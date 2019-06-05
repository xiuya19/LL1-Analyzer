class DivTable{
    constructor(options){
        this.Row=options.Row;
        this.Col=options.Col;
        this.ColumnRatio=options.ColumnRatio;
        this.ColumnBaseSize=options.ColumnBaseSize;
        this.data=options.data;
        this.init();
    }
    divPackage(str,callback){
        return "<div "+callback()+">"+str+"</div>";
    }
    init(){
        this.table="";
        this.data.forEach(node1=>{
            let row="";
            let index=0;
            let size,ratio;
            node1.forEach(node2=>{
                ratio=this.ColumnRatio[index];
                size=this.ColumnBaseSize[index++];
                row=row.concat(this.divPackage(node2.toString(),function () {
                    return "style=\"flex-grow:"+ratio+";width:"+size+";height:100%;border: 1px solid #000;box-sizing: border-box;\"";
                }));
            });
            row=this.divPackage(row,function () {
                return "style=\"display:flex;height:28px;line-height: 28px;box-sizing: border-box;\"";
            });
            this.table=this.table.concat(row);
        });
        //this.table=this.divPackage(this.table);
    }
}