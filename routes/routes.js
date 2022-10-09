const express = require('express')
const router = express.Router()

const {showOverview,showHistory,scrapePage,collectSelectors} = require('../controller/actors')

router.route('/').get(showOverview)
router.route('/showLinks').get(showHistory)
router.route('/scrape').get(scrapePage)
router.route('/').get(collectSelectors)

module.exports = router