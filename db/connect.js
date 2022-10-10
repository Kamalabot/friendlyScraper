const Datastore = require('nedb');

const database = new Datastore('scraperFriendly.db')
const siteData = new Datastore('siteFullData.db')
const tableData = new Datastore('siteTableData.db')
const selectorsData = new Datastore('siteSelectorsData.db')

database.loadDatabase();
siteData.loadDatabase();    
tableData.loadDatabase();
selectorsData.loadDatabase();

module.exports = {database,siteData,tableData,selectorsData}   