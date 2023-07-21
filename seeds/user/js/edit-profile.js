let bTwoFactorEnabled;

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

    try {
        let sUserId = localStorage.getItem('_id');

        // console.log('sUserId,', sUserId);
        let result = await _helper.call_API(
            'GET',
            `/user/profile/${sUserId}`,
            {},
            {
                Authorization: sToken,
            }
        );
        bTwoFactorEnabled = result.bTwoFactorEnabled;
        // console.log({ result });
        $('#bio').val(result?.sBio);
        $('#fname').val(result?.oName?.sFirstname);
        $('#lname').val(result?.oName?.sLastname);
        $('#uname').val(result?.sUserName);
        $('#email').val(result?.sEmail);
        $('#website-link').val(result?.sWebsite);
        $('#facebook').val(result?.sFacebook);
        $('#twitter').val(result?.sTwitter);
        $('#discord').val(result?.sDiscord);
        $('#pinterest').val(result?.sPinterest);
        $('#youtube').val(result?.sYoutube);
        $('#telegram').val(result?.sTelegram);
        $('#imagePreview').attr(
            'style',
            `background-image: url(${
                result?.sProfilePicUrl || '/assets/img/male-avatar-maker.jpg'
            });`
        );
        $('#imagePreview-bg').attr(
            'style',
            `background-image: url(${
                result?.sCoverPicUrl || '/assets/img/profile-background.png'
            });`
        );
        if (bTwoFactorEnabled) {
            $('#2fa-btn').attr('checked', true);
        }
    } catch (error) {
        console.log(error);
    }
    $('#submit-btn').on('click', async function (event) {
        event.preventDefault();
        $('#submit-btn')
            .html("<div class='spinner-border spinner-border-sm'></div>")
            .prop('disabled', true);
        let sBio = $('#bio').val().trim();
        let sFirstName = $('#fname').val().trim();
        let sLastName = $('#lname').val().trim();
        let sUserName = $('#uname').val().trim();
        let sEmail = $('#email').val().trim();
        let sWebsite = $('#website-link').val().trim();
        let sFacebook = $('#facebook').val().trim();
        let sTwitter = $('#twitter').val().trim();
        let sDiscord = $('#discord').val().trim();
        let sPinterest = $('#pinterest').val().trim();
        let sYoutube = $('#youtube').val().trim();
        let sTelegram = $('#telegram').val().trim();
        let profilePicFile = $('#imageUpload')[0].files[0];
        let coverPicFile = $('#imageUpload-bg')[0].files[0];

        if (
            sFirstName != '' &&
            (!_validator.isValidString(sFirstName) ||
                !_validator.isValidName(sFirstName))
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid first name');
        }
        if (
            sLastName != '' &&
            (!_validator.isValidString(sLastName) ||
                !_validator.isValidName(sLastName))
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid last name');
        }
        if (
            sUserName == '' &&
            (!_validator.isValidString(sUserName) ||
                !_validator.isValidUserName(sUserName))
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify(
                'error',
                'Please enter valid username! it must contain 5 to 15 character and it must starts with latter'
            );
        }
        if (sEmail == '' && !_validator.isValidEmail(sEmail)) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid email');
        }
        if (
            sWebsite != '' &&
            (!_validator.isValidLink(sWebsite) || sWebsite.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid website link');
        }
        if (
            sFacebook != '' &&
            (!_validator.isValidLink(sFacebook) || sFacebook.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid facebook link');
        }
        if (
            sTwitter != '' &&
            (!_validator.isValidLink(sTwitter) || sTwitter.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid twitter link');
        }
        if (
            sDiscord != '' &&
            (!_validator.isValidLink(sDiscord) || sDiscord.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid discord link');
        }
        if (
            sPinterest != '' &&
            (!_validator.isValidLink(sPinterest) || sPinterest.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid pinterest link');
        }
        if (
            sYoutube != '' &&
            (!_validator.isValidLink(sYoutube) || sYoutube.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid youtube link');
        }
        if (
            sTelegram != '' &&
            (!_validator.isValidLink(sTelegram) || sTelegram.length > 2083)
        ) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter valid telegram link');
        }
        if (sBio != '' && sBio.length > 1000) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            return notify('error', 'Please enter bio within 1000 characters');
        }

        let oData = new FormData();

        oData.append('sBio', sBio);
        oData.append('sFirstName', sFirstName);
        oData.append('sLastName', sLastName);
        oData.append('sUserName', sUserName);
        oData.append('sEmail', sEmail);
        oData.append('sWebsite', sWebsite);
        oData.append('sFacebook', sFacebook);
        oData.append('sTwitter', sTwitter);
        oData.append('sDiscord', sDiscord);
        oData.append('sPinterest', sPinterest);
        oData.append('sYoutube', sYoutube);
        oData.append('sTelegram', sTelegram);
        oData.append('profilePicFile', profilePicFile);
        oData.append('coverPicFile', coverPicFile);
        // console.log({ oData });

        try {
            // console.log({ bTwoFactorEnabled, sEmail });
            if (
                bTwoFactorEnabled &&
                sEmail &&
                sEmail != localStorage.getItem('sEmail')
            ) {
                changeEmail(localStorage.getItem('sWalletAddress'), oData);
            } else {
                let oResult = await internalUpdateProfile(oData);

                if (oResult.sProfilePicUrl) {
                    window.localStorage.setItem(
                        'sProfilePicUrl',
                        oResult.sProfilePicUrl
                    );
                }

                if (oResult.sUserName) {
                    window.localStorage.setItem('sUserName', oResult.sUserName);
                }
                notify('success', 'Profile details updated');

                if (oResult.isEmailChanged) {
                    $('#warning-friend-modal').show();
                    $('#btn-warning-ok, #icn-warning-close').onClick(
                        localStorage.clear()
                    );
                    return;
                }
                $('#submit-btn').html('Submit').prop('disabled', false);

                window.location.href = `/creator/${window.localStorage.getItem(
                    '_id'
                )}`;
            }
        } catch (error) {
            $('#submit-btn').html('Submit').prop('disabled', false);
            notify('error', error);
        }
    });
});

$('#2fa-btn').on('click', async (e) => {
    try {
        console.log('2fa clicked');
        const response = await _helper.call_API_v2(
            'POST',
            '/user/toggleTwoFactorAuth',
            {
                status: e.target.checked,
            },
            {
                Authorization: sToken,
            }
        );

        notify('success', response.message);
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
});

async function changeEmail(res, data) {
    try {
        let resData = await _helper.call_API_v2('POST', '/auth/getOtp', {
            sWalletAddress: res.toLowerCase(),
        });
        console.log(resData);
        $('#submit-btn').html('Submit').prop('disabled', false);

        // TODO : check otp sent or not
        if (resData.data.otpSent) {
            mailTimerEditProfile(30);
            $('#otp-modal-edit-profile').show();
            $('#char1-edit-profile').focus();
            $('#verify-otp-edit-profile').on('click', async () => {
                try {
                    const first = $('#char1-edit-profile').val().trim();
                    const second = $('#char2-edit-profile').val().trim();
                    const third = $('#char3-edit-profile').val().trim();
                    const fourth = $('#char4-edit-profile').val().trim();

                    if (
                        first === '' ||
                        second === '' ||
                        third === '' ||
                        fourth === ''
                    ) {
                        return notify('error', 'please enter valid otp');
                    }

                    let nOtp = first + second + third + fourth;

                    $('#otp-modal-edit-profile').hide();
                    data.append('nOtp', Number(nOtp));
                    $('#verify-otp-edit-profile')
                        .html(
                            '<button class="place-bid-final">Verify OTP</button>'
                        )
                        .prop('disabled', true);
                    let oResult = await internalUpdateProfile(data);
                    console.log(oResult);

                    if (oResult.isEmailChanged) {
                        $('#warning-friend-modal').show();
                        $('#btn-warning-ok, #icn-warning-close').on(
                            'click',
                            localStorage.clear()
                        );
                    }
                    $('#verify-otp-edit-profile')
                        .html(
                            '<button class="place-bid-final">Verify OTP</button>'
                        )
                        .prop('disabled', false);
                } catch (error) {
                    console.log(error);
                    $('#verify-otp-edit-profile')
                        .html(
                            '<button class="place-bid-final">Verify OTP</button>'
                        )
                        .prop('disabled', false);
                    return notify('error', error);
                }
            });
        } else {
            return notify('error', 'Something went wrong please try again');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function internalUpdateProfile(oData) {
    return new Promise(async function (resolve, reject) {
        try {
            let oResult = await _helper.call_API(
                'PATCH',
                '/user/updateProfile',
                oData,
                {
                    Authorization: sToken,
                }
            );
            resolve(oResult);
        } catch (error) {
            reject(error);
        }
    });
}

function mailTimerEditProfile(timeleft) {
    let downloadTimer = setInterval(function () {
        timeleft--;
        console.log('time:', timeleft, $('#mailTimer-edit-profile'));
        $('#resendMail-edit-profile').html(
            `<span>Resend in <span id="mailTimer-edit-profile"></span></span>`
        );
        $('#mailTimer-edit-profile').text(`${timeleft}`);
        $('#resendMail-edit-profile').prop('aria-disabled', true);
        if (timeleft <= 0) {
            $('#mailTimer-edit-profile').text('');
            $('#resendMail-edit-profile').html(
                `<span>Resend <span id="mailTimer-edit-profile"></span></span>`
            );
            $('#resendMail-edit-profile').prop('aria-disable', false);
            $('#resendMail-edit-profile').removeAttr('style');

            clearInterval(downloadTimer);
        }
    }, 1000);
}
