var JSDOM = require('jsdom').JSDOM;
var reading = require('./Readability_Plugin/index')
var request = require("request");
function LessOrMore(baseline, check){
    ComparisonDone = false;
    Progression = 0;
    do{
        if(baseline[Progression] > check[Progression]){
            ComparisonDone = true;
            return "Less";
        }else if(baseline[Progression] < check[Progression]){
            ComparisonDone = true;
            return "More";
        }else if(arraysEqual(baseline,check) == true){
            ComparisonDone = true;
            return "Equal";
        }
        Progression += 1;
    }while(ComparisonDone == false);
}
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function special_quicksort(specialSortableArray){
    if(specialSortableArray.length <= 1){
        return specialSortableArray;
    }
    var pivot = specialSortableArray[Math.floor(specialSortableArray.length / 2)];
    var left_of_pivot = specialSortableArray.filter(element => LessOrMore(pivot[3],element[3]) == "Less");
    var mid_of_pivot = specialSortableArray.filter(function (currentElement){
                var verdict = LessOrMore(pivot[3],currentElement[3]);
                if(verdict == "Equal"){
                        return currentElement;
                }
        });
    var right_of_pivot = specialSortableArray.filter(function (currentElement){
                var verdict = LessOrMore(pivot[3],currentElement[3]);
                if(verdict == "More"){
                        return currentElement;
                }
        });
    return special_quicksort(left_of_pivot).concat(mid_of_pivot,special_quicksort(right_of_pivot));	
}
class HTMLDOMCleaning {
    constructor(HTMLDocument) {
        this.HTMLDocument = HTMLDocument;
        this.currentID = "!/0ad4f4daffcd9a4c59718f33d070d9fbf71b3013748600e2b5b958dcdf0c340b/*";
        this.cleanedResults = [];
        this.reorderedResults = [];
    }
    get clean(){
        return this.Cleaning();
    }
    get traverse(){
        return this.TraversingThrough();
    }
    get reorder(){
        return this.Reordering();
    }
    get merge(){
        return this.Merging();
    }
    Cleaning() {
        var HTMLDocumentChildren = this.HTMLDocument.getElementsByTagName("body")[0].childNodes;
        var InitialComparison = false;
        var arrayHold = [];
        var CompleteValue = [];
        var Error = false;
        var Logger = "";
        var jjj = 0;
        while(InitialComparison == false && jjj < 1000){
            jjj = jjj + 1;
            
            
            
            if(HTMLDocumentChildren.length > 1){
                for (var i = 0; i < HTMLDocumentChildren.length; i++){
                    if(HTMLDocumentChildren[i].nodeName == "#text"){
                        if(HTMLDocumentChildren[i].nodeValue.replace(/[.,\/#@!$%\^&\*;:{}=\-_`~()+\[\]\\|<>?\"\']/g,"").replace(/ /g,'').replace(/\n/g,'') != ""){
                            var IDNow1 = this.currentID + ',' + i.toString();
                            var IDHold1 = [];
                            if(HTMLDocumentChildren[i].nodeName == "IMG"){
                                IDHold1 = [HTMLDocumentChildren[i].src,HTMLDocumentChildren[i].nodeName,IDNow1];
                            }else if(HTMLDocumentChildren[i].nodeName == "A"){
                                IDHold1 = [HTMLDocumentChildren[i].nodeValue,HTMLDocumentChildren[i].nodeName,IDNow1,HTMLDocumentChildren[i].href];
                            }else{
                                IDHold1 = [HTMLDocumentChildren[i].nodeValue,HTMLDocumentChildren[i].nodeName,IDNow1];
                            }
                            CompleteValue.push(IDHold1);
                        }
                    }else if(HTMLDocumentChildren[i].nodeName == "#comment" || HTMLDocumentChildren[i].nodeName == "#document"){
                        Logger = Logger + "Comment/Document Removed" + "\n"
                    }else{
                        var countTagsA = HTMLDocumentChildren[i].innerHTML.match(/</g);
                        var IDNow2 = this.currentID + ',' + i.toString();
                        if(countTagsA <= 2){
                            if(HTMLDocumentChildren[i].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'').replace(/\n/g,'') != ""){
                                var IDHold6 = []
                                if(HTMLDocumentChildren[i].nodeName == "IMG"){
                                    var IDHold6 = [HTMLDocumentChildren[i].src,HTMLDocumentChildren[i].nodeName,IDNow2];
                                }else if(HTMLDocumentChildren[i].nodeName == "A"){
                                    var IDHold6 = [HTMLDocumentChildren[i].textContent,HTMLDocumentChildren[i].nodeName,IDNow2,HTMLDocumentChildren[i].href];
                                }else{
                                    var IDHold6 = [HTMLDocumentChildren[i].textContent,HTMLDocumentChildren[i].nodeName,IDNow2];
                                }
                                CompleteValue.push(IDHold6);
                            }
                        }else{
                            const IDHold2 = [HTMLDocumentChildren[i].innerHTML,IDNow2];
                            arrayHold.push(IDHold2);
                        }
                    }
                }
                InitialComparison = true;
            }else if(HTMLDocumentChildren.length == 1){
                var DOMNew = new JSDOM(HTMLDocumentChildren[0].innerHTML).window.document;
                HTMLDocumentChildren = DOMNew.getElementsByTagName("body")[0].childNodes;
                
                
            }else if(HTMLDocumentChildren.length == 0){
                var DOMNew2 = new JSDOM(this.HTMLDocument.getElementsByTagName("body")[0].innerHTML).window.document;
                var HTMLDocumentChildrenCheck = DOMNew2.getElementsByTagName("body")[0].childNodes;
                if(HTMLDocumentChildrenCheck.length >= 1){
                    var countTags = this.HTMLDocument.getElementsByTagName("body")[0].innerHTML.match(/</g);
                    if(countTags == null){
                        countTags = 0;
                    }else{
                        countTags = countTags.length;
                    }
                    if(countTags > 2){
                        for (var i = 0; i < HTMLDocumentChildrenCheck.length; i++){
                            var IDNow3 = this.currentID + ',' + i.toString();
                            const IDHold3 = [HTMLDocumentChildrenCheck[i].innerHTML,IDNow3];
                            arrayHold.push(IDHold3);
                        } 
                    }else{
                        if(HTMLDocumentChildrenCheck[0].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'').replace(/\n/g,'') != "" || HTMLDocumentChildrenCheck[0].nodeName == "IMG"){
                            var IDNow4 = this.currentID;
                            var IDHold4 = [];
                            if(HTMLDocumentChildrenCheck[0].nodeName == "IMG"){
                                IDHold4 = [HTMLDocumentChildrenCheck[0].src,HTMLDocumentChildrenCheck[0].nodeName,IDNow4];
                            }else if(HTMLDocumentChildrenCheck[0].nodeName == "A"){
                                IDHold4 = [HTMLDocumentChildrenCheck[0].textContent, HTMLDocumentChildrenCheck[0].nodeName,IDNow4,HTMLDocumentChildrenCheck[0].href];
                            }else{
                                IDHold4 = [HTMLDocumentChildrenCheck[0].textContent,HTMLDocumentChildrenCheck[0].nodeName,IDNow4];
                            }
                            CompleteValue.push(IDHold4);
                        }
                    }
                }else{
                    if(this.HTMLDocument.getElementsByTagName("body")[0].innerHTML.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'').replace(/\n/g,'') != ""){
                        var IDNow5 = this.currentID;
                        var IDHold5 = [];
                        if(this.HTMLDocument.getElementsByTagName("body")[0].nodeName == "IMG"){
                            IDHold5 = [this.HTMLDocument.getElementsByTagName("body")[0].src,this.HTMLDocument.getElementsByTagName("body")[0].nodeName,IDNow5];
                        }else if(this.HTMLDocument.getElementsByTagName("body")[0].nodeName == "A"){
                            IDHold5 = [this.HTMLDocument.getElementsByTagName("body")[0].innerHTML, this.HTMLDocument.getElementsByTagName("body")[0].nodeName,IDNow5,this.HTMLDocument.getElementsByTagName("body")[0].href];
                        }else{
                            IDHold5 = [this.HTMLDocument.getElementsByTagName("body")[0].innerHTML,this.HTMLDocument.getElementsByTagName("body")[0].nodeName,IDNow5];
                        }
                        CompleteValue.push(IDHold5);
                    }
                }
                InitialComparison = true;
                
                
                
            }else{
                InitialComparison = true;
                Error = true;
            }
            if(InitialComparison == true || jjj == 100){
                return [arrayHold,CompleteValue,Error,Logger];
            }
        }
    }
    Reordering(){
        for(var i = 0; i < this.cleanedResults.length; i++){
            var commasSeparated = this.cleanedResults[i][2].split(",");
            commasSeparated.shift();
            commasSeparated = commasSeparated.map((current) => {
                return parseInt(current);
            });
            this.cleanedResults[i].splice(3, 0,commasSeparated);
        }
        return special_quicksort(this.cleanedResults);
    }
    
    Merging(){
        var Counter = 0;
        var SavingCheck = undefined;
        var newMadnessArray = [];
        var specialArrayHolder = [];
        for(var i = 0; i < this.reorderedResults.length; i++){
            var Insertion = [this.reorderedResults[i][0],this.reorderedResults[i][1]];
            var Popped = this.reorderedResults[i][3];
            Popped.pop();
            var specialThings = ["#text","P","A","STRONG"];
            if(specialThings.includes(this.reorderedResults[i][1]) && (SavingCheck == undefined || arraysEqual(SavingCheck,Popped)) == true){
                if(this.reorderedResults[i][1] == "A"){
                
                }
                specialArrayHolder.push(Insertion);
                Counter += 1;
                SavingCheck = Popped;
            }else{
                if(Counter > 0){
                    var indexEnd = i - 1 + 1;
                    var indexStart = i - Counter; // (i - 1) - (Counter - 1)
                    var StoreForNow = this.reorderedResults.slice(indexStart, indexEnd);
                    var ContentArray = StoreForNow.map((element) => {
                        return element[0];
                    });
                    newMadnessArray.push([ContentArray.join(""),"Possible Content (#text/P)",specialArrayHolder]);
                    if(specialThings.includes(this.reorderedResults[i][1])){
                        Counter = 1;
                        SavingCheck = Popped;
                        specialArrayHolder = [];
                        specialArrayHolder.push(Insertion);
                    }else{
                        Counter = 0;
                        SavingCheck = undefined;
                        var HoldingArea = this.reorderedResults[i];
                        HoldingArea.splice(-2, 2);
                        specialArrayHolder = [];
                        HoldingArea.push(Insertion);
                        newMadnessArray.push(HoldingArea);
                    }
                }
            }
        }
        return newMadnessArray;
    }
    
    TraversingThrough(){
        var TotalArray = this.clean;
        /*var ContinueWork = TotalArray[0];
        var FinishedWork = TotalArray[1];
        var Errors = TotalArray[2];
        var Logs = TotalArray[3];
        var Result = FinishedWork;
        var Error = "";
        var iiiii = 0;
        if(Errors == true){
            Error = Error + "CleaningError ";
        }
        while(ContinueWork.length > 1 && iiiii < 100){
            var CWStore = [];
            for(var i = 0; i < ContinueWork.length; i++){
                var RecleanedDOM = new JSDOM(ContinueWork[i][0]).window.document;
                this.HTMLDocument = RecleanedDOM;
                this.currentID = ContinueWork[i][1];
                var TotalFragArray = this.clean;
                var ResultContinue = TotalFragArray[0];
                var ResultFinished = TotalFragArray[1];
                var ResultError = TotalFragArray[2];
                if(ResultError == true){
                    Error = Error + "CleaningError ";
                }
                if(!(ResultContinue === undefined || ResultContinue.length == 0)){
                    CWStore = CWStore.concat(ResultContinue);
                }
                Result = Result.concat(ResultFinished);
            }
            ContinueWork = CWStore;
            iiiii = iiiii + 1;
        }
        this.cleanedResults = Result;
        var ReorderedResults = this.reorder;
        this.reorderedResults = ReorderedResults;
        var FinalResults = this.merge;
        return [FinalResults,Error,Logs];*/
    }
}
var ReadabilityAPI = function(){}

ReadabilityAPI.prototype.read = function (body){ 
    var doc = new JSDOM(body).window.document;
    let reader = new reading.Readability(doc);
    let article = reader.parse();
    //var ArticleDOM = new JSDOM(article.content).window.document;
    //var cleanedDOM = new HTMLDOMCleaning(ArticleDOM);
    //Memory Error
    //var cleanedFrags = cleanedDOM.traverse;
    //return cleanedFrags;
    //return ArticleDOM
    return article.content
}

module.exports = ReadabilityAPI;