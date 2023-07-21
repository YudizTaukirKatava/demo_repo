const controllers = {};

const commonRenderer = (res, page) => {
    return res.render(page, {
        NODE_ENV: process.env.NODE_ENV,
        SITE_NAME: process.env.SITE_NAME,
    });
};

controllers.landing = (req, res) => {
    return commonRenderer(res, 'user/landing');
};

controllers.editProfile = (req, res) => {
    return commonRenderer(res, 'user/editProfile');
};

controllers.wallet = (req, res) => {
    return commonRenderer(res, 'user/wallet');
};

controllers.exploreArtwork = (req, res) => {
    return commonRenderer(res, 'user/explore-artworks');
};

controllers.singleArtwork = (req, res) => {
    return commonRenderer(res, 'user/single-artwork');
};

controllers.exploreCreator = (req, res) => {
    return commonRenderer(res, 'user/explore-creators');
};

controllers.singleCreator = (req, res) => {
    return commonRenderer(res, 'user/single-creator');
};

controllers.createNFT = (req, res) => {
    return commonRenderer(res, 'user/create-nft');
};

controllers.nftDrop = (req, res) => {
    return commonRenderer(res, 'user/nft-drop');
};

controllers.aboutus = (req, res) => {
    return commonRenderer(res, 'user/aboutus');
};

controllers.terms = (req, res) => {
    return commonRenderer(res, 'user/terms');
};

controllers.privacyPolicy = (req, res) => {
    return commonRenderer(res, 'user/privacy-policy');
};

controllers.faqs = (req, res) => {
    return commonRenderer(res, 'user/faqs');
};
controllers.exploreCollection = (req, res) => {
    return commonRenderer(res, 'user/explore-collections');
};

controllers.activity = (req, res) => {
    return commonRenderer(res, 'user/activity');
};

controllers.createCollection = (req, res) => {
    return commonRenderer(res, 'user/create-collection');
};

controllers.singleCollections = (req, res) => {
    return commonRenderer(res, 'user/single-collections');
};

controllers.verifyEmail = (req, res) => {
    return commonRenderer(res, 'user/verify-email');
};

controllers.assets = (req, res) => {
    return commonRenderer(res, 'user/assets');
};

controllers.contactUs = (req, res) => {
    return commonRenderer(res, 'user/contactUs');
};

controllers.favoriteNft = (req, res) => {
    return commonRenderer(res, 'user/favoriteNft');
};

controllers.error404 = (req, res) => {
    return commonRenderer(res, 'error/404');
};

controllers.error500 = (req, res) => {
    return commonRenderer(res, 'error/500');
};
controllers.trust = (req, res) => {
    return commonRenderer(res, 'user/trust-safety');
};
controllers.career = (req, res) => {
    return commonRenderer(res, 'user/career');
};
controllers.ambassadorProgram = (req, res) => {
    return commonRenderer(res, 'user/ambassador-program');
};

controllers.becomePartner = (req, res) => {
    return commonRenderer(res, 'user/become-partner');
};

module.exports = controllers;
