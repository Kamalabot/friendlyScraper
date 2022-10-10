//buttons
var showLink, scrape

//data show areas
var dataOut, textOut, elemOut, elementOutHead

//User inputs

var spans, lists, links, paras, tables

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

    var divIds = ['chlk','chsp','chpa','chli','chtb']
    for(let ids of divIds){
        createDataElement('div','',ids,'ma2 pa2 tl f3 tc','elemOut','visible')
    }
    // createElement('div').parent('elemOut').id('chlk').class('pa2 tl f3')
    // createElement('div').parent('elemOut').id('chsp').class('pa2 tl f3')
    // createElement('div').parent('elemOut').id('chpa').class('pa2 tl f3')
    // createElement('div').parent('elemOut').id('chli').class('pa2 tl f3')
    // createElement('div').parent('elemOut').id('chtb').class('pa2 tl f3')
    var tagTypes = ['Links','Spans','Paras','Lists','Tables']
    
    var callBacks = [linksChecked,spanChecked,paraChecked,listChecked,tableChecked]
    var checkBoxes = [];
    for(let i = 0; i <= divIds.length - 1;i++){
        console.log(tagTypes[i],divIds[i])
        checkBoxes.push(createCheckbox(tagTypes[i], false).parent(divIds[i]).hide())
    }

    for(let i = 0; i <= divIds.length - 1;i++){
        // console.log(checkBoxes[i],callBacks[i])
        checkBoxes[i].changed(callBacks[i])
    }
    // // spans = createCheckbox('Spans', false).parent('chsp').hide();
    // spans.changed();
    
    // // paras = createCheckbox('Paras', false).parent('chpa').hide();
    // paras.changed();
    
    // // lists = createCheckbox('Lists', false).parent('chli').hide();
    // lists.changed();

    // // tables = createCheckbox('Tables', false).parent('chtb').hide();
    // tables.changed();

    // // links = createCheckbox('Links', false).parent('chlk').hide();
    // links.changed();
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



function getOverview(){
    
    link = select('#linkScrape').value()   
    
    if(link){
        let builtURL = `/api/v1/?url=${link}`
        loadJSON(builtURL, (data)=>{
            dataOut.html('')
            createElement('div').parent('dataOut').id('lk').class('pa2 tc')
            createElement('h4').parent('lk').html('Links')
            createP(data.data['links']).parent('lk')
            
            createElement('div').parent('dataOut').id('pr').class('pa2 tc')
            createElement('h4').parent('pr').html('Paras')
            createP(data.data['paras']).parent('pr')
            
            createElement('div').parent('dataOut').id('li').class('pa2 tc')
            createElement('h4').parent('li').html('Lists')
            createP(data.data['lists']).parent('li')

            createElement('div').parent('dataOut').id('sp').class('pa2 tc')
            createElement('h4').parent('sp').html('Spans')
            createP(data.data['spans']).parent('sp')

            createElement('div').parent('dataOut').id('tb').class('pa2 tc')
            createElement('h4').parent('tb').html('Tables')
            createP(data.data['tables']).parent('tb')
        })
    }else{
        dataOut.html('')
        createElement('p').parent('dataOut').html(`Please provide the link`)
    }
}

function getFullpage(){
    link = select('#linkScrape').value()   
    
    if(link){
        let builtURL = `/api/v1/scrape?url=${link}`
        let tableURL = `/api/v1/getTable?url=${link}`
        //Much of the page is scraped, 
        loadJSON(builtURL, (data)=>{            
            links.show()
            lists.show()
            spans.show()
            paras.show()
        })
        //except the table is scraped here
        loadJSON(tableURL,(data)=>{
            tables.show()
        })

    }else{
        dataOut.html('')
        createElement('p').parent('dataOut').html(`Please provide the link`)
    }
}   

function spanChecked(){
    link = select('#linkScrape').value()   
    if(spans.checked()){
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
    if(lists.checked()){
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
    if(paras.checked()){
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
    if(tables.checked()){
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
    if(links.checked()){
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
