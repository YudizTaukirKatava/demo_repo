let priceInUsd;
let value = '';
let nChainId = '';

$(async () => {
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sCurrencySymbol;
    if (!sWalletAddress) {
        sCurrencySymbol = '';
    } else {
        sCurrencySymbol =
            _chains_web3[await web3.eth.getChainId()].nativeCurrency.symbol;
    }
    let oData = {
        value: value,
        nChainId: nChainId,
        sCurrencySymbol,
    };
    let landingImgAPI = await _helper.call_API('POST', '/nft/', { oData });

    if (!landingImgAPI.data.length) {
        $('.hero-mainn').hide();
    }
    if (landingImgAPI.data.length <= 1) {
        $('#liveAuction').hide();
        $('#liveAuction').parent().parent().hide();
    }

    if (localStorage.getItem('sWalletAddress')) {
        $('#walletConnection').hide();
    }

    loadNFTs(oData);

    let NFT_ID = landingImgAPI.data[0]?.aNFTData?._id;

    let activity = await _helper.call_API('POST', '/nft/filter', { NFT_ID });
    let getPrice = await _helper.call_API('GET', '/nft/getPrice', {});

    priceInUsd =
        getPrice[
            _chains_web3[landingImgAPI.data[0]?.aNFTData?.nChainId]
                ?.nativeCurrency.symbol
        ];

    landingAuctionImg(landingImgAPI, activity);
    secondarySlider(landingImgAPI);
    loadCollections(landingImgAPI);

    let sBlockchainHtml = '';
    for (let index = 0; index < _SUPPORTED_CHAINS.length; index++) {
        sBlockchainHtml += `<option value="${_SUPPORTED_CHAINS[index]}">${_SUPPORTED_CHAINS_NAMES[index]}</option>`;
    }
    $('#sortWithChain').append(sBlockchainHtml);
    generateSelectDropdown($('#sortWithChain'));

    $('#place-bid-btn').click(async function () {
        if (!localStorage.getItem('sWalletAddress')) {
            callConnectModal();
            return;
        }

        $('#place-bid-modal').show();
        $('body').css('overflow', 'hidden auto');
    });

    $('#cancel-auction-btn').click(async function () {
        $('#cancel-auction-btn').addClass('inactiveLink');

        if (!localStorage.getItem('sWalletAddress')) {
            $('#cancel-auction-btn').removeClass('inactiveLink');
            callConnectModal();
            return;
        }

        try {
            if (
                landingImgAPI.data[0].aNFTData.nChainId !=
                (await web3.eth.getChainId())
            ) {
                await switchAddNetwork(landingImgAPI.data[0].aNFTData.nChainId);
            }
        } catch (error) {
            console.log(error);
            $('#cancel-auction-btn').removeClass('inactiveLink');
            return notify('error', error.message);
        }

        try {
            let nftAddress = landingImgAPI.data[0].aNFTData.sCollectionAddress;
            let id = landingImgAPI.data[0].nTokenId;
            let mediaContractAddress = contractObject(
                landingImgAPI.data[0].aNFTData.nChainId
            );

            try {
                let estimatedGas = await mediaContractAddress.methods
                    .withdrawAuction(nftAddress, id)
                    .estimateGas({
                        from: sWalletAddress,
                    });
                mediaContractAddress.methods
                    .withdrawAuction(nftAddress, id)
                    .send({
                        from: sWalletAddress,
                        gas: estimatedGas,
                    })
                    .once('transactionHash', (data) => {
                        notify('success', 'The transaction has been initiated');
                        console.log('Transaction Hash ', data);
                    })
                    .on('receipt', (receipt) => {
                        console.log('Transaction Receipt', receipt);
                        notify(
                            'success',
                            'NFT removed from auction successfully'
                        );
                    })
                    .catch((error) => {
                        $('#cancel-auction-btn').removeClass('inactiveLink');
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                console.log(error);
                $('#cancel-auction-btn').removeClass('inactiveLink');
                let oErrorJSON = JSON.parse(
                    error.message.substr(
                        error.message.indexOf('{'),
                        error.message.lastIndexOf('}')
                    )
                );
                notify(
                    'error',
                    oErrorJSON.message.replace('execution reverted: ', '')
                );
                return;
            }
        } catch (error) {
            $('#cancel-auction-btn').removeClass('inactiveLink');
            console.log(error);
        }
    });

    $('#close-bid').click(function () {
        $('#place-bid-modal').hide();
        $('body').css('overflow', 'auto');
    });
    $('#place-bid').click(function () {
        $('body').css('overflow', 'auto');
    });
    $('.minus').click(function () {
        let $input = $(this).parent().find('input');
        let count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);

        $input.change();
        return false;
    });
    $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) + 1;
        count = count > 10 ? 10 : count;
        $input.val(count);
        $input.change();
        return false;
    });

    $('#place-bid').on('click', async (e) => {
        e.preventDefault();
        $('.validation').hide();
        console.log(landingImgAPI.data[0]);

        console.log('PLACE BID METHOD');
        $('#place-bid').addClass('inactiveLink');
        let sWalletAddress = localStorage.getItem('sWalletAddress');

        try {
            if (!sWalletAddress) {
                $('#place-bid').removeClass('inactiveLink');
                callConnectModal();
            }

            let bidAmount = $('#bid-amount').val();

            if (!_validator.isNumber(bidAmount)) {
                $('#place-bid').removeClass('inactiveLink');
                $('#auctionError').append(`<p class="validation" id="err"> 
                Please enter valid bid
                        </p>`);
                return;
            }

            if (!bidAmount || Number(bidAmount) <= 0) {
                $('#place-bid').removeClass('inactiveLink');
                $('#auctionError').append(`<p class="validation" id="err"> 
            Please enter valid bid amount
                    </p>`);
                return;
            }

            if (countDecimals(bidAmount) > 18) {
                $('#auctionError').append(`<p class="validation" id="err"> 
                The price cannot have precision greater than 18 decimal places
                </p>`);
                $('#place-bid').removeClass('inactiveLink');
                return;
            }
            if (bidAmount <= activity.activityData[0].aBidders[0].nBidPrice) {
                $('#auctionError').append(`<p class="validation" id="err"> 
                Please place bid greater than last bid
                </p>`);
                $('#place-bid').removeClass('inactiveLink');
                return;
            }
            $('#place-bid')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            try {
                if (
                    (await web3.eth.getChainId()) !=
                    landingImgAPI.data[0].aNFTData.nChainId
                ) {
                    await switchAddNetwork(
                        landingImgAPI.data[0].aNFTData.nChainId
                    );
                }
            } catch (error) {
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                return notify('error', error.message);
            }
            const nWalletBalance = await web3.eth.getBalance(sWalletAddress);
            let bnbAmount = _helper.toWei(bidAmount);

            if (Number(nWalletBalance) < Number(bnbAmount)) {
                $('#auctionError').append(`<p class="validation" id="err"> 
                Insufficient wallet balance
            </p>`);
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                return;
            }
            let mediaContractAddress = contractObject(
                landingImgAPI.data[0].aNFTData.nChainId
            );
            try {
                let nftAddress =
                    landingImgAPI.data[0].aNFTData.sCollectionAddress;
                let id = landingImgAPI.data[0].aNFTData.nTokenId;
                let from =
                    landingImgAPI.data[0].aNFTData.aCurrentOwner.sWalletAddress;
                let estimatedGas;

                try {
                    estimatedGas = await mediaContractAddress.methods
                        .bid(nftAddress, id, from)
                        .estimateGas({
                            from: sWalletAddress,
                            value: bnbAmount,
                        });
                    console.log(estimatedGas);
                } catch (error) {
                    console.log(error);
                    let oErrorJSON = JSON.parse(
                        error.message.substr(
                            error.message.indexOf('{'),
                            error.message.lastIndexOf('}')
                        )
                    );
                    $('#place-bid').removeClass('inactiveLink');
                    $('#auctionError').append(`<p class="validation" id="err"> 
                            ${oErrorJSON.message.replace(
                                'execution reverted: Market: ',
                                ''
                            )}
                            </p>`);
                    $('#place-bid').text('Place Bid').prop('disabled', false);
                    return;
                }
                mediaContractAddress.methods
                    .bid(nftAddress, id, from)
                    .send({
                        from: sWalletAddress,
                        gas: estimatedGas,
                        value: bnbAmount,
                    })
                    .on('transactionHash', (data) => {
                        $('#place-bid-modal').hide();
                        notify('success', 'The transaction has been initiated');
                        console.log('Transaction Hash ', data);
                    })
                    .on('receipt', (receipt) => {
                        console.log('Transaction Receipt', receipt);
                        console.log('Status: ', receipt.status);
                        $('#place-bid').removeClass('inactiveLink');
                        $('#place-bid')
                            .text('Place Bid')
                            .prop('disabled', false);
                        notify('success', 'Bid placed successfully');
                    })
                    .catch((error) => {
                        console.log(error);
                        $('#place-bid').removeClass('inactiveLink');
                        $('#place-bid')
                            .text('Place Bid')
                            .prop('disabled', false);
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                console.log(error);
                let oErrorJSON = JSON.parse(
                    error.message.substr(
                        error.message.indexOf('{'),
                        error.message.lastIndexOf('}')
                    )
                );
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                notify(
                    'error',
                    oErrorJSON.message.replace('execution reverted: ', '')
                );
                return;
            }
        } catch (error) {
            $('#place-bid').removeClass('inactiveLink');
            $('#place-bid').text('Place Bid').prop('disabled', false);
            console.log(error);
        }
    });
});

async function landingAuctionImg(landingImgAPI, activity) {
    console.log(activity);
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let id = localStorage.getItem('_id');

    try {
        if (landingImgAPI.data.length) {
            let sHash = landingImgAPI.data[0].aNFTData.sImageHash;

            let sNFTId = landingImgAPI.data[0].aNFTData._id;
            let sUserId = landingImgAPI.data[0].aNFTData.oCurrentOwner;
            let auctionType;
            let index = 0;
            for (let i = 0; i < activity.activityData[0].aBidders.length; i++) {
                if (
                    activity.activityData[0].aBidders[i].eBidStatus ==
                    'Timed Auction'
                ) {
                    auctionType = 'Timed Auction';
                }
                if (
                    activity.activityData[0].aBidders[i].eBidStatus ==
                    'On Auction'
                ) {
                    auctionType = 'On Auction';
                }
            }

            if (auctionType == 'Timed Auction') {
                $('#landingAuctionImgTime')
                    .append(`<div class="timer-otr timer-gif">
                                                        <img src="/assets/img/Timer_ICon.gif"
                                                            style="width:30px;height:30px;" alt="Avalanche">
                                                    </div>`);
            }
            if (
                sWalletAddress ==
                landingImgAPI.data[0].aNFTData.aCurrentOwner?.sWalletAddress
            ) {
                $('#place-bid-btn').attr('id', 'cancel-auction-btn');
                $('#cancel-auction-btn').text('Cancel Auction');
                $('#cancel-auction-btn').css('background-color', '#e74c3c');
            }

            if (
                sWalletAddress ==
                    landingImgAPI.data[0].aNFTData.aCurrentOwner
                        ?.sWalletAddress &&
                auctionType == 'Timed Auction'
            ) {
                if (
                    activity.activityData[0].aBidders[index].nEndTime <
                    new Date().getTime() / 1000
                ) {
                    $('#place-bid-btn').attr('id', 'revert-auction-btn');
                    $('#revert-auction-btn').text('Revert Auction');
                    $('#revert-auction-btn').css('background-color', '#e74c3c');
                }
            }
            $('#landingAuctionImg').attr(
                'src',
                _platform_config[___ENV___].sS3Location + sHash
            );

            $(
                '#hero-profile-id, #hero-owner-name, #hover-hero-profileId, #hero-walletaddress-profile'
            ).attr('href', '/creator/' + sUserId);

            $('#hero-profilePic, #hero-profilePic1').attr(
                'src',
                landingImgAPI.data[0].aNFTData.aCurrentOwner.sProfilePicThumbUrl
            );
            $('#hero-view-nft, #hero-view-artwork').attr(
                'href',
                '/nft/' + sNFTId
            );

            $('#nft-title').html(landingImgAPI.data[0].aNFTData.sName);
            $('.primary-background-name').text(
                landingImgAPI.data[0].aNFTData.sName
            );

            let sOwnerDetails = landingImgAPI.data[0].aNFTData.aCurrentOwner
                .sUserName
                ? landingImgAPI.data[0].aNFTData.aCurrentOwner.sUserName
                : _helper.trimEthereumAddress(
                      landingImgAPI.data[0].aNFTData.aCurrentOwner
                          .sWalletAddress,
                      7
                  );

            $('#hero-owner-name').text(sOwnerDetails);

            $('#hero-nft-price').html(`
                ${activity.activityData[0].aBidders[0].nBidPrice} ${
                _chains_web3[landingImgAPI.data[0].aNFTData.nChainId]
                    ?.nativeCurrency.symbol
            }
            `);
            $('#current-highest-bid').html(`
                ${activity.activityData[0].aBidders[0].nBidPrice} ${
                _chains_web3[landingImgAPI.data[0].aNFTData.nChainId]
                    ?.nativeCurrency.symbol
            }
            `);

            $('#hero-walletaddress').html(
                _helper.trimEthereumAddress(
                    landingImgAPI.data[0].aNFTData.aCurrentOwner.sWalletAddress,
                    10
                )
            );

            // TODO: to be changed with NFT owner name
            $('#hero-nftOwner-name').html(sOwnerDetails); // TODO: to be changed with NFT owner name

            $('#copy-hero-address').click((event) => {
                event.preventDefault();
                copyDataToClipBoard(
                    landingImgAPI.data[0].aNFTData.aCurrentOwner.sWalletAddress
                );
            });

            $('#base-price').text(
                `${landingImgAPI.data[0].nBidPrice} ${
                    _chains_web3[landingImgAPI.data[0].aNFTData.nChainId]
                        ?.nativeCurrency.symbol
                }`
            );

            $('#bnbPrice').text(`$
            ${
                Math.round(
                    (_helper.toUsd(
                        activity.activityData[0].aBidders[0]?.nBidPrice,
                        priceInUsd
                    ) +
                        Number.EPSILON) *
                        100
                ) / 100
            }`);

            // Verified
            setBlueTick(landingImgAPI);

            let dataAppend = `<a class="heart-otr c-pointer ${
                id && landingImgAPI.data[0].aNFTData.aFavorite.indexOf(id) != -1
                    ? 'selected'
                    : ''
            }" data-liked="${
                id && landingImgAPI.data[0].aNFTData.aFavorite.indexOf(id) != -1
                    ? 'true'
                    : 'false'
            }" 
            data-nftid="${sNFTId}"
            onclick="likeNFT($(this))">
                                    <svg
                                        class="heart-icon"
                                        width="18"
                                        height="17"
                                        fill="none"
                                        
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 15.08S1 10.6 1 5.16a4.16 4.16 0 018-1.603h0a4.16 4.16 0 018 1.603c0 5.44-8 9.92-8 9.92z"
                                            stroke="#999"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </a>
                                <p class="body-sb num" id="likeCount">
                                </p>`;

            $('#landingCard').append(dataAppend);
            setAuctionTimer('live-auctions');

            //Live auction function call
            liveAuction(landingImgAPI);

            // Creator of Week
            creatorOfWeek(landingImgAPI);

            callPage(landingImgAPI);
        } else {
            // TODO: hide

            $('#creator-of-week').html(
                `<h3><center class="mb-5 text-white"><b>No Data Found</b></center></h3>`
            );
            $('.creator-main-home2 .creator-main-inr .view-all').hide();
        }
    } catch (error) {
        console.log('error: ', error);
    }
}

function liveAuction(landingImgAPI) {
    let dataToAppend = '';
    for (let i = 1; i < landingImgAPI.data.length; i++) {
        dataToAppend += generateNftCard(landingImgAPI.data[i], true);
    }

    $('#live-auctions').append(dataToAppend);

    $('#live-auctions').owlCarousel({
        loop: false,
        margin: 24,
        dots: false,
        autoplay: false,
        nav: true,
        navText: [
            "<img src='/assets/img/ArrowRight.svg'>",
            "<img src='/assets/img/ArrowLeft.svg'>",
        ],
        responsive: {
            0: {
                items: 1,
                nav: false,
                dots: true,
            },
            575: {
                items: 2,
            },
            992: {
                items: 3,
            },
            1300: {
                items: 4,
            },
        },
    });

    _helper.addTiltEffect($('#live-auctions .img-tilt'));
}

function setBlueTick(landingImgAPI) {
    if (!landingImgAPI.data[0].aNFTData.aCurrentOwner.bVerify) {
        $('#isVerified, #hero-hover-verified').hide();
    }
}

async function creatorOfWeek(landingImgAPI) {
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sCurrencySymbol;
    if (!sWalletAddress) {
        sCurrencySymbol = 'BNB';
    } else {
        sCurrencySymbol =
            _chains_web3[await web3.eth.getChainId()].nativeCurrency.symbol;
    }

    for (let i = 0; i < landingImgAPI.aUsers.length; i++) {
        let earning = landingImgAPI.aUsers[i].oEarnings[sCurrencySymbol] || '0';
        earning = new BigNumber(earning);
        earning = earning.toPrecision(3);

        landingImgAPI.aUsers[i].earnings = `${earning} ${sCurrencySymbol}`;

        $('#creator-of-week').append(
            _helper.generateHtmlFromEJS(
                _card_templates.creator,
                landingImgAPI.aUsers[i]
            )
        );
    }
}

function landingPageExploreArtWork(landingImgAPI) {
    let dataToAppend = '';
    landingImgAPI.ownerAndPosted.forEach((nft) => {
        dataToAppend += generateNftCard(nft);
    });
    $('#landingPage-explore-artwork').append(dataToAppend);
    setAuctionTimer('landingPage-explore-artwork');
    _helper.addTiltEffect($('#landingPage-explore-artwork .img-tilt'));
}

function callPage(landingImgAPI) {
    let allImages = [];
    let allImagesTemp = landingImgAPI.bids;

    let htmImgs = '';

    for (let index = 1; index <= 12; index++) {
        if (allImagesTemp[index - 1]) {
            allImages.push(
                _platform_config[___ENV___].sS3ThumbLocation +
                    allImagesTemp[index - 1]._id
            );
        } else {
            allImages.push('/assets/img/New_Project_1.jpg');
        }
        if (index % 4 === 0) {
            htmImgs += _helper.generateHtmlFromEJS(
                _card_templates.landingSquareImgGroup,
                allImages
            );
            allImages = [];
        }
    }

    $('#call-action-img').html(htmImgs);
}

async function loadNFTs(oData) {
    $('#landingPage-explore-artwork').empty();
    let data = await _helper.call_API('POST', '/nft/', { oData });

    if (data.ownerAndPosted.length) {
        landingPageExploreArtWork(data);
    } else {
        $('#landingPage-explore-artwork').html(
            `<h3><center class="mb-5 text-white"><b>Arts Not Available On Applied Filters</b></center></h3>`
        );
        $('.explore-artwork-home2 .explore-artwork-inr .view-all').hide();
    }
}

function secondarySlider(landingImgAPI) {
    let id = localStorage.getItem('_id');

    for (let i = landingImgAPI.ownerAndPosted.length - 1; i > 1; i--) {
        if (i < 4) {
            // limit of max 4 slides
            break;
        }

        let cNft = landingImgAPI.ownerAndPosted[i].aNFTData;

        let sLikeSelected, sLikeData;

        if (cNft.aFavorite.indexOf(id) != -1) {
            sLikeSelected = 'selected';
            sLikeData = true;
        } else {
            sLikeSelected = '';
            sLikeData = false;
        }

        let setData = {
            sName: cNft.sName,
            _id: cNft._id,
            sImage: _platform_config[___ENV___].sS3Location + cNft.sImageHash,
            oCurrentOwnerId: cNft.aCurrentOwner._id,
            sCurruntOwnerPic:
                cNft.aCurrentOwner.sProfilePicThumbUrl ||
                '/assets/img/male-avatar-maker.jpg',
            sCurruntOwnerName: cNft.aCurrentOwner.sUserName || 'Unknown',
            sEthAddress: cNft.aCurrentOwner.sWalletAddress,
            sEthAddressTrim: _helper.trimEthereumAddress(
                cNft.aCurrentOwner.sWalletAddress,
                7
            ),
            sLikeSelected,
            sLikeData,
        };

        $('#secondary-slider').append(
            _helper.generateHtmlFromEJS(_card_templates.secondarySlide, setData)
        );
    }
    if (landingImgAPI.ownerAndPosted.length) {
        $('.banner-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            dots: true,
            arrows: false,
            speed: 1200,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: 575,
                    settings: {
                        adaptiveHeight: true,
                    },
                },
                {
                    breakpoint: 991,
                    settings: {
                        adaptiveHeight: true,
                    },
                },
            ],
        });
    }

    _helper.addTiltEffect($('#secondary-slider .img-tilt'));
}

$('.tabs:not(.work-tabs)').click(async function () {
    $('#mainContainer').empty();
    let oData = {
        value: $('.tabs').find('.active').attr('value'),
        nChainId: $('#sortWithChain').val(),
    };
    loadNFTs(oData);
});

function showWithChain() {
    $('#mainContainer').empty();
    let oData = {
        value: $('.tabs').find('.active').attr('value'),
        nChainId: $('#sortWithChain').val(),
    };
    loadNFTs(oData);
}

$('#walletConnection').on('click', (event) => {
    event.preventDefault();
    callConnectModal();
    if (localStorage.getItem('sWalletAddress')) {
        $('#walletConnection').hide();
    }
});

setInterval(() => {
    if (window.innerWidth > 991) {
        if (!$('.primary-slide').hasClass('slick-active')) {
            $('.primary-slide .col-content-otr').css('opacity', '0');
            $('.primary-slide .bg-gradient').css('border-radius', '24px');
            $('.primary-slide .bg-gradient').css('width', '200%');
        } else {
            $('.primary-slide .col-content-otr').css('opacity', '1');
            $('.primary-slide .bg-gradient').css('width', '130%');
            $('.primary-slide .bg-gradient').css(
                'border-radius',
                '24px 0px 0px 24px'
            );
        }
    }
}, 800);

// Change option selected
const label = document.querySelector('.dropdown__filter-selected');
const options = Array.from(
    document.querySelectorAll('.dropdown__select-option')
);

options.forEach((option) => {
    option.addEventListener('click', () => {
        label.textContent = option.textContent;
    });
});

async function loadCollections(landingImgAPI) {
    try {
        if (!landingImgAPI.aCollection.length) {
            $('#hot-collections').append(
                `<h3><center class="mb-5 text-white"><b>Collection Not Available</b></center></h3>`
            );
            $('#all-collection').hide();
            return;
        }
        let dataToAppend = '';
        for (let i = 0; i < landingImgAPI.aCollection.length; i++) {
            dataToAppend += _helper.generateHtmlFromEJS(
                _card_templates.collection,
                landingImgAPI.aCollection[i]
            );
        }
        $('#hot-collections').append(dataToAppend);
    } catch (error) {
        console.log(error);
    }
}

$('#create-nft').on('click', (e) => {
    e.preventDefault();
    console.log('clicked');
    if (!localStorage.getItem('sWalletAddress')) {
        callConnectModal();
        return;
    }
    window.location.href = '/create-nft';
});
