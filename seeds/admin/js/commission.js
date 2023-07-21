let nCommissionPercentage;
let nReferalReward;
let nRefereeReward;

$(async () => {
    if (!window.ethereum || !window.ethereum.networkVersion) {
        $(`#selectWithChain option[value=${97}]`).attr('selected', 'selected');
        $('[data-id="selectWithChain"]').attr(
            'title',
            $('#selectWithChain :selected').text()
        );
        $('[data-id="selectWithChain"]')
            .children()
            .children()
            .children()
            .html($('#selectWithChain :selected').text());

        await setData(97);

        return;
    }

    const chainId = await web3.eth.getChainId();

    $(`#selectWithChain option[value=${chainId}]`).attr('selected', 'selected');
    $('[data-id="selectWithChain"]').attr(
        'title',
        $('#selectWithChain :selected').text()
    );
    $('[data-id="selectWithChain"]')
        .children()
        .children()
        .children()
        .html($('#selectWithChain :selected').text());

    oContract = await contractObject(chainId);
    await updateCommision();

    if (!(await ethereum._metamask.isUnlocked())) {
        $('#commissionPercentage-error').html(
            'MetaMask Is Locked, Please Unlock It & Reload The Page To Connect!'
        );
        $('#commissionPercentage-error').css('display', 'block');
    }
});

$('#selectWithChain').on('change', async () => {
    if (!window.ethereum) {
        let ChainId = $('#selectWithChain').val();

        setData(ChainId);
        return;
    }
    nChainId = $('#selectWithChain').val();

    const switch_res = await _service_web3.switchNetworkMetamask(
        web3.utils.toHex(nChainId)
    );

    if (switch_res === 'add_network') {
        await _service_web3.addNetworkMetamask(nChainId);
    }
    oContract = await contractObject(nChainId);

    await updateCommision();

    return;
});

async function updateCommision() {
    let oContractMarket = await contractObjectMarket(nChainId);
    oContract = await contractObject(nChainId);

    nCommissionPercentage = await oContractMarket.methods.commission().call();
    nReferalReward = await oContractMarket.methods.referalReward().call();
    nRefereeReward = await oContractMarket.methods.refereeReward().call();

    $('#txtCommission').val(nCommissionPercentage / 100);
    $('#edit_referPercent').val(nRefereeReward / 100);
    $('#edit_referrelPercent').val(nReferalReward / 100);
}

$('#btnUpdatePercentage').on('click', async () => {
    try {
        if (!window.ethereum) {
            return notify('error', 'metamask is not installed');
        }
        $('#btnUpdatePercentage').html('Update').prop('disabled', true);
        $('#btnUpdatePercentage')
            .html("<div class='spinner-border spinner-border-sm'></div>")
            .prop('disabled', true);

        let accounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });
        if (accounts.length == 0) {
            await connectMetamaskAdmin(nChainId);
        }
        if (!(await ethereum._metamask.isUnlocked())) {
            $('#commissionPercentage-error').html(
                'MetaMask Is Locked, Please Unlock It & Reload The Page To Connect!'
            );
            $('#commissionPercentage-error').css('display', 'block');
            return;
        }
        if (accounts[0] != localStorage.getItem('sWalletAddressAdmin')) {
            $('#btnUpdatePercentage').html('Update').prop('disabled', false);
            return notify('error', 'Wrong metamask wallet connected');
        }
        if (!window.ethereum || !window.ethereum.networkVersion) {
            notify(
                'error',
                '<strong>Attention!</strong> MetaMask Not Found! Click & Install. <button class="btn btn-warning pull-center   btn-sm RbtnMargin" type="button" id="alert_btn"><a href="https://metamask.io/" target="_blank" style="color:Black;text-decoration: none !important;">Download MetaMask</a></button>'
            );
            return;
        }
        if (!bIsValidAccountSelected) {
            notify(
                'error',
                "You've selected Wrong Address in MetaMask! Please Select Your Address."
            );
            return;
        }
        if (!bIsValidNetworkSelected) {
            notify(
                'error',
                '<strong>Attention!</strong> Please connect MetaMask on <b>BSC TestNet</b> You are on ' +
                    sNetworkName +
                    '.'
            );
            return;
        }

        let commisionPercentage = $('#txtCommission').val().trim()
            ? parseInt($('#txtCommission').val().trim() * 100)
            : nCommissionPercentage;
        let referPercentage = $('#edit_referPercent').val().trim()
            ? parseInt($('#edit_referPercent').val().trim() * 100)
            : nReferalReward;
        let refreePercentage = $('#edit_referrelPercent').val().trim()
            ? parseInt($('#edit_referrelPercent').val().trim() * 100)
            : nRefereeReward;

        if (
            !$('#txtCommission').val().trim() &&
            !$('#edit_referPercent').val().trim() &&
            !$('#edit_referrelPercent').val().trim()
        ) {
            return notify('error', 'please enter percentage to update value');
        }

        if (
            commisionPercentage >= 10000 ||
            referPercentage >= 10000 ||
            refreePercentage >= 10000
        ) {
            return notify('error', 'commision must be less than 100%');
        }

        var sAccount;
        let aAccounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });

        if (!aAccounts) {
            notify('error', 'No Accounts Found!');
            $('#updateReferrel').html('Update').prop('disabled', false);
            return;
        }
        sAccount = aAccounts[0];
        let nEstimatedGas;

        try {
            nEstimatedGas = await oContract.methods
                .setCommisionAndReferReward(
                    commisionPercentage,
                    referPercentage,
                    refreePercentage
                )
                .estimateGas({
                    from: sAccount,
                });
        } catch (error) {
            console.log(error);
            let oErrorJSON = JSON.parse(
                error.message.substr(
                    error.message.indexOf('{'),
                    error.message.lastIndexOf('}')
                )
            );

            console.log(oErrorJSON);
            $('#btnUpdatePercentage').html('Update').prop('disabled', false);
            if (nChainId == 5) {
                notify(
                    'error',
                    oErrorJSON.originalError.message.replace(
                        'execution reverted: Media: ',
                        ''
                    )
                );
                return;
            }
            notify(
                'error',
                oErrorJSON.message.replace('execution reverted: Media: ', '')
            );
            return;
        }

        try {
            const sendObj = await generateTxObj(web3, sAccount, nEstimatedGas);

            await oContract.methods
                .setCommisionAndReferReward(
                    commisionPercentage,
                    referPercentage,
                    refreePercentage
                )
                .send(sendObj)
                .on('transactionHash', () => {
                    notify('success', 'Transaction is being processed');
                })
                .then((receipt) => {
                    notify('success', 'Platform fee updated');
                    $('#txtCommission').val(commisionPercentage / 100);
                    $('#edit_referPercent').val(referPercentage / 100);
                    $('#edit_referrelPercent').val(refreePercentage / 100);

                    $('#btnUpdatePercentage')
                        .html('Update')
                        .prop('disabled', false);
                })
                .catch((err) => {
                    console.log(err);
                    if (err.code == 4001) {
                        console.log('inside 4001');
                        notify('error', 'Transaction Signature Denied!');
                    } else {
                        console.log('inside else');
                        notify('error', 'Something Went Wrong!');
                    }
                    $('#btnUpdatePercentage')
                        .html('Update')
                        .prop('disabled', false);
                });
        } catch (error) {
            console.log(error);
            if (err.code == 4001) {
                console.log('inside 4001');
                notify('error', 'Transaction Signature Denied!');
            } else {
                console.log('inside else');
                notify('error', 'Something Went Wrong!');
            }
            $('#btnUpdatePercentage').html('Update').prop('disabled', false);
        }
    } catch (error) {
        console.log(error);
        return notify('error', error);
    }
});

async function setData(chainId) {
    let oWeb3 = await new Web3(
        new Web3.providers.HttpProvider(_chains_web3[chainId].rpcUrls[0])
    );
    let oContractObjectMarket = await new oWeb3.eth.Contract(
        _contracts_web3.abis.market,
        _contracts_web3.addresses[chainId].market
    );
    nCommissionPercentage = await oContractObjectMarket.methods
        .commission()
        .call();
    nReferalReward = await oContractObjectMarket.methods.referalReward().call();
    nRefereeReward = await oContractObjectMarket.methods.refereeReward().call();

    $('#txtCommission').val(nCommissionPercentage / 100);
    $('#edit_referPercent').val(nReferalReward / 100);
    $('#edit_referrelPercent').val(nRefereeReward / 100);
}
