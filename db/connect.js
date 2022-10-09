const Datastore = require('nedb');

const database = new Datastore('scraperFriendly.db')
const siteData = new Datastore('siteFullData.db')
const tableData = new Datastore('siteTableData.db')

database.loadDatabase();
siteData.loadDatabase();    
tableData.loadDatabase();

module.exports = {database,siteData,tableData}   