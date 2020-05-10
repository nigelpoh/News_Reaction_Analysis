var JSDOM = require('jsdom').JSDOM;
var reading = require('./Readability_Plugin/index')
var request = require("request");
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
    TraversingThrough(){
        var TotalArray = this.clean;
    }
}
var ReadabilityAPI = function(){}

ReadabilityAPI.prototype.read = function (body){ 
    var doc = new JSDOM(body).window.document;
    let reader = new reading.Readability(doc);
    let article = reader.parse();
    return article.content
}

module.exports = ReadabilityAPI;