let earnings;
let isNotificationLoaded = false;
let hasUnreadNotification = false;
let sReferralCode;
$(async () => {
    let sWalletAddress = localStorage.getItem('sWalletAddress');
    let sAuthorization = localStorage.getItem('Authorization');
    let oMediaContractAddress;
    // checkChain();
    if (!sAuthorization) {
        $('#nav-connect-wallet-btn').show();
        $('.create-btn').hide();
        $('#notification').hide();
    } else {
        // if (!(await ethereum._metamask.isUnlocked())) {
        //     localStorage.clear();
        //     window.location.reload();
        // }

        updateNavbar(sWalletAddress);

        $('#refer-friend, #refer-friend-sb').click(function () {
            $('.icon-close').click();
            $('#refer-friend-modal').show();
            $('#referral-code').text(sReferralCode);
        });

        $('#copy-refer-btn').on('click', function () {
            copyDataToClipBoard(sReferralCode);
        });
    }
    $('#ticket-support, #ticket-support-sb').click(function () {
        console.log('ticket-support clicked');
        $('.icon-close').click();
        $('#raise-ticket-modal').show();
    });

    $('.click-open3').click(function (e) {
        $('.click-event3').toggleClass('displayblock');
        $('.click-event2').removeClass('displayblock');
        $('.click-event1').removeClass('displayblock');
        e.stopPropagation();
    });

    $('.close-icn').on('click', function (e) {
        e.preventDefault();
        $(this).parents().find('.modal').hide();
    });

    // $('.click-event3').click(function (e) {
    //     e.stopPropagation();
    // });

    $(document).click(function () {
        $('.click-event3').removeClass('displayblock');
        $('.notification-list-otr').removeClass('displayblock');
    });
    $('.notification-list-otr').click(function (e) {
        e.stopPropagation();
    });
    $('.notification-otr a').click(function (e) {
        $('.notification-list-otr').toggleClass('displayblock');
        $('.click-event1').removeClass('displayblock');
        $('.click-event2').removeClass('displayblock');
        $('.click-event3').removeClass('displayblock');
        e.stopPropagation();
    });

    $('.click-open3').click(function () {
        $('.notification-list-otr').removeClass('displayblock');
    });
    $('.click-open2').click(function () {
        $('.click-event2').toggleClass('displayblock');
        $('.click-event3').removeClass('displayblock');
        $('.click-event1').removeClass('displayblock');
        $('.notification-list-otr').removeClass('displayblock');
    });
    $('.click-open1').click(function () {
        $('.click-event1').toggleClass('displayblock');
        $('.click-event2').removeClass('displayblock');
        $('.click-event3').removeClass('displayblock');
        $('.notification-list-otr').removeClass('displayblock');
    });
    $('.burger-click').click(function () {
        $('.click-event1').removeClass('displayblock');
        $('.click-event2').removeClass('displayblock');
        $('.click-event3').removeClass('displayblock');
        $('.notification-list-otr').removeClass('displayblock');
    });

    $('.user-disconnect').on('click', logoutUser);

    let sBlockchainHtml = '';
    for (let index = 0; index < _SUPPORTED_CHAINS.length; index++) {
        sBlockchainHtml += `<li value="${_SUPPORTED_CHAINS[index]}" class="select-dropdown__list-item">
                            ${_SUPPORTED_CHAINS_NAMES[index]}
                        </li>`;
    }

    $('#chainList').append(sBlockchainHtml);
    $('.my-earnings').on('click', async function () {
        $('.icon-close').click();

        if (!localStorage.getItem('sWalletAddress')) {
            notify('error', 'Please connect wallet to see your earnings');
            return;
        }

        $('.claim-earnings-modal.modal').show();
        // let earningsWei;
    });
    $('#amount').keyup(function () {
        if (earnings < $('#amount').val()) {
            $('#amount').val(earnings);
        }
    });

    $('#claim-amt').click(async function () {
        $('#err').remove();
        const chainId = await web3.eth.getChainId();
        const itemValue = $('.select-dropdown__button').val();
        if (!itemValue) {
            $('#error').append(`<p class="validation" id="err">
                Please select chain
            </p>`);
        }

        oMediaContractAddress = contractObject(itemValue);
        if ($('#amount').val() <= earnings && $('#amount').val() > 0) {
            $('#claim-amt')
                .html("<div class='spinner-border spinner-border-sm'></div>")
                .prop('disabled', true);
            try {
                if (Number(chainId) !== Number(itemValue)) {
                    console.log('inside');
                    await switchAddNetwork(itemValue);
                }
            } catch (error) {
                console.log(error);
                $('#claim-amt').text('Claim').prop('disabled', false);
                return notify('error', error.message);
            }
            let amount = _helper.toWei($('#amount').val());
            let estimatedGas;
            try {
                estimatedGas = await oMediaContractAddress.methods
                    .redeem(amount)
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
                notify(
                    'error',
                    oErrorJSON.message.replace(
                        'execution reverted: Market: ',
                        ''
                    )
                );
                $('#claim-amt').text('Claim').prop('disabled', false);
                return;
            }

            oMediaContractAddress.methods
                .redeem(amount)
                .send({
                    from: sWalletAddress,
                    gas: estimatedGas,
                })
                .once('transactionHash', (data) => {
                    console.log('Transaction Hash ', data);
                    notify('success', 'Transaction has been initiated');
                })
                .on('receipt', (receipt) => {
                    console.log('Transaction Receipt', receipt);
                    $('#claim-amt').text('Claim').prop('disabled', false);
                    window.location.reload();
                    notify('success', 'Earning successfully redeemed');
                })
                .catch((error) => {
                    $('#claim-amt').text('Claim').prop('disabled', false);
                    notify('error', 'Please approve the transaction');
                    console.log(error);
                });
        } else {
            $('#error').append(`<p class="validation" id="err">
                Please enter valid value!
            </p>`);
        }

        $('body').css('overflow', 'hidden auto');
    });

    let dropdownId = '';
    $('#select-chain .select-dropdown__button').on('click', function () {
        dropdownId = $(this).parent().attr('id');
        $('#' + dropdownId + ' .select-dropdown__list').toggleClass('active');
    });
    $('#chainList li').on('click', async function () {
        let sWalletAddress = localStorage.getItem('sWalletAddress');
        let itemValue = $(this).val();

        $('#' + dropdownId + ' .select-dropdown__button span')
            .text($(this).text())
            .parent()
            .attr('value', itemValue);
        $(document).removeClass('active');

        oMediaContractAddress = callContractObj(itemValue);

        try {
            let nUserBalance = await oMediaContractAddress.methods
                .viewMyPoints()
                .call({ from: sWalletAddress });
            earnings = web3.utils.fromWei(nUserBalance, 'ether');
            $('#earning').text(
                `${earnings} ${_chains_web3[itemValue].nativeCurrency.symbol}`
            );
            $('#currency-symbol').text(
                _chains_web3[itemValue].nativeCurrency.symbol
            );
        } catch (error) {
            console.log(error);
            notify('error', 'Something went wrong please try again');
        }
    });

    $('#claim-close, #refer-close, #raise-ticket-close').click(function () {
        $(
            '#claim-earnings-modal, #raise-ticket-modal, #refer-friend-modal'
        ).hide();
        $('body').css('overflow', 'hidden auto');
    });
    $('#nav-connect-wallet-btn').on('click', function () {
        $('.icon-close').click();

        $('#select-wallet-modal.modal').show();
        $('#wallet-connect-options').show();
    });
    // $('#copyAddress').on('click', () => {
    //     copyDataToClipBoard(sWalletAddress);
    // });
    $('.logo-otr').tilt({
        maxTilt: 25,
        glare: false,
    });
});

async function searchData() {
    try {
        let oSearchText = $('#searchBar').val();
        console.log(oSearchText);
        let dataToAppend;
        if (oSearchText) {
            new Headers().set('searchData', oSearchText);
            window.location.replace(
                '/assets?q=' + encodeURIComponent(oSearchText)
            );
            return notify('success', 'Data Found');
        }
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
}

$('#searchBar, #searchBarMobile').keydown(async function (e) {
    if (e.key === 'Enter') {
        console.log(e.target.value);
        let oSearchText = e.target.value;
        console.log(oSearchText);
        if (oSearchText) {
            new Headers().set('searchData', oSearchText);
            window.location.replace(
                '/assets?q=' + encodeURIComponent(oSearchText)
            );
        }
        // event.preventDefault();
        // searchDataMobile();
    }
});

async function createNFT() {
    window.location.replace('/create-nft');
}

async function updateNavbar(sWalletAddress) {
    // console.log(web3);
    //

    sReferralCode = localStorage.getItem('sReferralCode');
    const subStringAddress = _helper.trimEthereumAddress(sWalletAddress, 7);
    const nWalletBalance = await web3.eth.getBalance(sWalletAddress);
    const nBalance = web3.utils.fromWei(nWalletBalance.toString(), 'ether');
    let nChainId = await web3.eth.getChainId();
    let currencySymbol = _chains_web3[nChainId]?.nativeCurrency.symbol;
    let nFormatedBalance;
    if (_validator.isInteger(Number(nBalance))) {
        nFormatedBalance = nBalance;
    } else {
        const nFormatedBalanceArray = nBalance.toString().split('.');
        nFormatedBalance = `${
            nFormatedBalanceArray[0] +
            '.' +
            nFormatedBalanceArray[1].substring(0, 3)
        }`;
    }

    // mobile sidebar
    $('#myNav .mobile-profile').show();

    // other common
    $('.create-btn').show();
    $('#notification').show();
    $('#walletConnection').hide();
    $('#connect-wallet-sidebar').hide();

    $('.user-bal').text(`${nFormatedBalance} ${currencySymbol}`);
    $('#nav-currency-logo').attr('src', `/assets/img/${nChainId}.svg`);

    $('.profile-pic').attr(
        'src',
        window.localStorage.getItem('sProfilePicUrl')
    );

    if (window.localStorage.getItem('isVerified') == 'true') {
        $('.user-verified').show();
    }

    $('.user-name').text(window.localStorage.getItem('sUserName') || '');

    $('.user-addr').text(subStringAddress);

    $('#copy-address-header, #copy-address').on('click', function () {
        copyDataToClipBoard(sWalletAddress);
    });

    $('.user-profile').attr(
        'href',
        `/creator/${window.localStorage.getItem('_id')}`
    );

    $('#nav-connect-wallet-btn').next().show();

    $('.user-disconnect').show();

    // console.log('referral code: ', sReferralCode);

    // $('#copy-refer-btn').click(function () {
    //     copyDataToClipBoard(sReferralCode);
    // });

    // load notifications
    if (!isNotificationLoaded) {
        notification();
    }
}

// ===========Sticky Header===========

const body = document.body;

const nav = document.querySelector('.main-hero .hero-main-inr .nav-otr');

const scrollUp = 'scroll-up';
const scrollDown = 'scroll-down';
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
        body.classList.remove(scrollUp);
        return;
    }

    if (
        currentScroll > lastScroll + 1.5 &&
        !body.classList.contains(scrollDown)
    ) {
        // down
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);
    } else if (
        currentScroll < lastScroll &&
        body.classList.contains(scrollDown)
    ) {
        // up
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
    }
    lastScroll = currentScroll;
});

function mover(e, p, c, n) {
    const currentValue = $(`#${c}`).val();
    if ((currentValue.length == 1 && n != '') || e.key == 'ArrowRight') {
        $(`#${n}`).focus();
    }
    if (e.key == 'ArrowLeft' || e.key == 'Backspace') {
        $(`#${p}`).focus();
    }
}

$(() => {
    $(document).on('input', "input[name='digits']", function (e) {
        var text = $(this).val();
        if (text.length == 4) {
            for (let i = 1; i <= text.length; i++) {
                $('#char' + i).val(text[i - 1]);
            }
        } else if (text.length > 1) {
            $(this).val(text[0]);
        }
    });
});

$('#raise-btn').on('click', raiseTicket);

async function raiseTicket() {
    try {
        let sTitle = $('#ticket-title').val();
        let sDescription = $('#ticket-desc').val();

        $('#raise-btn')
            .html("<div class='spinner-border spinner-border-sm'></div>")
            .prop('disabled', true);

        const raiseTicket = await _helper.call_API_v2(
            'POST',
            '/user/raise-ticket',
            { sTitle, sDescription },
            { Authorization: window.localStorage.getItem('Authorization') }
        );

        console.log('raiseTicket: ', raiseTicket);

        notify('success', raiseTicket.message);

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#raise-btn').html('Raise').prop('disabled', false);
    }
}

async function markAsReadNotification() {
    try {
        if ($('#notification-list-otr').hasClass('displayblock')) {
            $('#notification-list p').addClass('noti-text-read');
        }

        if (hasUnreadNotification) {
            await _helper.call_API_v2(
                'PATCH',
                '/user/notification/mark-as-read',
                {},
                { Authorization: window.localStorage.getItem('Authorization') }
            );
            hasUnreadNotification = false;
        }
    } catch (error) {
        // no error notify
        console.log(error);
    }
}

$('#notification').on('click', function () {
    $('#notification .noti-alert').hide();
    markAsReadNotification();
});

$(document).on('click', function () {
    // markAsReadNotification();
});

async function notification() {
    try {
        const oNotification = await _helper.call_API_v2(
            'GET',
            '/user/notification',
            {},
            { Authorization: window.localStorage.getItem('Authorization') }
        );

        isNotificationLoaded = true;

        let notifications = oNotification.data;

        let allNotifications = ``;

        let showPink = false;

        notifications.forEach((transaction) => {
            let sTransactionHash = transaction.transaction.sTransactionHash;
            let notificationType =
                allActivityIcons[transaction.transaction.eBidStatus]
                    .notification_text;
            let bViewed = 'noti-text-read';

            if (!transaction.bViewed) {
                hasUnreadNotification = true;
                $('#notification .noti-alert').show();
                showPink = true;
                bViewed = '';
            }

            allNotifications += `
            ${_helper.generateHtmlFromEJS(_card_templates.notification, {
                notificationType,
                imageUrl: `/nft/${transaction.transaction.nft._id}`,
                sImage: `${_platform_config[___ENV___].sS3Location}${transaction.transaction.nft.sImageHash}`,
                activityDate: moment(transaction.dCreatedAt).fromNow(),
                txLink: `${
                    _chains_web3[transaction.transaction.nft.nChainId]
                        .blockExplorerUrls[0]
                }/tx/${sTransactionHash}`,
                bViewed,
            })}`;
        });

        if (notifications.length) {
            $('#notification-list').html(allNotifications);
        }
    } catch (error) {
        console.log(error);
    }
}

$(document).on('scroll', function () {
    $('#notification-list-otr').removeClass('displayblock');
});
