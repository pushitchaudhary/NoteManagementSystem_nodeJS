const { RenderError } = require('../controller/extra/extra');
const { isLoggedIn } = require('../middleware/isLoggedIn');

const router = require('express').Router();


router.route('/error404').get(isLoggedIn, RenderError)      // page not found ko lagi

module.exports = router;