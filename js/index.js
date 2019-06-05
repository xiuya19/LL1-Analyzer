readFiles("#f1",".resultLDiv div",function(){
    let ll1=new LL1(window.sessionStorage.getItem("Grammar"));

    let resultTopL=document.querySelector(".resultTopDivL div");
    resultTopL.innerText=ll1.printGrammer;
    let resultTopR=document.querySelectorAll(".resultTopDivR div");
    let tab=new DivTable({
        Row:ll1.Grammar.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px"].concat(Array(ll1.Grammar.VN.length-1)).fill("100px",1,ll1.Grammar.VN.length),
        data:ll1.FirstTable
    });
    let tmp1=copy(tab.table,1);
    resultTopR[0].innerHTML=tmp1;
    tab=new DivTable({
        Row:ll1.Grammar.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px"].concat(Array(ll1.Grammar.VN.length-1)).fill("100px",1,ll1.Grammar.VN.length),
        data:ll1.FollowTable
    });
    let tmp2=copy(tab.table,1);
    resultTopR[1].innerHTML=tmp2;

    let resultBottom=document.querySelector(".resultBottomDiv div");
    tab=new DivTable({
        Row:ll1.Grammar.VN.length+2,
        Col:ll1.Grammar.VT.length+1,
        ColumnRatio:[1].concat(Array(ll1.Grammar.VT.length+1)).fill(4,1,ll1.Grammar.VT.length+2),
        ColumnBaseSize:["20px"].concat(Array(ll1.Grammar.VT.length+1)).fill("40px",1,ll1.Grammar.VT.length+2),
        data:ll1.TableList
    });
    let tmp3=copy(tab.table,1);
    resultBottom.innerHTML=tmp3;


    let parttenText=document.querySelector("#partten");
    let parttenButton=document.querySelector("#analyse");
    parttenButton.onclick=function () {
        let analyseString=copy(parttenText.value);
        ll1.Analyse(analyseString);
        let resultRight=document.querySelector(".resultRightDiv div");
        tab=new DivTable({
            Row:ll1.analyseTable.length,
            Col:3,
            ColumnRatio:[5,1,5],
            ColumnBaseSize:["170px","80px","200px"],
            data:ll1.analyseTable
        });
        let tmp4=copy(tab.table,1);
        resultRight.innerHTML=tmp4;
    }
});
