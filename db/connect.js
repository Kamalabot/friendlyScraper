const Datastore = require('nedb');

const database = new Datastore('scraperFriendly.db')
const siteData = new Datastore('siteFullData.db')
const tableData = new Datastore('siteTableData.db')
const selectorsData = new Datastore('siteSelectorsData.db')
const textDatabase = new Datastore('textOnlyData.db')

database.loadDatabase();
siteData.loadDatabase();    
tableData.loadDatabase();
selectorsData.loadDatabase();
textDatabase.loadDatabase();

module.exports = {database,siteData,tableData,selectorsData,textDatabase}   