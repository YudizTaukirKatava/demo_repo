// var token = window.localStorage.getItem('AuthorizationAdmin');
console.log('inside profile');

$(document).ready(async function () {
    let sTokenAdmin = localStorage.getItem('AuthorizationAdmin');
    $('#profile-username').html(localStorage.getItem('sUserNameAdmin'));
    var readURL = function (input) {
        // Check for Valid File
        const aAllowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!aAllowedMimes.includes(input.files[0].type)) {
            $('#profile-image-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#profile-image-error').html(
                'You can only Select a JPG/JPEG/PNG file.'
            );
            $('#profile-image-error').css('display', 'block');
            $('#editProfile').prop('disabled', false);
            return;
        } else {
            $('#profile-image-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#profile-image-error').html('');
            $('#profile-image-error').css('display', 'none');
        }

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#userProfilePicture').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $('#imageUpload').on('change', function () {
        readURL(this);
    });

    $('#userProfilePicture').on('click', function () {
        $('#imageUpload').click();
    });
    try {
        let sUserId = localStorage.getItem('sUserIdAdmin');
        let result = await _helper.call_API(
            'GET',
            `/admin/profile/${sUserId}`,
            {},
            {
                Authorization: sTokenAdmin,
            }
        );
        if (!result) {
            notify('error', 'data not found');
        }
        localStorage.setItem('sProfilePicUrlAdmin', result.sProfilePicUrl);

        if (localStorage.getItem('sProfilePicUrlAdmin'))
            $('#admin-profile-picture').attr('src', result.sProfilePicUrl);

        $('#fullName').html(
            result.oName.sFirstname + ' ' + result.oName.sLastname
        );
        $('#username').html('@' + result.sUserName);
        $('#name').html(result.oName.sFirstname);
        $('#joiningData').html('Join on ' + formatDate(result.dCreatedAt));
        $('#edit_firstname').val(result.oName.sFirstname);
        $('#edit_lastname').val(result.oName.sLastname);
        $('#edit_email').val(result.sEmail);
        $('#edit_walletaddress').val(result.sWalletAddress);
        $('#edit_username').val(result.sUserName);
        $('#userProfilePicture').attr(
            'src',
            result.sProfilePicUrl == undefined
                ? '/assets/img/male-avatar-maker.jpg'
                : result.sProfilePicUrl
        );
        $('#2fa-btn').attr('checked', result.bTwoFactorEnabled);
    } catch (error) {
        notify('error', error.message);

        $('#editProfile').html('Submit').prop('disabled', false);
    }
});

$('#editProfile').on('click', editProfile);

async function editProfile() {
    let sTokenAdmin = localStorage.getItem('AuthorizationAdmin');

    let sFirstname = $('#edit_firstname').val().trim();
    let sLastname = $('#edit_lastname').val().trim();
    let sUsername = $('#edit_username').val().trim();

    if (sFirstname == '') {
        $('#firstname-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#firstname-error').html('Please enter firstname');
        $('#firstname-error').css('display', 'block');
        return;
    } else {
        if (_validator.isValidName(sFirstname)) {
            $('#firstname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#firstname-error').html('');
            $('#firstname-error').css('display', 'none');
        } else if (!isNaN(sFirstname)) {
            $('#firstname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#firstname-error').html('Numbers are not allowed');
            $('#firstname-error').css('display', 'block');
            return;
        } else {
            $('#firstname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#firstname-error').html('Special characters are not allowed');
            $('#firstname-error').css('display', 'block');
            return;
        }
    }
    if (sLastname == '') {
        $('#lastname-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#lastname-error').html('Please enter lastname');
        $('#lastname-error').css('display', 'block');
        return;
    } else {
        if (_validator.isValidName(sLastname)) {
            $('#lastname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#lastname-error').html('');
            $('#lastname-error').css('display', 'none');
        } else if (!isNaN(sLastname)) {
            $('#lastname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#lastname-error').html('Numbers are not allowed');
            $('#lastname-error').css('display', 'block');
            return;
        } else {
            $('#lastname-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#lastname-error').html('Special characters are not allowed');
            $('#lastname-error').css('display', 'block');
            return;
        }
    }
    if (sUsername == '') {
        $('#username-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#username-error').html('Please enter username');
        $('#username-error').css('display', 'block');
        return;
    } else {
        if (
            _validator.validateEmpty(sUsername) &&
            _validator.isValidName(sUsername)
        ) {
            $('#username-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#username-error').html('');
            $('#username-error').css('display', 'none');
        } else {
            $('#username-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#username-error').html(
                'The Username should only contain alphabets with no white space'
            );
            $('#username-error').css('display', 'block');
            return;
        }
    }

    $('#editProfile')
        .html("<div class='spinner-border spinner-border-sm'></div>")
        .prop('disabled', true);

    var fd = new FormData();
    let bTwoFactorEnabled = $('#2fa-btn').is(':checked');

    var files = $('#imageUpload')[0].files;
    console.log('File : ', files[0]);
    fd.append('multerImage', files[0]);
    fd.append('sFirstname', sFirstname);
    fd.append('sLastname', sLastname);
    fd.append('sUserName', sUsername);
    fd.append('bTwoFactorEnabled', bTwoFactorEnabled);

    console.log('fd : ', fd);

    let oOptions = {
        sFirstname: sFirstname,
        sLastname: sLastname,
        sUserName: sUsername,
    };
    console.log('oOptions', oOptions);

    try {
        let result = await _helper.call_API(
            'PATCH',
            '/admin/updateProfile',
            fd,
            {
                Authorization: sTokenAdmin,
            }
        );
        console.log('result', result);
        localStorage.setItem('sUserName', sUsername);
        notify('success', 'profile updated');
        setTimeout(function () {
            location.reload();
        }, 1000);
    } catch (error) {
        notify('error', 'profile not updated');
        console.log('error', error);
        $('#editProfile').html('Submit').prop('disabled', false);
    }
}
