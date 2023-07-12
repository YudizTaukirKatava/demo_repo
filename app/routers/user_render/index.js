const router = require('express').Router();
const userRenderController = require('./lib/controllers');

router.get('/', userRenderController.landing);
router.get('/editProfile', userRenderController.editProfile);
router.get('/wallet', userRenderController.wallet);
router.get('/explore-artworks', userRenderController.exploreArtwork);
router.get('/nft/:id', userRenderController.singleArtwork);
router.get('/create-nft', userRenderController.createNFT);
router.get('/explore-creators', userRenderController.exploreCreator);
router.get('/nft-drop', userRenderController.nftDrop);
router.get('/creator/:id', userRenderController.singleCreator);
router.get('/aboutus', userRenderController.aboutus);
router.get('/terms', userRenderController.terms);
router.get('/privacy-policy', userRenderController.privacyPolicy);
router.get('/faqs', userRenderController.faqs);
router.get('/explore-collections', userRenderController.exploreCollection);
router.get('/activity', userRenderController.activity);
router.get('/create-collection', userRenderController.createCollection);
router.get(
    '/collection/:oCollectionId',
    userRenderController.singleCollections
);
router.get('/verify', userRenderController.verifyEmail);
router.get('/assets', userRenderController.assets);
router.get('/contactUs', userRenderController.contactUs);
router.get('/favorite-nft', userRenderController.favoriteNft);
router.get('/trust-safety', userRenderController.trust);
router.get('/career', userRenderController.career);
router.get('/404', userRenderController.error404);
router.get('/500', userRenderController.error500);

module.exports = router;
