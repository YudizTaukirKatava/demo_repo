let isLoaded = false;
let nSkip = 0;
let nLimit = 12;
let url = new URL(window.location.href);
let c = url.searchParams.get("admin");

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
    try {
        let dataToAppend = '';
        if (isLoaded) {
            dataToAppend += $('#collection_list').html();
        }
        let isAdminCollection = false
        if (c == 'true') {
            $('#explore-collection-header').text('Explore Admin\'s Collections')
            isAdminCollection = true
        }
        let oResult = await _helper.call_API(
            'POST',
            '/collection/viewCollection',
            {
                nLimit,
                nSkip,
                isAdminCollection
            }
        );
        oResult.data.forEach((collection) => {
            dataToAppend += _helper.generateHtmlFromEJS(
                _card_templates.collection,
                collection
            );
        });

        if (oResult.recordsTotal <= nLimit + nSkip) {
            $('#load-btn').css('display', 'none');
        }
        $('#collection_list').append(dataToAppend);
        nSkip += nLimit;
    } catch (err) {
        console.log(err);
    }
}
