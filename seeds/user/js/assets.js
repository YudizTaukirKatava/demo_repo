let isLoaded = false;
let isCreatorsLoaded = false;
let nSkip = 0;
let nLimit = 4;
let nCreatorLimit = 12;
let nCreatorOffset = 0;
let params = new URLSearchParams(window.location.search);
let oSearchText = params.get('q');

$(async () => {
    try {
        await appendNFTs(oSearchText);
        await appendCollection();
        await appendCreators(oSearchText);

        $('#searchLoadBtn').on('click', () => {
            appendNFTs(oSearchText);
        });
        $('#loadCreatorsBtn').on('click', () => {
            appendCreators(oSearchText);
        });
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
});

async function appendNFTs(oSearchText) {
    let dataToAppend = '';
    let oSearchedData;
    if (isLoaded) {
        dataToAppend += $('#searchNftContainer').html();
    }

    $('#searchString').text(oSearchText);

    if (!isLoaded) {
        nSkip = 0;
        nLimit = 4;
        oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
            oSearchText,
            nLimit,
            nSkip,
        });
        isLoaded = true;
    } else {
        nSkip = nSkip + nLimit;
        nLimit = 4;
        oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
            oSearchText,
            nLimit,
            nSkip,
        });
    }

    if (
        oSearchedData.data.length == 0 ||
        oSearchedData.data.aNftData.length == 0
    ) {
        $('#searchNftContainer').html(
            '<h3><center class="mb-5 text-white"><b>No NFT Found</b></center></h3>'
        );
        $('#searchLoadBtn').css('display', 'none');
        return;
    }
    $('#nftCount').text(oSearchedData.data.nTotalNftRecords + ' NFTs');

    if (oSearchedData.data.aNftData.length != 0) {
        oSearchedData.data.aNftData.forEach((nft) => {
            dataToAppend += generateNftCard(nft);
        });

        $('#searchNftContainer').html(dataToAppend);
        if (oSearchedData.data.nTotalNftRecords <= nLimit + nSkip) {
            $('#searchLoadBtn').css('display', 'none');
        }
    }
}

async function appendCollection() {
    let collectionDataToAppend = '';
    let params = new URLSearchParams(window.location.search);
    let oSearchText = params.get('q');

    let oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
        oSearchText,
        nLimit,
        nSkip,
    });

    if (
        oSearchedData.data.length == 0 ||
        oSearchedData.data.aCollectionData.length == 0
    ) {
        $('#search-result-collections').html(
            '<h3><center class="mb-5 text-white"><b>No Collection Found</b></center></h3>'
        );
        return;
    }

    if (oSearchedData.data.aCollectionData.length != 0) {
        oSearchedData.data.aCollectionData.forEach((collection) => {
            collectionDataToAppend += _helper.generateHtmlFromEJS(
                _card_templates.searchCollection,
                collection
            );
        });
        $('#search-result-collections').append(collectionDataToAppend);
        $('#collectionCount').text(
            oSearchedData.data.aCollectionData.length + ' Collections'
        );
        $('#search-result-collections').owlCarousel({
            loop: false,
            margin: 10,
            dots: false,
            autoplay: false,
            nav: true,
            navText: [
                "<img src='/assets/img/svg/ArrowRightWhite.svg'>",
                "<img src='/assets/img/svg/ArrowLeftWhite.svg'>",
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
                    items: 5,
                },
            },
        });
    }

    $('.search-tag .clear-search').on('click', function () {
        $('#search-result-collection-otr').addClass('d-none');
        $(this).parent().addClass('d-none');
        $('.search-result-nfts .line').toggle();
    });
}

async function appendCreators(oSearchText) {
    let creatorsToAppend = '';
    let sCurrencySymbol;
    let oSearchedData;

    if (!localStorage.getItem('Authorization')) {
        sCurrencySymbol = _chains_web3[_DEFAULT_CHAIN].nativeCurrency.symbol;
    } else {
        sCurrencySymbol =
            _chains_web3[await web3.eth.getChainId()].nativeCurrency.symbol;
    }

    if (!isCreatorsLoaded) {
        nCreatorLimit = 12;
        nCreatorOffset = 0;
        oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
            oSearchText,
            nCreatorLimit,
            nCreatorOffset,
        });
        isCreatorsLoaded = true;
    } else {
        nCreatorOffset = nCreatorOffset + nCreatorLimit;
        nCreatorLimit = 6;

        oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
            oSearchText,
            nCreatorLimit,
            nCreatorOffset,
        });
    }

    if (
        oSearchedData.data.nTotalUserRecords <=
            nCreatorLimit + nCreatorOffset ||
        oSearchedData.data.length == 0 ||
        oSearchedData.data.aUsers.length == 0
    ) {
        $('#loadCreatorsBtn').css('display', 'none');
    }

    if (
        oSearchedData.data.length == 0 ||
        oSearchedData.data.aUsers.length == 0
    ) {
        $('#searchedCreator-of-week').html(
            '<h3><center class="mb-5 text-white"><b>No Creator Found</b></center></h3>'
        );
        return;
    }

    if (oSearchedData.data.aUsers.length != 0) {
        for (let i = 0; i < oSearchedData.data.aUsers.length; i++) {
            let cUser = oSearchedData.data.aUsers[i];
            let earning = cUser.oEarnings[sCurrencySymbol] || '0';
            earning = new BigNumber(earning);
            earning = earning.toPrecision(3);

            cUser.earnings = `${earning} ${sCurrencySymbol}`;

            creatorsToAppend += _helper.generateHtmlFromEJS(
                _card_templates.creator,
                cUser
            );
        }
        $('#searchedCreator-of-week').append(creatorsToAppend);
    }

    $('#creatorsCount').text(
        oSearchedData.data.nTotalUserRecords + ' Creators'
    );
}

$('.search-tag .clear-search').on('click', async function () {
    $('#search-result-collection-otr').addClass('d-none');
    $(this).parent().addClass('d-none');
    $('.search-result-nfts .line').toggle();
    oSearchText = '';
    isLoaded = false;
    isCreatorsLoaded = false;
    nSkip = 0;
    nLimit = 4;
    nCreatorLimit = 12;
    nCreatorOffset = 0;

    let oSearchedData = await _helper.call_API('POST', '/nft/nftSearch', {
        oSearchText,
        nLimit,
        nSkip,
    });

    if (oSearchedData.data.nTotalNftRecords >= nLimit + nSkip) {
        $('#searchLoadBtn').css('display', 'block');
    }

    if (oSearchedData.data.nTotalUserRecords > 0) {
        if (
            oSearchedData.data.nTotalUserRecords >=
            nCreatorLimit + nCreatorOffset
        ) {
            $('#searchedCreator-of-week').empty();
            $('#loadCreatorsBtn').css('display', 'block');
        }
        await appendCreators(oSearchText);
    }
    await appendNFTs(oSearchText);
});
