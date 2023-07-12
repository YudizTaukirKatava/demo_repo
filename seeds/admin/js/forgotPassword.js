function validateEmail(email) {
    var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$('#email').on('click', function () {
    $('#email-error').css('display', 'none');
});

$('#forgot').on('click', forgotPassword);

async function forgotPassword() {
    this.disabled = true;
    let sEmail = $('#email').val();

    if (sEmail == '') {
        this.disabled = false;
        $('#email-error')
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $('#email-error').html('Please fill  out this field');
        $('#email-error').css('display', 'block');
        return;
    } else {
        if (validateEmail(sEmail)) {
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

        let oOptions = {
            sEmail: sEmail,
        };
        try {
            let res = await _helper.call_API(
                'POST',
                '/auth/passwordreset',
                oOptions,
                {}
            );
            console.log('ressssss : ', res);
            if (!res) {
                $('#forgot').attr('disabled', false);
                notify('error', 'password not reset');
                return;
            }
            notify('success', 'email sent successfully');

            setTimeout(function () {
                window.location.href = '/a/signin';
            }, 1000);
        } catch (error) {
            console.log(error);
            notify('error', error);
            $('#forgot').attr('disabled', false);
            return;
        }
    }
}
