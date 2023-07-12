var url_string = window.location.href;
var url = new URL(url_string);
var token_ = url.searchParams.get('token');

console.log(token_);

if (!token_) {
    window.location.href = '/a/expire';
} else {
    try {
        _helper
            .call_API('GET', '/auth/reset/' + token_, {}, {})
            .then(async function (res) {
                console.log('success', res);
            })
            .catch(async function (error) {
                console.log(error);
                window.location.href = '/a/expire';
            });
    } catch (error) {
        console.log(error);
    }
}

/* eslint-disable */
function validatePass(pass) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
    return re.test(String(pass));
}
$('#savePass').on('click', resetPass);

async function resetPass() {
    this.disabled = true;
    let temp = window.location.href.split('/');
    let token = temp.pop();
    console.log(token);
    let sPassword = $('#password').val();
    let sConfirmPassword = $('#confirm-password').val();

    if (sPassword == '') {
        $('#password-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#password-error').html('Please fill out this field!');
        $('#password-error').css('display', 'block');
        this.disabled = false;
        return;
    } else {
        if (validatePass(sPassword) || validatePass(sConfirmPassword)) {
            $('#password-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-valid');
            $('#password-error').html('');
            $('#password-error').css('display', 'none');
        } else {
            this.disabled = false;
            $('#password-error')
                .closest('.form-group')
                .removeClass('is-invalid')
                .addClass('is-invalid');
            $('#password-error').html(
                'Password must be at least 6 character long & 1 uppercase, lowercase, numeric character and Special character.'
            );
            $('#password-error').css('display', 'block');
            return;
        }
    }

    let oOptions = {
        sPassword: sPassword,
        sConfirmPassword: sConfirmPassword,
    };

    if (sPassword != sConfirmPassword) {
        $('#confirm-password-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#confirm-password-error').html(
            'Password & Confirm Password doesn`t Match!'
        );
        $('#confirm-password-error').css('display', 'block');
        this.disabled = false;
        return;
    } else {
        $('#confirm-password-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-valid');
        $('#confirm-password-error').html('');
        $('#confirm-password-error').css('display', 'none');
        try {
            let res = await _helper.call_API(
                'POST',
                '/auth/reset/' + token_,
                oOptions,
                {}
            );
            if (!res) {
                $('#savePass').attr('disabled', false);
                notify('error', 'token expired');
            }
            notify('success', 'password reset successfully');
            setTimeout(function () {
                window.location.href = '/a/signin';
            }, 500);
            return;
        } catch (error) {
            setTimeout(function () {
                window.location.href = '/a/signin';
            }, 1000);
            console.log(error);
            return;
        }
    }
}
