/* global BigInt */
let aAddresses;
let allCollectionsCache = [];
$(document).ready(async function () {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Create NFT | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Create NFT | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Create NFT | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    let { aCategories, aCollections } = await _helper.call_API(
        'GET',
        '/nft/options',
        {},
        {
            Authorization: sToken,
        }
    );

    let sCategoryHtml = '';
    for (i = 0; i < aCategories.length; i++) {
        sCategoryHtml += `<option class="select-styled" value="${aCategories[i].sName}">
                ${aCategories[i].sName}
            </option>`;
    }

    // console.log({ sCategoryHtml });
    $('#category').append(sCategoryHtml);
    generateSelectDropdown($('#category'));

    allCollectionsCache = aCollections;

    refreshCollectionDropdown();

    console.log(_SUPPORTED_CHAINS);
    let sBlockchainHtml = '';
    for (let index = 0; index < _SUPPORTED_CHAINS.length; index++) {
        sBlockchainHtml += `<option value="${_SUPPORTED_CHAINS[index]}">${_SUPPORTED_CHAINS_NAMES[index]}</option>`;
    }
    $('#blockchainList').append(sBlockchainHtml);
    generateSelectDropdown($('#blockchainList'));

    let loaded = false;
    $('#dropZoon').on('change', function (event) {
        event.preventDefault();
        if (loaded == false) {
            loaded = true;
        }
    });

    $('#btn-submit').on('click', async function (event) {
        event.preventDefault();

        const dropdownchainid = $('#blockchainList').val();
        console.warn(
            '☢️ ~ file: create-nft.js:89 ~ dropdownchainid',
            dropdownchainid
        );
        const sCategory = $('#category').val();

        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();
        console.log(chainId);
        console.log(dropdownchainid);

        if (Number(chainId) !== Number(dropdownchainid)) {
            console.log('inside');
            await switchAddNetwork(dropdownchainid);
        }

        aAddresses = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        console.log(aAddresses[0]);

        if (aAddresses[0] != localStorage.getItem('sWalletAddressAdmin')) {
            return notify('error', 'Wrong metamask Account selected');
        }

        let oData = new FormData();

        let sName = $('#name').val().trim();
        let sDescription = $('#desc').val().trim();
        let nQuantity = $('#quantity').val().trim();
        let nBasePrice = $('#price').val().trim();
        let nRoyaltyPercentage = $('#royalties').val().trim();
        let nftFile = $('#fileInput')[0].files[0];

        aCollaborator = $('input[name=collaborator]')
            .map(function () {
                return this.value;
            })
            .get();
        aCollaboratorPercentage = $('input[name=percent]')
            .map(function () {
                return this.value;
            })
            .get();

        let saletype = $("input[name='choose']:checked").val();

        console.log({ sName, sDescription, nQuantity, saletype });

        if (!nftFile) {
            return notify('error', 'Please select NFT file');
        }
        if (sCategory === 'hide') {
            return notify('error', 'Please select category');
        }
        if (!sName) {
            return notify('error', 'Please enter name');
        }
        if (!sDescription) {
            return notify('error', 'Please enter description');
        }
        if (!nQuantity) {
            return notify('error', 'Please enter quantity');
        }
        if (!nBasePrice) {
            return notify('error', 'Please enter price');
        }
        if (!nRoyaltyPercentage) {
            return notify('error', 'Please enter royalty');
        }

        if (!_validator.isValidString(sName)) {
            return notify('error', 'Please enter name upto 100 characters');
        }
        console.log(sDescription.length);
        if (sDescription.length >= 1000 || sDescription.length < 0) {
            return notify(
                'error',
                'Please enter description upto 1000 characters'
            );
        }
        if (!_validator.isInteger(parseFloat(nQuantity))) {
            return notify('error', 'Please enter valid quantity');
        }
        if (nQuantity == 1) {
            sCollectionAddress =
                _contracts_web3.addresses[dropdownchainid].erc721;
            sNftType = 'erc721';
        } else if (nQuantity > 1) {
            sCollectionAddress =
                _contracts_web3.addresses[dropdownchainid].erc1155;
            sNftType = 'erc1155';
        } else {
            return notify('error', 'Quantity cannot be less than 1');
        }

        if (!_validator.isNumber(nBasePrice)) {
            return notify('error', 'Please enter valid price');
        }

        if (!_validator.isExponential(nBasePrice) || nBasePrice < 0) {
            return notify('error', 'Please enter valid price');
        }

        let sBasePrice = nBasePrice.toString();
        if (sBasePrice.indexOf('.') !== -1) {
            if (sBasePrice.substring(sBasePrice.indexOf('.')).length > 19) {
                return notify(
                    'error',
                    'Please enter base price upto eighteen decimal places'
                );
            }
        }

        if (!_validator.isNumber(nRoyaltyPercentage)) {
            return notify('error', 'Please enter valid royalty');
        }
        if (nRoyaltyPercentage < 0 || nRoyaltyPercentage > 100) {
            return notify('error', 'Please enter valid royalty');
        }

        let sRoyaltyPercentage = nRoyaltyPercentage.toString();
        if (sRoyaltyPercentage.indexOf('.') !== -1) {
            if (
                sRoyaltyPercentage.substring(sRoyaltyPercentage.indexOf('.'))
                    .length > 3
            ) {
                return notify(
                    'error',
                    'Please enter royalty percentage upto two decimal places'
                );
            }
        }
        let totalCollaboratorPercentage = 0;
        for (i = 0; i < aCollaboratorPercentage.length; i++) {
            if (i > 0 && (!aCollaboratorPercentage[i] || !aCollaborator[i])) {
                return notify(
                    'error',
                    'Collaborator field or a collaborator percentage field left empty'
                );
            } else if (
                i == 0 &&
                ((aCollaborator[i] && !aCollaboratorPercentage[i]) ||
                    (!aCollaborator[i] && aCollaboratorPercentage[i]))
            ) {
                return notify(
                    'error',
                    'Collaborator field or a collaborator percentage field left empty'
                );
            }
            if (!web3.utils.isAddress(aCollaborator[i])) {
                if (!aCollaborator[0]);
                else {
                    $('#btn-submit')
                        .html('Create Artwork')
                        .prop('disabled', false);
                    return notify('error', 'Invalid collaborator address');
                }
            }
            if (
                aCollaborator[i].localeCompare(aAddresses[0], undefined, {
                    sensitivity: 'accent',
                }) === 0
            ) {
                return notify('error', 'Creator cannot be collaborator');
            }
            if (!_validator.isNumber(aCollaboratorPercentage[i])) {
                return notify('error', 'Invalid collaborator percentage');
            }
            let sPercent = aCollaboratorPercentage[i].toString();
            if (sPercent.indexOf('.') !== -1) {
                if (sPercent.substring(sPercent.indexOf('.')).length > 3) {
                    $('#btn-submit')
                        .html('Create Artwork')
                        .prop('disabled', false);
                    return notify(
                        'error',
                        'Please enter collaborator percentage upto two decimal places'
                    );
                }
            }
            if (aCollaboratorPercentage[i] < 0) {
                return notify(
                    'error',
                    'Collaborator percentage cannot be less than 0'
                );
            }
            totalCollaboratorPercentage += Number(aCollaboratorPercentage[i]);
        }
        if (totalCollaboratorPercentage > 100) {
            return notify(
                'error',
                'Total collaborator percentages more than 100'
            );
        }

        console.log('nAuctionType: ', $("input[name='choose']:checked").val());

        oData.append('sCategory', sCategory);
        oData.append('sName', sName);
        oData.append('sNftdescription', sDescription);
        oData.append('nQuantity', nQuantity);
        oData.append('sCollectionAddress', sCollectionAddress);
        oData.append('sNftType', sNftType);
        oData.append('eAuctionType', $("input[name='choose']:checked").val());
        oData.append('nBasePrice', sBasePrice);
        oData.append('sSetRoyaltyPercentage', nRoyaltyPercentage);
        oData.append('sCollaborator', aCollaborator);
        oData.append('nCollaboratorPercentage', aCollaboratorPercentage);
        oData.append('oCollectionId', $('#collection').val());
        oData.append('blockchainList', dropdownchainid);
        oData.append('nChainId', chainId);
        oData.append('nftFile', nftFile);

        try {
            $('#btn-submit').html('Create Artwork').prop('disabled', false);
            $('#btn-submit')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);

            let oRes = await _helper.call_API(
                'POST',
                '/nft/create-nft',
                oData,
                {
                    Authorization: sToken,
                }
            );

            console.log('oRes: ', oRes);
            // enum AfterMint {
            //     AUCTION, //0
            //     FIXED_SALE, //1
            //     ON_HOLD, //2
            //     TIMED_AUCTION //3
            // }
            let nAuctionType;
            let startTime = $('#dropdownMenuButton2').val();
            let endTime = $('#dropdownMenuButton3').val();
            let chosenTime;

            const endDays = [
                '1 Day from Listing',
                '3 Days from Listing',
                '5 Days from Listing',
            ];

            if ($("input[name='choose']:checked").val() == 'Auction') {
                nAuctionType = 0;
                startTime = 0;
                endTime = 0;
            } else if (
                $("input[name='choose']:checked").val() == 'Fixed Sale'
            ) {
                nAuctionType = 1;
                startTime = 0;
                endTime = 0;
            } else if ($("input[name='choose']:checked").val() == 'On Hold') {
                nAuctionType = 2;
                startTime = 0;
                endTime = 0;
            } else if (
                $("input[name='choose']:checked").val() == 'Timed Auction' //Time auction
            ) {
                nAuctionType = 3;
                if (startTime == 'Specific-time') {
                    notify('error', 'Please select start Date and Time');
                    $('#btn-submit').text('Create').prop('disabled', false);
                    return;
                }

                if (!startTime || startTime == 'after-listening') {
                    startTime = 0;
                    chosenTime = new Date();
                } else if (
                    startTime != 'after-listening' &&
                    startTime != 'Specific-time'
                ) {
                    chosenTime = new Date(startTime);
                    startTime = chosenTime.getTime() / 1000;
                } else {
                    notify('error', 'Something went wrong');
                    $('#btn-submit').text('Create').prop('disabled', false);
                    return;
                }

                if (!endTime || endTime == 'txt') {
                    notify('error', 'Please select valid end Date and Time');
                    $('#btn-submit').text('Create').prop('disabled', false);
                    return;
                }

                if (
                    new Date(endTime).getTime() < new Date().getTime() ||
                    new Date(endTime).getTime() / 1000 < startTime
                ) {
                    notify(
                        'error',
                        'End date & time must be greater then current time'
                    );
                    $('#btn-submit').text('Create').prop('disabled', false);
                    return;
                }

                if (endTime != 'txt' && endDays.includes(endTime)) {
                    chosenTime = new Date(Date.parse(chosenTime));
                    endTime = chosenTime.setDate(
                        chosenTime.getDate() + Number(endTime[0])
                    );
                    endTime = Math.round(endTime / 1000);
                } else {
                    chosenEndTime = new Date(endTime);
                    endTime = Math.round(chosenEndTime.getTime() / 1000);
                }
            } else {
                notify('error', 'Invalid sale type');
            }
            sHash = oRes.sJsonHash;
            console.log('sHash: ', sHash);
            console.log('nAuctionType: ', nAuctionType);

            await minter(
                sName,
                sHash,
                sCollectionAddress,
                nQuantity,
                $('#royalties').val(),
                aCollaborator,
                aCollaboratorPercentage,
                sBasePrice,
                nAuctionType, //afterMint
                startTime,
                endTime,
                dropdownchainid,
                sNftType
            );
        } catch (error) {
            console.log('in error', error);
            notify('error', error);
            $('#btn-submit').text('Create').prop('disabled', false);
        }
    });
    $('#quantity').keyup(function () {
        console.log($('#quantity').val());
        if ($('#quantity').val() <= 0) {
            console.log('ERROR');
            $('#quantity').val(1);
        }
    });
});

function refreshCollectionDropdown() {
    let sCollectionHtml = '';
    for (i = 0; i < allCollectionsCache.length; i++) {
        sCollectionHtml += `<option class="select-styled" value="${allCollectionsCache[i]._id}">
            ${allCollectionsCache[i].sName}
        </option>`;
    }

    // console.log(sHtml);
    $('#collection').html(sCollectionHtml);
    generateSelectDropdown($('#collection'));
}

async function minter(
    sName,
    sHash,
    sCollectionAddress,
    nQuantity,
    nRoyalty,
    aCollaborator,
    aCollaboratorPercentage,
    nPrice,
    nAuctionType, //afterMint
    startTime,
    endTime,
    dropdownchainid
) {
    let contract = contractObject(dropdownchainid);

    console.log('contract: ', contract);

    sUri = _platform_config[___ENV___].sIpfsUri + sHash;
    console.log('_platform_config.sIpfsUri: ', sUri);
    nPrice = web3.utils.toWei(nPrice, 'ether');
    nRoyalty *= 100;
    nRoyalty = Math.floor(nRoyalty);
    for (i = 0; i < aCollaboratorPercentage.length; i++) {
        aCollaboratorPercentage[i] *= 100;
        aCollaboratorPercentage[i] = Math.floor(aCollaboratorPercentage[i]);
    }
    if (aCollaborator[0] == '' && aCollaborator.length == 1) {
        aCollaborator = [];
        aCollaboratorPercentage = [];
    }

    try {
        console.log({
            sCollectionAddress,
            sUri,
            nQuantity,
            aCollaborator,
            aCollaboratorPercentage,
            nRoyalty,
            nPrice,
            nAuctionType, //afterMint
            startTime,
            endTime,
        });
        console.log('from address: ', aAddresses[0]);
        let estimateGas = await contract.methods
            .mintToken(
                sCollectionAddress,
                sUri,
                nQuantity,
                aCollaborator,
                aCollaboratorPercentage,
                nRoyalty,
                nPrice,
                nAuctionType, //afterMint
                startTime,
                endTime
            )
            .estimateGas({ from: aAddresses[0] });
        console.log({ estimateGas });
    } catch (error) {
        $('#btn-submit').html('Create Artwork').prop('disabled', false);
        let oErrorJSON = JSON.parse(
            error.message.substr(
                error.message.indexOf('{'),
                error.message.lastIndexOf('}')
            )
        );
        $('#buy-now').removeClass('inactiveLink');
        return notify(
            'error',
            oErrorJSON.message.replace('execution reverted: ', '')
        );
    }
    contract.methods
        .mintToken(
            sCollectionAddress,
            sUri,
            nQuantity,
            aCollaborator,
            aCollaboratorPercentage,
            nRoyalty,
            nPrice,
            nAuctionType, //afterMint
            startTime,
            endTime
        )
        .send({ from: aAddresses[0] })
        .on('transactionHash', async function (hash) {
            notify(
                'success',
                'Please wait... the transaction has been initiated'
            );
            console.log(sUri);
        })
        .on('receipt', async function (receipt) {
            console.log(receipt);
            console.log(
                ' _contracts_web3.addresses[dropdownchainid].erc721: ',
                _contracts_web3.addresses[dropdownchainid].erc721
            );
            notify('success', 'Your NFT is Created');

            // window.location.href = `/creator/${window.localStorage.getItem(
            //     '_id'
            // )}`;

            window.location.reload();
        })
        .catch((error) => {
            $('#btn-submit').html('Create Artwork').prop('disabled', false);
            return notify(
                'error',
                error.message.replace('MetaMask Tx Signature: ', '')
            );
        });
}

$('#adder').on('click', (event) => {
    event.preventDefault();
    let newRowAdd = `<div class="input-main" id="row">
    <div class="input-otr-2">
        <input
            class="input"
            type="text"
            name="collaborator"
            placeholder="Collaborators Address"
        />
    </div>
    <div class="input-otr-2">
        <input
            class="input"
            type="number"
            name="percent"
            placeholder="Collaborators Percentage"
        />
    </div>
</div>`;

    $('#newinput').append(newRowAdd);
});

$('body').on('click', '#remover', function (event) {
    event.preventDefault();
    $('#row').remove();
});

// create collection

$('#create-coll-btn').on('click', function () {
    $('#create-collection-modal').show();
});

$('#blockchainList').on('change', function () {
    $('#price').attr(
        'placeholder',
        `Base Price of the Artwork in ${
            _chains_web3[$('#blockchainList').val()].nativeCurrency.symbol
        }`
    );
});
