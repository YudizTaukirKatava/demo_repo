let isLoaded = false;
let nSkip = 0;
let nLimit = 8;

$(() => {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="My Favorite | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}/explore-creators">
    <meta property="og:type" content="website">
    <meta property="og:title" content="My Favorite | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="My Favorite | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    // console.log($('#sortby option:selected').val());
    if (!localStorage.getItem('sWalletAddress')) {
        window.location.href = '/';
    }

    loadData();
    $('#load-more-fav').on('click', function (e) {
        e.preventDefault();
        nLimit = 4;
        loadData();
    });
});

async function loadData() {
    try {
        let dataToAppend = '';
        if (isLoaded) {
            dataToAppend += $('#favorite-nft-card').html();
        }

        let oResult = await _helper.call_API(
            'POST',
            '/user/favorite-nft',
            {
                nLimit,
                nSkip,
            },
            { Authorization: sToken }
        );

        if (!oResult.favoriteNft.length) {
            $('#load-more-fav').css('display', 'none');
            dataToAppend = `<h1><center class="m-5 text-white"><b>Please like some NFTs to see here!</b></center></h1>`;
            $('#favorite-nft-card').html(dataToAppend);
            return;
        }
        oResult.favoriteNft.forEach((nft) => {
            dataToAppend += generateNftCard(nft);
        });

        if (oResult.recordsTotal.count <= nLimit + nSkip) {
            $('#load-more-fav').css('display', 'none');
        }
        $('#favorite-nft-card').append(dataToAppend);
        nSkip += nLimit;
    } catch (err) {
        console.log(err);
    }
}
