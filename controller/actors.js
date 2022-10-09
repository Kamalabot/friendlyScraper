const Datastore = require('nedb')
var database = new Datastore
database.loadDatabase('scraperFriendly.db')

const showOverview = (req,res) =>{
    res.send('Showing Overview.')
}

const showHistory = (req,res) =>{
    res.send('Showing History.')
}

const scrapePage = (req,res) =>{
    res.send('Scraping pages.')
}

const collectSelectors = (req,res) =>{
    res.send('Collection Selectors.')
}

module.exports = {showOverview,showHistory,scrapePage,collectSelectors}