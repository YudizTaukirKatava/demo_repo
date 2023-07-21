let isTimeAuction = true;
$(async () => {
    console.log('IN Single artwork page');
    let url = window.location.href;
    let oMediaContractAddress, oErc721ContractAddress, oErc1155ContractAddress;

    if (localStorage.getItem('AuthorizationAdmin')) {
        const wChainId = await web3.eth.getChainId();
        oMediaContractAddress = contractObject(wChainId);
        oErc721ContractAddress = contract721Object(wChainId);
        oErc1155ContractAddress = contract1155Object(wChainId);
    }
    let nft_id = url.split('nft/');
    let id = localStorage.getItem('sUserIdAdmin');
    let nNftQuantity = 1;
    let sWalletAddress = window.localStorage.getItem('sWalletAddressAdmin');
    const NFT_ID = nft_id[1];

    try {
        let oNFTData = await _helper.call_API(
            'GET',
            `/nft/viewnft/${nft_id[1]}`,
            {}
        );

        let getPrice = await _helper.call_API('GET', '/nft/getPrice', {});

        let activity = await _helper.call_API('POST', '/nft/filter', {
            NFT_ID,
        });

        let priceInUsd =
            getPrice[_chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol];

        // <!-- HTML Meta Tags -->
        $('head').append(`
    
        <meta name="description" content="${oNFTData.sNftdescription}">
        <meta itemprop="image" content="${
            _platform_config[___ENV___].sS3Location + oNFTData.sImageHash
        }">
        <meta property="og:url" content="${
            window.location.origin
        }/nft/${NFT_ID}">
        <meta property="og:image" content="${
            _platform_config[___ENV___].sS3Location + oNFTData.sImageHash
        }">
        <meta name="twitter:image" content="${
            _platform_config[___ENV___].sS3Location + oNFTData.sImageHash
        }">
        `);
        // <!-- Meta Tags Generated via http://heymeta.com -->

        let oTransactionData = await _helper.call_API(
            'GET',
            `/nft/getData/${NFT_ID}`,
            {}
        );
        if (oNFTData.sCollection == 'ERC1155') {
            if (oTransactionData.data.length > 0) {
                nNftQuantity = oTransactionData.data[0].nSaleQuantity;
            } else {
                nNftQuantity = oNFTData.nQuantity;
            }
        }

        let oListingNFT = await _helper.call_API('POST', '/nft/nftListing', {
            start: 0,
            length: 5,
            sTextsearch: '',
            sCategory: oNFTData.sCategory,
            sSortingType: '',
            sSellingType: '',
            nChainId: '',
            bRelated: true,
        });

        relatedNfts(oListingNFT, oNFTData);

        let appendData = `<a class="heart-otr c-pointer ${
            oNFTData.aFavorite.indexOf(id) != -1 ? 'selected' : ''
        }"  id="likess"
        data-liked="${oNFTData.aFavorite.indexOf(id) != -1 ? 'true' : 'false'}"
        data-nftid="${oNFTData._id}"
        onclick="likeNFT($(this))">
                                    <svg
                                        class="heart-icon"
                                        width="18"
                                        height="17"
                                        fill="none"
                                        
                                        id="likeID"
                                        xmlns="http://www.w3.org/2000/svg"
                                        
                                    >
                                        <path
                                            d="M9 15.08S1 10.6 1 5.16a4.16 4.16 0 018-1.603h0a4.16 4.16 0 018 1.603c0 5.44-8 9.92-8 9.92z"
                                            stroke="#999"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </a>
                                <p class="body-sb num" id="likeCount">
                                Favourite
                                </p>`;

        let nftImgMain = `${
            _platform_config[___ENV___].sS3Location + oNFTData.sImageHash
        }`;

        $('#single-artwork').attr('src', nftImgMain);

        $('.zoomed-img-container .zoomed-img img').attr('src', nftImgMain);

        $('#single-artwork').on('click', function () {
            $('.zoomed-img-container').css('display', 'flex').hide().fadeIn();
        });

        $('#view-ipfs').attr(
            'href',
            _platform_config[___ENV___].sIpfsUri + oNFTData.sImageHash
        );
        $('#singleDiv').append(appendData);
        $('#priceInUsd').text(`$
            ${
                Math.round(
                    (_helper.toUsd(
                        activity.activityData[0].aBidders[0]?.nBidPrice,
                        priceInUsd
                    ) +
                        Number.EPSILON) *
                        100
                ) / 100
            }`);

        let ownedBy;
        let postedBy;
        let saleHeader =
            oTransactionData.data[0]?.eBidStatus == 'On Auction' ||
            oTransactionData.data[0]?.eBidStatus == 'Timed Auction'
                ? 'Bid details'
                : oTransactionData.data[0]?.eBidStatus == 'On Sale'
                ? 'Sale Details'
                : '';

        let saleTitle =
            oTransactionData.data[0]?.eBidStatus == 'On Auction' ||
            oTransactionData.data[0]?.eBidStatus == 'Timed Auction'
                ? 'Current Bid'
                : oTransactionData.data[0]?.eBidStatus == 'On Sale'
                ? 'Price'
                : '';

        let placeBidBtn = `
        <a  class="btn-fill place-bid" id="place-bid-btn"
            >Place a Bid</a
        >`;
        let buyNowBtn = `
        <a  class="btn-fill place-bid" id="buy-now-btn"
            >Buy Now</a
        >`;
        let cancelAuctionBtn = `<a  class="btn-fill-red place-bid" id="cancel-auction-btn"
            >Cancel Auction</a
        >`;
        let cancelSaleBtn = `<a  class="btn-fill-red place-bid" id="cancel-sale-btn" 
            >Cancel Sale</a
        >`;

        let revertAuctionBtn = `<a  class="btn-fill-red place-bid" id="cancel-auction-btn"
            >Revert Auction</a
        >`;

        let claimBtn = '';
        if (
            activity.activityData[0]?.aBidders[0]?.bidderDetails
                .sWalletAddress == sWalletAddress
        ) {
            claimBtn =
                '<a  class="btn-fill place-bid" id="claim-now-btn">Claim Now</a>';
        }

        let timer =
            oTransactionData?.data[0]?.nStartTime * 1000 > new Date().getTime()
                ? oTransactionData?.data[0]?.nStartTime * 1000
                : oTransactionData?.data[0]?.nEndTime * 1000;
        oTransactionData?.data[0]?.nStartTime * 1000 > new Date().getTime();
        let auctionHead =
            oTransactionData?.data[0]?.nStartTime * 1000 > new Date().getTime()
                ? 'Auction Starting soon'
                : oTransactionData?.data[0]?.nEndTime * 1000 <
                  new Date().getTime()
                ? 'Auction Ended'
                : 'Auction Ending';
        $('#auctionHead').text(auctionHead);
        if (
            oTransactionData?.data[0]?.nEndTime * 1000 < new Date().getTime() &&
            oNFTData.aCurrentOwner.sWalletAddress == sWalletAddress
        ) {
            //
            // $('#auction-time').addClass('d-none');
            $('#clock').html(
                `<br><h5><center class="sb-2 text-white"><b>Auction ended Highest bidder will claim NFT.</b></center></h5>`
            );
        } else if (
            oTransactionData?.data[0]?.nEndTime * 1000 < new Date().getTime() &&
            activity.activityData[0]?.aBidders[0]?.bidderDetails
                .sWalletAddress != sWalletAddress
        ) {
            //
            console.log('Hiding timer and head');
            $('#auctionHead').text('');
            $('#clock').html(
                `<br><h5><center class="sb-2 text-white"><b>You missed the opportunity, NFT auction ended.</b></center></h5>`
            );
        }

        if (
            oTransactionData?.data[0]?.nEndTime * 1000 < new Date().getTime() &&
            activity.activityData[0]?.aBidders[0]?.bidderDetails
                .sWalletAddress == sWalletAddress &&
            activity.activityData[0]?.aBidders[0]?.eBidStatus == 'Bid'
        ) {
            // $('#auction-time').addClass('d-none');
            $('#auctionHead').text('');

            $('#clock').html(
                `<br><h5><center class="sb-2 text-white"><b>Congratulations! You won the auction</b></center></h5>`
            );
        }
        let saleType = '';

        if (oNFTData.aCurrentOwner.sWalletAddress == sWalletAddress) {
            saleType =
                oTransactionData.data[0]?.eBidStatus == 'On Sale'
                    ? cancelSaleBtn
                    : oTransactionData.data[0]?.eBidStatus == 'On Auction'
                    ? cancelAuctionBtn
                    : oTransactionData.data[0]?.nEndTime > 0 &&
                      oTransactionData.data[0]?.nEndTime <
                          Math.round(new Date().getTime() / 1000) &&
                      activity.activityData[0].aBidders[0].eBidStatus !=
                          'Bid' &&
                      oTransactionData.data[0]?.sCancelStatus == 0
                    ? revertAuctionBtn
                    : activity.activityData[0]?.aBidders[0]?.eBidStatus == 'Bid'
                    ? ''
                    : oTransactionData.data[0]?.eBidStatus == 'Timed Auction' &&
                      oTransactionData.data[0]?.nEndTime >
                          Math.round(new Date().getTime() / 1000)
                    ? cancelAuctionBtn
                    : $('#saleBtns').removeClass('d-none');
        }
        // else {
        //     saleType =
        //         oTransactionData?.data[0]?.nStartTime * 1000 >
        //         new Date().getTime()
        //             ? ''
        //             : oTransactionData.data[0]?.eBidStatus == 'Timed Auction' &&
        //               oTransactionData.data[0]?.nEndTime <
        //                   Math.round(new Date().getTime() / 1000) &&
        //               activity.activityData[0].aBidders[0].bidderDetails
        //                   .sWalletAddress == sWalletAddress
        //             ? claimBtn
        //             : oTransactionData.data[0]?.eBidStatus == 'On Auction' ||
        //               (oTransactionData.data[0]?.eBidStatus ==
        //                   'Timed Auction' &&
        //                   oTransactionData.data[0]?.nEndTime >
        //                       Math.round(new Date().getTime() / 1000))
        //             ? placeBidBtn
        //             : oTransactionData.data[0]?.eBidStatus == 'On Sale'
        //             ? buyNowBtn
        //             : '';
        // }

        //trimming address
        if (oNFTData.aCurrentOwner.sUserName) {
            ownedBy = oNFTData.aCurrentOwner.sUserName;
        } else {
            ownedBy =
                oNFTData.aCurrentOwner.sWalletAddress?.slice(0, 9) +
                ' ... ' +
                oNFTData.aCurrentOwner.sWalletAddress?.slice(
                    oNFTData.aCurrentOwner.sWalletAddress?.length - 5
                );
        }
        if (oNFTData.aPostedBy.sUserName) {
            postedBy = oNFTData.aPostedBy.sUserName;
        } else {
            postedBy =
                oNFTData.aPostedBy.sWalletAddress?.slice(0, 9) +
                ' ... ' +
                oNFTData.aPostedBy.sWalletAddress?.slice(
                    oNFTData.aPostedBy.sWalletAddress?.length - 5
                );
        }

        // setImage();
        setBlueTick(oNFTData);

        // set royalty info
        setRoyaltyInfo(oNFTData);

        $('title').text(`${oNFTData.sName} | ${_PLATFORM_NAME}`);

        $('#nft-name').text(oNFTData.sName);
        $('#nft-desc').text(oNFTData.sNftdescription);

        if (oNFTData.aPostedBy.sProfilePicThumbUrl) {
            $('#postedByImg').attr(
                'src',
                `${oNFTData.aPostedBy.sProfilePicThumbUrl}`
            );
        }
        if (oNFTData.aCurrentOwner.sProfilePicThumbUrl) {
            $('#ownedByImg').attr(
                'src',
                `${oNFTData.aCurrentOwner.sProfilePicThumbUrl}`
            );
        }
        if (
            oTransactionData.data[0]?.eBidStatus == 'On Sale' ||
            oTransactionData.data[0]?.eBidStatus == 'On Auction' ||
            // oTransactionData.data[0]?.eBidStatus == 'Timed Auction' ||
            !oTransactionData.data[0]?.eBidStatus
        ) {
            isTimeAuction = false;
            $('#auction-time').addClass('d-none');
        }
        $('#postedBy').text(postedBy);
        $('#postedBy').attr('href', `/creator/${oNFTData.aPostedBy._id}`);
        $('#ownedBy').text(ownedBy);
        $('#ownedBy').attr('href', `/creator/${oNFTData.aCurrentOwner._id}`);
        $('#postedByHref').attr('href', `/creator/${oNFTData.aPostedBy._id}`);
        $('#ownedByHref').attr(
            'href',
            `/creator/${oNFTData.aCurrentOwner._id}`
        );

        // Timer Plugin Start  http://hilios.github.io/jQuery.countdown/

        $('#clock').countdown(new Date(timer), function (event) {
            $('#days').html(event.strftime('%D'));
            $('#hours').html(event.strftime('%H'));
            $('#minutes').html(event.strftime('%M'));
            $('#seconds').html(event.strftime('%S'));
        });

        //===========All about Collection==========
        //TODO: Click On Collection

        $('#collectionHref').attr(
            'href',
            `/collection/${oNFTData.oCollection._id}`
        );

        $('#collectionImg').attr('src', `${oNFTData.oCollection.sImageUrl}`);
        $('#collectionName').text(oNFTData.oCollection.sName);
        $('#collectionName').attr(
            'href',
            `/collection/${oNFTData.oCollection._id}`
        );
        //==========================================
        $('#category').text(oNFTData.sCategory);
        $('#sale-head').text(saleHeader);
        $('#sale-title').text(saleTitle);
        $('#sale-btn').append(saleType);
        $('#sale-btn').removeClass('d-none');

        $('#copies-of-nft').text(
            activity.activityData[0].sCollection == 'ERC1155' ? nNftQuantity : 1
        );
        $('#nft-views').text(activity.activityData[0].nView);

        if (
            oTransactionData.data.length < 1 &&
            oNFTData.aCurrentOwner.sWalletAddress != sWalletAddress
        ) {
            $('#bid-details').hide();
        }
        if (
            oTransactionData.data.length < 1 &&
            oNFTData.aCurrentOwner.sWalletAddress == sWalletAddress
        ) {
            $('#bid-main').hide();
        }

        $('#buy-now').on('click', async (e) => {
            e.preventDefault();
            $('.validation').hide();
            $('#buy-now').addClass('inactiveLink');

            let amount = $('#buy-quantity').val();
            if (amount <= 0) {
                $('#buyError').append(`<p class="validation" id="err"> 
                Please enter valid quantity
            </p>`);
                $('#buy-now').removeClass('inactiveLink');
                return;
            }

            if (countDecimals(amount) > 0) {
                $('#buyError').append(`<p class="validation" id="err"> 
                Quantity should not in decimal
            </p>`);
                $('#buy-now').removeClass('inactiveLink');
                return;
            }

            $('#buy-now')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            try {
                if ((await web3.eth.getChainId()) != oNFTData.nChainId) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error);
                $('#buy-now').removeClass('inactiveLink');
                $('#buy-now').text('Buy Now').prop('disabled', false);
                return notify('error', error.message);
            }
            let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
            // let sToken = localStorage.getItem('Authorization');
            let nWalletBalance = await web3.eth.getBalance(sWalletAddress);
            let bnbAmount = _helper.toWei($('#buy-now-total').text());

            if (Number(nWalletBalance) < Number(bnbAmount)) {
                $('#buy-now').removeClass('inactiveLink');
                $('#buyError').append(`<p class="validation" id="err"> 
                Insufficient wallet balance
            </p>`);
                $('#buy-now').text('Buy Now').prop('disabled', false);
                return;
            }
            // TODO: change static data to Dynamic
            try {
                let nftAddress = oNFTData.sCollectionAddress;
                let id = oNFTData.nTokenId;
                let from = oNFTData.aCurrentOwner.sWalletAddress;
                let estimatedGas;
                let aRef = [];
                try {
                    oDomain.chainId = oNFTData.nChainId;
                    oDomain.verifyingContract =
                        _contracts_web3.addresses[oNFTData.nChainId].market;
                    const oSignRes = await _helper.call_API(
                        'PATCH',
                        '/user/generateSign',
                        {
                            sWalletAddress,
                            oDomain,
                        },
                        { Authorization: sToken }
                    );
                    console.log({ oSignRes });

                    if (oSignRes.aReferStructure.referee) {
                        aRef.push(oSignRes.aReferStructure.referee);
                        aRef.push(oSignRes.aReferStructure.referal);
                    } else {
                        aRef.push('0x0000000000000000000000000000000000000000');
                        aRef.push('0x0000000000000000000000000000000000000000');
                    }
                    try {
                        oMediaContractAddress = contractObject(
                            oNFTData.nChainId
                        );
                        estimatedGas = await oMediaContractAddress.methods
                            .directBuy(
                                nftAddress,
                                id,
                                from,
                                amount,
                                aRef,
                                oSignRes.sSignature
                            )
                            .estimateGas({
                                from: sWalletAddress,
                                value: bnbAmount,
                            });
                    } catch (error) {
                        console.log(error);
                        let oErrorJSON = JSON.parse(
                            error.message.substr(
                                error.message.indexOf('{'),
                                error.message.lastIndexOf('}')
                            )
                        );
                        $('#buy-now').removeClass('inactiveLink');
                        $('#buy-now').text('Buy Now').prop('disabled', false);
                        notify(
                            'error',
                            oErrorJSON.message.replace(
                                'execution reverted: ',
                                ''
                            )
                        );
                        return;
                    }

                    const sendObj = await generateTxObj(
                        web3,
                        sWalletAddress,
                        estimatedGas
                    );

                    oMediaContractAddress.methods
                        .directBuy(
                            nftAddress,
                            id,
                            from,
                            amount,
                            aRef,
                            oSignRes.sSignature
                        )
                        .send({ ...sendObj, value: bnbAmount })
                        .once('transactionHash', (data) => {
                            notify(
                                'success',
                                'The transaction has been initiated'
                            );
                        })
                        .on('receipt', (receipt) => {
                            console.log('inside receipt');
                            notify('success', 'NFT purchased successfully');
                            $('#buy-now').removeClass('inactiveLink');
                            $('#buy-now')
                                .text('Buy Now')
                                .prop('disabled', false);
                            setTimeout(() => {
                                window.location.href = `/creator/${localStorage.getItem(
                                    '_id'
                                )}`;
                            }, 1500);
                        })
                        .catch((error) => {
                            console.log(error);
                            $('#buy-now').removeClass('inactiveLink');
                            $('#buy-now')
                                .text('Buy Now')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        });
                } catch (error) {
                    console.log(error);
                    $('#buy-now').removeClass('inactiveLink');
                    $('#buy-now').text('Buy Now').prop('disabled', false);
                    notify('error', 'Something went wrong please try again');
                }
            } catch (error) {
                console.log(error);
                $('#buy-now').removeClass('inactiveLink');
                $('#buy-now').text('Buy Now').prop('disabled', false);
                notify('error', 'Something went wrong please try again');
            }
        });

        $('#place-bid').on('click', async (e) => {
            e.preventDefault();
            $('#place-bid').addClass('inactiveLink');
            $('.validation').hide();
            let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
            console.log('PLACE BID METHOD');

            let bidAmount = $('#bid-amount').val();

            if (
                !_validator.isNumber(bidAmount) ||
                !bidAmount ||
                Number(bidAmount) <= 0
            ) {
                $('#place-bid').removeClass('inactiveLink');
                $('#bidError').append(`<p class="validation" id="err"> 
                Please enter valid bid </p>`);
                return;
            }
            if (
                bidAmount <=
                Number(activity.activityData[0].aBidders[0].nBidPrice)
            ) {
                $('#bidError').append(`<p class="validation" id="err">
                Please place bid greater than last bid
            </p>`);
                $('#place-bid').removeClass('inactiveLink');
                return;
            }
            if (countDecimals(bidAmount) > 18) {
                $('#bidError').append(`<p class="validation" id="err"> 
                The price cannot have precision greater than 18 decimal places
                </p>`);
                $('#place-bid').removeClass('inactiveLink');
                return;
            }
            $('#place-bid')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            try {
                if ((await web3.eth.getChainId()) != oNFTData.nChainId) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error.message);
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                return notify('error', error.message);
            }
            let nWalletBalance = await web3.eth.getBalance(sWalletAddress);
            let bnbAmount = _helper.toWei(bidAmount);

            if (Number(nWalletBalance) < Number(bnbAmount)) {
                $('#bidError').append(`<p class="validation" id="err"> 
                Insufficient wallet balance
            </p>`);
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                return;
            }

            try {
                let nftAddress = oNFTData.sCollectionAddress;
                let id = oNFTData.nTokenId;
                let from = oNFTData.aCurrentOwner.sWalletAddress;
                oMediaContractAddress = contractObject(oNFTData.nChainId);
                try {
                    let estimatedGas = await oMediaContractAddress.methods
                        .bid(nftAddress, id, from)
                        .estimateGas({
                            from: sWalletAddress,
                            value: bnbAmount,
                        });

                    const sendObj = await generateTxObj(
                        web3,
                        sWalletAddress,
                        estimatedGas
                    );

                    oMediaContractAddress.methods
                        .bid(nftAddress, id, from)
                        .send({ ...sendObj, value: bnbAmount })
                        .on('transactionHash', (data) => {
                            console.log('Transaction Hash ', data);
                            notify(
                                'success',
                                'The transaction has been initiated'
                            );
                        })
                        .on('receipt', (receipt) => {
                            console.log('Transaction Receipt', receipt);
                            // addNewBid(bidAmount, oNFTData);
                            notify('success', 'Bid placed successfully');
                            $('#place-bid').removeClass('inactiveLink');
                            $('#place-bid')
                                .text('Place Bid')
                                .prop('disabled', false);
                            setTimeout(() => {
                                location.reload(true);
                            }, 1500);
                        })
                        .catch((error) => {
                            console.log(error);
                            $('#place-bid').removeClass('inactiveLink');
                            $('#place-bid')
                                .text('Place Bid')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        });
                } catch (error) {
                    let oErrorJSON = JSON.parse(
                        error.message.substr(
                            error.message.indexOf('{'),
                            error.message.lastIndexOf('}')
                        )
                    );
                    console.log(oErrorJSON);
                    $('#place-bid').removeClass('inactiveLink');
                    $('#place-bid').text('Place Bid').prop('disabled', false);
                    notify(
                        'error',
                        oErrorJSON.message.replace(
                            'execution reverted: Market: ',
                            ''
                        )
                    );
                    return;
                }
            } catch (error) {
                console.log(error);
                $('#place-bid').removeClass('inactiveLink');
                $('#place-bid').text('Place Bid').prop('disabled', false);
                // notify('error', error);
            }
        });

        $('#cancel-auction-btn').on('click', async (e) => {
            e.preventDefault();
            if (!(await checkConnectedAddress())) return;
            $('#cancel-auction-btn').addClass('inactiveLink');
            console.log('CANCEL AUCTION METHOD');
            let btnText = $('#cancel-auction-btn').text();
            $('#cancel-auction-btn').html(
                "<div class='spinner-border spinner-border-sm'></div>"
            );

            $('#cancel-auction-btn').prop('disabled', true);

            try {
                if ((await web3.eth.getChainId()) != oNFTData.nChainId) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error);
                $('#cancel-auction-btn').removeClass('inactiveLink');
                $('#cancel-auction-btn').text(btnText).prop('disabled', false);
                return notify('error', error.message);
            }

            try {
                let nftAddress = oNFTData.sCollectionAddress;
                let id = oNFTData.nTokenId;
                let estimatedGas;
                oMediaContractAddress = contractObject(oNFTData.nChainId);
                try {
                    estimatedGas = await oMediaContractAddress.methods
                        .withdrawAuction(nftAddress, id)
                        .estimateGas({
                            from: sWalletAddress,
                        });
                } catch (error) {
                    $('#cancel-auction-btn')
                        .text(btnText)
                        .prop('disabled', false);
                    $('#cancel-auction-btn').removeClass('inactiveLink');
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
                    return;
                }

                const sendObj = await generateTxObj(
                    web3,
                    sWalletAddress,
                    estimatedGas
                );

                oMediaContractAddress.methods
                    .withdrawAuction(nftAddress, id)
                    .send(sendObj)
                    .on('transactionHash', (data) => {
                        notify('success', 'The transaction has been initiated');

                        console.log('Transaction Hash ', data);
                    })
                    .on('receipt', (receipt) => {
                        $('#cancel-auction-btn').removeClass('inactiveLink');

                        notify(
                            'success',
                            'NFT removed from auction successfully'
                        );
                        setTimeout(() => {
                            location.reload(true);
                        }, 1500);

                        console.log('Transaction Receipt', receipt);
                    })
                    .catch((error) => {
                        console.log(error);
                        $('#cancel-auction-btn')
                            .text(btnText)
                            .prop('disabled', false);
                        $('#cancel-auction-btn').removeClass('inactiveLink');
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                console.log(error);
                $('#cancel-auction-btn').text(btnText).prop('disabled', false);
                $('#cancel-auction-btn').removeClass('inactiveLink');
            }
        });

        $('#cancel-sale-btn').on('click', async (e) => {
            e.preventDefault();
            if (!(await checkConnectedAddress())) return;
            console.log('CANCEL SALE METHOD');
            let btnText = $('#cancel-sale-btn').text();
            $('#cancel-sale-btn')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            $('#cancel-sale-btn').addClass('inactiveLink');

            try {
                if (oNFTData.nChainId != (await web3.eth.getChainId())) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error);
                $('#cancel-sale-btn').text(btnText).prop('disabled', false);
                $('#cancel-sale-btn').removeClass('inactiveLink');
                return notify('error', error.message);
            }

            try {
                let nftAddress = oNFTData.sCollectionAddress;
                let id = oNFTData.nTokenId;
                let estimatedGas;

                oMediaContractAddress = contractObject(oNFTData.nChainId);
                try {
                    estimatedGas = await oMediaContractAddress.methods
                        .withdrawSale(nftAddress, id)
                        .estimateGas({
                            from: sWalletAddress,
                        });
                } catch (error) {
                    $('#cancel-sale-btn').text(btnText).prop('disabled', false);
                    $('#cancel-sale-btn').removeClass('inactiveLink');
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
                    return;
                }

                const sendObj = await generateTxObj(
                    web3,
                    sWalletAddress,
                    estimatedGas
                );

                oMediaContractAddress.methods
                    .withdrawSale(nftAddress, id)
                    .send(sendObj)
                    .on('transactionHash', (data) => {
                        notify('success', 'The transaction has been initiated');
                        $('#cancel-sale-btn').addClass('inactiveLink');
                        console.log('Transaction Hash ', data);
                    })
                    .on('receipt', (receipt) => {
                        $('#cancel-sale-btn').removeClass('inactiveLink');
                        notify('success', 'NFT removed from sale successfully');
                        setTimeout(() => {
                            location.reload(true);
                        }, 1500);

                        console.log('Transaction Receipt', receipt);
                    })
                    .catch((error) => {
                        console.log(error);
                        $('#cancel-sale-btn')
                            .text(btnText)
                            .prop('disabled', false);
                        $('#cancel-sale-btn').removeClass('inactiveLink');
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                console.log(error);
                $('#cancel-sale-btn').text(btnText).prop('disabled', false);
                $('#cancel-sale-btn').removeClass('inactiveLink');
            }
        });

        //TODO: add start/end time in timed auction
        $('#put-on-auctionBtn').on('click', async (e) => {
            e.preventDefault();
            if (!(await checkConnectedAddress())) return;
            console.log('AUCTION SALE METHOD');

            $('#put-on-auctionBtn').addClass('inactiveLink');
            $('.validation').hide();

            let nftAddress = oNFTData.sCollectionAddress;
            let id = oNFTData.nTokenId;
            let inputPrice = $('#auction-price').val();
            let quantity = $('#auction-quantity').val();
            let startTime = $('#put-on-auctionBtn').attr('starttime') || 0;
            let endTime = $('#put-on-auctionBtn').attr('endtime') || 0;

            if (!inputPrice || Number(inputPrice) <= 0) {
                $('#auctionError').append(`<p class="validation" id="err"> 
                Please enter valid price
                </p>`);

                $('#put-on-auctionBtn').removeClass('inactiveLink');
                return;
            }

            if (countDecimals(inputPrice) > 18) {
                $('#auctionError').append(`<p class="validation" id="err"> 
                The price cannot have precision greater than 18 decimal places
                </p>`);
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                return;
            }
            if (quantity <= 0) {
                $('#auctionError').append(
                    `<p class="validation" id="err">Please enter valid quantity</p>`
                );
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                return;
            }
            if (countDecimals(quantity) > 0) {
                $('#auctionError').append(
                    `<p class="validation" id="err">Quantity should not in decimal</p>`
                );
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                return;
            }

            $('#put-on-auctionBtn')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);

            try {
                if (oNFTData.nChainId != (await web3.eth.getChainId())) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error);
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                $('#put-on-auctionBtn').text('Auction').prop('disabled', false);
                return notify('error', error.message);
            }

            oMediaContractAddress = contractObject(oNFTData.nChainId);
            oErc721ContractAddress = contract721Object(oNFTData.nChainId);
            oErc1155ContractAddress = contract1155Object(oNFTData.nChainId);

            let price = _helper.toWei(inputPrice * quantity);
            let estimatedGas;

            try {
                if (oNFTData.sCollection == 'ERC721') {
                    let isApproved = await oErc721ContractAddress.methods
                        .isApprovedForAll(
                            sWalletAddress,
                            _contracts_web3.addresses[oNFTData.nChainId].media
                        )
                        .call();
                    if (!isApproved) {
                        let estimategas;
                        try {
                            estimategas = await oErc721ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .estimateGas({
                                    from: sWalletAddress,
                                });
                        } catch (error) {
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
                            $('#put-on-auctionBtn').removeClass('inactiveLink');
                            $('#put-on-auctionBtn')
                                .text('Auction')
                                .prop('disabled', false);
                            return;
                        }
                        try {
                            const sendObj = await generateTxObj(
                                web3,
                                sWalletAddress,
                                estimategas
                            );

                            await oErc721ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .send(sendObj);
                        } catch (error) {
                            console.log(error);
                            $('#put-on-auctionBtn').removeClass('inactiveLink');
                            $('#put-on-auctionBtn')
                                .text('Auction')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        }
                    }
                } else {
                    let isApproved = await oErc1155ContractAddress.methods
                        .isApprovedForAll(
                            sWalletAddress,
                            _contracts_web3.addresses[oNFTData.nChainId].media
                        )
                        .call();
                    if (!isApproved) {
                        let estimategas;
                        try {
                            estimategas = await oErc1155ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .estimateGas({
                                    from: sWalletAddress,
                                });
                        } catch (error) {
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
                            $('#put-on-auctionBtn').removeClass('inactiveLink');
                            $('#put-on-auctionBtn')
                                .text('Auction')
                                .prop('disabled', false);
                            return;
                        }
                        try {
                            const sendObj = await generateTxObj(
                                web3,
                                sWalletAddress,
                                estimategas
                            );
                            await oErc1155ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .send(sendObj);
                        } catch (error) {
                            $('#put-on-auctionBtn').removeClass('inactiveLink');
                            $('#put-on-auctionBtn')
                                .text('Auction')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                $('#put-on-auctionBtn').text('Auction').prop('disabled', false);
                return;
            }

            console.log({
                nftAddress,
                id,
                price,
                quantity,
                startTime,
                endTime,
            });

            try {
                estimatedGas = await oMediaContractAddress.methods
                    .putOnAuction(
                        nftAddress,
                        id,
                        price,
                        quantity,
                        startTime,
                        endTime
                    )
                    .estimateGas({
                        from: sWalletAddress,
                    });
                console.log(estimatedGas);
            } catch (error) {
                console.log(error);
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                $('#put-on-auctionBtn').text('Auction').prop('disabled', false);
                let oErrorJSON = JSON.parse(
                    error.message.substr(
                        error.message.indexOf('{'),
                        error.message.lastIndexOf('}')
                    )
                );
                return notify(
                    'error',
                    oErrorJSON.message.replace('execution reverted: ', '')
                );
            }

            try {
                const sendObj = await generateTxObj(
                    web3,
                    sWalletAddress,
                    estimatedGas
                );
                oMediaContractAddress.methods
                    .putOnAuction(
                        nftAddress,
                        id,
                        price,
                        quantity,
                        startTime,
                        endTime
                    )
                    .send(sendObj)
                    .on('transactionHash', (hash) => {
                        $('#put-on-auction').addClass('inactiveLink');
                        $('#put-on-sale').addClass('inactiveLink');
                        notify('success', 'The transaction has been initiated');

                        console.log('Transaction Hash ', hash);
                    })
                    .on('receipt', (receipt) => {
                        console.log('Transaction Receipt', receipt);
                        $('#put-on-auction').removeClass('inactiveLink');
                        $('#put-on-sale').removeClass('inactiveLink');
                        $('#put-on-auctionBtn')
                            .text('Auction')
                            .prop('disabled', false);

                        notify('success', 'NFT put on auction successfully');
                        setTimeout(() => {
                            location.reload(true);
                        }, 1500);
                    })
                    .catch((error) => {
                        console.log(error);
                        $('#put-on-auction').removeClass('inactiveLink');
                        $('#put-on-sale').removeClass('inactiveLink');
                        $('#put-on-auctionBtn').removeClass('inactiveLink');
                        $('#put-on-auctionBtn')
                            .text('Auction')
                            .prop('disabled', false);
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                console.log(error);
                $('#put-on-auctionBtn').removeClass('inactiveLink');
                $('#put-on-auctionBtn').text('Auction').prop('disabled', false);
            }
        });

        $('#put-on-saleBtn').on('click', async (e) => {
            e.preventDefault();
            if (!(await checkConnectedAddress())) return;
            $('#put-on-saleBtn').addClass('inactiveLink');
            $('.validation').hide();

            let nftAddress = oNFTData.sCollectionAddress;
            let id = oNFTData.nTokenId;
            let inputPrice = $('#sale-price').val();

            let quantity = $('#sale-quantity').val();

            if (!inputPrice || Number(inputPrice) <= 0) {
                $('#saleError').append(`<p class="validation" id="err"> 
                                        Price is not valid
                                         </p>`);

                $('#put-on-saleBtn').removeClass('inactiveLink');
                return;
            }

            if (countDecimals(inputPrice) > 18) {
                $('#saleError').append(`<p class="validation" id="err"> 
                The price cannot have precision greater than 18 decimal places
                                             </p>`);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                return;
            }

            if (quantity <= 0) {
                $('#saleError').append(`<p class="validation" id="err"> 
                Please enter valid quantity</p>`);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                return;
            }

            if (countDecimals(quantity) > 0) {
                $('#saleError').append(`<p class="validation" id="err"> 
                Quantity should not in decimal</p>`);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                return;
            }
            $('#put-on-saleBtn')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            try {
                if (oNFTData.nChainId != (await web3.eth.getChainId())) {
                    await switchAddNetwork(oNFTData.nChainId);
                }
            } catch (error) {
                console.log(error);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                $('#put-on-saleBtn').text('Sale').prop('disabled', false);
                return notify('error', error.message);
            }

            oMediaContractAddress = contractObject(oNFTData.nChainId);
            oErc721ContractAddress = contract721Object(oNFTData.nChainId);
            oErc1155ContractAddress = contract1155Object(oNFTData.nChainId);

            let price = _helper.toWei(inputPrice);
            let estimatedGas;

            try {
                if (oNFTData.sCollection == 'ERC721') {
                    let isApproved = await oErc721ContractAddress.methods
                        .isApprovedForAll(
                            sWalletAddress,
                            _contracts_web3.addresses[oNFTData.nChainId].media
                        )
                        .call();
                    if (!isApproved) {
                        try {
                            let estimatedGas;
                            try {
                                estimatedGas =
                                    await oErc721ContractAddress.methods
                                        .setApprovalForAll(
                                            _contracts_web3.addresses[
                                                oNFTData.nChainId
                                            ].media,
                                            true
                                        )
                                        .estimateGas({ from: sWalletAddress });
                            } catch (error) {
                                console.log(error);
                                notify('error', error);
                            }

                            const sendObj = await generateTxObj(
                                web3,
                                sWalletAddress,
                                estimatedGas
                            );
                            await oErc721ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .send(sendObj);
                        } catch (error) {
                            console.log(error);
                            $('#put-on-saleBtn').removeClass('inactiveLink');
                            $('#put-on-saleBtn')
                                .text('Sale')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        }
                    }
                } else {
                    let isApproved = await oErc1155ContractAddress.methods
                        .isApprovedForAll(
                            sWalletAddress,
                            _contracts_web3.addresses[oNFTData.nChainId].media
                        )
                        .call();
                    if (!isApproved) {
                        try {
                            let estimatedGas;
                            estimatedGas = await oErc1155ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .estimateGas({ from: sWalletAddress });

                            const sendObj = await generateTxObj(
                                web3,
                                sWalletAddress,
                                estimatedGas
                            );
                            await oErc1155ContractAddress.methods
                                .setApprovalForAll(
                                    _contracts_web3.addresses[oNFTData.nChainId]
                                        .media,
                                    true
                                )
                                .send(sendObj);
                        } catch (error) {
                            console.log(error);
                            $('#put-on-saleBtn').removeClass('inactiveLink');
                            $('#put-on-saleBtn')
                                .text('Sale')
                                .prop('disabled', false);
                            return notify(
                                'error',
                                error.message.replace(
                                    'MetaMask Tx Signature: ',
                                    ''
                                )
                            );
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                $('#put-on-saleBtn').text('Sale').prop('disabled', false);
                return;
            }

            try {
                estimatedGas = await oMediaContractAddress.methods
                    .putOnSell(nftAddress, id, price, quantity)
                    .estimateGas({
                        from: sWalletAddress,
                    });
            } catch (error) {
                console.log(error);
                let oErrorJSON = JSON.parse(
                    error.message.substr(
                        error.message.indexOf('{'),
                        error.message.lastIndexOf('}')
                    )
                );
                notify(
                    'error',
                    oErrorJSON.message.replace('execution reverted: ', '')
                );
                $('#put-on-saleBtn').removeClass('inactiveLink');
                $('#put-on-saleBtn').text('Sale').prop('disabled', false);
                return;
            }

            try {
                const sendObj = await generateTxObj(
                    web3,
                    sWalletAddress,
                    estimatedGas
                );
                oMediaContractAddress.methods
                    .putOnSell(nftAddress, id, price, quantity)
                    .send(sendObj)
                    .on('transactionHash', (hash) => {
                        notify('success', 'The transaction has been initiated');
                        $('#put-on-sale').addClass('inactiveLink');
                        $('#put-on-auction').addClass('inactiveLink');
                        console.log('Transaction Hash ', hash);
                    })
                    .on('receipt', (receipt) => {
                        notify(
                            'success',
                            'NFT sale has been created successfully'
                        );
                        $('#put-on-sale').removeClass('inactiveLink');
                        $('#put-on-auction').addClass('inactiveLink');
                        $('#put-on-saleBtn')
                            .text('Sale')
                            .prop('disabled', false);
                        setTimeout(() => {
                            location.reload(true);
                        }, 1500);
                        console.log('Transaction Receipt', receipt);
                    })
                    .catch((error) => {
                        console.log(error);
                        $('#put-on-saleBtn').removeClass('inactiveLink');
                        $('#put-on-saleBtn')
                            .text('Sale')
                            .prop('disabled', false);
                        return notify(
                            'error',
                            error.message.replace('MetaMask Tx Signature: ', '')
                        );
                    });
            } catch (error) {
                notify('error', error);
                console.log(error);
                $('#put-on-saleBtn').removeClass('inactiveLink');
                $('#put-on-saleBtn').text('Sale').prop('disabled', false);
                return;
            }
        });

        // place bid modal js
        $('#place-bid-btn').click(async function () {
            if (!localStorage.getItem('sWalletAddressAdmin')) {
                $('#select-wallet-modal.modal').show();
                $('#wallet-connect-options').show();
                return;
            }
            $('#place-bid-modal').show();
            $('body').css('overflow', 'hidden auto');
            $('#base-price').text(`
                ${
                    oTransactionData.data[0].nBidPrice
                } ${_chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol}`);
            $('#price').text(
                `${oTransactionData.data[0].nBidPrice} ${
                    _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
                }`
            );
        });

        $('#put-on-sale').click(function () {
            if (!localStorage.getItem('sWalletAddressAdmin')) {
                $('#select-wallet-modal.modal').show();
                $('#wallet-connect-options').show();
                return;
            }
            $('#put-onSale-modal').show();
            $('.validation').hide();
            if (oNFTData.sCollection == 'ERC721')
                $('#sale-quantity-field').hide();

            let salePrice = _helper.valueMultiply(
                $('#sale-price').val(),
                $('#sale-quantity').val()
            );
            $('#sale-now-total').text(salePrice);
            $('#sale-currency-symbol').text(
                _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
            );
            $('body').css('overflow', 'hidden auto');
        });

        $('.put-on-auction').click(function () {
            console.log('btn Clicked');
            if (!localStorage.getItem('sWalletAddressAdmin')) {
                $('#select-wallet-modal.modal').show();
                $('#wallet-connect-options').show();
                return;
            }
            let startTime = $('#dropdownMenuButton2').val();
            let endTime = $('#dropdownMenuButton3').val();
            console.log({ endTime });
            let chosenTime;

            const endDays = [
                '1 Day from Now',
                '3 Days from Now',
                '5 Days from Now',
            ];

            if ($('#put-on-auction').attr('auctiontype') != 'time') endTime = 0;
            if (
                startTime == 'Specific-time' &&
                $('#put-on-auction').attr('auctiontype') == 'time'
            ) {
                notify('error', 'Please select start Date and Time');
                $('#btn-submit').text('Create').prop('disabled', false);
                return;
            }

            if (
                !startTime ||
                startTime == 'after-listening' ||
                $('#put-on-auction').attr('auctiontype') != 'time'
            ) {
                startTime = 0;
                chosenTime = new Date();
            } else if (
                startTime != 'after-listening' &&
                startTime != 'Specific-time'
            ) {
                chosenTime = new Date(startTime);
                startTime = chosenTime.getTime() / 1000;
            } else {
                notify('error', 'Something went wrong');
                // $('#btn-submit').text('Create').prop('disabled', false);
                return;
            }

            if (
                (!endTime || endTime == 'txt') &&
                $('#put-on-auction').attr('auctiontype') == 'time'
            ) {
                notify('error', 'Please select valid end Date and Time');
                // $('#btn-submit').text('Create').prop('disabled', false);
                return;
            }

            if (
                (new Date(endTime).getTime() < new Date().getTime() ||
                    new Date(endTime).getTime() / 1000 < startTime) &&
                $('#put-on-auction').attr('auctiontype') == 'time'
            ) {
                notify(
                    'error',
                    'End date & time must be greater then current time'
                );
                // $('#btn-submit').text('Create').prop('disabled', false);
                return;
            }

            if (endTime != 'txt' && endDays.includes(endTime)) {
                chosenTime = new Date(Date.parse(chosenTime));
                endTime = chosenTime.setDate(
                    chosenTime.getDate() + Number(endTime[0])
                );
                endTime = Math.round(endTime / 1000);
            } else {
                chosenEndTime = new Date(endTime);
                endTime = Math.round(chosenEndTime.getTime() / 1000);
            }

            console.log({
                startTime,
                endTime,
            });

            $('#put-on-auctionBtn').attr('startTime', startTime);
            $('#put-on-auctionBtn').attr('endTime', endTime);
            $('#put-onAuction-modal').show();
            if (oNFTData.sCollection == 'ERC721')
                $('#auction-quantity-field').hide();
            let salePrice = _helper.valueMultiply(
                $('#auction-price').val(),
                $('#auction-quantity').val()
            );
            $('#auction-now-total').text(salePrice);
            $('#auction-currency-symbol').text(
                _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
            );
            $('body').css('overflow', 'hidden auto');
        });

        $('#close-bid').click(function () {
            $('#place-bid-modal').hide();
            $('body').css('overflow', 'auto');
        });
        $('#close-sale').click(function () {
            $('#put-onSale-modal').hide();
            $('body').css('overflow', 'auto');
        });
        $('#close-auction').click(function () {
            $('#put-onAuction-modal').hide();
            $('body').css('overflow', 'auto');
        });
        $('#place-bid').click(function () {
            $('body').css('overflow', 'auto');
        });
        $('#sale-quantity').keyup(function () {
            $('#sale-now-total').text(
                _helper.valueMultiply(
                    $('#sale-quantity').val(),
                    $('#sale-price').val()
                )
            );
            if (nNftQuantity < $('#sale-quantity').val()) {
                $('#sale-quantity').val(nNftQuantity);
                console.log($('#sale-now-total').text());
                $('#sale-now-total').text(
                    _helper.valueMultiply(
                        $('#sale-quantity').val(),
                        $('#sale-price').val()
                    )
                );
            }
        });
        $('#buy-quantity').keyup(function () {
            if (nNftQuantity < $('#buy-quantity').val()) {
                $('#buy-quantity').val(nNftQuantity);
            }

            $('#buy-now-total').text(
                _helper.valueMultiply(
                    $('#buy-quantity').val(),
                    oTransactionData.data[0].nBidPrice
                )
            );
        });
        $('#sale-price').keyup(function () {
            $('#sale-now-total').text(
                _helper.valueMultiply(
                    $('#sale-quantity').val(),
                    $('#sale-price').val()
                )
            );
        });
        $('#auction-price').keyup(function () {
            $('#auction-now-total').text(
                _helper.valueMultiply(
                    $('#auction-quantity').val(),
                    $('#auction-price').val()
                )
            );
        });
        $('#auction-quantity').keyup(function () {
            if (nNftQuantity < $('#auction-quantity').val()) {
                $('#auction-quantity').val(nNftQuantity);
            }

            $('#auction-now-total').text(
                _helper.valueMultiply(
                    $('#auction-quantity').val(),
                    $('#auction-price').val()
                )
            );
        });

        $('.minus').click(function () {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            if (oTransactionData.data.length > 0) {
                $('#buy-now-total').text(
                    _helper.valueMultiply(
                        count,
                        oTransactionData.data[0].nBidPrice
                    )
                );
            }
            $('#sale-now-total').text(
                _helper.valueMultiply(count, $('#sale-price').val())
            );
            $('#auction-now-total').text(
                _helper.valueMultiply(count, $('#auction-price').val())
            );
            $input.change();
            return false;
        });
        $('.plus').click(function () {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) + 1;
            count =
                oNFTData.sCollection == 'ERC721'
                    ? 1
                    : count > nNftQuantity
                    ? nNftQuantity
                    : count;
            // count = count > 10 ? 10 : count;
            $input.val(count);
            $input.change();
            if (
                oTransactionData.data[0]?.eBidStatus == 'On Auction' ||
                oTransactionData.data[0]?.eBidStatus == 'Timed Auction'
            ) {
                $('#auction-now-total').text(
                    _helper.valueMultiply(count, $('#auction-price').val())
                );
            }
            if (oTransactionData.data[0]?.eBidStatus == 'On Sale')
                $('#buy-now-total').text(
                    _helper.valueMultiply(
                        count,
                        oTransactionData.data[0].nBidPrice
                    )
                );
            $(this)
                .parents(':eq(2)')
                .find('.sale-price-total-val')
                .text(
                    _helper.valueMultiply(
                        count,
                        $(this).parents(':eq(2)').find('input').val()
                    )
                );

            return false;
        });

        // buy now modal js
        $('#buy-now-btn').click(async function () {
            if (!localStorage.getItem('sWalletAddressAdmin')) {
                $('#select-wallet-modal.modal').show();
                $('#wallet-connect-options').show();
                return;
            }
            $('#buy-now-modal').show();
            if (oNFTData.sCollection == 'ERC721') {
                $('#showQuantityERC1155').hide();
            } else {
                $('#showQuantityERC721').hide();
            }
            $('body').css('overflow', 'hidden auto');

            $('#price').text(
                `${oTransactionData.data[0].nBidPrice} ${
                    _chains_web3[oNFTData.nChainId].nativeCurrency.symbol
                }`
            );
            $('#buy-now-total').text(
                _helper.valueMultiply(
                    $('#buy-quantity').val(),
                    oTransactionData.data[0].nBidPrice
                )
            );
            $('#modal-curr-symbol').text(
                _chains_web3[oNFTData.nChainId].nativeCurrency.symbol
            );
        });

        $('#close-buy').click(function () {
            $('#buy-now-modal').hide();
            $('body').css('overflow', 'auto');
        });
        $('#place-bid').click(function () {
            $('#buy-now-modal').hide();
            $('body').css('overflow', 'auto');
        });

        //Claim NFT LOGIC Start
        $('#claim-now-btn').on('click', async () => {
            console.log('Claimed');
            console.log(activity.activityData[0]);
            try {
                await switchAddNetwork(oNFTData.nChainId);
            } catch (error) {
                console.log(error);
                return notify('error', error.message);
            }

            let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
            // let sToken = localStorage.getItem('Authorization');
            let from = oNFTData.aCurrentOwner.sWalletAddress;
            let amount = activity.activityData[0]?.NFTsDetails?.nQuantity || 1;
            let aRef = [];
            let nftAddress = oNFTData.sCollectionAddress;
            let id = oNFTData.nTokenId;
            try {
                oDomain.chainId = oNFTData.nChainId;
                oDomain.verifyingContract =
                    _contracts_web3.addresses[oNFTData.nChainId].market;
                const oSignRes = await _helper.call_API(
                    'PATCH',
                    '/user/generateSign',
                    {
                        sWalletAddress,
                        oDomain,
                    },
                    { Authorization: sToken }
                );
                console.log({ oSignRes });
                if (oSignRes.aReferStructure.referee) {
                    aRef.push(oSignRes.aReferStructure.referee);
                    aRef.push(oSignRes.aReferStructure.referal);
                } else {
                    aRef.push('0x0000000000000000000000000000000000000000');
                    aRef.push('0x0000000000000000000000000000000000000000');
                }

                try {
                    oMediaContractAddress = contractObject(oNFTData.nChainId);
                    estimatedGas = await oMediaContractAddress.methods
                        .claim(
                            nftAddress,
                            id,
                            from,
                            amount,
                            aRef,
                            oSignRes.sSignature
                        )
                        .estimateGas({
                            from: sWalletAddress,
                        });

                    console.log(estimatedGas);
                } catch (error) {
                    console.log(error);
                    let oErrorJSON = JSON.parse(
                        error.message.substr(
                            error.message.indexOf('{'),
                            error.message.lastIndexOf('}')
                        )
                    );
                    $('#buy-now').removeClass('inactiveLink');
                    $('#buy-now').text('Buy Now').prop('disabled', false);
                    notify(
                        'error',
                        oErrorJSON.message.replace('execution reverted: ', '')
                    );
                    return;
                }
                const sendObj = await generateTxObj(
                    web3,
                    sWalletAddress,
                    estimatedGas
                );
                oMediaContractAddress.methods
                    .claim(
                        nftAddress,
                        id,
                        from,
                        amount,
                        aRef,
                        oSignRes.sSignature
                    )
                    .send(sendObj)
                    .once('transactionHash', (data) => {
                        notify('success', 'The transaction has been initiated');
                    })
                    .on('receipt', (receipt) => {
                        console.log(receipt);
                        notify('success', 'NFT claimed successfully');
                        setTimeout(() => {
                            window.location.href = `/creator/${localStorage.getItem(
                                '_id'
                            )}`;
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
                console.log(error);
            }
        });

        //================Bid History==========//
        bidHistory(activity, oNFTData, priceInUsd, oTransactionData);
        //================Activity=============//
        let nNFTPrice;
        try {
            if (activity.activityData[0].aBidders.length) {
                if (
                    activity.activityData[0].aBidders[0].eBidStatus ==
                        'Bid Rejected' ||
                    activity.activityData[0].aBidders[0].eBidStatus ==
                        'Bid Withdrawn'
                ) {
                    nNFTPrice = activity.activityData[0].aBidders[1]?.nBidPrice;
                } else if (
                    activity.activityData[0].aBidders[0].eBidStatus == 'Bid' ||
                    activity.activityData[0].aBidders[0].eBidStatus ==
                        'On Auction' ||
                    activity.activityData[0].aBidders[0].eBidStatus ==
                        'Timed Auction'
                ) {
                    nNFTPrice = activity.activityData[0].aBidders[0]?.nBidPrice;
                } else {
                    nNFTPrice = oTransactionData.data[0]?.nBidPrice;
                }
                for (
                    var i = 0;
                    i < activity.activityData[0].aBidders.length;
                    i++
                ) {
                    let sCancelStatus =
                        activity.activityData[0].aBidders[i].sCancelStatus;

                    let bidderAddress =
                        activity.activityData[0].aBidders[i].bidderDetails
                            ?.sWalletAddress;
                    let loggedInUser = localStorage.getItem(
                        'sWalletAddressAdmin'
                    );
                    let eBidStatus =
                        activity.activityData[0].aBidders[i].eBidStatus;
                    let ownerAddress = oNFTData.aCurrentOwner.sWalletAddress;
                    let sCollection = activity.activityData[0].sCollection;
                    let soldQuantity =
                        activity.activityData[0].aBidders[i].nQuantity;

                    const isBidder = loggedInUser == bidderAddress;
                    const isOwner = loggedInUser == ownerAddress;

                    $('#nft-price').text(
                        `${nNFTPrice} ${
                            _chains_web3[oNFTData.nChainId]?.nativeCurrency
                                .symbol
                        }`
                    );

                    if (
                        eBidStatus == 'Bid' ||
                        eBidStatus == 'Bid Withdrawn' ||
                        eBidStatus == 'Bid Accepted' ||
                        eBidStatus == 'Bid Rejected'
                    ) {
                        continue;
                    }

                    if (activity.activityData[0].aBidders.length) {
                        $('#activity-tab').append(`
                        <div class="place-bid-main ${
                            (isBidder || isOwner) &&
                            eBidStatus != 'On Auction' &&
                            eBidStatus != 'Timed Auction' &&
                            eBidStatus != 'On Sale' &&
                            eBidStatus != 'Mint' &&
                            eBidStatus != 'Sold' &&
                            eBidStatus != 'Bid Withdrawn' &&
                            eBidStatus != 'Bid Accepted' &&
                            eBidStatus != 'Bid Rejected' &&
                            eBidStatus != 'Auction Cancelled' &&
                            eBidStatus != 'Sale Cancelled' &&
                            sCancelStatus == 0
                                ? 'slide-this'
                                : ''
                        }">
                        <div class="place-content-grp ">
                            <div
                                class="slide-down-buttons"
                            ></div>
                            <a class="img-otr">
                                <img
                                    class="img-bid"
                                    src="${allActivityIcons[eBidStatus].icon}"
                                    onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                                    alt="${eBidStatus}"
                                />
                            </a>
                            <div class="bid-content">
                                <div class="content-left">
                                    <p
                                        class="body-mb bid-otr"
                                        style="${
                                            eBidStatus == 'Auction Cancelled' ||
                                            eBidStatus == 'Bid Withdrawn' ||
                                            eBidStatus == 'Bid Rejected' ||
                                            eBidStatus == 'Sale Cancelled' ||
                                            (eBidStatus == 'Bid' &&
                                                sCancelStatus == 1)
                                                ? 'text-decoration: line-through;'
                                                : ''
                                        }"
                                    >
                                    <span
                                            class="by body-m"
                                            >${
                                                sCollection == 'ERC721' ||
                                                eBidStatus ==
                                                    'Sale Cancelled' ||
                                                eBidStatus ==
                                                    'Auction Cancelled'
                                                    ? ''
                                                    : sCollection ==
                                                          'ERC1155' &&
                                                      soldQuantity > 1
                                                    ? soldQuantity + ' copies '
                                                    : soldQuantity + ' copy '
                                            }</span
                                        >
                                        <span class="bid">${
                                            eBidStatus == 'Mint'
                                                ? 'Minted'
                                                : eBidStatus
                                        }</span
                                        >
                                        <span
                                            class="by body-m"
                                            >${
                                                eBidStatus == 'Sold'
                                                    ? 'to'
                                                    : 'by'
                                            }</span
                                        >
                                        <a
                                            href="/creator/${
                                                activity.activityData[0]
                                                    .aBidders[i].bidderDetails
                                                    ?._id
                                            }"
                                            class="user"
                                            >${
                                                isBidder &&
                                                eBidStatus == 'Bid Withdrawn'
                                                    ? activity.activityData[0]
                                                          .aBidders[i]
                                                          .bidderDetails
                                                          ?.sUserName
                                                    : activity.activityData[0]
                                                          .aBidders[i]
                                                          .bidderDetails
                                                          ?.sUserName ||
                                                      _helper.trimEthereumAddress(
                                                          activity
                                                              .activityData[0]
                                                              .aBidders[i]
                                                              .bidderDetails
                                                              ?.sWalletAddress,
                                                          5
                                                      )
                                            }</a
                                        >
                                    </p>
                                    <p class="body-s date" data-toggle="tooltip" data-placement="bottom" title="${moment(
                                        activity.activityData[0].aBidders[i]
                                            .sCreated
                                    ).format('LLL')}">
                                        <a href="${
                                            _chains_web3[oNFTData.nChainId]
                                                .blockExplorerUrls[0]
                                        }/tx/${
                            activity.activityData[0].aBidders[i]
                                .sTransactionHash
                        }" target="_blank">
                                            ${moment(
                                                activity.activityData[0]
                                                    .aBidders[i].sCreated
                                            ).fromNow()}
                                            <i class="fa fa-external-link"></i>
                                        </a>
                                    </p>
                                </div>
                                <div class="content-right">
                                    <p
                                        class="eth heading-h5"
                                    >
                                        ${
                                            eBidStatus == 'Mint' ||
                                            eBidStatus == 'Sale Cancelled' ||
                                            eBidStatus == 'Auction Cancelled'
                                                ? ''
                                                : activity.activityData[0]
                                                      .aBidders[i].nBidPrice +
                                                  ` ${
                                                      _chains_web3[
                                                          oNFTData.nChainId
                                                      ]?.nativeCurrency.symbol
                                                  }`
                                        }
                                    </p>
                                    <p
                                        class="dollor body-sb"
                                        class="user"
                                        >
                                        ${
                                            eBidStatus == 'Mint' ||
                                            eBidStatus == 'Sale Cancelled' ||
                                            eBidStatus == 'Auction Cancelled'
                                                ? ''
                                                : '$ ' +
                                                  `
                                                ${
                                                    Math.round(
                                                        (_helper.toUsd(
                                                            activity
                                                                .activityData[0]
                                                                .aBidders[i]
                                                                ?.nBidPrice,
                                                            priceInUsd
                                                        ) +
                                                            Number.EPSILON) *
                                                            100
                                                    ) / 100
                                                }`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="place-bid-button-grp ${
                            isBidder && eBidStatus == 'Bid' ? 'slide-this' : ''
                        }">
                            <a
                                href="javascript:void(0)"
                                class="${
                                    isBidder && eBidStatus == 'Bid'
                                        ? 'activity-box-btn red-activity-btn withdraw-btn-main'
                                        : ''
                                }"
                            ><i class="${
                                isBidder && eBidStatus == 'Bid'
                                    ? 'fa-solid fa-xmark'
                                    : ''
                            }">
                                </i>
                            ${isBidder && eBidStatus == 'Bid' ? 'Withdraw' : ''}
                            </a>
                    </div>
                    <div class="place-bid-button-grp ${
                        isOwner && eBidStatus != 'On Auction'
                            ? 'slide-this'
                            : 'd-none'
                    }" >
                        <button
                            class="${
                                isOwner &&
                                eBidStatus != 'Bid Rejected' &&
                                eBidStatus != 'Bid Accepted' &&
                                eBidStatus != 'Bid Withdrawn' &&
                                eBidStatus !== 'On Auction' &&
                                eBidStatus !== 'Timed Auction' &&
                                sCancelStatus != 1
                                    ? 'activity-box-btn green-activity-btn'
                                    : 'd-none'
                            }"
                            bidder-address="${bidderAddress}"
                            nft-id="${activity.activityData[0]?.nTokenId}"
                            collection-address="${
                                activity.activityData[0]?.sCollectionAddress
                            }"
                            quantity="${
                                activity.activityData[0]?.NFTsDetails?.nQuantity
                            }"
                            sCollection="${
                                activity.activityData[0].sCollection
                            }"
                            ownerId = "${oNFTData.aCurrentOwner?._id}"
                            nChainId="${oNFTData.nChainId}"
                            _id = "${
                                activity.activityData[0].aBidders[i]
                                    .bidderDetails?._id
                            }"
                            sProfilePicUrl = "${
                                activity.activityData[0].aBidders[i]
                                    ?.bidderDetails?.sProfilePicThumbUrl
                            }"
                            amount = "${
                                activity.activityData[0].aBidders[i]?.nBidPrice
                            }"
                            onclick="callAcceptBid($(this))"
                            ><i
                                class="${
                                    isOwner &&
                                    eBidStatus != 'Bid Rejected' &&
                                    eBidStatus != 'Bid Accepted' &&
                                    eBidStatus != 'Bid Withdrawn' &&
                                    eBidStatus !== 'On Auction' &&
                                    eBidStatus !== 'Timed Auction' &&
                                    sCancelStatus != 1
                                        ? 'fa-solid fa-check'
                                        : ''
                                }"
                            ></i>
                            ${
                                isOwner &&
                                eBidStatus != 'Bid Rejected' &&
                                eBidStatus != 'Bid Accepted' &&
                                eBidStatus != 'Bid Withdrawn' &&
                                eBidStatus !== 'On Auction' &&
                                eBidStatus !== 'Timed Auction' &&
                                sCancelStatus != 1
                                    ? 'Accept'
                                    : ''
                            }</button>
                        <button
                            class="${
                                isOwner &&
                                eBidStatus != 'Bid Rejected' &&
                                eBidStatus != 'Bid Accepted' &&
                                eBidStatus != 'Bid Withdrawn' &&
                                eBidStatus !== 'On Auction' &&
                                eBidStatus !== 'Timed Auction' &&
                                sCancelStatus != 1
                                    ? 'activity-box-btn red-activity-btn'
                                    : 'd-none'
                            }"
                            bidder-address="${bidderAddress}"
                            nft-id="${activity.activityData[0].nTokenId}"
                            collection-address="${
                                activity.activityData[0].sCollectionAddress
                            }"
                            sCollection="${
                                activity.activityData[0].sCollection
                            }"
                            ownerId = "${oNFTData.aCurrentOwner._id}"
                            _id = "${
                                activity.activityData[0].aBidders[i]
                                    .bidderDetails?._id
                            }"
                            nChainId= "${oNFTData.nChainId}"
                            sProfilePicUrl = "${
                                activity.activityData[0].aBidders[i]
                                    ?.bidderDetails?.sProfilePicThumbUrl
                            }"
                            amount = "${
                                activity.activityData[0].aBidders[i]?.nBidPrice
                            }"
                            onclick="callRejectBid($(this))"
                            ><i
                                class="${
                                    isOwner &&
                                    eBidStatus != 'Bid Rejected' &&
                                    eBidStatus != 'Bid Accepted' &&
                                    eBidStatus != 'Bid Withdrawn' &&
                                    eBidStatus != 'Auction Cancelled' &&
                                    eBidStatus != 'Sale Cancelled' &&
                                    eBidStatus != 'On Auction' &&
                                    eBidStatus != 'Timed Auction' &&
                                    eBidStatus != 'On Sale' &&
                                    eBidStatus != 'Mint'
                                        ? 'fa-solid fa-xmark'
                                        : ''
                                }"
                            ></i>
                            ${
                                isOwner &&
                                eBidStatus != 'Bid Rejected' &&
                                eBidStatus != 'Bid Accepted' &&
                                eBidStatus != 'Bid Withdrawn' &&
                                eBidStatus !== 'On Auction' &&
                                eBidStatus !== 'Timed Auction' &&
                                sCancelStatus != 1
                                    ? 'Reject'
                                    : ''
                            }</
                        ></button>
                    </div>
                    </div>
                    </div>
                `);
                        $('[data-toggle="tooltip"]').tooltip({
                            placement: 'bottom',
                        });
                    }
                }
                $('.withdraw-btn-main').on('click', function () {
                    callWithdraw(oNFTData);
                });
            } else {
                $('#activity-tab').append(
                    `<center class="mb-5"><b style='color:white'>No Activity Found</b></center>`
                );
            }
            $('#current-highest-bid').text(
                `${activity.activityData[0].aBidders.length ? nNFTPrice : 0} ${
                    _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
                }`
            );
        } catch (error) {
            console.log(error);
        }

        //================YOU MAY ALSO LIKE=============//
    } catch (error) {
        console.log(error);
        if (error != 'server error') {
            // window.location.href = '/404';
        }
    }
});

async function relatedNfts(oListingNFT, oNFTData) {
    let nPopulted = 0;
    let dataToAppend = '';
    for (const key in oListingNFT.data) {
        const element = oListingNFT.data[key];
        if (element.aNFTData._id != oNFTData._id) {
            dataToAppend += generateNftCard(element);
            nPopulted++;
        }
        if (nPopulted === 4) break;
    }
    if (!dataToAppend) {
        $('.explore-artwork-inr').hide();
        return;
    }
    $('#related-nft').append(dataToAppend);

    _helper.addTiltEffect($('#related-nft .img-tilt'));
}

async function callWithdraw(oNFTData) {
    try {
        let nftAddress = oNFTData.sCollectionAddress;
        let id = oNFTData.nTokenId;
        let from = oNFTData.aCurrentOwner.sWalletAddress;
        let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');

        if ((await web3.eth.getChainId()) != oNFTData.nChainId) {
            await switchAddNetwork(oNFTData.nChainId);
        }

        let mediaContractAddress = contractObject(oNFTData.nChainId);
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
            const sendObj = await generateTxObj(
                web3,
                sWalletAddress,
                estimatedGas
            );
            mediaContractAddress.methods
                .withdrawBid(nftAddress, id, from)
                .send(sendObj)
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

async function callAcceptBid(btn) {
    const nNFTId = btn.attr('nft-id');
    const sBidderAddress = btn.attr('bidder-address');
    const sCollectionAddress = btn.attr('collection-address');
    const nQuantity = btn.attr('quantity');
    const sCollection = btn.attr('sCollection');
    const nChainId = btn.attr('nChainId');
    let sWalletAddress = localStorage.getItem('sWalletAddressAdmin');
    // let sToken = localStorage.getItem('Authorization');

    if ((await web3.eth.getChainId()) != nChainId) {
        await switchAddNetwork(nChainId);
    }

    let oMediaContract = contractObject(nChainId);
    let oErc721ContractAddress = contract721Object(nChainId);
    let oErc1155ContractAddress = contract1155Object(nChainId);
    let oSignRes;
    let aRef = [];
    let nEstimatedGas;

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
                    let estimatedGas;
                    try {
                        estimatedGas = await oErc721ContractAddress.methods
                            .setApprovalForAll(
                                _contracts_web3.addresses[nChainId].media,
                                true
                            )
                            .estimateGas({ from: sWalletAddress });
                    } catch (error) {
                        notify('error', error);
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
                        notify('error', error)
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
                aRef,
                oSignRes.sSignature
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
                    window.location.href = `/creator/${localStorage.getItem(
                        '_id'
                    )}`;
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

function addNewBid(amount, oNFTData) {
    console.log(eBidStatus);
    $('#activity-tab').prepend(`
        <div class="place-bid-main ">
            <div class="place-content-grp ">
                <div class="slide-down-buttons"></div>
                <a href="/creator/${localStorage.getItem(
                    '_id'
                )}" class="img-otr">
                    <img class="img-creator" src="${
                        allActivityIcons[eBidStatus].icon
                    }" 
                    onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';" alt="creator-img">
                </a>
                <div class="bid-content">
                    <div class="content-left">
                        <p class="body-mb bid-otr">
                            <span class="bid">Bid
                                placed</span>
                            <span class="by body-m">by</span>
                            <a href="/creator/${localStorage.getItem(
                                '_id'
                            )}" class="user">You</a>
                        </p>
                        <p class="body-s date">
                            ${new Date().toLocaleString()}
                        </p>
                    </div>
                    <div class="content-right">
                        <p class="eth heading-h5">
                            ${amount} ${
        _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
    }
                        </p>
                        <p class="dollor body-sb">
                            $2,505
                        </p>
                    </div>
                </div>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
        </div>
    `);
}

function updateAcceptedBid(_id, ownerId, sProfilePicUrl, amount) {
    $('#activity-tab').prepend(`
        <div class="place-bid-main ">
            <div class="place-content-grp ">
                <div class="slide-down-buttons"></div>
                <a href="/creator/${_id}" class="img-otr">
                    <img class="img-creator" src="${
                        allActivityIcons[eBidStatus].icon
                    }" onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';" alt="creator-img">
                </a>
                <div class="bid-content">
                    <div class="content-left">
                        <p class="body-mb bid-otr">
                            <span class="bid">Bid
                                accepted</span>
                            <span class="by body-m">by</span>
                            <a href="/creator/${ownerId}" class="user">Owner</a>
                        </p>
                        <p class="body-s date">
                            ${new Date().toLocaleString()}
                        </p>
                    </div>
                    <div class="content-right">
                        <p class="eth heading-h5">
                            ${amount} ${
        _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
    }
                        </p>
                        <p class="dollor body-sb">
                            $2,505
                        </p>
                    </div>
                </div>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
        </div>
    `);
}

function updateRejectedBid(_id, ownerId, sProfilePicUrl, amount) {
    $('#activity-tab').prepend(`
        <div class="place-bid-main ">
            <div class="place-content-grp ">
                <div class="slide-down-buttons"></div>
                <a href="/creator/${_id}" class="img-otr">
                    <img class="img-creator" src="${
                        allActivityIcons[eBidStatus].icon
                    }" onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';" alt="creator-img">
                </a>
                <div class="bid-content">
                    <div class="content-left">
                        <p class="body-mb bid-otr">
                            <span class="bid">Bid
                                Rejected</span>
                            <span class="by body-m">by</span>
                            <a href="/creator/${ownerId}" class="user">Owner</a>
                        </p>
                        <p class="body-s date">
                            ${new Date().toLocaleString()}
                        </p>
                    </div>
                    <div class="content-right">
                        <p class="eth heading-h5">
                            ${amount} ${
        _chains_web3[oNFTData.nChainId]?.nativeCurrency.symbol
    }
                        </p>
                        <p class="dollor body-sb">
                            $2,505
                        </p>
                    </div>
                </div>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
            <div class="">
                <a href="#" class=""><i class=""></i>
                    </a>
                <a href="#" class=""><i class=""></i>
                    </a>
            </div>
        </div>
    `);
}
let bidHtml = '';
function bidHistory(activity, oNFTData, priceInUsd, oTransactionData) {
    let allowedType = [
        'Bid',
        'Bid Rejected',
        'Bid Withdrawn',
        'Bid Rejected',
        'Bid Accepted',
    ];
    for (let i = 0; i < activity.activityData[0].aBidders.length; i++) {
        let eBidStatus = activity.activityData[0].aBidders[i].eBidStatus;

        if (!allowedType.includes(eBidStatus)) {
            continue;
        }
        let bidderAddress =
            activity.activityData[0].aBidders[i].bidderDetails?.sWalletAddress;
        let ownerAddress = oNFTData.aCurrentOwner.sWalletAddress;
        let loggedInUser = localStorage.getItem('sWalletAddressAdmin');
        let sCancelStatus = activity.activityData[0].aBidders[i].sCancelStatus;

        const isBidder = loggedInUser == bidderAddress;
        const isOwner = loggedInUser == ownerAddress;

        let demo =
            (isBidder || isOwner) &&
            eBidStatus != 'On Auction' &&
            eBidStatus != 'Timed Auction' &&
            eBidStatus != 'On Sale' &&
            eBidStatus != 'Mint' &&
            eBidStatus != 'Sold' &&
            eBidStatus != 'Bid Withdrawn' &&
            eBidStatus != 'Bid Accepted' &&
            eBidStatus != 'Bid Rejected' &&
            eBidStatus != 'Auction Cancelled' &&
            eBidStatus != 'Sale Cancelled' &&
            sCancelStatus == 0
                ? 'slide-this'
                : '';

        if (isTimeAuction) {
            demo = '';
        }

        bidHtml += `<div class="place-bid-main ${demo}">
    <div class="place-content-grp ">
        <div class="slide-down-buttons"></div>
        <a class="img-otr">
            <img class="img-bid" src="${allActivityIcons[eBidStatus].icon}"
            onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
            alt="${eBidStatus}">
        </a>
        <div class="bid-content">
            <div class="content-left">
                <p class="body-mb bid-otr" style="${
                    // eBidStatus == 'Bid Withdrawn' ||
                    // eBidStatus == 'Bid Rejected' ||
                    eBidStatus == 'Bid' && sCancelStatus == 1
                        ? 'text-decoration: line-through;'
                        : ''
                }">
                    <span class="by body-m"></span>
                    <span class="bid">${
                        eBidStatus == 'Bid' ? 'Bid' : eBidStatus
                    }</span>
                    <span class="by body-m">by</span>
                    <a href="/creator/${
                        activity.activityData[0].aBidders[i].bidderDetails?._id
                    }"
                        class="user">${
                            isBidder && eBidStatus == 'Bid Withdrawn'
                                ? activity.activityData[0].aBidders[i]
                                      .bidderDetails?.sUserName
                                : activity.activityData[0].aBidders[i]
                                      .bidderDetails?.sUserName ||
                                  _helper.trimEthereumAddress(
                                      activity.activityData[0].aBidders[i]
                                          .bidderDetails?.sWalletAddress,
                                      5
                                  )
                        }</a>
                </p>
                <p class="body-s date" data-toggle="tooltip" data-placement="bottom"
                    title="${moment(
                        activity.activityData[0].aBidders[i].sCreated
                    ).format('LLL')}">
                    <a href="${
                        _chains_web3[oNFTData.nChainId].blockExplorerUrls[0]
                    }/tx/${
            activity.activityData[0].aBidders[i].sTransactionHash
        }"
                        target="_blank">
                        ${moment(
                            activity.activityData[0].aBidders[i].sCreated
                        ).fromNow()}
                        <i class="fa fa-external-link"></i>
                    </a>
                </p>
            </div>
            <div class="content-right">
                <p class="eth heading-h5">
                   ${
                       activity.activityData[0].aBidders[i].nBidPrice +
                       ` ${
                           _chains_web3[oNFTData.nChainId]?.nativeCurrency
                               .symbol
                       }`
                   }
                </p>
                <p class="dollor body-sb">
                    $
                    ${
                        Math.round(
                            (_helper.toUsd(
                                activity.activityData[0].aBidders[i].nBidPrice,
                                priceInUsd
                            ) +
                                Number.EPSILON) *
                                100
                        ) / 100
                    }
                </p>
            </div>
        </div>
    </div>
    <div class="place-bid-button-grp ${
        isBidder &&
        eBidStatus == 'Bid' &&
        oTransactionData.data[0]?.eBidStatus != 'Timed Auction'
            ? 'slide-this'
            : 'd-none'
    }">
        <a href="javascript:void(0)"
            class="${
                isBidder && eBidStatus == 'Bid'
                    ? 'activity-box-btn red-activity-btn withdraw-btn-main'
                    : ''
            }"><i
                class="${
                    isBidder && eBidStatus == 'Bid' ? 'fa-solid fa-xmark' : ''
                }">
            </i>
            ${isBidder && eBidStatus == 'Bid' ? 'Withdraw' : ''}
        </a>
    </div>
    <div class="place-bid-button-grp ${
        isOwner && eBidStatus != 'On Auction' && eBidStatus != 'Timed Auction'
            ? 'slide-this'
            : 'd-none'
    }" >
        <button
            class="${
                isOwner &&
                eBidStatus != 'Bid Rejected' &&
                eBidStatus != 'Bid Accepted' &&
                eBidStatus != 'Bid Withdrawn' &&
                eBidStatus !== 'On Auction' &&
                eBidStatus !== 'Timed Auction' &&
                sCancelStatus != 1
                    ? 'activity-box-btn green-activity-btn'
                    : 'd-none'
            }"
            bidder-address="${bidderAddress}"
            nft-id="${activity.activityData[0]?.nTokenId}"
            collection-address="${activity.activityData[0]?.sCollectionAddress}"
            quantity="${activity.activityData[0]?.NFTsDetails?.nQuantity}"
            sCollection="${activity.activityData[0].sCollection}"
            ownerId = "${oNFTData.oCurrentOwner?._id}"
            nChainId="${oNFTData.nChainId}"
            _id = "${activity.activityData[0].aBidders[i].bidderDetails?._id}"
            sProfilePicUrl = "${
                activity.activityData[0].aBidders[i]?.bidderDetails
                    ?.sProfilePicThumbUrl
            }"
            amount = "${activity.activityData[0].aBidders[i]?.nBidPrice}"
            onclick="callAcceptBid($(this))"
            ><i
                class="${
                    isOwner &&
                    eBidStatus != 'Bid Rejected' &&
                    eBidStatus != 'Bid Accepted' &&
                    eBidStatus != 'Bid Withdrawn' &&
                    eBidStatus !== 'On Auction' &&
                    eBidStatus !== 'Timed Auction' &&
                    sCancelStatus != 1
                        ? 'fa-solid fa-check'
                        : ''
                }"
            ></i>
            ${
                isOwner &&
                eBidStatus != 'Bid Rejected' &&
                eBidStatus != 'Bid Accepted' &&
                eBidStatus != 'Bid Withdrawn' &&
                eBidStatus !== 'On Auction' &&
                eBidStatus !== 'Timed Auction' &&
                sCancelStatus != 1
                    ? 'Accept'
                    : ''
            }</button>
        <button
            class="${
                isOwner &&
                eBidStatus != 'Bid Rejected' &&
                eBidStatus != 'Bid Accepted' &&
                eBidStatus != 'Bid Withdrawn' &&
                eBidStatus !== 'On Auction' &&
                eBidStatus !== 'Timed Auction' &&
                sCancelStatus != 1
                    ? 'activity-box-btn red-activity-btn'
                    : 'd-none'
            }"
            bidder-address="${bidderAddress}"
            nft-id="${activity.activityData[0].nTokenId}"
            collection-address="${activity.activityData[0].sCollectionAddress}"
            sCollection="${activity.activityData[0].sCollection}"
            ownerId = "${oNFTData.oCurrentOwner._id}"
            _id = "${activity.activityData[0].aBidders[i].bidderDetails?._id}"
            nChainId= "${oNFTData.nChainId}"
            sProfilePicUrl = "${
                activity.activityData[0].aBidders[i]?.bidderDetails
                    ?.sProfilePicThumbUrl
            }"
            amount = "${activity.activityData[0].aBidders[i]?.nBidPrice}"
            onclick="callRejectBid($(this))"
            ><i
                class="${
                    isOwner &&
                    eBidStatus != 'Bid Rejected' &&
                    eBidStatus != 'Bid Accepted' &&
                    eBidStatus != 'Bid Withdrawn' &&
                    eBidStatus != 'Auction Cancelled' &&
                    eBidStatus != 'Sale Cancelled' &&
                    eBidStatus != 'On Auction' &&
                    eBidStatus != 'Timed Auction' &&
                    eBidStatus != 'On Sale' &&
                    eBidStatus != 'Mint'
                        ? 'fa-solid fa-xmark'
                        : ''
                }"
            ></i>
            ${
                isOwner &&
                eBidStatus != 'Bid Rejected' &&
                eBidStatus != 'Bid Accepted' &&
                eBidStatus != 'Bid Withdrawn' &&
                eBidStatus !== 'On Auction' &&
                eBidStatus !== 'Timed Auction' &&
                sCancelStatus != 1
                    ? 'Reject'
                    : ''
            }</
        ></button>
    </div>
    </div>`;
    }
    if (!bidHtml) {
        $('#bid-section').hide();
        return;
    }
    $('#bid-history').append(bidHtml);
}

function setBlueTick(oNFTData) {
    if (!oNFTData.aCurrentOwner.bVerify) {
        $('#blue-tick-ownedBy').hide();
    }
    if (!oNFTData.aPostedBy.bVerify) {
        $('#blue-tick-postedBy').hide();
    }
}

function setRoyaltyInfo(data) {
    if (data.sSetRroyalityPercentage) {
        $('#royaltyPercentage').text(`${data.sSetRroyalityPercentage / 100}%`);
    } else {
        return;
    }

    let html = '';
    let totalPercentage = 100;

    if (data.aCollaborator.length) {
        data.aCollaborator.forEach((collab) => {
            let res = _helper.findFromObjectArray(
                data.aCollaboratorData,
                'sWalletAddress',
                collab.sWalletAddress
            );

            let nPercentage = collab.nPercentage / 100;

            totalPercentage -= nPercentage;

            let oData = {};

            if (res) {
                oData = {
                    sImage: res.sProfilePicThumbUrl
                        ? res.sProfilePicThumbUrl
                        : '/assets/img/male-avatar-maker.jpg',
                    sName: res.sUserName
                        ? res.sUserName
                        : _helper.trimEthereumAddress(res.sWalletAddress, 5),
                    nPercentage,
                };
            } else {
                oData = {
                    sImage: '/assets/img/male-avatar-maker.jpg',
                    sName: _helper.trimEthereumAddress(
                        collab.sWalletAddress,
                        5
                    ),
                    nPercentage,
                };
            }

            html += _helper.generateHtmlFromEJS(_card_templates.royalty, oData);
        });
    }
    let oData = {
        sImage: data.aPostedBy.sProfilePicThumbUrl
            ? data.aPostedBy.sProfilePicThumbUrl
            : '/assets/img/male-avatar-maker.jpg',
        sName: data.aPostedBy.sUserName
            ? data.aPostedBy.sUserName
            : _helper.trimEthereumAddress(data.aPostedBy.sWalletAddress, 5),
        nPercentage: totalPercentage,
    };

    // creator percentage
    html = _helper.generateHtmlFromEJS(_card_templates.royalty, oData) + html;

    $('#nft-all-royalties').append(html);
    $('#nft-all-royalties').show();
}

async function checkConnectedAddress() {
    const aAddresses = await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
    if (!aAddresses || !aAddresses[0]) throw new Error('No Account Found!');

    const sWalletAddress = aAddresses[0];
    if (sWalletAddress != window.localStorage.getItem('sWalletAddressAdmin')) {
        notify('error', 'Incorrect wallet address selected!');
        return false;
    }
    return true;
}
