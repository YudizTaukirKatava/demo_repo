//function to validate email & password
// function isValidEmail(email) {
//     var re =
//         /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

function validatePass(pass) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
    return re.test(String(pass));
}

function validateEmpty(name) {
    var re = /^(?![\s-])[\w\s-]+$/;
    return re.test(String(name));
}

$(() => {
    if (localStorage.getItem('AuthorizationAdmin')) {
        window.location.href = '/a/dashboard';
    }
    $(document).on('input', "input[name='digits']", function (e) {
        var text = $(this).val();
        if (text.length == 4) {
            for (let i = 1; i <= text.length; i++) {
                $('#char' + i).val(text[i - 1]);
            }
        } else if (text.length > 1) {
            $(this).val(text[0]);
        }
    });
});

$('#email').on('click', function () {
    $('#email-error').css('display', 'none');
});
$('#password').on('click', function () {
    $('#password-error').css('display', 'none');
});

// Disable Back Buttton
function disableBack() {
    window.history.forward();
}
window.onload = disableBack();
window.onpageshow = function (evt) {
    if (evt.persisted) disableBack();
};

$('#signin').on('click', signin);

async function signin() {
    this.disabled = true;
    let sEmail = $('#email').val();
    let sPassword = $('#password').val();

    if (sEmail == '') {
        this.disabled = false;
        $('#email-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#email-error').html('Please fill out this field');
        $('#email-error').css('display', 'block');
        return;
    } else {
        if (_validator.isValidEmail(sEmail)) {
            $('#email-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#email-error').html('');
            $('#email-error').css('display', 'none');
        } else {
            this.disabled = false;
            $('#email-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#email-error').html('Please enter a valid Email Address');
            $('#email-error').css('display', 'block');
            return;
        }
    }
    if (sPassword == '') {
        this.disabled = false;
        $('#password-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#password-error').html('Please fill out this field!');
        $('#password-error').css('display', 'block');
        return;
    } else {
        $('#password-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-valid');
        $('#password-error').html('');
        $('#password-error').css('display', 'none');
        let oOptions = {
            sEmail: sEmail,
            sPassword: sPassword,
        };
        try {
            let signIn = await _helper.call_API(
                'POST',
                '/auth/adminlogin',
                oOptions
            );

            if (signIn.twoFactorEnabled == true) {
                $('#admin-otp-modal').modal('show');

                $('#submitAdminOtp').on('click', async () => {
                    const first = $('#char1').val().trim();
                    const second = $('#char2').val().trim();
                    const third = $('#char3').val().trim();
                    const fourth = $('#char4').val().trim();

                    if (
                        first === '' ||
                        second === '' ||
                        third === '' ||
                        fourth === ''
                    ) {
                        return notify('error', 'please enter valid otp');
                    }

                    let nOtp = first + second + third + fourth;
                    let oData = {
                        nOtp,
                        sEmail,
                    };
                    try {
                        await _helper.call_API(
                            'POST',
                            '/auth/verifyOtp',
                            oData
                        );
                        signInData(signIn);
                    } catch (error) {
                        console.log(error);
                        return notify('error', error);
                    }
                });
            } else {
                await signInData(signIn);
            }
        } catch (error) {
            console.log('file: signin.js ~ line 102 ~ signin ~ error', error);
            notify('error', error);
            this.disabled = false;
        }
    }
}

async function signInData(signIn) {
    try {
        if (window.localStorage.getItem('AuthorizationAdmin')) {
            window.location.href = '/a/dashboard';
        }
        window.localStorage.setItem('AuthorizationAdmin', signIn.sToken);
        window.localStorage.setItem('sUserIdAdmin', signIn._id);
        window.localStorage.setItem('sUserNameAdmin', signIn.sUserName);
        window.localStorage.setItem(
            'sWalletAddressAdmin',
            signIn.sWalletAddress
        );

        if (signIn.sProfilePicUrl) {
            window.localStorage.setItem(
                'sProfilePicUrlAdmin',
                signIn.sProfilePicUrl
            );
        }
        notify('success', 'login successfully');
        setTimeout(function () {
            window.location.href = '/a/dashboard';
        }, 500);
    } catch (error) {
        console.log(error);
        return;
    }
}

$(document).ready(function () {
    var url_string = window.location;
    var urlChk = new URL(url_string);
    var urlErr = urlChk.searchParams.get('error');
    window.localStorage.removeItem('AuthorizationAdmin');
    window.localStorage.removeItem('sUserIdAdmin');
    window.localStorage.removeItem('sUserNameAdmin');
    window.localStorage.removeItem('sWalletAddressAdmin');
    window.localStorage.removeItem('sProfilePicUrlAdmin');

    if (urlErr) {
        console.log(urlErr);
        notify('error', decodeURIComponent(urlErr));
    }
});
