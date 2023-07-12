let start = 0;
let length = 12;
let loaded = false;

$(() => {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Explore Creator | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}/explore-creators">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Explore Creator | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Explore Creator | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    // console.log($('#sortby option:selected').val());
    loadData();
    $('#load-btn').on('click', function (e) {
        e.preventDefault();
        loadData();
    });
});

async function loadData() {
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sCurrencySymbol;
    if (!sWalletAddress) {
        sCurrencySymbol = 'BNB';
    } else {
        sCurrencySymbol =
            _chains_web3[await web3.eth.getChainId()].nativeCurrency.symbol;
    }

    let nSortingOrder = $('#sortby option:selected').val();

    try {
        if (!loaded) {
            oResult = await _helper.call_API('POST', '/user/explore-creator', {
                start: start,
                length: length,
                nSortingOrder,
                sCurrencySymbol,
            });
            loaded = true;
        } else {
            start = start + length;
            length = 6;
            oResult = await _helper.call_API('POST', '/user/explore-creator', {
                start: start,
                length: length,
                nSortingOrder: nSortingOrder,
                sCurrencySymbol,
            });
        }

        if (!oResult.data.length) {
            $('#load-btn').css('display', 'none');
            $('#creators-list').append(`<h3><center class="mb-5 text-white"><b>Creators Not Found</b></center></h3>`);
            return;
        }

        for (i = 0; i < oResult.data.length; i++) {
            let earning = oResult.data[i].oEarnings[sCurrencySymbol] || '0';
            earning = new BigNumber(earning);
            earning = earning.toPrecision(3);

            oResult.data[i].earnings = `${earning} ${sCurrencySymbol}`;

            $('#creators-list').append(
                _helper.generateHtmlFromEJS(
                    _card_templates.creator,
                    oResult.data[i]
                )
            );
        }

        if (oResult.recordsTotal <= start + length) {
            $('#load-btn').removeClass('d-inline-block').fadeOut();
        }
    } catch (err) {
        console.log(err);
    }
}

$('#sortby').on('change', async function () {
    $('#creators-list').empty();
    loaded = false;
    start = 0;
    length = 12;
    loadData();
    $('#load-btn').addClass('d-inline-block').fadeOut();
});
