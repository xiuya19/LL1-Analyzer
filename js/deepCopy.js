//util作为判断变量具体类型的辅助模块
var util = (function(){
    var class2type = {};
    ["Null","Undefined","Number","Boolean","String","Object","Function","Array","RegExp","Date"].forEach(function(item){
        class2type["[object "+ item + "]"] = item.toLowerCase();
    })

    function isType(obj, type){
        return getType(obj) === type;
    }
    function getType(obj){
        return class2type[Object.prototype.toString.call(obj)] || "object";
    }
    return {
        isType:isType,
        getType:getType
    }
})();

function copy(obj,deep){
    //如果obj不是对象，那么直接返回值就可以了
    if(obj === null || typeof obj !== "object"){
        return obj;
    }
    //定义需要的局部变脸，根据obj的类型来调整target的类型
    var i, target = util.isType(obj,"array") ? [] : {},value,valueType;
    for(i in obj){
        value = obj[i];
        valueType = util.getType(value);
        //只有在明确执行深复制，并且当前的value是数组或对象的情况下才执行递归复制
        if(deep && (valueType === "array" || valueType === "object")){
            target[i] = copy(value);
        }else{
            target[i] = value;
        }
    }
    return target;
}