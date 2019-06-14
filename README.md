# LL1-Analyzer
Compilation principle，LL1，javasciprt  
编译原理实验，实现词法分析器，LL1文法

先创建文法文件，命名任意（不可为中文）  

文件存有语法结构，如下  

> {VT}  
> {VN}  
> S  
> {PRODUCTION}  

其中  
VT:终结符集合，用","隔开  
VN:非终结符集合，用","隔开  
S:文法开始符  
PRODUCTION:产生式集合，用","隔开  

**举例**  
{a,e,d,f}  
{B,C,E}  
E  
{E->aBBd,B->eCf,C->d|$}  

点击"选择文件"，上传语法文件  
随后会自动生成FIRST集和FOLLOW集  
把要分析的语句填入input中，点击分析即可得到分析栈

# 更新日志
## 2019.6.14 
- 更新词法分析，可以通过切换按钮切换；词法分析得到的结果会根据词法表更换（例如标识符会换成终结符i）作为语法分析的输入
- 更换DivTable.js中样式的插入，改为使用插入style标签，通过类修改样式
