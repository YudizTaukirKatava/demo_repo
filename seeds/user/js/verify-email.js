var url_string = window.location.href;
var url = new URL(url_string);
var token_ = url.searchParams.get('token');

console.log(token_);

checkVerify();

async function checkVerify() {
    try {
        if (!token_) {
            window.location.href = '/';
        } else {
            await _helper.call_API('PATCH', '/auth/verify-email/' + token_);
            console.log('success');
            $('#verify-link-success').show();
        }
    } catch (error) {
        console.log('expired or invalid');
        console.log(error);
        $('#verify-link-expired').show();
    }
}
