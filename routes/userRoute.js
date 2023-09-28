const { RenderDeleteBlog } = require('../controller/blog/blogController');
const { NotExist } = require('../controller/extra/extra');
const { RenderLoginPage1, RenderLoginPage2, RenderPasswordWrong, RenderAccountDelete, RenderRegisterPage, RenderEditProfile, PostUserRegisters, PostLogin, PostAccountDelete, PostUpdateProfile } = require('../controller/user/UserController');


const router = require('express').Router();

router.route('/notexist').get(NotExist);   // if account register xhain vane
router.route('/deleteAccount/:id').get(RenderDeleteBlog)    // deleteAccount page ma jana ko lagi
router.route('/finalAccountDelete/:id').post(PostAccountDelete)     // Account Delete garn ko lagi
router.route('accountDeletedAlert').get(RenderAccountDelete)    // account delete alert

router.route('/register').get(RenderRegisterPage).post(PostUserRegisters)   // Register page ma jaan / Register garn
router.route('/').get(RenderLoginPage1);    // login page ma jaan ko lagi method 1
router.route('/login').get(RenderLoginPage2).post(PostLogin)   // login page ma jaan ko lagi method 2 
router.route('/passwordWrong').get(RenderPasswordWrong)     // if password wrong xha vane
router.route('/editProfile/:userId').get(RenderEditProfile)     // Edit profile page kholna ko lagi
router.route('/updateProfile/:id').post(PostUpdateProfile)      // Profile Upadte garn ko lagi


module.exports = router;