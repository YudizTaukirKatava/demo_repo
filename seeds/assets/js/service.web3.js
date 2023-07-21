/*---------------------------------------------*
This file requires import of following js cdns:
- web3.js (v1.7.4)

- chains.web3.js
- config.platform.js
*----------------------------------------------*/

const _service_web3 = {};

_service_web3.connectMetamask = async function () {
    try {
        if (!window.ethereum) {
            throw 'Metamask not found!';
        }

        web3 = new Web3(window.ethereum);

        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();

        if (!_SUPPORTED_CHAINS.includes(Number(chainId))) {
            const switch_res = await _service_web3.switchNetworkMetamask(
                web3.utils.toHex(_DEFAULT_CHAIN)
            );

            if (switch_res === 'add_network') {
                await _service_web3.addNetworkMetamask(_DEFAULT_CHAIN);
            }
        }

        // Get connected chain id from Ethereum node
        const chainIdAgain = await web3.eth.getChainId();

        if (!_SUPPORTED_CHAINS.includes(Number(chainIdAgain))) {
            throw `Only ${_SUPPORTED_CHAINS_NAMES.toString()} netwroks are supported!<br/> Switch the network to access our platform.`;
        }

        const aAddresses = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });

        const sWalletAddress = aAddresses[0].toLowerCase();

        const sSignature = await _service_web3.signData(sWalletAddress);

        return {
            sWalletAddress,
            sSignature,
        };
    } catch (error) {
        throw error;
    }
};

_service_web3.addNetworkMetamask = function (chainId, provider) {
    return new Promise(function (resolve, reject) {
        provider
            .request({
                method: 'wallet_addEthereumChain',
                params: [_chains_web3[chainId]],
            })
            .then((d) => {
                return resolve(true);
            })
            .catch((e) => {
                return reject(e);
            });
    });
};

_service_web3.switchNetworkMetamask = function (
    chainId,
    provider = window.ethereum
) {
    return new Promise(function (resolve, reject) {
        provider
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            })
            .then((d) => {
                return resolve(true);
            })
            .catch((e) => {
                console.log(e);
                if (
                    e.code === 4902 ||
                    e.toString().indexOf('wallet_addEthereumChain') !== -1
                ) {
                    return resolve('add_network');
                }
                return reject(e);
            });
    });
};

_service_web3.signData = async function (address) {
    return new Promise(function (resolve, reject) {
        web3.eth.personal
            .sign(`${_SIGN_MSG}\n${address}`, address)
            .then((sign) => {
                resolve(sign);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

_service_web3.setWeb3Events = function (
    _logout_fun,
    provider = window.ethereum
) {
    provider.on('chainChanged', function (networkId) {
        if (!_SUPPORTED_CHAINS.includes(Number(networkId))) {
            _logout_fun();
        }
        if (localStorage.getItem('sWalletAddress')) {
            updateNavbar(localStorage.getItem('sWalletAddress'));
        } else if (localStorage.getItem('adminWalletAddress')) {
            updateHeader(localStorage.getItem('adminWalletAddress'));
            updateCommision();
        }
    });

    provider.on('accountsChanged', function (accounts) {
        if (
            !accounts.length ||
            (accounts.length &&
                localStorage.getItem('sWalletAddress') !==
                    accounts[0].toLowerCase())
        ) {
            _logout_fun();
        }
    });

    provider.on('disconnect', function (error, payload) {
        if (localStorage.getItem('isWalletConnect')) {
            _logout_fun();
        }
    });
};

_service_web3.connectTrustWallet = async function (provider) {
    //
    try {
        web3 = new Web3(provider);

        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();

        if (!_SUPPORTED_CHAINS.includes(Number(chainId))) {
            const switch_res = await _service_web3.switchNetworkMetamask(
                web3.utils.toHex(_DEFAULT_CHAIN),
                provider
            );

            if (switch_res === 'add_network') {
                await _service_web3.addNetworkMetamask(
                    _DEFAULT_CHAIN,
                    provider
                );
            }
        }

        // Get connected chain id from Ethereum node
        const chainIdAgain = await web3.eth.getChainId();

        if (!_SUPPORTED_CHAINS.includes(Number(chainIdAgain))) {
            throw `Only ${_SUPPORTED_CHAINS_NAMES.toString()} netwroks are supported!<br/> Switch the network to access our platform.`;
        }

        const aAddresses = await web3.eth.getAccounts();

        const sWalletAddress = aAddresses[0].toLowerCase();
        // console.log(sWalletAddress);

        const sSignature = await _service_web3.signData(sWalletAddress);

        return {
            sWalletAddress,
            sSignature,
        };
    } catch (error) {
        throw error;
    }
};
