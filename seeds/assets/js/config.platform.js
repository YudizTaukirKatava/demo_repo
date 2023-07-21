const _PLATFORM_NAME = 'NFT Talent';

const _platform_config = {
    dev: {
        api_base_url: 'http://localhost:3000/api/v1',
        supported_chain_ids: [97, 5, 43113, 80001], //TODO: 1, 56, 137, 43114 mainnet
        supported_chain_names: [
            'Binance Smart Chain - Testnet',
            'Goerli - Testnet',
            'Avalanche fuji - Testnet',
            'Mumbai - Testnet',
        ], //TODO: change name for mainnet
        default_chain_id: 97,
        sIpfsUri: 'https://ipfs.filebase.io/ipfs/',
        sS3Location:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts/',
        sS3ThumbLocation:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts_thumb/',
        network: {
            97: {
                name: 'BSC',
            },
            80001: {
                name: 'Matic',
            },
            5: {
                name: 'Goerli',
            },
            43113: {
                name: 'Avalanche',
            },
        },
    },
    testing: {
        api_base_url: 'http://localhost:3001/api/v1',
        supported_chain_ids: [97, 5, 43113, 80001], //TODO: 1, 56, 137, 43114 mainnet
        supported_chain_names: [
            'Binance Smart Chain - Testnet',
            'Goerli - Testnet',
            'Avalanche fuji - Testnet',
            'Mumbai - Testnet',
        ], //TODO: change name for mainnet
        default_chain_id: 97,
        sIpfsUri: 'https://ipfs.filebase.io/ipfs/',
        sS3Location:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts/',
        sS3ThumbLocation:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts_thumb/',
        network: {
            97: {
                name: 'BSC',
            },
            80001: {
                name: 'Matic',
            },
            5: {
                name: 'Goerli',
            },
            43113: {
                name: 'Avalanche',
            },
        },
    },
    stag: {
        api_base_url: 'https://demo.nftiz.biz:6014/api/v1',
        supported_chain_ids: [97, 5, 43113, 80001], //TODO: 1, 56, 137, 43114 mainnet
        supported_chain_names: [
            'Binance Smart Chain - Testnet',
            'Goerli - Testnet',
            'Avalanche fuji - Testnet',
            'Mumbai - Testnet',
        ], //TODO: change name for mainnet
        default_chain_id: 97,
        sIpfsUri: 'https://ipfs.filebase.io/ipfs/',
        sS3Location:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts/',
        sS3ThumbLocation:
            'https://yudiz-blockchain.s3.amazonaws.com/nft-talent/nfts_thumb/',
        network: {
            97: {
                name: 'BSC',
            },
            80001: {
                name: 'Matic',
            },
            5: {
                name: 'Goerli',
            },
            43113: {
                name: 'Avalanche',
            },
        },
    },
    prod: {
        api_base_url: 'https://api.nfttalent.io/api/v1',
        supported_chain_ids: [1, 56, 137, 43114],
        supported_chain_names: [
            'Ethereum',
            'Binance Smart Chain',
            'Polygon',
            'Avalanche c chain',
        ],
        default_chain_id: 56,
        sIpfsUri: 'https://ipfs.filebase.io/ipfs/',
        sS3Location:
            'https://nfttalent-s3-bucket.s3.eu-south-1.amazonaws.com/nfts/',
        sS3ThumbLocation:
            'https://nfttalent-s3-bucket.s3.eu-south-1.amazonaws.com/nfts_thumb/',
        network: {
            1: {
                name: 'Ethereum',
            },
            56: {
                name: 'BSC',
            },
            137: {
                name: 'Polygon',
            },
            43114: {
                name: 'Avalanche',
            },
        },
    },
};

const _SIGN_MSG = `Welcome to ${_PLATFORM_NAME}!\n\nClick to sign and accept the ${_PLATFORM_NAME}'s Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:`;
