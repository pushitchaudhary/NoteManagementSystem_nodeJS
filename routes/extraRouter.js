const { RenderError } = require('../controller/extra/extra');

const router = require('express').Router();


router.route('/error404').get(RenderError)      // page not found ko lagi

module.exports = router;