/*---------------------------------------------*
This file requires import of following js:
- global.js

- also requires ___ENV___ variable
*----------------------------------------------*/

// TODO: uncomment below code for prod

if (
    !sToken &&
    !aAllowedPaths.includes(
        window.location.pathname.split('/')[1] === 'a'
            ? window.location.pathname
            : window.location.pathname.split('/')[1]
    )
) {
    window.location.href = '/';
}

$(window).on('load', function () {
    $('.loader').fadeOut();
});
/* handle 401 ajax */
$(document).ajaxComplete(function (event, xhr, settings) {
    if (xhr.status === 401) {
        localStorage.clear();
        if (window.location.pathname === '/create-nft') {
            window.location.href = '/';
        } else {
            window.location.reload();
        }
    }
});

// All properties on a domain are optional
const oDomain = {
    name: 'NFTTalent',
    version: '1',
    chainId: 97,
    verifyingContract: '0xE3fEF3C000278a5f7F3E49827D5559A63694f1f5', //dynamic
};

/* Common Utility Functions */

function notify(sType, sMessage) {
    notyf.dismissAll();
    notyf[sType](sMessage);
}

function copyDataToClipBoard(text) {
    const isCopied = _helper.copyToClipboard(text);

    if (isCopied) {
        notify('success', 'Copied to clipboard!');
    } else {
        notify('error', 'Unable to copy!');
    }
    return false;
}

function generateNftCard(oResult, isLandingPage = false, isAdminSide = false) {
    let aNFTdata;
    if (oResult.aNFTData) {
        aNFTdata = oResult.aNFTData;
    }
    delete oResult.aNFTData;
    let data = {
        ...oResult,
        ...aNFTdata,
    };

    let imageUrl =
        _platform_config[___ENV___].sS3ThumbLocation +
        (data.sImageHash || data.sImageHash);
    let sNFTId = data._id;
    let sCurrentOwnerWalletAddress = data.aCurrentOwner.sWalletAddress;
    let sCurrentOwnerProfilePic = data.aCurrentOwner.sProfilePicThumbUrl;
    let isOwnerVerified = data.aCurrentOwner.bVerify;
    let id = localStorage.getItem('_id') ? localStorage.getItem('_id') : '';

    let nftLink;
    if (data.bStatus) {
        nftLink = !isAdminSide ? `/nft/${sNFTId}` : `/a/nft/${sNFTId}`;
    }

    let aCurrentOwnerFollowers = data.aCurrentOwner.aFollowers;

    let time =
        data.eBidStatus == 'Timed Auction'
            ? `<div class="timer-otr timer-gif">
                    <img src="/assets/img/Timer_ICon.gif" style="width:30px;height:30px;" alt="Avalanche">
                </div>`
            : ``;
    let chainId = data.nChainId;
    let sNetworkName = `<div class="timer-otr copies">
                    <div class="body-sb copies-text">${_platform_config[___ENV___].network[chainId].name}
                    </div>
                </div>`;
    let currencySymbol = _chains_web3[chainId].nativeCurrency.symbol;

    let aFavorite = data.aFavorite;

    let classToAdd = '';

    if (!isLandingPage) {
        classToAdd = 'col-lg-3';
    }
    let varData = {
        imageUrl,
        sNFTId,
        nftLink,
        sCurrentOwnerWalletAddress,
        sCurrentOwnerProfilePic,
        isOwnerVerified,
        id,
        aCurrentOwnerFollowers,
        sNetworkName,
        time,
        chainId,
        currencySymbol,
        aFavorite,
        classToAdd,
    };

    let followCurrent = `<a href=""
    class="btn-outline2 follow-btn btn-wallet" onclick="followCreator($(this)); return false;"
    data-isFollowed="${
        aCurrentOwnerFollowers.indexOf(id) != -1 ? 'true' : 'false'
    }"
    data-_id="${data.aCurrentOwner._id}"
    >${aCurrentOwnerFollowers.indexOf(id) != -1 ? 'Unfollow' : 'Follow'}</a
    >`;
    let newObjact = {
        ...data,
        ...varData,
        // followCurrent,
    };
    // console.log(_helper.generateHtmlFromEJS(_card_templates.nft, newObjact));
    return _helper.generateHtmlFromEJS(_card_templates.nft, newObjact);
}

async function likeNFT(btn) {
    console.log('Button clicked');
    const bIsLiked = $(btn).attr('data-liked');
    const sNFTId = $(btn).attr('data-nftid');
    let userId =
        localStorage.getItem('_id') || localStorage.getItem('sUserIdAdmin');
    let oData = {
        sNFTId,
        userId,
    };
    if (!userId) {
        callConnectModal();
        return;
    }

    const sPath = bIsLiked == 'true' ? '/nft/unlike' : '/nft/like';

    try {
        let res = await _helper.call_API('PATCH', sPath, oData, {
            Authorization: sToken,
        });
    } catch (error) {
        console.log(error);
    }

    if (bIsLiked == 'true') {
        $(btn).removeClass('selected');
        $(btn).attr('data-liked', false);
    } else {
        $(btn).addClass('selected');
        $(btn).attr('data-liked', true);
    }
}

async function followCreator(btn) {
    try {
        const isFollowed = $(btn).attr('data-isFollowed');
        const _id = $(btn).attr('data-_id');

        let oData = {
            _id,
        };

        const sPath = isFollowed == 'true' ? '/user/unfollow' : '/user/follow';

        await _helper.call_API('PATCH', sPath, oData, {
            Authorization: sToken,
        });

        if (isFollowed == 'true') {
            $(`[data-_id=${_id}]`)
                .text('Follow')
                .attr('data-isFollowed', false);
            $('#user-followers').text(Number($('#user-followers').text()) - 1);
        } else {
            $(`[data-_id=${_id}]`)
                .text('Unfollow')
                .attr('data-isFollowed', true);
            $('#user-followers').text(Number($('#user-followers').text()) + 1);
        }
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
}

/* Connect wallet (Metamask) */

$('#btn-metamask').on('click', connectMetamask);

async function connectMetamask() {
    try {
        localStorage.clear();
        isWalletConnectClick = false;
        $('#wallet-connect-options').hide();
        $('#wallet-connect-options').next().show();
        let res;
        try {
            res = await _service_web3.connectMetamask();
        } catch (error) {
            console.log(error);
            $('#select-wallet-modal.modal').hide();
            if (error == 'Metamask not found!') {
                notify('error', error);
                window.open('https://metamask.io/', '_blank');
            }
            $('#wallet-connect-options').hide();
            $('#wallet-connect-options').next().hide();
            return;
        }
        _service_web3.setWeb3Events(logoutUser);
        connectWithSite(res);
        localStorage.setItem(
            'sWalletAddress',
            res.sWalletAddress.toLowerCase()
        );
        // $('#wallet-connect-options').hide();
        // $('#wallet-connect-options').next().hide();
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#wallet-connect-options').show();
        $('#wallet-connect-options').next().hide();
    }
}

$('#btn-trustwallet').on('click', connectTrustWallet);

$('#select-wallet-modal .close-icn').on('click', function () {
    // if (isWalletConnectClick) {
    $('#wallet-connect-options').show();
    $('#wallet-connect-options').next().hide();
    // }
});

async function connectTrustWallet() {
    try {
        localStorage.clear();
        $('#wallet-connect-options').hide();
        $('#wallet-connect-options').next().show();

        isWalletConnectClick = true;

        initWalletConnect();

        await provider.disconnect();
        await provider.enable();

        let res = await _service_web3.connectTrustWallet(provider);

        localStorage.setItem('isWalletConnect', true);

        _service_web3.setWeb3Events(logoutUser, provider);
        localStorage.setItem(
            'sWalletAddress',
            res.sWalletAddress.toLowerCase()
        );
        connectWithSite(res);
    } catch (error) {
        console.log({ error });
        if (error.message !== 'User closed modal') {
            notify('error', error.message || error);
        }
        $('#wallet-connect-options').show();
        $('#wallet-connect-options').next().hide();
    }
}

function switchAddNetwork(chainId) {
    let provider_send = window.ethereum;

    if (localStorage.getItem('isWalletConnect') == 'true') {
        provider_send = provider; // global
    }

    return new Promise(function (resolve, reject) {
        _service_web3
            .switchNetworkMetamask(web3.utils.toHex(chainId), provider_send)
            .then((switch_res) => {
                if (switch_res === 'add_network') {
                    _service_web3
                        .addNetworkMetamask(chainId, provider_send)
                        .then(() => {
                            resolve();
                        })
                        .catch((e) => {
                            reject(e);
                        });
                } else {
                    resolve();
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
}

async function verifyCode() {
    try {
        const sReferralCode = $('#enter-details-verify-referral-code').val();

        if (!sReferralCode) {
            return;
        }

        await _helper.call_API_v2('POST', '/auth/check-referral-code', {
            sReferralCode,
        });

        notify('success', 'code verified');
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
}

$('#verify-referral-code').on('click', verifyCode);

function contractObject(chainId) {
    return new web3.eth.Contract(
        _contracts_web3.abis.media,
        _contracts_web3.addresses[chainId].media
    );
}

function contractObjectMarket(chainId) {
    return new web3.eth.Contract(
        _contracts_web3.abis.market,
        _contracts_web3.addresses[chainId].market
    );
}

function contract721Object(chainId) {
    return new web3.eth.Contract(
        _contracts_web3.abis.erc721,
        _contracts_web3.addresses[chainId].erc721
    );
}

function contract1155Object(chainId) {
    return new web3.eth.Contract(
        _contracts_web3.abis.erc1155,
        _contracts_web3.addresses[chainId].erc1155
    );
}

window.addEventListener('storage', function (event) {
    if (
        event.key == 'sWalletAddress' ||
        event.key == 'Authorization' ||
        event.key == '_id'
    ) {
        if (event.oldValue) {
            window.localStorage.removeItem('sWalletAddress');
            window.localStorage.removeItem('Authorization');
            window.localStorage.removeItem('_id');
            window.localStorage.removeItem('sProfilePicUrl');
            window.localStorage.removeItem('isVerified');
            window.localStorage.removeItem('sUserName');
            // localStorage.clear();
        }
        window.location.reload();
    }
    if (
        event.key == 'sWalletAddressAdmin' ||
        event.key == 'AuthorizationAdmin' ||
        event.key == 'sUserIdAdmin'
    ) {
        if (event.oldValue) {
            window.localStorage.removeItem('sWalletAddressAdmin');
            window.localStorage.removeItem('AuthorizationAdmin');
            window.localStorage.removeItem('sUserIdAdmin');
            window.localStorage.removeItem('sProfilePicUrlAdmin');
            window.localStorage.removeItem('isVerifiedAdmin');
            window.localStorage.removeItem('sUserNameAdmin');
            // localStorage.clear();
        }
        window.location.reload();
    }

    if (event.key == null) {
        window.location.reload();
    }
});

function showHideError(id, show, message) {
    if (show) {
        $(id)
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-invalid');
        $(id).html(message);
        $(id).css('display', 'block');
    } else {
        $(id)
            .closest('.form-group')
            .removeClass('is-invalid')
            .addClass('is-valid');
        $(id).html('');
        $(id).css('display', 'none');
    }
}

function setAuctionTimer(id) {
    $(`#${id} .countdown`).each(function () {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('%H : %M : %S'));
        });
    }); // Timer Plugin End  http://hilios.github.io/jQuery.countdown/
}

async function connectWithSite(res) {
    try {
        const oUser = await _helper.call_API('POST', '/user/checkUser', {
            sWalletAddress: res.sWalletAddress.toLowerCase(),
        });

        let isOtpverified = false;
        if (oUser.isExist && oUser.bVerify) {
            // registered (Login)
            if (oUser.bTwoFactorEnabled) {
                let resData = await _helper.call_API_v2(
                    'POST',
                    '/auth/getOtp',
                    {
                        sWalletAddress: res.sWalletAddress.toLowerCase(),
                    }
                );

                // TODO : check otp sent or not
                if (resData.data.otpSent) {
                    $('#select-wallet-modal').hide();
                    $('#wallet-connect-options').next().hide();
                    $('#otp-modal').show();
                    $('#char1').focus();
                    mailTimer(30);

                    $('#verify-otp').on('click', async () => {
                        try {
                            const first = $('#char1').val().trim();
                            const second = $('#char2').val().trim();
                            const third = $('#char3').val().trim();
                            const fourth = $('#char4').val().trim();

                            if (
                                first === '' ||
                                second === '' ||
                                third === '' ||
                                fourth === ''
                            ) {
                                return notify(
                                    'error',
                                    'please enter valid otp'
                                );
                            }

                            let nOtp = first + second + third + fourth;
                            let oData = {
                                nOtp: Number(nOtp),
                                sEmail: resData.data.sEmail,
                            };

                            let oRes = await _helper.call_API_v2(
                                'POST',
                                '/auth/verifyOtp',
                                oData
                            );
                            notify('success', oRes.message);
                            $('#otp-modal').hide();
                            loginUser(res);
                        } catch (error) {
                            console.log(error);
                            notify('error', error);
                        }
                    });
                } else {
                    notify('error', 'Something went wrong please try again');
                }
            } else {
                loginUser(res);
            }
        } else {
            // not registered (Register)
            localStorage.setItem('register_data', JSON.stringify(res));
            $('#wallet-connect-options').show();
            $('#wallet-connect-options').next().hide();
            $('#select-wallet-modal').hide();

            if (!oUser.isExist || !oUser.sEmail) {
                $('#enter-details-modal').show();
            } else {
                $('#email-verify-modal').show();
                localStorage.removeItem('sWalletAddress');
                await sendVerificationMail(res.sWalletAddress);
            }
        }
        // return;
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
}

async function loginUser(res) {
    try {
        const data = await _helper.call_API('POST', '/auth/login', {
            sWalletAddress: res.sWalletAddress.toLowerCase(),
            sMessage: `${_SIGN_MSG}\n${res.sWalletAddress}`,
            sSignature: res.sSignature,
        });
        sWalletAddress = data.sWalletAddress;

        window.localStorage.setItem('sWalletAddress', data.sWalletAddress);
        window.localStorage.setItem('sReferralCode', data.sReferCode);
        window.localStorage.setItem('_id', data._id);
        window.localStorage.setItem('Authorization', data.sToken);
        window.localStorage.setItem('sEmail', data.sEmail);
        sToken = data.sToken; // set global token
        window.localStorage.setItem(
            'sProfilePicUrl',
            `${data.sProfilePicUrl}?cacheblock=true&time=${new Date().getTime()}` || '/assets/img/male-avatar-maker.jpg'
        );
        window.localStorage.setItem('isVerified', data.bVerify);
        if (data.sUserName) {
            window.localStorage.setItem('sUserName', data.sUserName);
        }

        // window.location.href = '/';
        $('#select-wallet-modal').hide();
        $('#nav-connect-wallet-btn').hide();
        updateNavbar(sWalletAddress);
        window.location.reload();
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#nav-connect-wallet-btn').show();
        $('#select-wallet-modal').hide();
        $('#wallet-connect-options').next().hide();
    }
}

async function sendVerificationMail(sWalletAddress) {
    localStorage.removeItem('sWalletAddress');
    await _helper.call_API('POST', '/auth/send-verification-mail', {
        sWalletAddress,
    });
    $('#email-verify-modal').show();
}

$('#register-new-user').on('click', registerUser);
$('#resendMail').on('click', async function () {
    $('#resendMail').css('pointer-events', 'none');

    try {
        let timer = $('#mailTimer').text();
        if (timer <= 0) {
            $('#resendMail').append(
                "<div class='spinner-border spinner-border-sm'></div>"
            );

            let resData = await _helper.call_API_v2('POST', '/auth/getOtp', {
                sWalletAddress: localStorage.getItem('sWalletAddress'),
            });

            // TODO : check otp sent or not
            if (resData.data.otpSent) {
                $('.spinner-border .spinner-border-sm').remove();
                $('#resendMail').prop('aria-disabled', true);
                $('#char1').focus();
                mailTimer(30);
            } else {
                notify('error', 'Something went wrong please try again');
                $('#resendMail').prop('aria-disabled', false);
            }
        }
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#resendMail').prop('aria-disabled', false);
    }
});

async function registerUser() {
    try {
        const res = JSON.parse(localStorage.getItem('register_data'));

        const sReferralCode = $('#enter-details-verify-referral-code').val();
        const sEmail = $('#enter-details-email-id').val();

        if (!sEmail) {
            notify('error', 'Please enter email address');
            return;
        }

        $('#register-new-user').prop('disabled', true);
        $('#register-new-user')
            .html("<div class='spinner-border spinner-border-sm'></div>")
            .prop('disabled', true);

        await _helper.call_API('POST', '/auth/register', {
            sWalletAddress: res.sWalletAddress.toLowerCase(),
            sMessage: `${_SIGN_MSG}\n${res.sWalletAddress}`,
            sSignature: res.sSignature,
            sEmail,
            sReferralCode,
        });

        $('#register-new-user').prop('disabled', false);
        localStorage.removeItem('sWalletAddress');

        await sendVerificationMail(res.sWalletAddress);

        $('#enter-details-modal').hide();
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#register-new-user').prop('disabled', false);
        $('#register-new-user').text('Register').prop('disabled', false);
    }
}

function countDecimals(value) {
    if (Math.floor(Number(value)) === Number(value)) return 0;
    return value.toString().split('.')[1].length || 0;
}

function cloneObject(obj) {
    return Object.assign({}, obj);
}

$('.otpbox-container input').keyup(function (e) {
    if ($(this).val() > 0) {
        if (
            e.key == 1 ||
            e.key == 2 ||
            e.key == 3 ||
            e.key == 4 ||
            e.key == 5 ||
            e.key == 6 ||
            e.key == 7 ||
            e.key == 8 ||
            e.key == 9 ||
            e.key == 0
        ) {
            $(this).next().focus();
        } else if (e.key == 'ArrowRight') {
            $(this).next().focus();
        }
    } else if (e.key == 'Backspace') {
        $(this).prev().focus();
    }
});

function callConnectModal() {
    $('#select-wallet-modal.modal').show();
    $('#wallet-connect-options').show();
}

function callContractObj(chainId) {
    let web3 = new Web3(_chains_web3[chainId].rpcUrls[0]);
    return new web3.eth.Contract(
        _contracts_web3.abis.media,
        _contracts_web3.addresses[chainId].media
    );
}

function mailTimer(timeleft) {
    let downloadTimer = setInterval(function () {
        timeleft--;
        $('#resendMail').html(
            `<span>Resend in <span id="mailTimer"></span></span>`
        );
        $('#mailTimer').text(`${timeleft}`);
        $('#resendMail').prop('aria-disabled', true);
        if (timeleft <= 0) {
            $('#mailTimer').text('');
            $('#resendMail').html(
                `<span>Resend <span id="mailTimer"></span></span>`
            );
            $('#resendMail').prop('aria-disable', false);
            $('#resendMail').removeAttr('style');

            clearInterval(downloadTimer);
        }
    }, 1000);
}

// gas fee
function generateTxObj(currentWeb3, fromAddress, estimateGas) {
    return new Promise(async (resolve, reject) => {
        try {
            let gasp = await currentWeb3.eth.getGasPrice();
            console.log('gasp: ', gasp);
            // return gasp;
            const sendObj = {
                from: fromAddress,
                gas: estimateGas,
            };

            dropdownchainid == 56
                ? (sendObj['gasPrice'] = gasp)
                : ((sendObj['maxFeePerGas'] = gasp),
                  (sendObj['maxPriorityFeePerGas'] = 0));

            console.log('sendObj: ', sendObj);
            resolve(sendObj);
        } catch (error) {
            reject(error);
        }
    });
}
