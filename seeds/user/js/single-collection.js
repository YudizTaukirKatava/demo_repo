let nSkip = 0;
let nLimit = 12;

$(async () => {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Single Collection | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}/explore-creators">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Single Collection | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Single Collection | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    // console.log($('#sortby option:selected').val());
    let oCollectionId;
    try {
        let url = window.location.href;
        oCollectionId = url.split('collection/');

        const getCollection = await _helper.call_API(
            'GET',
            `/collection/get-collection/${oCollectionId[1]}`,
            {}
        );

        $('#collection-desc').text(getCollection.sDescription);
        $('#collection-name').text(getCollection.sName);
        $('#collection-img').attr('src', getCollection.sImageUrl);

        $('title').text(`${getCollection.sName} | ${_PLATFORM_NAME}`);
    } catch (error) {
        console.log(error);
        if (error != 'server error') {
            window.location.href = '/404';
        }
        notify('error', error);
    }
    loadData(oCollectionId);
    $('#load-btn').on('click', function (e) {
        e.preventDefault();
        loadData(oCollectionId);
    });
});

async function loadData(oCollectionId) {
    try {
        let dataToAppend = '';
        const getCollectionNft = await _helper.call_API(
            'POST',
            `/collection/get-collection-nft/${oCollectionId[1]}`,
            { nSkip, nLimit }
        );

        getCollectionNft.collNfts.forEach((nft) => {
            dataToAppend += generateNftCard(nft);
        });

        if (getCollectionNft.totalCollNfts <= nLimit + nSkip) {
            $('#load-btn').css('display', 'none');
        }
        $('#collection-nft-card').append(dataToAppend);
        nSkip += nLimit;
        _helper.addTiltEffect($('#collection-nft-card .img-tilt'));
        setAuctionTimer('collection-nft-card');
    } catch (error) {
        console.log(error);
        if (error != 'server error') {
            window.location.href = '/404';
        }
        notify('error', error);
    }
}
