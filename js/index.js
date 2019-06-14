let lex={};
let ll1={};
let oBtnDisplay=document.querySelector("#change");
let head=document.querySelector("head");
//切换按钮
oBtnDisplay.onclick=function () {
    let oDivLL1=document.querySelector(".mainsLL1");
    let oDivDir=document.querySelector(".mainsDir");
    if(oDivDir.style.display==="none"){
        oDivDir.style.display="block";
        oDivLL1.style.display="none";
    }else{
        oDivDir.style.display="none";
        oDivLL1.style.display="block";
        let LL1Text=document.querySelector(".resultTopDiv textarea");
        if(Object.keys(lex).length!==0){
            let str="";
            lex.binaryGroup.forEach(value=>{
                if(value[1]===lex.identifierStart){
                    str=str+"i";
                }else str=str+value[0];
            });
            LL1Text.value=str;
        }
    }
};
let buttonChange=function(fileId,buttonId,callback){
    let oFile=document.querySelector(fileId);
    let oBtn=document.querySelector(buttonId);
    oBtn.onclick=function () {
        oFile.click();
    };
    readFile(fileId,function (name,result) {
        oBtn.value=name;
        callback(name, result);
    })
};
let LL1Print=function(name,result){
    window.sessionStorage.setItem("Grammar",result);
    ll1=new LL1(window.sessionStorage.getItem("Grammar"));

    let resultTopL=document.querySelector(".resultTopDiv>div");

    /*文法*/
    resultTopL.innerText=ll1.printGrammer;

    /*first*/
    let resultTopR=document.querySelectorAll(".resultTopDiv>div");
    let tab=new DivTable({
        Row:ll1.Grammar.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px","100px"],
        className:"First",
        data:ll1.FirstTable
    });
    let styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp1=copy(tab.table,1);
    resultTopR[1].innerHTML=tmp1;

    /*follow*/
    tab=new DivTable({
        Row:ll1.Grammar.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px","100px"],
        className:"Follow",
        data:ll1.FollowTable
    });
    styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp2=copy(tab.table,1);
    resultTopR[2].innerHTML=tmp2;

    /*table*/
    let resultBottom=document.querySelector(".resultBottomDiv>div");
    tab=new DivTable({
        Row:ll1.Grammar.VN.length+1,
        Col:ll1.Grammar.VT.length+2,
        ColumnRatio:[1].concat(Array(ll1.Grammar.VT.length+1).fill(3,0)),
        ColumnBaseSize:["20px"].concat(Array(ll1.Grammar.VT.length+1).fill("40px",0)),
        className:"LL1Table",
        data:ll1.TableList
    });
    // console.log(tab);
    styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp3=copy(tab.table,1);
    resultBottom.innerHTML=tmp3;


};
buttonChange("#grammarFile","#grammarButton",LL1Print);


let analyseLL1Text=document.querySelector(".resultTopDiv textarea");
let analyseLL1Button=document.querySelector("#analyseLL1");
analyseLL1Button.onclick=function () {
    let tempStr=copy(analyseLL1Text.value);
    // let radioLL1=document.querySelector("input[name='a']").value;
    // console.log(radioLL1,typeof radioLL1);
    let analyseString=tempStr;
    // let analyseString="";
    // if(radioLL1=="true"){
    //     analyseString=tempStr;
    // }else{
    //     if("mapTable" in LL1){
    //         Array.from(tempStr.split('\n')).forEach(str=>{
    //             let tmp=str.substring(1,str.length-1);
    //             analyseString.concat(ll1.mapTable[tmp.split(',')[1]]);
    //         })
    //     }else{
    //         alert("There is no map table");
    //         return;
    //     }
    // }
    ll1.Analyse(analyseString);
    let resultRight=document.querySelector(".resultRightDiv div");
    let tab=new DivTable({
        Row:ll1.analyseTable.length,
        Col:3,
        ColumnRatio:[5,1,5],
        ColumnBaseSize:["170px","80px","200px"],
        className:"LL1Analyse",
        data:ll1.analyseTable
    });
    let styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp=copy(tab.table,1);
    resultRight.innerHTML=tmp;
};

buttonChange("#reservedWordFile","#reservedWordButton",function (name,result) {
    window.sessionStorage.setItem("reservedWord",result);
});
buttonChange("#attributeOperatorFile","#attributeOperatorButton",function (name,result) {
    window.sessionStorage.setItem("attributeOperator",result);
});
// buttonChange("#grammarDirFile","#grammarDirButton",function (name,result) {
//     ll1.MappingTable(result);
// });


let createLexical=document.querySelector("#generate");

createLexical.onclick=function () {
    let attributeOperator=window.sessionStorage.getItem("attributeOperator");
    let reservedWord=window.sessionStorage.getItem("reservedWord");
    if(attributeOperator==null||reservedWord==null){
        alert("the attributeOperator or reservedWord is empty");
        return;
    }
    attributeOperator=attributeOperator.replace(/\r/g,'');
    reservedWord=reservedWord.replace(/\r/g,'');
    lex=new Lexical({
        "attributeOperator":attributeOperator,
        "reservedWord":reservedWord
    });

    let result=document.querySelectorAll(".contentDirDiv>div:nth-of-type(1)")[1];
    let tab=new DivTable({
        Row:lex.tableList.length,
        Col:2,
        ColumnRatio:[1,1],
        ColumnBaseSize:["100px","100px"],
        className:"LexAnalyse",
        data:lex.tableList
    });
    let styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp=copy(tab.table,1);
    result.innerHTML=tmp;
};

let analyseLexButton=document.querySelector("#analyseLex");
let analyseLexText=document.querySelector(".contentDirDiv>textarea");
analyseLexButton.onclick=function () {
    let text=analyseLexText.value.toString();
    // console.log(text);
    if(text==""||Object.keys(lex).length===0){
        alert("the analyse string is empty");
        return;
    }

    lex.main(text);

    let Table=document.querySelectorAll(".contentDirDiv>div:nth-of-type(1)");

    let tab=new DivTable({
        Row:lex.tableList.length,
        Col:2,
        ColumnRatio:[1,1],
        ColumnBaseSize:["100px","100px"],
        className:"LexIdentifier",
        data:lex.identifierList
    });
    let styleNode=document.createElement("style");
    styleNode.innerText=tab.showStyle();
    head.appendChild(styleNode);
    let tmp=copy(tab.table,1);
    Table[0].innerHTML=tmp;

    Table[2].innerText=lex.analyseString;

};

