const {database,siteData,tableData} = require('../db/connect');

const cheerio = require('cheerio');
const request = require('request');


const urlCorrector = (url) =>{
    const urlFilter = new RegExp("^(http:\/\/|https:\/\/)?(www\.)?([a-zA-Z0-9-_\.]+\.[a-zA-Z]+)")
    const matcher = url.match(urlFilter)[3]
    // console.log(matcher)
    const builtURL = `http://www.${matcher}`
    return builtURL
}

const showOverview = (req,res) =>{
    // console.log(req.query.url)
    const url = req.query.url;
    // Execute the HTTP Request
    // console.log(url)
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
    // console.log(url)
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
    // console.log(url)
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

// const idCollector = (text)=>{
//     let collector = /<[a-z]+[^>]+id\s*=\s*['"]([^'"]+)['"][^>]*>/g
//     var locRes = collector.exec(text);
//     var ids = [];
    
//     while(locRes != null){
//         ids.push(locRes[1])
//         locRes = collector.exec(text)
//     }
//     return ids
// }

// const classCollector = (text)=>{
//     let collector = /<[a-z]+[^>]+class\s*=\s*['"]([^'"]+)['"][^>]*>/gm
//     var locRes = collector.exec(text);
//     var ids = [];
    
//     while(locRes != null){
//         ids.push(locRes[1])
//         locRes = collector.exec(text)
//     }
//     return ids
// }

const scrapeTester = (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    console.log(url)
    request(url, getFullpage)

        // Callback for when the request is complete
    function getFullpage(error, response, body) {
        // Check for errors
        // console.log(body)
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body)

            let items = $('*');
            let classes = []
            let ids = []
            for (let ite of items){
                let tem = $(ite).attr()
                if(tem.class != undefined){
                    classes.push(tem.class)
                }
                if(tem.id != undefined){
                    ids.push(tem.id)
                }
            }

            if(classes && ids){
                return res.status(200).json({success:true,classes:classes,ids:ids})
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