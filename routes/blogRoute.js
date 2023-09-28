const { RenderCreateBlog, PostCreateBlog, RenderEditBlog, PostEditBlog, renderHomePage, RenderSingleBlog, RenderBlogDelete } = require('../controller/blog/blogController');
const { RenderAllLink } = require('../controller/extra/extra');
const { isLoggedIn } = require('../middleware/isLoggedIn');

const router = require('express').Router();

router.route('/createBlog').get(isLoggedIn, RenderCreateBlog).post( isLoggedIn ,PostCreateBlog)
router.route('/updateBlog/:id').get(RenderEditBlog).post(PostEditBlog)
router.route('/home').get(isLoggedIn, renderHomePage)   // home page ma jaan ko lagi
router.route('/singleBlog/:postId').get(RenderSingleBlog)   // single blog show garna ko lagi
router.route('/deleteBlog/:postNum').get(RenderBlogDelete) // post delete garna ko lagi
router.route('*').get(RenderAllLink)        // if user le wrong url haale ma


module.exports = router;