const { RenderError } = require('../controller/extra/extra');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const catchError = require('../services/catchError');

const router = require('express').Router();


router.route('/error404').get(catchError(isLoggedIn), catchError(RenderError))     // page not found ko lagi

module.exports = router;