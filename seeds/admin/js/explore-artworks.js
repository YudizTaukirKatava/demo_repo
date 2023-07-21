$(async () => {
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
    getData('onSale', 'tabn1');

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
            console.log('On line 26');
            let oNftData = await _helper.call_API(
                'POST',
                `/user/getUserDetails/${localStorage.getItem('sUserIdAdmin')}`,
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
                nft['isAdminSide'] = true;
                dataToAppend += generateNftCard(nft, false, true);
            });

            $(`#${tabId}`).append(dataToAppend);
            _helper.addTiltEffect($(`#${tabId} .img-tilt`));
            setAuctionTimer(`${tabId}`);
        } catch (error) {
            console.log(error);
        }
    }

    async function getBidActivity() {
        //
        $('#bidActivityTab').addClass('loaded');
        let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
        try {
            let getPrice = await _helper.call_API('GET', '/nft/getPrice', {});

            const aBidActivity = await _helper.call_API_v2(
                'GET',
                '/user/bidActivity',
                {},
                { Authorization: localStorage.getItem('AuthorizationAdmin') }
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
                        _id: localStorage.getItem('sUserIdAdmin'),
                        amount: activity.nBidPrice,
                        chainId: activity.oNFT.nChainId,
                        tokenId: activity.oNFT.nTokenId,
                    };
                    activityData += _helper.generateHtmlFromEJS(
                        _card_templates.generalActivity,
                        {
                            isBidActivity: true,
                            isAdminSide: true,
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
                        _id: localStorage.getItem('sUserIdAdmin'),
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

    $('.tabs li').on('click', function () {
        let tabId = $(this).data('value');
        let id = $(this).attr('id');
        let cFilter = $(this).attr('filter');
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
});

async function callAcceptBid(btn) {
    const nNFTId = btn.attr('nft-id');
    const sBidderAddress = btn.attr('bidder-address');
    const sCollectionAddress = btn.attr('collection-address');
    const nQuantity = btn.attr('quantity');
    const sCollection = btn.attr('sCollection');
    const nChainId = btn.attr('nChainId');
    let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
    let sToken = localStorage.getItem('AuthorizationAdmin');

    if ((await web3.eth.getChainId()) != nChainId) {
        await switchAddNetwork(nChainId);
    }

    let oMediaContract = contractObject(nChainId);
    let oErc721ContractAddress = contract721Object(nChainId);
    let oErc1155ContractAddress = contract1155Object(nChainId);
    let oSignRes;
    // let aRef = [];
    let nEstimatedGas;

    try {
        oDomain.chainId = nChainId;
        oDomain.verifyingContract = _contracts_web3.addresses[nChainId].market;
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
                    let estimatedGas;
                    try {
                        estimatedGas = await oErc721ContractAddress.methods
                            .setApprovalForAll(
                                _contracts_web3.addresses[nChainId].media,
                                true
                            )
                            .estimateGas({ from: sWalletAddress });
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
                            oErrorJSON.message.replace(
                                'execution reverted: ',
                                ''
                            )
                        );
                        setTimeout(() => {
                            btn.parent().parent().addClass('slide-this');
                        }, 1500);
                        return;
                    }

                    const sendObj = await generateTxObj(
                        web3,
                        sWalletAddress,
                        estimatedGas
                    );
                    await oErc721ContractAddress.methods
                        .setApprovalForAll(
                            _contracts_web3.addresses[nChainId].media,
                            true
                        )
                        .send(sendObj);
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
                        let estimatedGas;
                        try {
                            estimatedGas = await oErc1155ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[nChainId].media,
                                    true
                                )
                                .estimateGas({ from: sWalletAddress });
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
                                oErrorJSON.message.replace(
                                    'execution reverted: ',
                                    ''
                                )
                            );
                            setTimeout(() => {
                                btn.parent().parent().addClass('slide-this');
                            }, 1500);
                            return;
                        }

                    const sendObj = await generateTxObj(
                        web3,
                        sWalletAddress,
                        estimatedGas
                    );
                    await oErc1155ContractAddress.methods
                        .setApprovalForAll(
                            _contracts_web3.addresses[nChainId].media,
                            true
                        )
                        .send(sendObj);
                }
            }
        } catch (error) {
            notify('error', error);
            console.log(error);
            btn.parent().parent().addClass('slide-this');
            return;
        }
        //ToDo: need to passed two more field in accept bid
        nEstimatedGas = await oMediaContract.methods
            .acceptBid(
                sCollectionAddress,
                nNFTId,
                sBidderAddress,
                nQuantity,
                // aRef,
                // oSignRes.sSignature,
                [
                    '0x0000000000000000000000000000000000000000',
                    '0x0000000000000000000000000000000000000000',
                ],
                '0x'
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
        const sendObj = await generateTxObj(
            web3,
            sWalletAddress,
            nEstimatedGas
        );
        oMediaContract.methods
            .acceptBid(
                sCollectionAddress,
                nNFTId,
                sBidderAddress,
                nQuantity,
                // aRef,
                // oSignRes.sSignature
                [
                    '0x0000000000000000000000000000000000000000',
                    '0x0000000000000000000000000000000000000000',
                ],
                '0x'
            )
            .send(sendObj)
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
    console.log('Reject Bid Called');
    const nNFTId = btn.attr('nft-id');
    const sBidderAddress = btn.attr('bidder-address');
    const sCollectionAddress = btn.attr('collection-address');
    const nChainId = btn.attr('nChainId');
    console.log({
        nNFTId,
        sBidderAddress,
        sCollectionAddress,
        nChainId,
    });
    let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');

    try {
        if (nChainId != (await web3.eth.getChainId())) {
            await switchAddNetwork(nChainId);
        }
    } catch (error) {
        console.log(error);
        return notify('error', error.message);
    }

    let oMediaContract = contractObject(nChainId);
    let nEstimatedGas;

    try {
        nEstimatedGas = await oMediaContract.methods
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
        const sendObj = await generateTxObj(
            web3,
            sWalletAddress,
            nEstimatedGas
        );
        oMediaContract.methods
            .rejectBid(sCollectionAddress, nNFTId, sBidderAddress)
            .send(sendObj)
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

// Tabs Start Here

$('.tab-link').click(function () {
    var tabID = $(this).attr('data-tab');
    $(this).addClass('active').siblings().removeClass('active');
    $('#tab-' + tabID)
        .addClass('active')
        .siblings()
        .removeClass('active');
});
$('.tab-link-work').click(function () {
    var tabID = $(this).attr('data-tab');
    $(this).addClass('active').siblings().removeClass('active');
    $('#tab-' + tabID)
        .addClass('active')
        .siblings()
        .removeClass('active');
});
// Tabs End Here
