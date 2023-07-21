$(() => {
    aboutusData();
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
});

// async function aboutusData() {
//     try {
//         const aboutusAPI = await call_API('GET', '/user/getAboutusData', {});

//         $('#nft-drop').append(`
      
//         <div class="row">
//             <div class="col" align='justify'>
//                 <p> <h5>${aboutusAPI} </h5> </p>
//             </div>
//         </div>



    

        
                 
                        
                    
                      
            
                   
                    
//                 `);
//     } catch (error) {
//         console.log('error: ', error);
//     }
// }
