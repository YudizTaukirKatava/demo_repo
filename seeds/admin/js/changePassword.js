function validatePass(pass) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
    return re.test(String(pass));
}

$('#adminChangePassword').on('click', async function () {
    try {
        let sOldPassword = $('#currentPass').val();
        let sNewPassword = $('#newPass').val();
        let sConfirmPassword = $('#confirmPass').val();
        let sTokenAdmin = localStorage.getItem('AuthorizationAdmin');

        if (
            sOldPassword === '' ||
            sNewPassword === '' ||
            sConfirmPassword === ''
        ) {
            return notify('error', 'please enter all fields');
        }

        if (
            !validatePass(sOldPassword) ||
            !validatePass(sNewPassword) ||
            !validatePass(sConfirmPassword)
        ) {
            return notify('error', 'please enter valid password');
        }

        let oData = {
            sOldPassword,
            sNewPassword,
            sConfirmPassword,
        };

        let oResponse = await _helper.call_API(
            'PATCH',
            '/admin/changePassword',
            oData,
            {
                Authorization: sTokenAdmin,
            }
        );
        if (!oResponse) {
            return notify('error', 'password is not changed');
        }

        setTimeout(() => {
            window.location.href = '/a/dashboard';
        }, 1000);

        return notify('success', 'password changed successfully');
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
});

function togglePassword(firstId) {
    if ($(`${firstId} input`).attr('type') == 'text') {
        $(`${firstId} input`).attr('type', 'password');
        $(`${firstId} i`).addClass('fa-eye-slash');
        $(`${firstId} i`).removeClass('fa-eye');
    } else if ($(`${firstId} input`).attr('type') == 'password') {
        $(`${firstId} input`).attr('type', 'text');
        $(`${firstId} i`).removeClass('fa-eye-slash');
        $(`${firstId} i`).addClass('fa-eye');
    }
}
