let nSkip = 0;
let nLimit = 12;

$(async () => {
    let oCollectionId;
    try {
        let url = window.location.href;
        oCollectionId = url.split('single-collection/');

        const getCollection = await _helper.call_API(
            'GET',
            `/collection/get-collection/${oCollectionId[1]}`,
            {}
        );

        $('#collection-desc').text(getCollection.sDescription);
        $('#collection-name').text(getCollection.sName);
        $('#collection-img').attr('src', getCollection.sImageUrl);

        $('title').text(`${getCollection.sName} | ${_PLATFORM_NAME}`);
    } catch (error) {
        console.log(error);
        if (error != 'server error') {
            window.location.href = '/404';
        }
        notify('error', error);
    }
    loadData(oCollectionId);
    $('#load-btn').on('click', function (e) {
        e.preventDefault();
        loadData(oCollectionId);
    });
});

async function loadData(oCollectionId) {
    try {
        let dataToAppend = '';
        const getCollectionNft = await _helper.call_API(
            'POST',
            `/collection/get-collection-nft/${oCollectionId[1]}`,
            { nSkip, nLimit }
        );

        getCollectionNft.collNfts.forEach((nft) => {
            nft['isAdminSide'] = true;
            dataToAppend += generateNftCard(nft, false, true);
        });

        if (getCollectionNft.totalCollNfts <= nLimit + nSkip) {
            $('#load-btn').css('display', 'none');
        }
        $('#collection-nft-card').append(dataToAppend);
        nSkip += nLimit;
        _helper.addTiltEffect($('#collection-nft-card .img-tilt'));
        setAuctionTimer('collection-nft-card');
    } catch (error) {
        console.log(error);
        if (error != 'server error') {
            window.location.href = '/404';
        }
        notify('error', error);
    }
}
