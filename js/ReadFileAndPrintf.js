readFiles=function(fileId,target,callback){
     //读取文件，获取上传文件标签的这个对象
     let file1=document.querySelector(fileId);
     //上传文件触发对象
     file1.onchange=function () {
         //获取上传的文件
         //this指向input对象，它的属性中files保存了文件，通常以数组形式存在
         let fl1=this.files[0];
         //读取文件，创建读取文件的对象
         let fReader=new FileReader();
         //读取文件
         fReader.readAsText(fl1);
         //开始读取文件的加载事件
         fReader.onload=function () {
             //获取读取的结果
             let result=fReader.result;
             saveInSessionStorage(result);

            // let Odiv=document.querySelector(target);
            // Odiv.innerText=grammerPrintf(result);
            callback();
         }
     }
};
saveInSessionStorage=function(grammer){
    window.sessionStorage.setItem("Grammer",grammer);
};
grammerPrintf=function(result){
    return result;
};