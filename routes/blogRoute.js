const { RenderCreateBlog, PostCreateBlog, RenderEditBlog, PostEditBlog, renderHomePage, RenderSingleBlog, RenderBlogDelete } = require('../controller/blog/blogController');
const { RenderAllLink } = require('../controller/extra/extra');
const { isLoggedIn } = require('../middleware/isLoggedIn');

const router = require('express').Router();

// image liyauna ko lagi 
const { multer, storage } = require("../middleware/multerConfig");
const catchError = require('../services/catchError');
const upload = multer({ storage: storage });

router.route('/createBlog').get(catchError(isLoggedIn), catchError(RenderCreateBlog)).post(catchError(isLoggedIn),upload.single('image'), catchError(PostCreateBlog));
router.route('/updateBlog/:id').get(catchError(isLoggedIn) ,catchError(RenderEditBlog)).post(catchError(isLoggedIn), upload.single('image'), catchError(PostEditBlog))
router.route('/home').get(catchError(isLoggedIn), catchError(renderHomePage))   // home page ma jaan ko lagi
router.route('/singleBlog/:postId').get(catchError(isLoggedIn), catchError(RenderSingleBlog))   // single blog show garna ko lagi
router.route('/deleteBlog/:postNum').get(catchError(isLoggedIn), catchError(RenderBlogDelete)) // post delete garna ko lagi
router.route('*').get(catchError(RenderAllLink))        // if user le wrong url haale ma


module.exports = router;