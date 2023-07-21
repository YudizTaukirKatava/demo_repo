const router = require('express').Router();
const adminRenderController = require('./lib/controller');

router.get('/signin', adminRenderController.signin);
router.get('/forgotPassword', adminRenderController.forgotPassword);
router.get('/dashboard', adminRenderController.dashboard);
router.get('/profile', adminRenderController.profile);
router.get('/users', adminRenderController.users);
router.get('/nfts', adminRenderController.nfts);
router.get('/transactions', adminRenderController.transactions);
router.get('/commission', adminRenderController.commission);
router.get('/NewsLetterPage', adminRenderController.newsLetterPage);
router.get('/categories', adminRenderController.categories);
router.get('/collection', adminRenderController.collection);
router.get(
    '/collectionManagememnt',
    adminRenderController.collectionManagement
);
router.get('/aboutus', adminRenderController.aboutus);
router.get('/terms', adminRenderController.terms);
router.get('/faqs', adminRenderController.faqs);
router.get('/composeMail', adminRenderController.composeMail);
router.get('/resetPassword', adminRenderController.resetPassword);
router.get('/changePassword', adminRenderController.changePassword);
router.get('/admin-collection', adminRenderController.adminCollection);
router.get('/single-collection/:id', adminRenderController.singleCollection);

router.get('/expire', adminRenderController.expire);
router.get('/createNft', adminRenderController.createNft);
router.get('/nft/:id', adminRenderController.nftDetail);
router.get('/explore-artworks', adminRenderController.exploreArtwork);

module.exports = router;
