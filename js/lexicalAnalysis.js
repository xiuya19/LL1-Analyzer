class Lexical{
    constructor(options){
        this.reservedWord=options.reservedWord.split('\n');
        this.attributeOperator=options.attributeOperator.split('\n');
        this.initTableAndTree();
        // console.log(this);
    }

    initTableAndTree(){

        this.attributeOperatorStart=this.reservedWord.length;
        this.identifierStart=this.attributeOperatorStart+this.attributeOperator.length;
        this.constantNumStart=this.identifierStart+1;
        this.constantCharStart=this.constantNumStart+1;
        this.constantStringStart=this.constantCharStart+1;

        this.trie=new trieTree();
        this.tableList=[];
        let index=1;
        this.reservedWord.forEach(value=>{
            if(value!==""){
                this.tableList.push([value,index.toString()]);
                this.trie.Insert(value,index);
                index=index+1;
            }
        });
        this.attributeOperator.forEach(value=>{
            if(value!==""){
                this.tableList.push([value,index.toString()]);
                this.trie.Insert(value,index);
                index=index+1;
            }
        });

        this.tableList.push(["标识符",index.toString()]);
        index=index+1;
        this.tableList.push(["整数常量",index.toString()]);
        index=index+1;
        this.tableList.push(["字符常量",index.toString()]);
        index=index+1;
        this.tableList.push(["字符串常量",index.toString()]);
        index=index+1;
    }
    filter(sentence){
        this.originSentence=sentence;
        let tempString="";
        for(let i=0,length=this.originSentence.length;i<length;i++){
            if(i<length-1&&this.originSentence[i]==='/'&&this.originSentence[i+1]==='/'){
                while(i<length&&this.originSentence.charAt(i++)!=='\n');
            }
            if(i<length-1&&this.originSentence[i]==='/'&&this.originSentence[i+1]==='*'){
                i+=2;
                while(i<length-1&&this.originSentence[i]!=='*'&&this.originSentence[i+1]!=='/'){
                    i++;
                    if(i===length){
                        alert("There is no '*/' behind '/*'.\n");
                        return -1;
                    }
                }
                i+=2;
            }
            if (i<length&&this.originSentence[i] !== '\n'&&this.originSentence[i] !== '\t'
                &&this.originSentence[i] !== '\v' &&this.originSentence[i] !== '\r'
                &&this.originSentence[i] !== '\b'){
                //若出现无用字符，则过滤；否则加载
                tempString=tempString.concat(this.originSentence[i]);
            }
        }
        this.filterSentence=tempString;
        return 1;
    }
    Scanner(index){
        while(this.filterSentence[index]===' '){
            index++;
        }
        let token="";
        if(this.isLetter(this.filterSentence[index])||this.filterSentence[index]==='_'){
            token=token.concat(this.filterSentence[index++]);
            while(this.isLetter(this.filterSentence[index])||this.isDigit(this.filterSentence[index])){
                token=token.concat(this.filterSentence[index++]);
            }
            let mark=this.trie.SearchReservedWord(token);
            if(mark===-1){
                return [this.identifierStart,token,index];
            }else{
                return [mark,token,index];
            }
        }else if(this.isDigit(this.filterSentence[index])){
            while(this.isDigit(this.filterSentence[index])){
                token=token.concat(this.filterSentence[index++]);
            }
            return [this.constantNumStart,token,index];
        }else if(this.filterSentence[index]==='\''||this.filterSentence[index]==='\"'){
            let ch=this.filterSentence[index];
            index++;
            while(index<this.filterSentence.length&&this.filterSentence[index]!==ch){
                token=token.concat(this.filterSentence[index++]);
            }
            if(index>this.filterSentence.length||this.filterSentence[index]!==ch){
                return [-1,token,index];
            }
            index++;
            if(ch==='\'') return [this.constantCharStart,token,index];
            else return [this.constantStringStart,token,index];
        }else{
            let mark=this.trie.SearchAttributeOperator(this.filterSentence,index);
            if(mark[0]===-1) return [-1,token,index];
            return mark;
        }
    }
    main(str){
        if(this.filter(str)===-1){
            return;
        }
        this.binaryGroup=[];
        this.identifier=[];
        let index=0;
        while(index<this.filterSentence.length){
            let mark=this.Scanner(index);
            if(mark[0]===-1){
                alert("error：There is no exist"+mark[1]);
                return;
            }else if(mark[0]>=0&&mark[0]<this.reservedWord.length){
                //保留字
                this.binaryGroup.push([mark[1],mark[0],"--"]);
            }else if(mark[0]>=this.attributeOperatorStart&&mark[0]<this.identifierStart){
                //界符运算符
                this.binaryGroup.push([mark[1],mark[0],"--"]);
            }else if(mark[0]===this.identifierStart){
                if(!(mark[1] in this.identifier)){
                    this.identifier.push(mark[1]);
                }
                this.binaryGroup.push(["标识符",mark[0],mark[1]]);
            }else if(mark[0]===this.constantNumStart){
                this.binaryGroup.push(["整数常量",mark[0],mark[1]]);
            }else if(mark[0]===this.constantStringStart){
                this.binaryGroup.push(["字符串常量",mark[0],mark[1]]);
            }
            index=mark[2];
        }
        this.identifierList=[];
        for(let i=0,length=this.identifier.length;i<length;i++){
            this.identifierList.push([this.identifier[i],(i+1).toString()]);
        }
        this.analyseString="";
        this.binaryGroup.forEach(value=>{
            this.analyseString=this.analyseString.concat("("+value.join(',')+")\n");
        })
    }
    isLetter(letter){
        return (letter >= 'a'&&letter <= 'z' || letter >= 'A'&&letter <= 'Z' || letter === '_');
    }
    isDigit(digit){
        return (digit >= '0'&&digit <= '9');
    }
}

class treeNode{
    constructor(){
        this.mark=0;
        this.ch='\0';
        this.next={};
    }
}
class trieTree{
    constructor(){
        this.Root=new treeNode();
    }
    Insert(str,mark){
        let tempNode=this.Root;
        for(let i=0,length=str.length;i<length;i++){
            if(!(str[i] in tempNode.next)){
                tempNode.next[str[i]]=new treeNode();
            }
            tempNode=tempNode.next[str[i]];
            tempNode.ch=str[i];
        }
        if (tempNode.next["$$$"] === undefined) {
            tempNode.next["$$$"] = new treeNode();
            tempNode.next["$$$"].mark = mark;
        }
    }
    SearchAttributeOperator(str,endPos){
        let tempNode=this.Root;
        let token="",tempCh;
        for(let i=endPos,length=str.length;i<=length;i++){
            if(i===length||!(str[i] in tempNode.next)){
                if("$$$" in tempNode.next){
                    endPos=i;
                    return [tempNode.next["$$$"].mark,token,endPos];
                }else{
                    alert("error:could not find the word"+token+"in table.");
                    return [-1,token,-1];
                }
            }else{
                token=token.concat(str[i]);
                tempNode=tempNode.next[str[i]];
            }
        }
        return [-1,token,-1];
    }
    SearchReservedWord(str){
        let tempNode=this.Root;
        for(let i=0,length=str.length;i<length;i++){
            if(!(str[i] in tempNode.next)){
                return -1;
            }else{
                tempNode=tempNode.next[str[i]];
            }
        }
        if("$$$" in tempNode.next){
            return tempNode.next["$$$"].mark;
        }
        return -1;
    }
}