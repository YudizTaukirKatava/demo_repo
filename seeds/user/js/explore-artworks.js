let NFT_LIMIT = 12;
let NEW_LOAD_LIMIT = 4;
let NFT_START = 0;
let loaded = false;
let starts = 8;
let oResult;
let nChainId = $('#sortWithChain').val();
let sCategory = $('#sortWithCatagory').val();
let value = $('.tabs').find('.active').attr('value');
let sSortingType = $('#sortingList').val().trim();
let sTextsearchVal = '';
let dataToAppend = '';

$(() => {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Explore Artwork | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}/explore-artworks">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Explore Artwork | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Explore Artwork | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    let params = new URLSearchParams(window.location.search);

    let sData = params.get('q');
    if (sData) {
        $('#mainContainer').empty();
        loaded = false;
        starts = 8;
        value = $('.tabs').find('.active').attr('value');
        sCategory = $('#sortWithCatagory').val();
        sTextsearchVal = sData;
    }
    loadData();
    $('#loadBtn').on('click', function (e) {
        e.preventDefault();
        loadData();
    });
    loadCategories();
    let sBlockchainHtml = '';
    for (let index = 0; index < _SUPPORTED_CHAINS.length; index++) {
        sBlockchainHtml += `<option value="${_SUPPORTED_CHAINS[index]}">${_SUPPORTED_CHAINS_NAMES[index]}</option>`;
    }
    $('#sortWithChain').append(sBlockchainHtml);
    generateSelectDropdown($('#sortWithChain'));
});

async function loadData() {
    $('#loadBtn').removeClass('d-inline-block').fadeOut();
    try {
        const oData = {
            start: NFT_START,
            length: NFT_LIMIT,
            sTextsearch: sTextsearchVal,
            sCategory: sCategory,
            sSortingType: sSortingType,
            sSellingType: value,
            nChainId: nChainId,
            bRelated: false,
        };
        if (!loaded) {
            loaded = true;
        } else {
            oData.start = starts + NEW_LOAD_LIMIT;
            oData.length = NEW_LOAD_LIMIT;
            starts += NEW_LOAD_LIMIT;
        }
        oResult = await _helper.call_API('POST', '/nft/nftListing', oData);

        if (oResult.data.length == 0) {
            dataToAppend = `<h1><center class="m-5 text-white"><b>Arts Not Available On Applied Filters</b></center></h1>`;
            $('#mainContainer').html(dataToAppend);
            return;
        }

        oResult.data.forEach((nft) => {
            dataToAppend += generateNftCard(nft);
        });
        let nextPage = NFT_START + oResult.data.length;
        if (NFT_START + oResult.data.length < oResult.recordsTotal) {
            $('#loadBtn')
                .click(function () {
                    NFT_START = nextPage;
                })
                .addClass('d-inline-block')
                .fadeIn();
        }
        $('#mainContainer').html(dataToAppend);

        _helper.addTiltEffect($('#mainContainer .img-tilt'));
        $('#mainContainer .img-tilt').tilt({
            maxTilt: 5,
            glare: true,
            maxGlare: 0.05,
        });
    } catch (error) {
        console.log('Error : ', error);
    }
}

$('.tabs').click(async function () {
    $('#mainContainer').empty();
    dataToAppend = '';
    NFT_START = 0;
    loaded = false;
    starts = 8;
    value = $(this).find('.active').attr('value');
    loadData();
});

async function sortData() {
    $('#mainContainer').empty();
    dataToAppend = '';
    NFT_START = 0;
    loaded = false;
    starts = 8;
    sSortingType = $('#sortingList').val().trim();
    loadData();
}

function showWithChain() {
    $('#mainContainer').empty();
    dataToAppend = '';
    NFT_START = 0;
    loaded = false;
    starts = 8;
    nChainId = $('#sortWithChain').val();
    loadData();
}

async function loadCategories() {
    try {
        const { aCategories } = await _helper.call_API(
            'GET',
            '/nft/viewCategories'
        );
        let sCategoryHtml = '';
        for (let index = 0; index < aCategories.length; index++) {
            sCategoryHtml += `<option value="${aCategories[index].sName}">${aCategories[index].sName}</option>`;
        }
        $('#sortWithCatagory').append(sCategoryHtml);
        generateSelectDropdown($('#sortWithCatagory'));
    } catch (error) {
        console.log(error);
    }
}

function sortWithCategory() {
    $('#mainContainer').empty();
    dataToAppend = '';
    NFT_START = 0;
    loaded = false;
    starts = 8;
    sCategory = $('#sortWithCatagory').val();
    loadData();
}

$('.clear-filter').on('click', function () {
    window.location.reload();
});
