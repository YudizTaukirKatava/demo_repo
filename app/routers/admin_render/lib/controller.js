const controllers = {};

const commonRenderer = (res, page) => {
    return res.render(page, {
        NODE_ENV: process.env.NODE_ENV,
        SITE_NAME: process.env.SITE_NAME,
    });
};

controllers.dashboard = (req, res) => {
    return commonRenderer(res, 'admin/dashboard');
};

controllers.profile = (req, res) => {
    return commonRenderer(res, 'admin/profile');
};

controllers.users = (req, res) => {
    return commonRenderer(res, 'admin/users');
};

controllers.nfts = (req, res) => {
    return commonRenderer(res, 'admin/nfts');
};

controllers.transactions = (req, res) => {
    return commonRenderer(res, 'admin/transactions');
};

controllers.signin = (req, res) => {
    return commonRenderer(res, 'admin/signin');
};

controllers.forgotPassword = (req, res) => {
    return commonRenderer(res, 'admin/forgotPassword');
};

controllers.commission = (req, res) => {
    return commonRenderer(res, 'admin/commission');
};

controllers.newsLetterPage = (req, res) => {
    return commonRenderer(res, 'admin/NewsLetterPage');
};

controllers.categories = (req, res) => {
    return commonRenderer(res, 'admin/categories');
};

controllers.collection = (req, res) => {
    return commonRenderer(res, 'admin/collection');
};

controllers.collectionManagement = (req, res) => {
    return commonRenderer(res, 'admin/collection-management');
};

controllers.aboutus = (req, res) => {
    return commonRenderer(res, 'admin/aboutus');
};

controllers.terms = (req, res) => {
    return commonRenderer(res, 'admin/terms');
};

controllers.faqs = (req, res) => {
    return commonRenderer(res, 'admin/faqs');
};

controllers.composeMail = (req, res) => {
    return commonRenderer(res, 'admin/composeMail');
};

controllers.changePassword = (req, res) => {
    return commonRenderer(res, 'admin/changePassword');
};

controllers.resetPassword = (req, res) => {
    return commonRenderer(res, 'admin/resetPassword');
};

controllers.expire = (req, res) => {
    return commonRenderer(res, 'error/token_expire');
};

controllers.createNft = (req, res) => {
    return commonRenderer(res, 'admin/create-nft');
};
controllers.nftDetail = (req, res) => {
    return commonRenderer(res, 'admin/nft-detail');
};
controllers.adminCollection = (req, res) => {
    return commonRenderer(res, 'admin/adminExploreCollection');
};

controllers.singleCollection = (req, res) => {
    return commonRenderer(res, 'admin/singleCollection');
};

controllers.exploreArtwork = (req, res) => {
    return commonRenderer(res, 'admin/explore-artworks');
};

module.exports = controllers;
