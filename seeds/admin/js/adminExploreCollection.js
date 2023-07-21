let isLoaded = false;
let nSkip = 0;
let nLimit = 12;

$(() => {
    // <!-- HTML Meta Tags -->
    loadData();
    $('#load-btn').on('click', function (e) {
        e.preventDefault();
        loadData();
    });
});

async function loadData() {
    try {
        let dataToAppend = '';
        if (isLoaded) {
            dataToAppend += $('#collection_list').html();
        }
        let oResult = await _helper.call_API(
            'POST',
            '/admin/admin-collection',
            {
                nLimit,
                nSkip,
            },
            {
                Authorization: localStorage.getItem('AuthorizationAdmin')
            }
        );
        oResult.data.forEach((collection) => {
            collection['isAdminSide'] = true
            dataToAppend += _helper.generateHtmlFromEJS(
                _card_templates.collection,
                collection
            );
        });

        if (oResult.recordsTotal <= nLimit + nSkip) {
            $('#load-btn').css('display', 'none');
        }
        $('#collection_list').append(dataToAppend);
        nSkip += nLimit;
    } catch (err) {
        console.log(err);
    }
}
