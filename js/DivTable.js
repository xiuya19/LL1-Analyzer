class DivTable{
    constructor(options){
        /*
        * ColumnRatio:列比例，数组形式
        * ColumnBaseSize:列初始大小*/
        this.Row=options.Row;
        this.Col=options.Col;
        this.ColumnRatio=options.ColumnRatio;
        this.ColumnBaseSize=options.ColumnBaseSize;
        this.ClassName=options.className;
        this.data=options.data;
        this.InitData();
        this.InitStyle();
    }
    divPackage(str,className){
        return "<div "+className+">"+str+"</div>";
    }
    InitData(){
        this.table="";
        this.data.forEach(node1=>{
            let row="";
            let index=0;
            let size,ratio;
            node1.forEach(node2=>{
                ratio=this.ColumnRatio[index];
                size=this.ColumnBaseSize[index++];
                row=row.concat(this.divPackage(node2.toString(),""));
            });
            row=this.divPackage(row,"class=\""+this.ClassName+"\"");
            this.table=this.table.concat(row);
        });
        //this.table=this.divPackage(this.table);
    }
    InitStyle(){
        this.style={};
        this.style["."+this.ClassName]="display:flex;height:28px;line-height:28px;box-sizing:border-box;text-align: center";
        this.style["."+this.ClassName+" div"]="height:100%;border:1px solid #000;box-sizing:border-box";
        for(let i=0;i<this.Col;i++){
            this.style["."+this.ClassName+" div:nth-child("+(i+1)+")"]="flex-grow:"+
                this.ColumnRatio[i]+";width:"+this.ColumnBaseSize[i];
        }

    }
    showStyle(){
        let result="";
        for(const index in this.style){
            result=result.concat(index.toString()+"{"+this.style[index]+"}");
        }
        return result;
    }
}

