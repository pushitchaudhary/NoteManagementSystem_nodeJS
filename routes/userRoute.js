const { RenderDeleteBlog } = require('../controller/blog/blogController');
const { NotExist } = require('../controller/extra/extra');
const { RenderLoginPage1, RenderLoginPage2, RenderPasswordWrong, RenderAccountDelete, RenderRegisterPage, RenderEditProfile, PostUserRegisters, PostLogin, PostAccountDelete, PostUpdateProfile, logout, ForgetPassword, ResetYourPassword, identify_account, PostForgetPassword, PostIdentify_account, PostResetYourPassword, RenderOtpCode, PostRenderOtpCode, RenderNewPassword, PostNewPassword } = require('../controller/user/UserController');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const catchError = require('../services/catchError');

const router = require('express').Router();

router.route('/logout').get(logout)
router.route('/notexist').get(NotExist);   // if account register xhain vane
router.route('/deleteAccount/:id').get(isLoggedIn, RenderDeleteBlog)    // deleteAccount page ma jana ko lagi
router.route('/finalAccountDelete/:id').post(isLoggedIn, PostAccountDelete)     // Account Delete garn ko lagi
router.route('accountDeletedAlert').get(isLoggedIn, RenderAccountDelete)    // account delete alert

router.route('/forgetPassword').get(ForgetPassword).post(PostForgetPassword)
router.route('/resetYourPassword/:id').get(catchError(ResetYourPassword)).post(catchError(PostResetYourPasswor))
router.route('/identify_account/:id').get(catchError(identify_account)).post(catchError(PostIdentify_account)) 
router.route('/otpCode/:email').get(catchError(RenderOtpCode)).post(catchError(PostRenderOtpCode))
router.route('/newPassword').get(catchError(RenderNewPassword)).post(catchError(PostNewPassword))

router.route('/register').get(catchError(RenderRegisterPage)).post(catchError(PostUserRegisters))   // Register page ma jaan / Register garn
// router.route('/').get(RenderLoginPage1);    // login page ma jaan ko lagi method 1
router.route('/login').get(catchError(RenderLoginPage2)).post(catchError(PostLogin))   // login page ma jaan ko lagi method 2 
router.route('/editProfile/:userId').get(catchError(isLoggedIn), catchError(RenderEditProfile))     // Edit profile page kholna ko lagi
router.route('/updateProfile/:id').post(catchError(isLoggedIn),catchError(PostUpdateProfile))      // Profile Upadte garn ko lagi


module.exports = router;