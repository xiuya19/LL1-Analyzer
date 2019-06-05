readFiles("#f1",".resultLDiv div",function(){
    let sets=new Sets();
    let resultTopL=document.querySelector(".resultTopDivL div");
    resultTopL.innerText=sets.printGrammer;
    let resultTopR=document.querySelectorAll(".resultTopDivR div");
    let tab=new DivTable({
        Row:sets.Grammer.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px"].concat(Array(sets.Grammer.VN.length-1)).fill("100px",1,sets.Grammer.VN.length),
        data:sets.FirstList
    });
    let tmp1=copy(tab.table,1);
    resultTopR[0].innerHTML=tmp1;
    tab=new DivTable({
        Row:sets.Grammer.VN.length,
        Col:2,
        ColumnRatio:[1,4],
        ColumnBaseSize:["40px"].concat(Array(sets.Grammer.VN.length-1)).fill("100px",1,sets.Grammer.VN.length),
        data:sets.FollowList
    });
    let tmp2=copy(tab.table,1);
    resultTopR[1].innerHTML=tmp2;

    let resultBottom=document.querySelector(".resultBottomDiv div");
    tab=new DivTable({
        Row:sets.Grammer.VN.length+2,
        Col:sets.Grammer.VT.length+1,
        ColumnRatio:[1].concat(Array(sets.Grammer.VT.length+1)).fill(4,1,sets.Grammer.VT.length+2),
        ColumnBaseSize:["20px"].concat(Array(sets.Grammer.VT.length+1)).fill("40px",1,sets.Grammer.VT.length+2),
        data:sets.TableList
    });
    let tmp3=copy(tab.table,1);
    resultBottom.innerHTML=tmp3;


    let parttenText=document.querySelector("#partten");
    let parttenButton=document.querySelector("#analyse");
    parttenButton.onclick=function () {
        let analyseString=copy(parttenText.value);
        sets.Analyse(analyseString);
        let resultRight=document.querySelector(".resultRightDiv div");
        tab=new DivTable({
            Row:sets.analyseTable.length,
            Col:3,
            ColumnRatio:[5,1,5],
            ColumnBaseSize:["170px","80px","200px"],
            data:sets.analyseTable
        });
        let tmp4=copy(tab.table,1);
        resultRight.innerHTML=tmp4;
    }
});
