const {database,siteData,tableData} = require('../db/connect');

const cheerio = require('cheerio');
const request = require('request');

const showOverview = (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    console.log(url)
    request(url, loadOverview)

        // Callback for when the request is complete
    function loadOverview(error, response, body) {
        // Check for errors
        if (!error && response.statusCode == 200) {
            // The raw HTML is in body
            $ = cheerio.load(body)    
            
            let itemsA = $('a');
            let itemsLi = $('li');
            let itemsP = $('p');
            let itemsS = $('span');
            let itemsT = $('table');
            const reply ={
                url: url,
                links: itemsA.length,
                spans: itemsLi.length,
                paras: itemsP.length,
                lists: itemsS.length,
                tables: itemsT.length
            }

            if(reply){    
                //Registering the links and the results the database
                database.insert(reply)
                return res.status(200).json({success:true,data:reply})
            } else {
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}


const showHistory = (req,res) =>{
    database.find({},(err,data)=>{
        if(err){
            res.status(404).json({success:false,msg:'Something wrong with Database'})
        } else{
            const history = data.map(d => d.url)
            res.status(200).json({success:true,data:history})
        }
    })
}

const scrapePage = (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    console.log(url)
    request(url, getFullpage)

        // Callback for when the request is complete
    function getFullpage(error, response, body) {
        // Check for errors
        if (!error && response.statusCode == 200) {
            // The raw HTML is in body
            $ = cheerio.load(body)    
            
            let itemsA = $('a');
            let itemsLi = $('li');
            let itemsP = $('p');
            let itemsS = $('span');
            let parsedItemsA = [];
            let parsedItemsLi = [];
            let parsedItemsS = [];
            let parsedItemsP = [];
            itemsA.each((i, elem) => {
                parsedItemsA.push($(elem).attr('href'));
            });
            itemsLi.each((i, elem) => {
                parsedItemsLi.push($(elem).text());
            });
            itemsP.each((i, elem) => {
                parsedItemsP.push($(elem).text());
            });
            itemsS.each((i, elem) => {
                parsedItemsS.push($(elem).text());
            });
            const reply ={
                url: url,
                links: parsedItemsA,
                spans: parsedItemsS,
                paras: parsedItemsP,
                lists: parsedItemsLi,
            }

            if(reply){    
                //Registering the links and the results the database
                siteData.insert(reply)
                return res.status(200).json({success:true,data:reply})
            } else {
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}



cheerioTableParser = require('cheerio-tableparser');

const scrapeTableBody= (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    console.log(url)
    request(url, getFullpage)
        // Callback for when the request is complete
    function getFullpage(error, response, body) {
        // Check for errors
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body)
            cheerioTableParser($)
            const data = $('table').parsetable(true,true,true)
            console.log(data.length)
            const reply ={
                url: url,
                bodies: data
            }
            if(reply){
                tableData.insert(reply)
                res.json({success:true,pack:data})
            }else{
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}

const scrapeTester = (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    console.log(url)
    request(url, getFullpage)

        // Callback for when the request is complete
    function getFullpage(error, response, body) {
        // Check for errors
        if (!error && response.statusCode == 200) {
            // The raw HTML is in body
            $ = cheerio.load(body)    
            
            let itemBody = $('tbody>tr>td');
            let parsedBody = [];
            itemBody.each((i, elem) => {
                parsedBody.push($(elem).text());
            });
            const reply ={
                url: url,
                bodies: parsedBody
            }

            if(reply){
                tableData.insert(reply)
                return res.status(200).json({success:true,data:reply})
            } else {
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}

const collectSelectors = (req,res) =>{
    res.send('Collection Selectors.')
}

module.exports = {showOverview,showHistory,scrapePage,collectSelectors,scrapeTableBody,scrapeTester}