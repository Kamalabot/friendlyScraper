const {database,siteData,tableData,selectorsData,textDatabase} = require('../db/connect');

const cheerio = require('cheerio');
const request = require('request');
const axios = require('axios')
cheerioTableParser = require('cheerio-tableparser');
const fs = require('fs')


const urlCorrector = (url) =>{
    const urlFilter = new RegExp("^(http:\/\/|https:\/\/)?(www\.)?([a-zA-Z0-9-_\.]+\.[a-zA-Z]+)")
    const matcher = url.match(urlFilter)[3]
    // console.log(matcher)
    const builtURL = `http://www.${matcher}`
    return builtURL
}

const urlExtractor =  async (url) => {
    // Fetch HTML of the page we want to scrape
    try{
        const { data } = await axios.get(url);
    
        const textData = processHtml(data);
        
        const regex = /(?<=\s)[\w/\-\_]+(?=\s*)/g;
    
        const processedText = [];

        var locRes = regex.exec(textData);
    
        while(locRes != null){
            processedText.push(locRes[0])
            locRes = regex.exec(textData)
        }
        console.log(processedText)
        let joinedText = processedText.join(' ');
    
        return joinedText
     
    } catch(error){

        return error
    }

}


const textExtractorErr =  async (req,res) => {

    console.log(req.body)
    const url = req.body.url
    
    const processUrl = url.split(',');
    const fullTextData = [];

    for(let url of processUrl){

        try{
            const { data } = await urlExtractor(url)
            fullTextData.push(data)
        } catch (error) {
            return res.status(404).json({success:false, msg:`${url} created error. Aborting.`})
        }
    }
    let writeToFile = JSON.stringify(fullTextData)
    var fileTime = Date.now()
    var fileName = `textData${fileTime}.txt`

    fs.writeFile(fileName,writeToFile,'utf8',(err) => {
        if (err) throw err;
        return res.status(404).json({success:false, msg:`Failed at writing file to drive`})
    });    
    return res.status(200).json({success:`${fileName} has been written`,data:writeToFile})
}


function processHtml(textData){
    let htmlReg = "(?<=(\s))<\w+>(?=(\s))|<(?<=<)[^<>]+(?=>)>|<(?<=<)\/[^><]+(?=>)>|<>|<|>|(?<=(\s))>\w+(?=(\s))|(?<=(\s))<\w+(?=(\s))|[\b.,?]\s{2,}|\b\s{2,}|(?<=>)\s+(?=<)"
    let regEx = new RegExp(htmlReg,'g')
    //initiating replace 
    return textData.replace(regEx,'')
}

const textExtractor = (req,res) =>{
    const url = req.query.url;
    // Check if data already available
    textDatabase.find({'url':url}, (err, data)=>{
        console.log(data)
        if(err || data.length == 0){
            request(url, getTextOnly)
            // res.status(404).json({success:false,msg:'Something wrong with Database'})
        } else{
            const reply ={
                url: data[0].url,
                text: data[0].text
            }
            // const history = data.map(d => d.url)
            return res.status(200).json({success:true,data:reply})
        }
        
    })
        // Callback for when the request is complete
    function getTextOnly(error, response, body) {
        // Check for errors
        if (!error && response.statusCode == 200) {
            
            const textData = processHtml(body);
            
            const regex = /(?<=\s)[\w/\-\_]+(?=\s*)/g;
        
            const processedText = [];

            var locRes = regex.exec(textData);
        
            while(locRes != null){
                processedText.push(locRes[0])
                locRes = regex.exec(textData)
            }
            
            let joinedText = processedText.join(' ');
    
            const reply ={
                url: url,
                text: joinedText,
            }

            if(reply){    
                //Registering the links and the results the database
                textDatabase.insert(reply)
                return res.status(200).json({success:true,data:reply})
            } else {
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}

const showOverview = (req,res) =>{
    // console.log(req.query.url)
    const url = req.query.url;
    // Check if data already available
    database.find({'url':url}, (err, data)=>{
        if(err || data.length == 0){
            request(url, loadOverview)
            // res.status(404).json({success:false,msg:'Something wrong with Database'})
        } else{
            const reply ={
                url: data[0].url,
                links: data[0].links,
                spans: data[0].spans,
                paras: data[0].paras,
                lists: data[0].lists,
                tables: data[0].tables
            }
            // const history = data.map(d => d.url)
            return res.status(200).json({success:true,data:reply})
        }
        
    })
    
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
    // Check if data already available
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
    // Check if data already available
    siteData.find({'url':url}, (err, data)=>{
        console.log(data)
        if(err || data.length == 0){
            request(url, getFullpage)
            // res.status(404).json({success:false,msg:'Something wrong with Database'})
        } else{
            const reply ={
                url: data[0].url,
                links: data[0].links,
                spans: data[0].spans,
                paras: data[0].paras,
                lists: data[0].lists
            }
            // const history = data.map(d => d.url)
            return res.status(200).json({success:true,data:reply})
        }
        
    })
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

const scrapeTester = async (req,res) =>{
    const url = req.query.url;
    // Execute the HTTP Request
    // console.log(url)
    let options = {
        headers: { 'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1' }
    }
    const { data } = await axios.get(url,options);
    console.log(data)
    $ = cheerio.load(data);
    let itemsP = $("p");
    let paraItem = [];
    for (let p in itemsP){
        paraItem.push($(p).text())
    }
    console.log(paraItem)
    if(paraItem){
        let reply = {para:paraItem}
        return res.status(200).json({success:true,reply})
    } else{
        return res.status(404).json({success:false,msg:'Something went wrong'})
    }

}


const collectSelectors = (req,res) =>{
    const url = req.query.url;
    // Check if data already available
    selectorsData.find({'url':url}, (err, data)=>{
        // console.log(data)
        if(err || data.length == 0){
            request(url, getFullpage)
            // res.status(404).json({success:false,msg:'Something wrong with Database'})
        } else{
            const reply ={
                url: data[0].url,
                classes: data[0].classes,
                ids: data[0].ids
            }
            // const history = data.map(d => d.url)
            return res.status(200).json({success:true,data:reply})
        }
        
    })    
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
                var reply = {url: url, classes:classes,ids:ids}
                selectorsData.insert(reply)
                return res.status(200).json({success:true,classes:classes,ids:ids})
            } else {
                return res.status(404).json({success:false,msg:'Something went wrong'})
            }
        }
    }
}

module.exports = {showOverview,showHistory,scrapePage,collectSelectors,scrapeTableBody,scrapeTester,textExtractor}