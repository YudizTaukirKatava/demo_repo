$(document).ready(async function () {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Edit Profile | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${window.location.origin}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Edit Profile | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Edit Profile | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${window.location.origin}/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    $('#contactus-btn').on('click', async function (event) {
        event.preventDefault();
        $('#contactus-btn')
            .html("<div class='spinner-border spinner-border-sm'></div>")
            .prop('disabled', true);
        let sName = $('#contactus-name').val().trim();
        let sEmail = $('#contactus-mail').val().trim();
        let sDescription = $('#contactus-desc').val().trim();

        if (sName == '') {
            $('#contactus-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter name');
        }
        if (
            sName != '' &&
            (!_validator.isValidString(sName) || !_validator.isValidName(sName))
        ) {
            $('#contactus-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid name');
        }
        if (sEmail == '') {
            $('#contactus-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter email');
        }
        if (sEmail != '' && !_validator.isValidEmail(sEmail)) {
            $('#contactus-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid email');
        }
        if (sDescription == '') {
            $('#contactus-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid description');
        }

        try {
            const contactUs = await _helper.call_API_v2(
                'POST',
                '/user/contactUs',
                { sName, sEmail, sDescription }
            );

            console.log('contactUs: ', contactUs);

            notify('success', contactUs.message);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            notify('error', error);
            $('#contactus-btn').html('Submit').prop('disabled', false);
        }
    });
});
