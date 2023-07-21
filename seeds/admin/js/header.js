let bIsValidAccountSelected = true;
let bIsValidNetworkSelected = true;
// let sToken = localStorage.getItem('AuthorizationAdmin');
let nChainId;
let adminEarning;

let oContract;

if (window.ethereum) {
    window.ethereum.on('accountsChanged', function () {
        console.log(provider);
        window.location.reload();
    });
}

$('#redeemPoints').keyup(function () {
    if (adminEarning < $('#redeemPoints').val()) {
        $('#redeemPoints').val(adminEarning);
    }
});
$(async () => {
    let sUserName = localStorage.getItem('sUserNameAdmin');
    $('#profileusername').html(sUserName);

    let sProfilePicUrl = localStorage.getItem('sProfilePicUrlAdmin');
    if (sProfilePicUrl) $('#admin-profile-picture').attr('src', sProfilePicUrl);

    if (!window.ethereum || !window.ethereum.networkVersion) {
        return;
    }
    nChainId = await web3.eth.getChainId();

    console.log({ nChainId });

    oContract = await contractObject(nChainId);

    $(`#selectWithChains option[value=${nChainId}]`).attr(
        'selected',
        'selected'
    );
    $('[data-id="selectWithChains"]').attr(
        'title',
        $('#selectWithChains :selected').text()
    );
    $('[data-id="selectWithChains"]')
        .children()
        .children()
        .children()
        .html($('#selectWithChains :selected').text());

    if (!localStorage.getItem('adminWalletAddress')) {
        $('#btn-admin-disconnect').hide();
        $('#btn-admin-connect').show();
    } else {
        $('#btn-admin-disconnect').show();
        $('#btn-admin-connect').hide();
    }
});

async function updateHeader() {
    let ChainId = await web3.eth.getChainId();
    if (!_SUPPORTED_CHAINS.includes(Number(ChainId))) {
        const switch_res = await _service_web3.switchNetworkMetamask(
            web3.utils.toHex(_DEFAULT_CHAIN)
        );

        if (switch_res === 'add_network') {
            await _service_web3.addNetworkMetamask(_DEFAULT_CHAIN);
        }
    }

    if (_SUPPORTED_CHAINS.includes(Number(nChainId))) {
        oContract = await contractObject(nChainId);
        loadRedeemablePoints();
        return;
    } else {
        return;
    }
}

$('#selectWithChains').on('change', async () => {
    if (!window.ethereum) {
        let ChainId = $('#selectWithChains').val();

        await setEarningData(ChainId);
        return;
    }
    nChainId = $('#selectWithChains').val();
    console.log(nChainId);

    const switch_res = await _service_web3.switchNetworkMetamask(
        web3.utils.toHex(nChainId)
    );

    if (switch_res === 'add_network') {
        await _service_web3.addNetworkMetamask(nChainId);
    }
    oContract = await contractObject(nChainId);
    $('#redeemPoints').val(' ');

    await loadRedeemablePoints();

    return;
});

async function connectMetamaskAdmin(nChainId) {
    try {
        if (!window.ethereum) {
            throw 'Metamask not found!';
        }

        web3 = new Web3(window.ethereum);

        // Get connected chain id from Ethereum node
        // const chainId = await web3.eth.getChainId();

        if (!_SUPPORTED_CHAINS.includes(Number(nChainId))) {
            const switch_res = await _service_web3.switchNetworkMetamask(
                web3.utils.toHex(_DEFAULT_CHAIN)
            );

            if (switch_res === 'add_network') {
                await _service_web3.addNetworkMetamask(_DEFAULT_CHAIN);
            }
        }

        // Get connected chain id from Ethereum node
        // const chainIdAgain = await web3.eth.getChainId();

        // if (!_SUPPORTED_CHAINS.includes(Number(chainIdAgain))) {
        //     throw `Only ${_SUPPORTED_CHAINS_NAMES.toString()} netwroks are supported!<br/> Switch the network to access our platform.`;
        // }

        const aAddresses = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        if (!aAddresses || !aAddresses[0]) throw new Error('No Account Found!');

        const sWalletAddress = aAddresses[0];
        if (
            sWalletAddress != window.localStorage.getItem('sWalletAddressAdmin')
        ) {
            notify('error', 'Incorrect wallet address selected!');
            return;
        }
        localStorage.setItem('adminWalletAddress', sWalletAddress);
        // $('#btn-admin-disconnect').show();
        // $('#btn-admin-connect').hide();
        let currencySymbol = _chains_web3[nChainId]?.nativeCurrency.symbol;
        // console.log(currencySymbol);

        oContract = await contractObject(nChainId);

        return;
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
}

async function logout() {
    try {
        let oResponse = await _helper.call_API(
            'POST',
            '/auth/logoutAdmin',
            {},
            { Authorization: sToken }
        );

        localStorage.removeItem('sWalletAddressAdmin');
        localStorage.removeItem('sUserIdAdmin');
        localStorage.removeItem('AuthorizationAdmin');
        localStorage.removeItem('sProfilePicUrlAdmin');
        localStorage.removeItem('isVerifiedAdmin');
        localStorage.removeItem('sUserNameAdmin');
        setTimeout(() => {
            window.location.href = '/a/signin';
        }, 1000);
        return notify('success', 'logout successfully');
    } catch (error) {
        window.location.href = '/a/signin';
        console.log('file: header.js ~ line 53 ~ logout ~ error', error);
    }
}

$('#logoutAdmin').on('click', logout);

async function loadRedeemablePoints() {
    let aAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
    let sAccount = aAccounts[0];
    let nChainId = await web3.eth.getChainId();
    let currencySymbol = _chains_web3[nChainId]?.nativeCurrency.symbol;

    if (localStorage.getItem('sWalletAddressAdmin') != sAccount) {
        $('#txtRedeemablePoints').text(0 + ' ' + currencySymbol);
        $('#redeemPoints').prop('disabled', true);
        $('#btnRedeem').html('Redeem').prop('disabled', true);
        return;
    }

    let nUserEarnings = await oContract.methods
        .viewMyPoints()
        .call({ from: sAccount });

    let nAmountInEther = Web3.utils.fromWei(nUserEarnings, 'ether');
    $('#txtRedeemablePoints').text(nAmountInEther + ' ' + currencySymbol);
    console.log(nAmountInEther);
    adminEarning = nAmountInEther;

    if (nAmountInEther <= 0) {
        $('#redeemPoints').prop('disabled', true);
        $('#btnRedeem').html('Redeem').prop('disabled', true);
    } else {
        $('#redeemPoints').prop('disabled', false);
        $('#btnRedeem').html('Redeem').prop('disabled', false);
    }
}

$('#btnRedeem').on('click', async () => {
    if (!window.ethereum) {
        return notify('error', 'metamask is not installed');
    }

    $('#btnRedeem').html('Redeem').prop('disabled', true);
    $('#btnRedeem')
        .html("<div class='spinner-border spinner-border-sm'></div>")
        .prop('disabled', true);

    let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length == 0) {
        await connectMetamaskAdmin(nChainId);
    }

    $('#lblAmountError').addClass('d-none');
    $('#btnRedeem')
        .html("<div class='spinner-border spinner-border-sm'></div>")
        .prop('disabled', true);

    let aAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('aAccounts', aAccounts);
    let sAccount = aAccounts[0];
    console.log('sAccount : ', sAccount);

    let estimatedGas;

    try {
        estimatedGas = await oContract.methods
            .redeem(_helper.toWei($('#redeemPoints').val()))
            .estimateGas({ from: sAccount });
    } catch (error) {
        $('#btnRedeem').html('Redeem').prop('disabled', false);
        notify('error',error)
        return;
    }
    const sendObj = await generateTxObj(web3, sWalletAddress, estimatedGas);

    await oContract.methods
        .redeem(_helper.toWei($('#redeemPoints').val()))
        .send(sendObj)
        .then((receipt) => {
            console.log(receipt);
            notify('success', 'Redeemed Points Successfully!');
            setInterval(() => {
                location.reload();
            }, 1000);
        })
        .catch((error) => {
            console.log(error);
            $('#btnRedeem').html('Redeem').prop('disabled', false);
            if (error.code == 4001)
                notify('error', 'You Denied Transaction Request!');
            else notify('error', 'Something Went Wrong!');
        });
});

async function disconnectAdmin() {
    localStorage.removeItem('adminWalletAddress');
    $('#btn-admin-disconnect').hide();
    $('#btn-admin-connect').show();
}

$('#myearnings').on('shown.bs.modal', async function () {
    if (!window.ethereum) {
        $(`#selectWithChains option[value=${97}]`).attr('selected', 'selected');
        $('[data-id="selectWithChains"]').attr(
            'title',
            $('#selectWithChains :selected').text()
        );
        $('[data-id="selectWithChains"]')
            .children()
            .children()
            .children()
            .html($('#selectWithChains :selected').text());
        await setEarningData(97);
        return;
    }
    let nChainId = await web3.eth.getChainId();
    oContract = await contractObject(nChainId);
    // let adminWalletAddress = localStorage.getItem('adminWalletAddress');

    // if (adminWalletAddress == null) {
    //     $('#connectError').text('Please connect metamask first');
    //     $('#connectError').removeClass('d-none');
    // } else {
    $('#connectError').addClass('d-none');
    loadRedeemablePoints(); // TODO: check
    // }
});

/* handle 401 ajax */
$(document).ajaxComplete(function (event, xhr, settings) {
    if (xhr.status === 401) {
        console.log('Login in first');
        // localStorage.clear();
        // window.location.href = '/a/signin';
    }
});

async function setEarningData(chainId) {
    web3 = await new Web3(
        new Web3.providers.HttpProvider(_chains_web3[chainId].rpcUrls[0])
    );

    let oContractObject = new web3.eth.Contract(
        _contracts_web3.abis.media,
        _contracts_web3.addresses[chainId].media
    );

    let currencySymbol = _chains_web3[chainId]?.nativeCurrency.symbol;

    let nUserEarnings = await oContractObject.methods
        .viewMyPoints()
        .call({ from: localStorage.getItem('sWalletAddressAdmin') });

    let nAmountInEther = Web3.utils.fromWei(nUserEarnings, 'ether');
    $('#txtRedeemablePoints').text(nAmountInEther + ' ' + currencySymbol);
}

function formatDate(date) {
    return moment(date).format('DD MMM YYYY hh:mm a');
}
