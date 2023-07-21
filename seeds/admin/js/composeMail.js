$(document).ready(function () {
    $('#composeMailBody').summernote();
});

$('#btnSendMail').on('click', async () => {
    console.log('button clicked ');
    console.log($('#emailSubject').val());
    console.log($('.note-editable').html());
    console.log($('.note-editable').text().trim());

    if ($('#emailSubject').val().trim() == '') {
        notify('error', 'Please Enter Mail Subject!');
        console.log('mail subject');
        return;
    }
    if ($('.note-editable').text().trim() == '') {
        console.log('mail content');
        notify('error', 'Please Enter Mail Content!');
        return;
    }

    $('#btnSendMail')
        .html("<div class='spinner-border spinner-border-sm'></div>")
        .prop('disabled', true);

    let oData = {
        sSubject: $('#emailSubject').val(),
        sHTMLContent: $('.note-editable').html(),
    };
    let sTokenAdmin = localStorage.getItem('AuthorizationAdmin');

    console.log('oData : ', oData);
    try {
        let res = await _helper.call_API('POST', '/admin/sendNewsLetterEmail', oData, {
            Authorization: sTokenAdmin,
        });
        if (!res) {
            notify('error', 'email is not sent');
            return;
        }
        console.log('success');
        notify('success', 'Email sent');
        $('#btnSendMail').html('Send').prop('disabled', false);
    } catch (error) {
        console.log(error);
        notify('error', 'Email not sent');
    }
});
