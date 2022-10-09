const express = require('express')
const router = express.Router()

const {showOverview,showHistory,scrapePage,collectSelectors,scrapeTableBody,scrapeTester} = require('../controller/actors')

router.route('/').get(showOverview)
router.route('/showLinks').get(showHistory)
router.route('/scrape').get(scrapePage)
router.route('/getTable').get(scrapeTableBody)
router.route('/collect').get(collectSelectors)
router.route('/test').get(scrapeTester)

module.exports = router