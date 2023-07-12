$(async () => {
    // <!-- HTML Meta Tags -->
    $('head').append(`
    <meta name="description" content="NFT Talent">
    
    
    <meta itemprop="name" content="Single Creator | NFT Talent">
    <meta itemprop="description" content="NFT Talent">
    <meta itemprop="image" content="${
        window.location.origin
    }/${localStorage.getItem('sProfilePicUrl')}">
    <meta itemprop="image:width" content="300">
    <meta itemprop="image:height" content="300">
    <meta itemprop="image:alt" content="NFT-MarketPlace">
    
    
    <meta property="og:url" content="${
        window.location.origin
    }/creator/${localStorage.getItem('_id')}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Single Creator | NFT Talent">
    <meta property="og:description" content="NFT Talent">
    <meta property="og:image" content="${
        window.location.origin
    }/${localStorage.getItem('sProfilePicUrl')}">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="NFT-MarketPlace">
    
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Single Creator | NFT Talent">
    <meta name="twitter:description" content="NFT Talent">
    <meta name="twitter:image" content="${
        window.location.origin
    }/assets/img/NFTiz%20Logo.jpg">
    <meta property="twitter:image:width" content="300">
    <meta property="twitter:image:height" content="300">
    <meta property="twitter:image:alt" content="NFT-MarketPlace">
    `);
    // <!-- Meta Tags Generated via http://heymeta.com -->

    $('#edit-profile').hide();
    $('#tab-activity').hide();
    $('#activityTab').hide();
    $('#bidActivityTab').hide();

    $('.two-fa-otr').hide();
    let obj = {
        nSkip: 0,
        nLimit: 4,
        isLoaded: false,
        oFilter: {
            id: 'onSale',
        },
    };
    let paginationData = {
        onSale: cloneObject(obj),
        created: cloneObject(obj),
        owned: cloneObject(obj),
    };
    let url = window.location.href;
    let user_id = url.split('creator/');
    let sUserName;
    let sWalletAddress;
    let nFollowers;
    let nFollowing;
    let sUserProfilePic;
    let colorPalletImg;
    let is2FaEnabled;
    let onSaleCount;
    let createdCount;
    let ownedCount;

    try {
        let oData = {
            nSkip: 0,
            nLimit: 1,
            isLoaded: false,
            oFilter: {
                id: 'user',
            },
        };
        let oUser = await _helper.call_API(
            'POST',
            `/user/getUserDetails/${user_id[1]}`,
            oData
        );
        getData('onSale', 'tabn1');

        sUserName = oUser.userData[0].sUserName
            ? oUser.userData[0].sUserName
            : oUser.userData[0]?.oName?.sFirstname
            ? oUser.userData[0]?.oName?.sFirstname
            : 'Unknown';

        $('title').text(`${sUserName} | ${_PLATFORM_NAME}`);

        nFollowers = oUser.userData[0].followers?.length;
        nFollowing = oUser.userData[0].following?.length;
        sUserProfilePic = oUser.userData[0].sProfilePicUrl;
        is2FaEnabled = oUser.userData[0].bTwoFactorEnabled;
        console.log(oUser.userData[0].sWalletAddress);

        if (
            localStorage.getItem('sWalletAddress') ===
            oUser.userData[0].sWalletAddress
        ) {
            localStorage.setItem('sUserName', sUserName);
            $('#edit-profile').show();
            $('#tab-activity').show();
            $('.two-fa-otr').show();
            $('#activityTab').show();
            $('#bidActivityTab').show();
        }
        let id = localStorage.getItem('_id');
        let singleHtml = ` <a
                            href=""                          
                            class="btn-fill btn-follow" onclick="followCreator($(this)); return false;"
                            data-isFollowed="${
                                oUser.userData[0].aFollowers?.includes(id)
                                    ? 'true'
                                    : 'false'
                            }"
                            data-_id="${oUser.userData[0]._id}"
                                                >${
                                                    oUser.userData[0].aFollowers.includes(
                                                        id
                                                    )
                                                        ? 'Unfollow'
                                                        : 'Follow'
                                                }</a>`;
        oUser.userData[0].sWalletAddress ==
            localStorage.getItem('sWalletAddress') ||
        !localStorage.getItem('sWalletAddress')
            ? ''
            : $('#singleCreator').append(singleHtml);
        let noDataFollowers = `<h5 class='text-center text-white'>No Followers</h5>`;
        let noDataFollowings = `<h5 class='text-center text-white'>No Following</h5>`;
        if (nFollowers == 0) {
            // console.log('length : ', nFollowers);

            $('#followersList').append(noDataFollowers);
        }

        for (let i = 0; i < nFollowers; i++) {
            $('#followersList').append(
                generateFollower(oUser.userData[0].followers[i], id)
            );
        }
        if (nFollowing == 0) {
            // console.log('length : ', nFollowing);
            $('#followingsList').append(noDataFollowings);
        }

        for (let i = 0; i < nFollowing; i++) {
            $('#followingsList').append(
                generateFollower(oUser.userData[0].following[i], id)
            );
        }
        sWalletAddress =
            oUser.userData[0].sWalletAddress?.slice(0, 5) +
            ' ... ' +
            oUser.userData[0].sWalletAddress?.slice(
                oUser.userData[0].sWalletAddress?.length - 5
            );

        $('#user-wallet-address').text(sWalletAddress);

        $('#copy-address-2').on('click', function () {
            copyDataToClipBoard(oUser.userData[0].sWalletAddress);
        });

        function showBlueTick() {
            // alert();
        }

        function showFollowButton() {
            console.log(
                `DB address = ${
                    oUser.userData[0].sWalletAddress
                }, LocalStorage address = ${localStorage.getItem(
                    'sWalletAddress'
                )}`
            );
        }
        if (
            oUser.userData[0].sProfilePicThumbUrl &&
            oUser.userData[0].sProfilePicThumbUrl != ''
        ) {
            $('#user-img').attr('src', `${sUserProfilePic}?cacheblock=true`);
            colorPalletImg = 'user-img';
        } else {
            colorPalletImg = 'user-img-temp';
        }

        if (oUser.userData[0].sWebsite) {
            $('#website-link')
                .attr('href', `${oUser.userData[0].sWebsite}`)
                .html(`${oUser.userData[0].sWebsite}`);
        } else {
            $('#website').hide();
        }
        if (oUser.userData[0].sFacebook) {
            $('#fb-link').attr('href', `${oUser.userData[0].sFacebook}`);
        } else {
            $('#facebook').hide();
        }
        if (oUser.userData[0].sTwitter) {
            $('#twitter-link').attr('href', `${oUser.userData[0].sTwitter}`);
        } else {
            $('#twitter').hide();
        }
        if (oUser.userData[0].sDiscord) {
            $('#discord-link').attr('href', `${oUser.userData[0].sDiscord}`);
        } else {
            $('#discord').hide();
        }
        if (oUser.userData[0].sPinterest) {
            $('#pinterest-link').attr(
                'href',
                `${oUser.userData[0].sPinterest}`
            );
        } else {
            $('#pinterest').hide();
        }
        if (oUser.userData[0].sYoutube) {
            $('#youtube-link').attr('href', `${oUser.userData[0].sYoutube}`);
        } else {
            $('#youtube').hide();
        }
        if (oUser.userData[0].sTelegram) {
            $('#telegram-link').attr('href', `${oUser.userData[0].sTelegram}`);
        } else {
            $('#telegram').hide();
        }
        if (!oUser.userData[0].sBio) {
            $('#user-bio').html('Hi I am new here');
        } else {
            $('#user-bio').text(oUser.userData[0].sBio);
        }
        if (!oUser.userData[0].bVerify) {
            $('#blue-tick').hide();
        }
        if (
            oUser.userData[0].sWalletAddress ==
                localStorage.getItem('sWalletAddress') ||
            !localStorage.getItem('sWalletAddress')
        ) {
            $('#singleFollow').hide();
        }
        if (
            oUser.userData[0].sCoverPicUrl &&
            oUser.userData[0].sCoverPicUrl != ''
        ) {
            $('.user-img').css(
                'background-image',
                `url(${oUser.userData[0].sCoverPicUrl})`
            );
            $('.user-img').css('background-position', 'center');
        } else {
            const colorThief = new ColorThief();
            const imgcolorThief = document.getElementById(colorPalletImg);
            imgcolorThief.crossOrigin = 'Anonymous';

            // Make sure image is finished loading
            imgcolorThief.addEventListener('load', function () {
                let imgColor = colorThief.getColor(imgcolorThief);
                let plaColor = colorThief.getPalette(imgcolorThief);
                let palLen = plaColor.length - 1;

                $('.user-img').css(
                    'background',
                    `linear-gradient(to right, rgb(${plaColor[
                        palLen
                    ].toString()}), rgb(${imgColor.toString()}))`
                );
            });
        }
    } catch (error) {
        console.log(error);
        notify('error', error);
        if (error != 'server error') {
            window.location.href = '/404';
        }
    }
    $('#user-name').text(sUserName);
    $('#user-wallet').text(sWalletAddress);
    $('#user-followers').text(nFollowers);
    $('#user-followings').text(nFollowing);
    if (is2FaEnabled) {
        $('#2fa-btn').attr('checked', true);
    }
    $('.tabs li').on('click', function () {
        let tabId = $(this).data('value');
        let id = $(this).attr('id');
        let cFilter = $(this).attr('filter');
        if (id == 'activityTab') {
            if (!$('#activityTab').hasClass('loaded')) {
                getActivity();
                $(this).addClass('loaded');
            }
        }
        if (id == 'bidActivityTab') {
            if (!$('#bidActivityTab').hasClass('loaded')) {
                getBidActivity();
                $(this).addClass('loaded');
            }
        }
        if (!$(this).hasClass('loaded')) {
            getData(cFilter, tabId);
            $(this).addClass('loaded');
        }
    });

    async function getData(id, tabId) {
        try {
            let { isLoaded, nSkip, nLimit, oFilter } = paginationData[id];

            const oData = {
                nSkip,
                nLimit,
                oFilter: {
                    id,
                },
            };
            let oNftData = await _helper.call_API(
                'POST',
                `/user/getUserDetails/${user_id[1]}`,
                oData
            );
            ownedCount = oNftData.ownedCount;
            onSaleCount = oNftData.onSaleCount;
            createdCount = oNftData.createdCount;

            $('#OnSale').html(onSaleCount);
            $('#Owned').html(ownedCount);
            $('#Created').html(createdCount);

            let totalNft = Number($(`#${id}Tab span`).html());

            if (
                paginationData[id].nSkip + paginationData[id].nLimit >=
                totalNft
            ) {
                $(`#load-more-${id}`).css('display', 'none');
            }

            let dataToAppend = '';

            if (!isLoaded) {
                paginationData[id].isLoaded = true;
            }

            oNftData.nftData.forEach((nft) => {
                dataToAppend += generateNftCard(nft);
            });

            $(`#${tabId}`).append(dataToAppend);
            _helper.addTiltEffect($(`#${tabId} .img-tilt`));
            setAuctionTimer(`${tabId}`);
        } catch (error) {
            console.log(error);
        }
    }

    async function getActivity() {
        $('#activityTab').addClass('loaded');
        try {
            const oGeneralData = await _helper.call_API(
                'GET',
                `/user/generalActivity`,
                {},
                {
                    Authorization: sToken,
                }
            );
            let activityData = '';
            let artworkActivityData = '';
            oGeneralData.aGeneralActivity.forEach((activity) => {
                let userName =
                    activity.aUserData._id == localStorage.getItem('_id')
                        ? 'You'
                        : activity.aUserData.sUserName
                        ? activity.aUserData.sUserName
                        : _helper.trimEthereumAddress(
                              activity.aUserData.sWalletAddress,
                              7
                          );
                let activityType =
                    activity.sAction == 'Like'
                        ? `${userName} liked your NFT`
                        : activity.sAction == 'Follow'
                        ? `${userName} now follows you`
                        : '';
                let nftImage =
                    _platform_config[___ENV___].sS3Location +
                    activity.aNFTData.sImageHash;
                activityData += _helper.generateHtmlFromEJS(
                    _card_templates.generalActivity,
                    {
                        isBidActivity: false,
                        type: '/assets/img/liked.png',
                        nftImage,
                        activityType,
                        activityDate: moment(activity.createdAt).fromNow(),
                        sNFTId: activity.aNFTData._id,
                        userId: activity.aUserData._id,
                        txLink: 'javascript:void(0)',
                    }
                );
            });

            oGeneralData.aArtworkActivity.forEach((activity) => {
                let activityStatus = activity.eBidStatus;
                let preText = 'You have ';
                let postText =
                    activityStatus == 'On Sale'
                        ? `put ${activity.oNFT.sName} on Sale `
                        : activityStatus == 'On Auction'
                        ? `put ${activity.oNFT.sName} on Auction`
                        : activityStatus == 'Mint'
                        ? `Minted ${activity.oNFT.sName}`
                        : activityStatus == 'Bid Accepted'
                        ? `Accepted bid on ${activity.oNFT.sName}`
                        : activityStatus == 'Auction Cancelled'
                        ? `cancelled auction of ${activity.oNFT.sName}`
                        : activityStatus == 'Sale Cancelled'
                        ? `cancelled sale of ${activity.oNFT.sName}`
                        : '';
                let activityType = preText + postText;
                let sTransactionHash = activity.sTransactionHash;
                if (activityStatus == 'Mint') {
                    sTransactionHash = activity.oNFT.sTransactionHash;
                    postText = 'Minted';
                }

                let svg =
                    activityStatus == 'On Sale'
                        ? 'for-sale'
                        : activityStatus == 'On Auction'
                        ? 'bid-auction'
                        : activityStatus == 'Mint'
                        ? 'nft-mint'
                        : activityStatus == 'Bid Accepted'
                        ? 'bid-accepted'
                        : activityStatus == 'Auction Cancelled' ||
                          activityStatus == 'Sale Cancelled'
                        ? 'sale-cancel'
                        : '';

                if (svg == '') {
                    console.log(activity);
                }

                let nftImage =
                    _platform_config[___ENV___].sS3Location +
                    activity.oNFT.sImageHash;

                artworkActivityData += _helper.generateHtmlFromEJS(
                    _card_templates.generalActivity,
                    {
                        isBidActivity: false,
                        type: `/assets/img/${svg}.png`,
                        nftImage,
                        activityType,
                        activityDate: moment(activity.sCreated).fromNow(),
                        txLink: `${
                            _chains_web3[activity.oNFT.nChainId]
                                .blockExplorerUrls[0]
                        }/tx/${sTransactionHash}`,
                        sNFTId: activity.oNFT._id,
                        userId: activity.iCallerId,
                        link: `<i class="fa fa-external-link"></i>`,
                        target: 'target="_blank"',
                    }
                );
            });

            $('#generalActivity').append(activityData);
            $('#artworkActivity').append(artworkActivityData);
        } catch (error) {
            console.log(error);
            notify('error', error.message);
        }
    }

    async function getBidActivity() {
        //
        $('#bidActivityTab').addClass('loaded');
        let sWalletAddress = localStorage.getItem('sWalletAddress');
        try {
            let getPrice = await _helper.call_API('GET', '/nft/getPrice', {});

            const aBidActivity = await _helper.call_API_v2(
                'GET',
                '/user/bidActivity',
                {},
                { Authorization: sToken }
            );

            let activityData = '';
            let bidActivityData = '';
            aBidActivity.data.aBidActivity.forEach((activity) => {
                if (activity.aBidders.sWalletAddress != sWalletAddress) {
                    let priceInUsd =
                        getPrice[
                            _chains_web3[activity.oNFT.nChainId]?.nativeCurrency
                                .symbol
                        ];
                    let bidderName =
                        activity.aBidders.sName ||
                        activity.aBidders.sUserName ||
                        _helper.trimEthereumAddress(
                            activity.aBidders.sWalletAddress,
                            7
                        );
                    let activityType = `Bid by ${bidderName}`;
                    let nftImage =
                        _platform_config[___ENV___].sS3Location +
                        activity.oNFT.sImageHash;
                    let bidData = {
                        bidderAddress: activity.aBidders.sWalletAddress,
                        collectionAddress: activity.oNFT.sCollectionAddress,
                        quantity: activity.nQuantity,
                        sCollection: activity.oNFT.sCollection,
                        ownerId: activity.oNFT.oCurrentOwner,
                        _id: user_id[1],
                        amount: activity.nBidPrice,
                        chainId: activity.oNFT.nChainId,
                        tokenId: activity.oNFT.nTokenId,
                    };
                    activityData += _helper.generateHtmlFromEJS(
                        _card_templates.generalActivity,
                        {
                            isBidActivity: true,
                            isReceivedBid: true,
                            link: `<i class="fa fa-external-link"></i>`,
                            target: 'target="_blank"',
                            type: '/assets/img/bid-placed.png',
                            nftImage,
                            activityType,
                            activityDate: moment(activity.sCreated).fromNow(),
                            sNFTId: activity.oNFT._id,
                            userId: activity.aBidders._id,
                            sPrice: activity.nBidPrice,
                            priceInUsd:
                                Math.round(
                                    (_helper.toUsd(
                                        activity.nBidPrice,
                                        priceInUsd
                                    ) +
                                        Number.EPSILON) *
                                        100
                                ) / 100,
                            bidData,
                            txLink: `${
                                _chains_web3[activity.oNFT.nChainId]
                                    .blockExplorerUrls[0]
                            }/tx/${activity.sTransactionHash}`,
                            classToAdd:
                                activity.oNFT.aNftTransaction[0].eBidStatus ==
                                'On Auction'
                                    ? 'slide-this'
                                    : '',
                            currencySymbol:
                                _chains_web3[activity.oNFT.nChainId]
                                    ?.nativeCurrency.symbol,
                        }
                    );
                } else {
                    let priceInUsd =
                        getPrice[
                            _chains_web3[activity.oNFT.nChainId]?.nativeCurrency
                                .symbol
                        ];
                    let bidderName =
                        activity.aBidders.sName ||
                        activity.aBidders.sUserName ||
                        _helper.trimEthereumAddress(
                            activity.aBidders.sWalletAddress,
                            7
                        );
                    let activityType = `Bid by ${bidderName}`;
                    let nftImage =
                        _platform_config[___ENV___].sS3Location +
                        activity.oNFT.sImageHash;
                    let bidData = {
                        collectionAddress: activity.oNFT.sCollectionAddress,
                        _id: user_id[1],
                        chainId: activity.oNFT.nChainId,
                        tokenId: activity.oNFT.nTokenId,
                        from: activity.aRecipient.sWalletAddress,
                    };
                    bidActivityData += _helper.generateHtmlFromEJS(
                        _card_templates.generalActivity,
                        {
                            isBidActivity: true,
                            isReceivedBid: false,
                            link: `<i class="fa fa-external-link"></i>`,
                            target: 'target="_blank"',
                            type: '/assets/img/bid-placed.png',
                            nftImage,
                            activityType,
                            activityDate: moment(activity.sCreated).fromNow(),
                            sNFTId: activity.oNFT._id,
                            userId: activity.aBidders._id,
                            sPrice: activity.nBidPrice,
                            priceInUsd:
                                Math.round(
                                    (_helper.toUsd(
                                        activity.nBidPrice,
                                        priceInUsd
                                    ) +
                                        Number.EPSILON) *
                                        100
                                ) / 100,
                            bidData,
                            txLink: `${
                                _chains_web3[activity.oNFT.nChainId]
                                    .blockExplorerUrls[0]
                            }/tx/${activity.sTransactionHash}`,
                            classToAdd:
                                activity.oNFT.aNftTransaction[0].eBidStatus ==
                                'On Auction'
                                    ? 'slide-this'
                                    : '',
                        }
                    );
                }
            });
            // console.log(activityData);
            $('#receivedBid').append(activityData);
            $('#placebid').append(bidActivityData);
        } catch (error) {
            console.log(error);
            notify('error', error);
        }
    }

    $('.load-more-collections').on('click', function () {
        let id = $(this).attr('filter');
        let tabId = $(this).data('value');
        let totalNft = Number($(`#${id}Tab span`).html());
        paginationData[id].nSkip += paginationData[id].nLimit;
        if (paginationData[id].nSkip + paginationData[id].nLimit >= totalNft) {
            $(`#${$(this).attr('id')}`).css('display', 'none');
        }
        getData(id, tabId);
    });
});

var tab = $('.teb-main').offset();
$(window).scroll(function () {
    if ($(this).scrollTop() > tab.top - 80) {
        $('body').addClass('scroll-up');
        $('body').removeClass('.scroll-down');
    } else {
        $('body').removeClass('scroll-up');
        $('body').addClass('.scroll-down');
    }
});

$('#2fa-btn').on('click', async (e) => {
    try {
        const response = await _helper.call_API_v2(
            'POST',
            '/user/toggleTwoFactorAuth',
            {
                status: e.target.checked,
            },
            {
                Authorization: sToken,
            }
        );

        notify('success', response.message);
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
});

async function callAcceptBid(btn) {
    const nNFTId = btn.attr('nft-id');
    const sBidderAddress = btn.attr('bidder-address');
    const sCollectionAddress = btn.attr('collection-address');
    const nQuantity = btn.attr('quantity');
    const sCollection = btn.attr('sCollection');
    const nChainId = btn.attr('nChainId');
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sToken = localStorage.getItem('Authorization');

    console.log({
        sBidderAddress,
        sCollectionAddress,
        sWalletAddress,
        sToken,
        nChainId,
    });

    if ((await web3.eth.getChainId()) != nChainId) {
        await switchAddNetwork(nChainId);
    }

    let oMediaContract = contractObject(nChainId);
    let oErc721ContractAddress = contract721Object(nChainId);
    let oErc1155ContractAddress = contract1155Object(nChainId);
    let oSignRes;
    let aRef = [];

    try {
        oDomain.chainId = nChainId;
        oDomain.verifyingContract = _contracts_web3.addresses[nChainId].market;
        oSignRes = await _helper.call_API(
            'PATCH',
            '/user/generateSign',
            {
                sWalletAddress: sBidderAddress.toLowerCase(),
                oDomain,
            },
            { Authorization: sToken }
        );
        if (oSignRes.aReferStructure.referee) {
            aRef.push(oSignRes.aReferStructure.referee);
            aRef.push(oSignRes.aReferStructure.referal);
        } else {
            aRef.push('0x0000000000000000000000000000000000000000');
            aRef.push('0x0000000000000000000000000000000000000000');
        }
        console.log({ oSignRes });
        try {
            if (sCollection == 'ERC721') {
                let isApproved = await oErc721ContractAddress.methods
                    .isApprovedForAll(
                        sWalletAddress,
                        _contracts_web3.addresses[nChainId].media
                    )
                    .call();
                if (!isApproved) {
                    btn.parent().parent().removeClass('slide-this');
                    await oErc721ContractAddress.methods
                        .setApprovalForAll(
                            _contracts_web3.addresses[nChainId].media,
                            true
                        )
                        .send({ from: sWalletAddress });
                }
            } else {
                let isApproved = await oErc1155ContractAddress.methods
                    .isApprovedForAll(
                        sWalletAddress,
                        _contracts_web3.addresses[nChainId].media
                    )
                    .call();
                if (!isApproved) {
                    btn.parent().parent().removeClass('slide-this');
                    await oErc1155ContractAddress.methods
                        .setApprovalForAll(
                            _contracts_web3.addresses[nChainId].media,
                            true
                        )
                        .send({ from: sWalletAddress });
                }
            }
        } catch (error) {
            notify('error', error);
            console.log(error);
            btn.parent().parent().addClass('slide-this');
            return;
        }
        //ToDo: need to passed two more field in accept bid
        let nEstimatedGas = await oMediaContract.methods
            .acceptBid(
                sCollectionAddress,
                nNFTId,
                sBidderAddress,
                nQuantity,
                aRef,
                oSignRes.sSignature
            )
            .estimateGas({
                from: sWalletAddress,
            });
        console.log('nEstimatedGas: ', nEstimatedGas);
        btn.parent().parent().removeClass('slide-this');
    } catch (error) {
        console.log(error);
        let oErrorJSON = JSON.parse(
            error.message.substr(
                error.message.indexOf('{'),
                error.message.lastIndexOf('}')
            )
        );
        console.log(oErrorJSON);
        notify('error', oErrorJSON.message.replace('execution reverted: ', ''));
        setTimeout(() => {
            // $('#activity-tab').addClass('slide-this');
            btn.parent().parent().addClass('slide-this');
        }, 1500);
        return;
    }
    try {
        oMediaContract.methods
            .acceptBid(
                sCollectionAddress,
                nNFTId,
                sBidderAddress,
                nQuantity,
                aRef,
                oSignRes.sSignature
            )
            .send({
                from: sWalletAddress,
            })
            .on('transactionHash', (data) => {
                notify('success', 'The transaction has been initiated...');
                console.log('Transaction Hash ', data);
            })
            .on('receipt', (receipt) => {
                notify('success', 'Bid has been accepted');
                console.log('Transaction Receipt', receipt);
                //updateAcceptedBid(_id, ownerId, sProfilePicUrl, amount);
                btn.parent().parent().addClass('slide-this');

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
                notify(
                    'error',
                    error.message.replace('MetaMask Tx Signature: ', '')
                );

                setTimeout(() => {
                    btn.parent().parent().addClass('slide-this');
                }, 1500);
                return;
            });
    } catch (error) {
        console.log(error);
        // notify('error', 'You denied Metamask transaction request');
        setTimeout(() => {
            btn.parent().parent().addClass('slide-this');
        }, 1500);
        return;
    }
}

async function callRejectBid(btn) {
    const nNFTId = btn.attr('nft-id');
    const sBidderAddress = btn.attr('bidder-address');
    const sCollectionAddress = btn.attr('collection-address');
    const nChainId = btn.attr('nChainId');
    let sWalletAddress = localStorage.getItem('sWalletAddress');

    try {
        if (nChainId != (await web3.eth.getChainId())) {
            await switchAddNetwork(nChainId);
        }
    } catch (error) {
        console.log(error);
        return notify('error', error.message);
    }

    let oMediaContract = contractObject(nChainId);

    try {
        let nEstimatedGas = await oMediaContract.methods
            .rejectBid(sCollectionAddress, nNFTId, sBidderAddress)
            .estimateGas({
                from: sWalletAddress,
            });
        console.log('nEstimatedGas: ', nEstimatedGas);
        btn.parent().parent().removeClass('slide-this');
    } catch (error) {
        console.log(error);
        let oErrorJSON = JSON.parse(
            error.message.substr(
                error.message.indexOf('{'),
                error.message.lastIndexOf('}')
            )
        );
        console.log(oErrorJSON);
        notify('error', oErrorJSON.message.replace('execution reverted: ', ''));
        btn.parent().parent().addClass('slide-this');
        return;
    }

    try {
        oMediaContract.methods
            .rejectBid(sCollectionAddress, nNFTId, sBidderAddress)
            .send({
                from: sWalletAddress,
            })
            .on('transactionHash', (data) => {
                notify('success', 'The transaction has been initiated');
                console.log('Transaction Hash ', data);
            })
            .on('receipt', (receipt) => {
                notify('success', 'Bid has been rejected');
                console.log('Transaction Receipt', receipt);
                btn.parent().parent().addClass('slide-this');
                // updateRejectedBid(_id, ownerId, sProfilePicUrl, amount);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
                notify(
                    'error',
                    error.message.replace('MetaMask Tx Signature: ', '')
                );
                btn.parent().parent().addClass('slide-this');
                return;
            });
    } catch (error) {
        console.log(error);
        // TODO: Handle Metamask cancel event
        // notify('error', 'You denied Metamask transaction request');
        btn.parent().parent().addClass('slide-this');
        return;
    }
}

async function callWithdraw(btn) {
    try {
        const id = btn.attr('tokenId');
        const nftAddress = btn.attr('collection-address');
        const nChainId = btn.attr('nChainId');
        const from = btn.attr('from');
        let sWalletAddress = localStorage.getItem('sWalletAddress');

        console.log({ id, nftAddress, nChainId, from, sWalletAddress });

        if ((await web3.eth.getChainId()) != nChainId) {
            await switchAddNetwork(nChainId);
        }

        let mediaContractAddress = contractObject(nChainId);
        let estimatedGas;
        try {
            estimatedGas = await mediaContractAddress.methods
                .withdrawBid(nftAddress, id, from)
                .estimateGas({
                    from: sWalletAddress,
                });
            console.log('estimatedGas', estimatedGas);
            $('pla').removeClass('slide-this');
        } catch (error) {
            console.log(error);
            let oErrorJSON = JSON.parse(
                error.message.substr(
                    error.message.indexOf('{'),
                    error.message.lastIndexOf('}')
                )
            );
            console.log(oErrorJSON);
            notify(
                'error',
                oErrorJSON.message.replace('execution reverted: ', '')
            );
            // setTimeout(() => {
            //     $('#activity-tab').addClass('slide-this');
            // }, 500);
            return;
        }

        try {
            mediaContractAddress.methods
                .withdrawBid(nftAddress, id, from)
                .send({
                    from: sWalletAddress,
                    gas: estimatedGas,
                })
                .on('transactionHash', (data) => {
                    console.log('Transaction Hash ', data);
                    notify('success', 'The transaction has been initiated');
                })
                .on('receipt', (receipt) => {
                    notify('success', 'Bid has been withdrawn');
                    console.log('Transaction Receipt', receipt);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                })
                .catch((error) => {
                    console.log(error);
                    return notify(
                        'error',
                        error.message.replace('MetaMask Tx Signature: ', '')
                    );
                });
        } catch (error) {
            notify('error', 'You denied Metamask transaction request');
            return;
        }
    } catch (error) {
        notify('error', error);
        console.log(error);
        return;
    }
}

function generateFollower(cFollower, id) {
    let data_isFollowed;
    let data_btn;

    if (cFollower.aFollowers.indexOf(id) != -1) {
        data_isFollowed = true;
        data_btn = 'Unfollow';
    } else {
        data_isFollowed = false;
        data_btn = 'Follow';
    }

    let showBtn =
        cFollower.sWalletAddress == localStorage.getItem('sWalletAddress') ||
        !localStorage.getItem('sWalletAddress')
            ? false
            : true;

    let dataNew = {
        _id: cFollower._id,
        sProfilePic:
            cFollower.sProfilePicThumbUrl ||
            '/assets/img/male-avatar-maker.jpg',
        sUserName:
            cFollower.sUserName ||
            _helper.trimEthereumAddress(cFollower.sWalletAddress, 7),
        showBtn,
        data_isFollowed,
        data_btn,
    };

    return _helper.generateHtmlFromEJS(_card_templates.follower, dataNew);
}
