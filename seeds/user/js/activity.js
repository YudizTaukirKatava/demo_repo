let nLimit = 5;
let nSkip = 0;
let hasMore = true;

let aFilter = [];

loadActivities();

function resetInitData() {
    nSkip = 0;
    hasMore = true;
    $('#activity-tab').html('');
}

async function loadActivities() {
    try {
        const resAct = await _helper.call_API_v2(
            'POST',
            '/platform/activities',
            { nLimit, nSkip, aFilter },
        );

        let activities = resAct.data;

        // console.log(activities);

        let allHtml = ``;

        if(activities.length == nLimit) { 
            nSkip += nLimit;
        } else {
            hasMore = false;
        }
        // console.log(hasMore);

        activities.forEach(activity => {
            // console.log(activity); 

            let preType = activity.eBidStatus;
            let postType = activity.eBidStatus == 'Sold' ? 'to' : 'by';
            let sTransactionHash = activity.sTransactionHash;

            if(activity.eBidStatus == 'Mint') {
                sTransactionHash = activity.oNFT[0].sTransactionHash;
                preType = 'Minted';
            }

            let activityType = `${preType} ${postType}`;

            let userName = activity.aBidders[0]?.sUserName || 
                _helper.trimEthereumAddress(activity
                    .aBidders[0]
                    ?.sWalletAddress,
                    10
                );

            allHtml += _helper.generateHtmlFromEJS(_card_templates.activity, {
                nftImage: `${_platform_config[___ENV___].sS3Location}${activity.oNFT[0].sImageHash}`,
                nftName: activity.oNFT[0].sName,
                userName,
                activityType,
                activityDate: 'At ' + moment(activity.sCreated).format('h:mm A on Do MMMM YYYY'),
                txLink: `${_chains_web3[activity.oNFT[0].nChainId].blockExplorerUrls[0]}/tx/${sTransactionHash}`,
                nftUrl: `/nft/${activity.oNFTId}`
            });
            
        });
        if(!allHtml){

            $('#activity-tab').append(`<h3><center class="mb-5 text-white align-item-center"><b>Activity Not Found</b></center></h3>`);
        }
        
        $('#activity-tab').append(allHtml);


    } catch (error) {
        console.log(error);
        notify('error', error);
    }
}

$('#activity-tab').scroll(function() {
    let div = $(this).get(0);
    if(div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if(hasMore) {
            loadActivities();
        }
    }
});

$(".clear-filter").on('click', function () {
    $('.activity-selection-tabs li').removeClass("select-active");
    aFilter = [];
    resetInitData();
    loadActivities();
});

$('.activity-selection-tabs li').on('click', function () {
    let val = $(this).attr('val');

    if($(this).hasClass('select-active')) {
        const index = aFilter.indexOf(val);
        if (index > -1) {
            aFilter.splice(index, 1);
        }
    } else {
        if(!aFilter.includes(val)) {
            aFilter.push(val);
        }
    }

    // console.log(aFilter);

    $(this).toggleClass("select-active");
    resetInitData();
    loadActivities();
});

