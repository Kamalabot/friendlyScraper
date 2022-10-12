/*
1. Provide the link of the webpage
2. Show the number of Links of Images, Videos and other pages, Lists, Headings, Paragraphs, and Tables in that page are shown.
3. If requested then some number of the above parts of the websites are populated 
4. Classes and Ids used in the tags are shown
5. Option to filter the text data through the tags, classes and Ids are provided. 
6. The cheerio command to scrape using the above selectors are provided. 
*/

const express = require('express');
const app = express()

//controllers and models
const routes = require('./routes/routes')

//middlewares
app.use(express.static('./public'))  //provides the static page
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1', routes)

app.listen(5000,()=>{
    console.log("listening on port 5000...")
})