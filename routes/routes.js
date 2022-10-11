const express = require('express')
const router = express.Router()

const {showOverview,showHistory,scrapePage,collectSelectors,scrapeTableBody,scrapeTester, textExtractor} = require('../controller/actors')
const {loadTables,loadSpans,loadParas,loadLists,loadLinks} = require('../controller/receptors')


//Data Collecting routes
router.route('/').get(showOverview)
router.route('/showLinks').get(showHistory)
router.route('/scrape').get(scrapePage)
router.route('/getTable').get(scrapeTableBody)
router.route('/collect').get(collectSelectors)
router.route('/extractText').post(textExtractor)

//Data or web scraping  Testing Routes
router.route('/test').get(scrapeTester)

//Data delivery to Front End

router.route('/loadLinks').get(loadLinks)
router.route('/loadLists').get(loadLists)
router.route('/loadParas').get(loadParas)
router.route('/loadSpans').get(loadSpans)
router.route('/loadTables').get(loadTables)
// router.route('/showDBLinks')

module.exports = router