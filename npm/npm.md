npm：node的包管理工具，是在命令行做管理。  

cnpm：淘宝的npm镜像文件  npm流程： 

 \1. npm init (-y) 创建package.json文件 

 \2. npm install 包名（eg:gulp） //下载包 

 \3. npm install 包名 -g //将包下载到全局  

\4. npm uninstall 包名 (-g) //-g是卸载安装在全局的包文件  

\5. npm install gulp –save -dev(以gulp代替“包名”) //下载本地包并配置到package.json中  ps:  –save 可以写成 -S， 

保存在package中的devDependencies中  –save -dev 可以写成 -D 保存在dependencies中  install 写成 i  ps:  devDependencies 随程序一起上传到线上，项目依赖  dependencies 只用于本地开发，在上传时不需要上传，开发依赖  

\6. npm info gulp //查看包信息，其中可以查看历代版本号 

 \7. npm i gulp@2 / @2.7 / @2.7.0 -D //更换本地的版本，省略的以满足条件的最高版本安装  ps: 版本号讲解  3. 9. 1  3.主版本号，每次变化都会发生很大的变化，比如H4到H5  9.子版本号，每次变化会增添一些新功能  1 是用来记录bug的修正  

8.npm outdated （gulp） //显示所有包的已安装版本，程序所需版本，包的最新版。若无最新则不显示。可以全部查看，也可以单独查看某一个包 

 9.npm update //更新到最新的包 

 \10. npm ls //查看包 

 \11. nrm ls //查看所有支持的源 

 \12. nrm test //测试哪个源的速度最快  

\13. nrm use cnpm //将源切换到cnpm上，即使用cnpm
