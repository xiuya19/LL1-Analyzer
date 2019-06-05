
class GRAMMAR{
    constructor(options){
        this.originGrammar=options.split('\n');
        this.initGrammar();
    }
    initGrammar(){
        /*
            分解语法
            VT:终结符
            VN:非终结符
            S:文法开始符
            PROD:产生式
        */
        let Partten=/\{(.*)\}/;
        this.Grammar={};
        let tmp=Partten.exec(this.originGrammar[0])[1].split(',');
        this.Grammar.VT=Array.from(tmp);

        tmp=Partten.exec(this.originGrammar[1])[1].split(',');
        this.Grammar.VN=Array.from(tmp);

        this.Grammar.S=this.originGrammar[2][0];

        tmp=Partten.exec(this.originGrammar[3])[1].split(',');
        this.Grammar.PROD={};
        Array.from(tmp).forEach(nodes=>{
            let temp=nodes.split("->");
            this.Grammar.PROD[temp[0]]=temp[1].split('|');
        });

        this.printGrammer="";
        this.printGrammer=this.printGrammer.concat("VN:"+this.originGrammar[0]+"\n");

        this.printGrammer=this.printGrammer.concat("VT:"+this.originGrammar[1]+"\n");
        this.printGrammer=this.printGrammer.concat("S:"+this.originGrammar[2]+"\n");
        this.printGrammer=this.printGrammer.concat("PRODUCT:\n"+this.originGrammar[3].split(',').join('\n'));
    }
}

class FIRST extends GRAMMAR{
    constructor(options){
        super(options);
        this.initFirstSet();
        this.initFirstTable();
    }
    initFirstSet(){
        this.First=initSetObj(this.Grammar.VN);
        this.Grammar.VN.forEach(nodes=>{
            if(this.First[nodes]==false)
                this.getFirst(nodes);
        })
    }
    initFirstTable(){
        //生成二元表[终结符,first集]
        this.FirstTable=[];
        for(const key1 in this.First){
            let temp=[];
            for(const key2 in this.First[key1]){
                for(const key3 in this.First[key1][key2]){
                    temp.push(this.First[key1][key2][key3]);
                }
            }
            temp=temp.join(',');
            this.FirstTable.push([key1].concat(temp));
        }
    }
    getFirst(tar){
        //没有产生式的非终结符
        if(!this.Grammar.PROD.hasOwnProperty(tar))return [];
        this.Grammar.PROD[tar].forEach(node=>{
            //遍历产生式

            //当终结符开头或非终极符的first集没有空字时为false
            let allowContinue=true;

            for(const iter of node){
                if(!allowContinue) break;
                allowContinue=false;
                if(this.Grammar.VT.indexOf(iter)>-1||iter === '$'){
                    //终结符或者空字时，直接加入first集

                    let tempObj={[node]:iter};

                    //去重
                    if(this.First[tar].indexOf(tempObj)===-1){
                        this.First[tar].push(tempObj);
                    }

                    //结束循环
                    break;
                }else if(this.Grammar.VN.indexOf(iter)>-1){
                    //非终结符时，遍历连续非终结符
                    let tempFirst;//保存first集

                    //如果没有其first集，则递归求；否则保存于tempFirst中
                    if(this.First[iter]==false){
                        this.First[iter]=this.getFirst(iter);
                    }
                    tempFirst=this.First[iter];
                    //遍历非终结符的first集合是否有空字
                    for(const value of tempFirst){
                        for(const key in value){
                            //有空字则跳过
                            if(value[key]==='$'){
                                allowContinue=true;
                                continue;
                            }
                            let tempObj={[node]:value[key]};
                            if(this.First[tar].indexOf(tempObj)===-1)
                                this.First[tar].push(tempObj);
                        }
                    }
                }else{
                    alert("error :there is and unknown code "+iter);
                    break;
                }
            }
            //如果都有空字，则把空字也加入first集合
            if(allowContinue) {
                let tempObj = {[node]: '$'};
                if (this.First[tar].indexOf(tempObj) === -1)
                    this.First[tar].push(tempObj);
            }
        });
        return this.First[tar];
    }
}
class FOLLOW extends FIRST{
    constructor(options){
        super(options);
        this.initFollowSet();
        this.initFollowTable();
    }
    initFollowSet(){
        this.Follow=initSetObj(this.Grammar.VN);
        this.Follow[this.Grammar.S]=['#'];
        this.getFollow(this.Grammar.S);
        this.Grammar.VN.forEach(node=>{
            if(node!==this.Grammar.S||this.Follow[node]==false){
                this.getFollow(node);
            }
        })
    }
    initFollowTable(){
        this.FollowTable=[];
        for(const key1 in this.Follow){
            let tmp=[];
            for(const key2 of this.Follow[key1]){
                tmp.push(key2);
            }
            tmp=tmp.join(',');
            this.FollowTable.push([key1].concat(tmp));
        }
    }
    getFollow(tar){
        for(const key in this.Grammar.PROD){
            //遍历产生式右部
            let value=this.Grammar.PROD[key];
            value.forEach(node1=>{
                for(let i=0,len=node1.length;i<len;i++){
                    if(node1[i]===tar){
                        //产生式右部有目标的非终结符
                        if(i==len-1){
                            if(tar!==key){
                                //位于产生式最后且产生式左部不是自身时，则产生式左部的follow加入follow集
                                if(this.Follow[key]==false){
                                    this.Follow[key]=this.getFollow(key);
                                }
                                this.Follow[tar]=connectSet(this.Follow[tar],this.Follow[key]);
                            }
                        }else{
                            let str=node1.substring(i+1);//截取用于求first集目标
                            let tempFirst=this.getFirstInFollow(str);
                            let index=tempFirst.indexOf('$');
                            if(index>-1){
                                //first集合中有空字，则需要把则产生式左部的follow加入follow集

                                tempFirst.splice(index,1);//删除空字

                                this.Follow[tar]=connectSet(this.Follow[tar],tempFirst);

                                if(tar!==key){
                                    if(this.Follow[key]==false){
                                        this.Follow[key]=this.getFollow(key);
                                    }
                                    this.Follow[tar]=connectSet(this.Follow[tar],this.Follow[key]);
                                }
                            }else{
                                this.Follow[tar]=connectSet(this.Follow[tar],tempFirst);
                            }
                        }
                    }
                }
            })
        }
        return this.Follow[tar];
    }
    getFirstInFollow(tar){
        let allowContinue=true;
        let result=[];
        for(const value of tar){
            if(!allowContinue) break;
            allowContinue=false;
            if(this.Grammar.VT.indexOf(value)>-1){
                allowContinue=false;
                if(result.indexOf(value)===-1){
                    result.push(value);
                }
            }else if(this.Grammar.VN.indexOf(value)>-1){
                for(const FirstSet of this.First[value]){
                    for(const key in FirstSet){
                        if(FirstSet[key]==='$'){
                            allowContinue=true;
                            continue;
                        }
                        if(result.indexOf(FirstSet[key]===-1)){
                            result.push(FirstSet[key]);
                        }
                    }
                }
            }else{
                alert("error :there is and unknown code "+value);
                break;
            }
        }
        if(allowContinue){
            if(result.indexOf('$')===-1){
                result.push('$');
            }
        }
        return result;
    }
}
class TABLE extends FOLLOW{
    constructor(options){
        super(options);
        this.initTable();
        this.initTableList();
    }
    initTable(){
        //分析表，去空格版，只有映射关系
        this.Table={};
        this.Grammar.VN.forEach(node=>{
            this.Table[node]={};
        });
        this.Grammar.VN.forEach(node1=>{
            this.First[node1].forEach(node2=>{
                for(const key in node2){
                    if(node2[key]==='$'){
                        //如果有空字，则把其follow集加入表
                        this.Follow[node1].forEach(node3=>{
                            this.Table[node1][node3]=key;
                        })
                    }else{
                        this.Table[node1][node2[key]]=key;
                    }
                }
            })
        })
    }
    initTableList(){
        //分析表,保留空格版，用于输出页面
        this.TableList=[];
        //第一行为空格+终结符集+#
        this.TableList.push([' '].concat(this.Grammar.VT).concat('#'));
        this.Grammar.VN.forEach(node=>{
            let temp=[];
            for(let i=0,len=this.Grammar.VT.length+2;i<len;i++){
                //先把每个格子填满
                temp.push(' ');
            }
            temp[0]=node;//非终结符
            for(const value in this.Table[node]){
                let index=this.TableList[0].indexOf(value);
                temp[index]=this.Table[node][value];
            }
            this.TableList.push(temp);
        })
    }
}
class LL1 extends TABLE{
    constructor(options){
        super(options);
        console.log(this);
    }
    Analyse(tar){
        this.analyseTable=[["符号栈","当前输入","输入串"]];
        tar=tar+'#';
        let index=0;
        let stack=[];

        stack.push('#');
        stack.push(this.Grammar.S);
        while(!(stack[stack.length-1]==='#'&&tar[index]==='#')){
            this.analyseTable.push([stack.join(''),tar[index],tar.substring(index)]);
            if(stack[stack.length-1]===tar[index]){
                //符号栈和输入串指向的字符相同时
                //符号栈出栈，指针后移
                stack.pop();
                index++;
            }else if(tar[index] in this.Table[stack[stack.length-1]]){

                let tmp=this.Table[stack[stack.length-1]][tar[index]];
                stack.pop();
                if(tmp==="$")
                    continue;
                //翻转压入栈
                stack=stack.concat(tmp.split('').reverse());
            }else{
                //匹配到空格，结束
                alert("The pattern string does not match the Grammar!");
                this.analyseTable=[];
                break;
            }
        }
    }
}

let initSetObj=function(tar){
    let temp={};
    tar.forEach(nodes=>{
        temp[nodes]=[];
    });
    return temp;
};
let connectSet=function(src,tar){
    tar.forEach(value=>{
        if(src.indexOf(value)===-1){
            src.push(value);
        }
    });
    return src;
};