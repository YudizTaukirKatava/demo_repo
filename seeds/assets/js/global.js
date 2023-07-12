/*---------------------------------------------*
This file requires import of following js:
- config.platform.js
- contracts.web3.js
- notyf (cdn)

- also requires ___ENV___ variable
*----------------------------------------------*/

// disable logs
if (___ENV___ == 'prod') {
    console.log = () => {};
    console.warn = () => {};
}

// default chain
const _DEFAULT_CHAIN = _platform_config[___ENV___].default_chain_id;

// supported chain ids
const _SUPPORTED_CHAINS = _platform_config[___ENV___].supported_chain_ids;

// supported chain names
const _SUPPORTED_CHAINS_NAMES =
    _platform_config[___ENV___].supported_chain_names;

// setting global api url
const _API_BASE_URL = _platform_config[___ENV___].api_base_url;

let sToken = window.localStorage.getItem('Authorization');

if (!sToken) {
    sToken = window.localStorage.getItem('AuthorizationAdmin');
}

let hasInjectedWeb3 = false;

if (window.ethereum) {
    hasInjectedWeb3 = true;
}

let provider;

let isWalletConnectClick = false;

function initWalletConnect() {
    provider = new WalletConnectProvider.default({
        rpc: {
            97: 'https://data-seed-prebsc-2-s1.binance.org:8545',
            5: 'https://endpoints.omniatech.io/v1/eth/goerli/public',
            43113: 'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
            80001: 'https://rpc.ankr.com/polygon_mumbai',
        },
        infuraId: '233f4d3fbc1a44dcbbbfc1621a75f9ed',
    });
}
initWalletConnect();

let web3;

async function logoutUser() {
    try {
        let sToken = localStorage.getItem('Authorization');
        if (localStorage.getItem('sWalletAddress')) {
            const data = await _helper.call_API(
                'POST',
                '/auth/logout',
                {},
                { Authorization: sToken }
            );

            if (localStorage.getItem('isWalletConnect') == 'true') {
                await provider.disconnect();
            }

            localStorage.clear();
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        notify('error', error);
    }
}

async function initwallet() {
    try {
        // for metamask only
        if (hasInjectedWeb3 && !localStorage.getItem('isWalletConnect')) {
            // console.log('in metamask');
            web3 = new Web3(window.ethereum);
            _service_web3.setWeb3Events(logoutUser);
        }

        // for walletconnect only
        if (localStorage.getItem('isWalletConnect') == 'true') {
            // console.log('in wallet connect');
            await provider.enable();
            web3 = new Web3(provider);
            _service_web3.setWeb3Events(logoutUser, provider);
        }
    } catch (e) {
        // no metamask (injected)
        console.log(e);
    }
}
initwallet();

let sWalletAddress;

/* notification library */
const notyf = new Notyf({
    duration: 3000,
    types: [
        {
            type: 'success',
            background: '#24182f',
        },
        {
            type: 'error',
            background: '#2b2036',
            duration: 2000,
            dismissible: false,
        },
    ],
});

const aAllowedPaths = [
    '',
    '/a/signin',
    'nft',
    'collection',
    'wallet',
    'explore-artworks',
    'explore-creators',
    'explore-collections',
    'creator',
    'a/aboutus',
    'faqs',
    'aboutus',
    'nft-drop',
    'terms',
    'error404',
    '/a/forgotPassword',
    '/a/resetPassword',
    'favorite-nft',
    'assets',
    'verify',
    'contactUs',
    'activity',
    'privacy-policy',
    '404',
    '/a/createNft',
    '/a/nft',
    'trust-safety',
    'career',
];

const allActivityIcons = {
    Bid: {
        icon: '/assets/img/bid-placed.png',
        message: 'have Placed a Bid on',
        notification_text: 'Bid Received',
    },
    'Auction Cancelled': {
        icon: '/assets/img/auction-cancel.png',
        message: 'have Cancelled Auction on',
    },
    'Sale Cancelled': {
        icon: '/assets/img/sale-cancel.png',
        message: 'have Cancelled Sale on',
    },
    'Bid Accepted': {
        icon: '/assets/img/bid-accepted.png',
        message: 'have Accepted Bid on',
        notification_text: 'Bid Accepted',
    },
    Sold: {
        icon: '/assets/img/nft-sold.png',
        message: 'have Bought',
        notification_text: 'NFT Sold',
    },
    'Bid Rejected': {
        icon: '/assets/img/bid-reject.png',
        message: 'have Rejected Bid of',
        notification_text: 'Bid Rejected',
    },
    'Bid Withdrawn': {
        icon: '/assets/img/bid-withdraw.png',
        message: 'have Withdrawn Bid on',
        notification_text: 'Bid Withdrawn',
    },
    'On Sale': {
        icon: '/assets/img/for-sale.png',
        message: 'have Put Sale on',
    },
    'On Auction': {
        icon: '/assets/img/bid-auction.png',
        message: 'have Put Auction on',
    },
    'Timed Auction': {
        icon: '/assets/img/bid-auction.png',
        message: 'have Put Auction on',
    },
    Mint: {
        icon: '/assets/img/nft-mint.png',
        message: 'have Minted',
    },
    Like: {
        icon: '/assets/img/liked.png',
        message: 'liked your NFT.',
    },
    Follow: {
        icon: '/assets/img/follow.png',
        message: 'started following you.',
    },
    Follower: {
        icon: '/assets/img/follow.png',
        message: '',
    },
    Claimed: {
        icon: '/assets/img/nft-sold.png',
        message: '',
        notification_text: 'NFT Claimed',
    },
    Earning: {
        icon: '/assets/img/nft-sold.png',
        message: '',
        notification_text: 'Refer earning earned',
    },
};
