$(() => {
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sAuthorization = localStorage.getItem('Authorization');

    if (sWalletAddress && sAuthorization) {
        $('#connect-wallet-sidebar').hide();
    } else {
        $('#disconnect-wallet-sidebar').hide();
    }

    $('#connect-wallet-sidebar').on('click', (event) => {
        event.preventDefault();
        $('#select-wallet-modal.modal').show();
        $('#wallet-connect-options').show();
        $('.icon-close').click();
        if (localStorage.getItem('sWalletAddress')) {
            $('#connect-wallet-sidebar').hide();
        }
    });
});

async function searchNFT() {
    try {
        let oSearchText = $('#searchBarData').val();
        console.log(oSearchText);
        if (oSearchText) {
            new Headers().set('searchData', oSearchText);
            window.location.replace(
                '/assets?q=' + encodeURIComponent(oSearchText)
            );
        }
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
}

$('#searchBardiv').keydown(function (event) {
    if (event.key === 'Enter') {
        let oSearchText = event.target.value;
        console.log(oSearchText);
        if (oSearchText) {
            new Headers().set('searchData', oSearchText);
            window.location.replace(
                '/assets?q=' + encodeURIComponent(oSearchText)
            );
        }
    }
});

