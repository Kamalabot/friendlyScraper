//buttons
var showLink, scrape, getPages

//data show areas
var dataOut, textOut, elemOut, elementOutHead

//User inputs

var spans, lists, links, paras, tables, link, listLinks

//Parents and children
var tagTypes, textIds, divIds

//checkboxes
var checkBoxes, callBacks

//id="" class="pa2 ma2"

function setup(){
    noCanvas()
    //buttons
    showLink = select('#showLink')
    scrape = select('#scrape')
    getPages = select('#getPages')

    //data areas
    dataOut = select('#dataOut')
    textOut = select('#textOut')
    elemOut = select('#elemOut')
    listLinks = select('#listLinks')

    showLink.mouseClicked(getOverview)
    scrape.mouseClicked(getFullpage)
    getPages.mouseClicked(listingLinks)

    divIds = ['chlk','chsp','chpa','chli','chtb','chid','chcl']
    textIds = ['lk','sp','pa','li','tb','ids','cls']
    tagTypes = ['Links','Spans','Paras','Lists','Tables','Ids','Classes']

    for(let ids of divIds){
        createDataElement('div','',ids,'ma2 pa2 tl f3 tc','elemOut','visible')
    }
    
    callBacks = [linksChecked,spanChecked,paraChecked,listChecked,tableChecked,idsChecked,classesChecked]
    checkBoxes = [];
    for(let i = 0; i <= divIds.length - 1;i++){
        // console.log(tagTypes[i],divIds[i])
        checkBoxes.push(createCheckbox(tagTypes[i], false).parent(divIds[i]).hide())
    }

    for(let i = 0; i <= divIds.length - 1;i++){
        // console.log(checkBoxes[i],callBacks[i])
        checkBoxes[i].changed(callBacks[i])
    }

}

function listingLinks(){
    var urls = select('#urls').value()
    var splitUrls = urls.split(',')
    var buttonId = 0;
    var buttons = []
    
    for (let l in splitUrls){
        let nameButton = `Link-${l}`
        let newTextButton = new textButton('button',nameButton,`button${buttonId}`,"pa2 ma2","linkList",l,"textOut")
        textButton.makeButton()
        textButton.attachCaller()
        buttons.push(newTextButton)
        //buttons.push(createDataElement())
    }

}

class textButton{
    constructor(elt, text, id, className, parentId, urlLink, outputId){
        this.elt = elt;
        this.text = text;
        this.id = id;
        this.className = className;
        this.parentId = parentId;
        this.urlLink = urlLink;
        this.outputId = outputId;
        
    }
    makeButton(){
        let parentElement = document.getElementById(this.parentId);
        let htmlbuilt = `<${this.elt} id="${this.id}" class="${this.className}" visibility="visible">${this.text}</${this.elt}>`;
        parentElement.innerHTML += htmlbuilt
    }
    attachCaller(){        
        let currentButton = document.getElementById(this.id);
        currentButton.addEventListener('click', function(){
            console.log(`logging from ${this.text}`)
            let builtURL = `/api/v1/extractText?url=${this.urlLink}`
            let outPutArea = document.getElementById(this.outputId)
            loadJSON(builtURL, (data)=>{
                print(data.data)
                outPutArea.html(data.data)
            })
        })
    }
}

function createDataElement(elt, text, id, className, parentId, visibility){
    let parentElement = document.getElementById(parentId);
    let htmlbuilt = `<${elt} id="${id}" class="${className}" visibility="${visibility}">${text}</${elt}>`;
    parentElement.innerHTML += htmlbuilt
}

function createInputElement(type, name, featureName, id, className, parentId, visibility, value){
    let parentElement = document.getElementById(parentId);
    let htmlbuilt = `<input type="${type}" id="${id}" visibility="${visibility}" name="${name}">
        <label for="${name}" class="${className}">${featureName}</label>`;
    parentElement.innerHTML += htmlbuilt
}

function idsChecked(){
    //print('Id yes sir...')
    link = select('#linkScrape').value()   
    if(checkBoxes[5].checked()){
        let URL = `/api/v1/collect/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data.data['ids']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('idpr')
            createElement('h3').parent('idpr').html('Following are Ids in the page')
            for(let ids of dataArray){
                createElement('span').parent('idpr').class('pa2 f4 fl').html(ids)
            }
        })
    } else {
        textOut.html('')
    }

}
function classesChecked(){
    //console.log('Class iruken')
    link = select('#linkScrape').value()   
    if(checkBoxes[6].checked()){
        let URL = `/api/v1/collect/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data.data['classes']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('clpr')
            createElement('h3').parent('clpr').html('Following are the Classes in the Page')
            for(let cl of dataArray){
                createElement('span').parent('clpr').class('pa2 f4 fl').html(cl)
            }
        })
    } else {
        textOut.html('')
    }
}

function getOverview(){
    
    link = select('#linkScrape').value()   
    
    if(link){
        let builtURL = `/api/v1/?url=${link}`
        loadJSON(builtURL, (data)=>{
            print(data.data)
            dataOut.html('')
            for(let i = 0; i <= textIds.length - 1;i++){
                console.log(tagTypes[i].toLowerCase())
                createDataElement('div','',textIds[i],'pa2 tc','dataOut','visible')
                createDataElement('h4',tagTypes[i],'','pa2 tc',textIds[i],'visible')
                createP(data.data[tagTypes[i].toLowerCase()]).parent(textIds[i])
            }

        })
    }else{
        dataOut.html('')
        createDataElement('p','`Please provide the link`','','pa2 tc','dataOut','visible')
        // createElement('p').parent('dataOut').html(`Please provide the link`)
    }
}

function getFullpage(){
    link = select('#linkScrape').value()   
    
    if(link){
        let builtURL = `/api/v1/scrape?url=${link}`
        let tableURL = `/api/v1/getTable?url=${link}`
        //Much of the page is scraped, 
        loadJSON(builtURL, (data)=>{            
            checkBoxes.slice(0,4).map(d => d.show())
        })
        //except the table is scraped here
        loadJSON(tableURL,(data)=>{
            checkBoxes.slice(4,7).map(d => d.show())
        })

    }else{
        dataOut.html('')
        createElement('p').parent('dataOut').html(`Please provide the link`)
    }
}   

function spanChecked(){
    link = select('#linkScrape').value()   
    if(checkBoxes[1].checked()){
        let URL = `/api/v1/loadSpans/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data['spans']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('sppr')
            createElement('h3').parent('sppr').html('Following are span elements')
            for(let sp of dataArray){
                createElement('span').parent('sppr').class('pa2 f4 fl').html(sp)
            }
        })
    } else {
        textOut.html('')
    }
}
function listChecked(){
    link = select('#linkScrape').value()   
    if(checkBoxes[3].checked()){
        let URL = `/api/v1/loadLists/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data['lists']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('lipr')
            createElement('h3').parent('lipr').html('Following are List elements')

            for(let li of dataArray){
                createElement('span').parent('lipr').class('pa2 f4 fl').html(li)
            }

        })
    }else {
        textOut.html('')
    }
}
function paraChecked(){
    link = select('#linkScrape').value()   
    if(checkBoxes[2].checked()){
        let URL = `/api/v1/loadParas/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data['paras']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('papr')
            createElement('h3').parent('papr').html('Following are Para elements')

            for(let pa of dataArray){
                createElement('div').parent('papr').class('pa2 f4 fl').html(pa)
            }
        })
    }else {
        textOut.html('')
    }
}

function tableChecked(){
    link = select('#linkScrape').value()   
    if(checkBoxes[4].checked()){
        let URL = `/api/v1/loadTables/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data['bodies']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('tapr')
            createElement('h3').parent('tapr').html('Following are part of Table')
            for(let ta of dataArray){
                createElement('div').parent('tapr').class('pa2 f4 fl').html(ta)
            }
        })
    }else {
        textOut.html('')
    }
}
function linksChecked(){
    link = select('#linkScrape').value()   
    if(checkBoxes[0].checked()){
        let URL = `/api/v1/loadLinks/?url=${link}`
        print(URL)
        loadJSON(URL, (data)=>{
            const dataArray = data['links']
            createElement('div').parent('textOut').class('pa2 f4 fl').id('lkpr')
            createElement('h3').parent('lkpr').html('Following are link elements')

            for(let lk of dataArray){
                createElement('div').parent('textOut').class('pa2 f4 fl').html(lk)
            }
        })
    }else {
        textOut.html('')
    }
}
