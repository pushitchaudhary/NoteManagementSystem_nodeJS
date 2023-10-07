const { RenderDeleteBlog } = require('../controller/blog/blogController');
const { NotExist } = require('../controller/extra/extra');
const { RenderLoginPage1, RenderLoginPage2, RenderPasswordWrong, RenderAccountDelete, RenderRegisterPage, RenderEditProfile, PostUserRegisters, PostLogin, PostAccountDelete, PostUpdateProfile, logout, ForgetPassword, ResetYourPassword, identify_account, PostForgetPassword } = require('../controller/user/UserController');
const { isLoggedIn } = require('../middleware/isLoggedIn');


const router = require('express').Router();

router.route('/logout').get(logout)
router.route('/notexist').get(NotExist);   // if account register xhain vane
router.route('/deleteAccount/:id').get(isLoggedIn, RenderDeleteBlog)    // deleteAccount page ma jana ko lagi
router.route('/finalAccountDelete/:id').post(isLoggedIn, PostAccountDelete)     // Account Delete garn ko lagi
router.route('accountDeletedAlert').get(isLoggedIn, RenderAccountDelete)    // account delete alert

router.route('/forgetPassword').get(ForgetPassword).post(PostForgetPassword)
router.route('/resetYourPassword').get(ResetYourPassword)
router.route('/identify_account').get(identify_account)   //-> kaam baki xha

router.route('/register').get(RenderRegisterPage).post(PostUserRegisters)   // Register page ma jaan / Register garn
router.route('/').get(RenderLoginPage1);    // login page ma jaan ko lagi method 1
router.route('/login').get(RenderLoginPage2).post(PostLogin)   // login page ma jaan ko lagi method 2 
router.route('/passwordWrong').get(RenderPasswordWrong)     // if password wrong xha vane
router.route('/editProfile/:userId').get(isLoggedIn, RenderEditProfile)     // Edit profile page kholna ko lagi
router.route('/updateProfile/:id').post(isLoggedIn, PostUpdateProfile)      // Profile Upadte garn ko lagi


module.exports = router;