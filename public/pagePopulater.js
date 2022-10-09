//buttons
var showLink, scrape, 

//data show areas
var dataOut, textOut, elemOut

//User inputs

var link, span, list, links, paras, tables

function setup(){
    noCanvas()
    //buttons
    showLink = select('#showLink')
    scrape = select('#scrape')

    //data areas
    dataOut = select('#dataOut')
    textOut = select('#textOut')
    elemOut = select('#elemOut')

    showLink.mouseClicked(getOverview)
    scrape.mouseClicked(getFullpage)

    span = createCheckbox
}


function getOverview(){
    
    link = select('#linkScrape').value()   
    
    if(itemRet){
        loadJSON('/allPrice', (data)=>{
        var price = data[itemRet]
        pricePrint.html(`The price of ${itemRet} is ${price}`)
        })
    }else{
        pricePrint.html(`Enter a Valid Item, or price unavailable`)
    }
}