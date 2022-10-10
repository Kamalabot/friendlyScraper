//Learnt the purpose of setter and getter methods inside the Class construction code
//Limitation of using the p5 library to position the dom element becomes cumbersome, 
//since the element names needs to be provided.
//Much simpler solution would be to use a function that attaches the element to the 
//said parent

var trialChk;
var anotherPara;
var htmlTrial;
var showLink;

function setup(){
    trialChk = new compositedataElement('h1','Trial Element','local')
    trialChk.createItem()

    anotherPara = new compositedataElement('p','This is a new data','dataOut','myObj','f2 red')
    anotherPara.createItem()

    htmlTrial = new dataElement('p','Building HTML components','htmlObj','f2 blue','dataOut','visible')
    htmlTrial.makeElement()

    showLink = select('#showLink')
    showLink.mouseClicked(changeVisibility)

    checkTrial = new inputElement('checkbox','trialBox','This is a trial','myChecker','bg-red','dataOut','visible','checked')
    checkTrial.makeElement()

    createDataElement('p','Functional object builders','htmlObj','f2 orange','dataOut','visible')

    createInputElement('radio','trialBox','Enter your Text','myText','pa2 red','textOut','visible','checked')
    createInputElement('radio','trialBox','Text','myText','pa2 blue','textOut','visible','checked')
    createInputElement('radio','trialBox','your Text','myText','pa2 green','textOut','visible','checked')
    createInputElement('radio','trialBox','Enter','myText','pa2 blue','textOut','visible','checked')
}

function changeVisibility(){
    console.log(htmlTrial.showId)
    let changeElement = select(`#${htmlTrial.showId}`)
    let data = changeElement.html()
    if(changeElement.attribute('visibility') == 'visible'){
        console.log('enterend')
        changeElement.html('');
        // changeElement.makeElement()
    } else {
        changeElement.html(data)
        // changeElement.makeElement()
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

class inputElement{
    constructor(type, name, featureName, id, className, parentId, visibility, value){
        this.type = type;
        this.name = name;
        this.id = id;
        this.className = className;
        this.parentId = parentId;
        this.visibility = visibility;
        this.value = value;
        this.featureName = featureName;
    }

    makeElement(){
        let htmlbuilt = `<input type="${this.type}" id="${this.id}" class="${this.className}" visibility="${this.visibility}" name="${this.name}">
        <label for="${this.name}">${this.featureName}</label>`;
        print(htmlbuilt)
        createElement(this.elt).parent(this.parentId).html(htmlbuilt)
    }
}

class dataElement{
    constructor(elt, text, id, className, parentId, visibility){
        this.elt = elt;
        this.text = text;
        this.id = id;
        this.className = className;
        this.parentId = parentId;
        this.visibility = visibility;
    }

    get visible(){
        return this.visibility;
    }

    get showId(){
        return this.id
    }

    set changeVisible(newVis){
        this.visibility = newVis;
    }
    makeElement(){
        let htmlbuilt = `<${this.elt} id="${this.id}" class="${this.className}" visibility="${this.visibility}">${this.text}</${this.elt}>`;
        print(htmlbuilt)
        createElement(this.elt).parent(this.parentId).html(htmlbuilt)
    }
}

class compositedataElement{
    constructor(elt, lableOrData, parentId, idname, className){
        this.elt= elt;
        this.lableOrData = lableOrData;
        this.parentId = parentId;
        this.className = className;
        this.idname = idname;
    }
    createItem(){
        if(this.idname != undefined && this.className != undefined){
            createElement(this.elt)
                .parent(this.parentId)
                .id(this.idname)
                .class(this.className)
                .html(this.lableOrData)

        }else if(this.idname != undefined) {
            createElement(this.elt)
                .parent(this.parentId)
                .class(this.className)
                .html(this.lableOrData)

        }else if(this.className != undefined){
            createElement(this.elt)
                .parent(this.parentId)
                .class(this.className)
                .html(this.lableOrData)
        }else{
            createElement(this.elt)
                .parent(this.parentId)
                .html(this.lableOrData)
        }

    }
}

