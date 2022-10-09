var getFile, putext;
var askData, fileLoc,fileData


var itemIn, itemRet, setPriceB, priceIn, getPriceB,pricePrint,outComment;
var socket = io();
var chosenFileTxt;
socket.on('mouse',newDrawing);

var fileType;

function mousePressed(){
    background(150,25,255)
}

function mouseDragged(){
    fill(255,255,0)
    circle(mouseX, mouseY, 25);
    var data = {x:mouseX,y:mouseY};
    socket.emit('mouse',data)
}

function newDrawing(data){
    noStroke()
    fill(255,0,255)
    rect(data.x, data.y,25,35)
}

function setup(){
    var canv = createCanvas(400,400)
    .parent("canvas")
    background(150,25,255)
    loadJSON('/allPrice',gotData)
    outComment = select('#outCom')
    fileType = select('#filetype')
    setPriceB = select('#setPrice')

    getPriceB = select('#getPrice')
    pricePrint = select('#outPrice')

    setPriceB.mouseClicked(setPriceData)
    getPriceB.mouseClicked(getPriceData)
    getFile = select('#getFile')
    putext = select('#textArea')

    getFile.mouseClicked(loadFiles)

    askData = select('#askData');
    fileData = select('#fileData');
    fileLoc = select('#fileLoc')

    askData.mouseClicked(openAndSee)
}

async function loadFiles(){

    var fetchList = await fetch('listfile/')
    var listData = await fetchList.json();
    print(`This is fetch:${listData}`)

    var arrayFiles = Object.entries(listData)
    putext.html('')
    for(let elt of arrayFiles){
        createElement('span')
            .parent('textArea')
            .html(`${elt[0]} : ${elt[1]}`)
        createElement('br')
            .parent('textArea')
    }
}
//you have to recieve the JSON only.
async function openAndSee(){
    var filePath = fileLoc.value();
    print(filePath)
    var fetchText = await fetch(`uploads/${filePath}`)
    var data = await fetchText.json()
    // var fetchText = httpGet(`uploads/${filePath}`,(data,err)=>{
    print(data.text)
    fileData.html(data.text)
    
}


function gotData(data){
    console.log(data)
}
function setPriceData(){
    itemIn = select('#item').value()
    priceIn = select('#price').value()
    print('enter set')   
    
    if(itemIn !='' && priceIn !=''){
        loadJSON(`/add/${itemIn}/${priceIn}`)
        outComment.html('price is registered...')
    }else{
        outComment.html('Please enter both item and price')
    } 
}

function getPriceData(){
    print('enter get')
    itemRet = select('#itemRet').value()   
    
    if(itemRet){
        loadJSON('/allPrice', (data)=>{
        var price = data[itemRet]
        pricePrint.html(`The price of ${itemRet} is ${price}`)
        })
    }else{
        pricePrint.html(`Enter a Valid Item, or price unavailable`)
    }
}