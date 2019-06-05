class Sets{
    constructor(){
        this.originGrammer=sessionStorage.getItem("Grammer").split('\n');
        this.initGrammer();
        this.initFirst();
        this.initFollow();
        this.initTable();
        this.initFirstList();
        this.initFollowList();
        this.initTableList();
        console.log(this);
    }
    Analyse(tar){
        this.analyseTable=[["符号栈","当前输入","输入串"]];
        tar=tar+'#';
        let indexTar=0;
        let stack=[];

        stack.push('#');
        stack.push(this.Grammer.S);
        while(!(stack[stack.length-1]==='#'&&tar[indexTar]==='#')){
            this.analyseTable.push([stack.join(''),tar[indexTar],tar.substring(indexTar)]);
            if(stack[stack.length-1]===tar[indexTar]){
                stack.pop();
                indexTar++;
            }else if(tar[indexTar] in this.Table[stack[stack.length-1]]){

                let tmp=this.Table[stack[stack.length-1]][tar[indexTar]];
                stack.pop();
                if(tmp==="$")
                    continue;
                stack=stack.concat(tmp.split('').reverse());
            }else{
                alert("The pattern string does not match the grammar!");
                this.analyseTable=[];
                break;
            }
        }
        this.analyseTable.push(["#","#"," "]);
    }
    initFirstList(){
        this.FirstList=[];
        for(const key1 in this.First){
            let tmp=[];
            for(const key2 in this.First[key1]){
                for(const key3 in this.First[key1][key2]){
                    tmp.push(this.First[key1][key2][key3]);
                }
            }
            tmp=tmp.join(',');
            this.FirstList.push([key1].concat(tmp));
        }
    }
    initFollowList(){
        this.FollowList=[];
        for(const key1 in this.Follow){
            let tmp=[];
            for(const key2 of this.Follow[key1]){
                tmp.push(key2);
            }
            tmp=tmp.join(',');
            this.FollowList.push([key1].concat(tmp));
        }
    }
    initGrammer(){
        /*
            分解语法
            VT:终结符
            VN:非终结符
            S:文法开始符
            PROD:产生式
        */
        let partten=/\{(.*)\}/;
        this.Grammer={};
        let tmp=partten.exec(this.originGrammer[0])[1].split(',');
        this.Grammer.VT=Array.from(tmp);

        tmp=partten.exec(this.originGrammer[1])[1].split(',');
        this.Grammer.VN=Array.from(tmp);

        this.Grammer.S=this.originGrammer[2][0];

        tmp=partten.exec(this.originGrammer[3])[1].split(',');
        this.Grammer.PROD={};
        Array.from(tmp).forEach(nodes=>{
            let temp=nodes.split("->");
            this.Grammer.PROD[temp[0]]=temp[1].split('|');
        });
        this.printGrammer="";
        this.printGrammer=this.printGrammer.concat("VN:"+this.originGrammer[0]+"\n");

        this.printGrammer=this.printGrammer.concat("VT:"+this.originGrammer[1]+"\n");
        this.printGrammer=this.printGrammer.concat("S:"+this.originGrammer[2]+"\n");
        this.printGrammer=this.printGrammer.concat("PRODUCT:\n"+this.originGrammer[3].split(',').join('\n'));
    }
    initFirst(){
        this.First=this.initSet(this.Grammer.VN);
        //console.log(this.First);
        this.Grammer.VN.forEach(nodes=>{
            if(this.First[nodes]==false)
                this.getFirst(nodes);
        })
    }
    initFollow(){
        this.Follow=this.initSet(this.Grammer.VN);
        this.Follow[this.Grammer.S]=['#'];
        this.Grammer.VN.forEach(nodes=>{
            if(nodes==this.Grammer.S||this.Follow[nodes]==false)
                this.getFollow(nodes)
                //this.Follow[nodes]=this.connectArray(this.Follow[nodes],);
        })
    }
    initTable(){
        this.Table={};
        this.Grammer.VN.forEach(nodes=>{
            this.Table[nodes]={};
        });
        this.Grammer.VN.forEach(node1=>{
           this.First[node1].forEach(node2=>{
               for(const key in node2){
                   if(node2[key]==='$'){
                       this.Follow[node1].forEach(node3=>{
                           this.Table[node1][node3]=key;
                       })
                   }else{
                       this.Table[node1][node2[key]]=key;
                   }
               }
           });
        })
    }
    initTableList(){
        this.TableList=[];
        this.TableList.push([' '].concat(this.Grammer.VT).concat('#'));
        this.Grammer.VN.forEach(node=>{
            let tmp=[];
            for(let i=0,len=this.Grammer.VT.length+2;i<len;i++){
                tmp.push(' ');
            }
            tmp[0]=node;
            for(const x in this.Table[node]){
                let indx=this.TableList[0].indexOf(x);
                tmp[indx]=this.Table[node][x];
                //this.TableList[index][indx]=this.Table[node][x];
            }
            this.TableList.push(tmp);
        });
    }
    initSet(tar){
        let temp={};
        tar.forEach(nodes=>{
            temp[nodes]=[];
        });

        return temp;
    }
    getFirst(tar){
        if(!this.Grammer.PROD.hasOwnProperty(tar))return [];
        this.Grammer.PROD[tar].forEach(nodes=>{
            //是否非终结符开头，是否为空字结尾
            let allowContinue=true;
            for (const iterator of nodes) {
                //终结符或空字开头
                if(!allowContinue) break;
                allowContinue=false;
                if(this.Grammer.VT.indexOf(iterator)>-1||iterator === '$'){
                    let tempObj={[nodes]:iterator};
                    if(this.First[tar].indexOf(tempObj)===-1)
                        this.First[tar].push(tempObj);
                    break;
                }else if(this.Grammer.VN.indexOf(iterator)>-1){
                    let tmp;//保存first集
                    if(this.First[iterator]==false){
                        this.First[iterator]=this.getFirst(iterator);
                        tmp=this.First[iterator];
                    }else{
                        tmp=this.First[iterator];
                    }

                    for(const value of tmp){
                        for (const key in value) {
                            //检查是否有空字
                            //如果有则消除，并标记，之后需要移动指针
                            if(value[key]==='$'){
                                allowContinue=true;
                                continue;
                            }
                            let tempObj={[nodes]:value[key]};
                            if(this.First[tar].indexOf(tempObj)===-1)
                                this.First[tar].push(tempObj);
                        }
                    }
                }else{
                    console.log("error :there is and unknown code "+iterator);
                    break;
                }
            }
            if(allowContinue) {
                let tempObj = {[nodes]: '$'};
                if (this.First[tar].indexOf(tempObj) === -1)
                    this.First[tar].push(tempObj);
            }
        });
        return this.First[tar];
    }
    getFollow(tar){
        for(const key in this.Grammer.PROD){
            let value=this.Grammer.PROD[key];
            value.forEach(node1=>{
                for(let i=0,len=node1.length;i<len;i++){
                    if(node1[i]===tar){
                        if(i===len-1){
                            if(tar!==key){
                                if((key===this.Grammer.S&&this.Follow[this.Grammer.S].length===1)
                                    ||this.Follow[key] == false){
                                    this.Follow[key]=this.getFollow(key);
                                    this.Follow[tar]=this.connectArray(this.Follow[tar],this.Follow[key]);
                                }else{
                                    this.Follow[tar]=this.connectArray(this.Follow[tar],this.Follow[key]);
                                }
                            }
                        }else{
                            let str=node1.substring(i+1);
                            let tmp=this.FollowFromFirst(str);
                            let index=tmp.indexOf('$');
                            if(index>-1){
                                tmp.splice(index,1);
                                this.Follow[tar]=this.connectArray(this.Follow[tar],tmp);
                                if(tar!==key) {
                                    if ((key == this.Grammer.S && this.Follow[this.Grammer.S].length === 1)
                                        || this.Follow[key] == false) {
                                        this.Follow[key]=this.getFollow(key);
                                        this.Follow[tar]=this.connectArray(this.Follow[tar],this.Follow[key]);
                                    } else {
                                        this.Follow[tar] = this.connectArray(this.Follow[tar], this.Follow[key]);
                                    }
                                }
                            }
                            //console.log(result instanceof Array);
                            this.Follow[tar]=this.connectArray(this.Follow[tar],tmp);
                        }
                    }
                }
            })
        }
        return this.Follow[tar];
    }
    FollowFromFirst(tar){
        let allowContinue=true;
        let result=[];
        for(const value of tar){
            if(!allowContinue)
                break;
            allowContinue=false;
            if(this.Grammer.VT.indexOf(value)>-1){
                allowContinue=false;
                if(result.indexOf(value)===-1){
                    result.push(value);
                }
            }else if(this.Grammer.VN.indexOf(value)>-1){
                for(const firstSet of this.First[value]){
                    for(const key in firstSet){
                        if(firstSet[key]==='$'){
                            allowContinue=true;
                            continue;
                        }
                        if(result.indexOf(firstSet[key])===-1){
                            result.push(firstSet[key]);
                        }
                    }
                }
            }else{
                console.log("error :there is and unknown code "+value);
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
    connectArray(src,tar){
        tar.forEach(value=>{
            if(src.indexOf(value)===-1){
                src.push(value);
            }
        });
        return src;
    }
}