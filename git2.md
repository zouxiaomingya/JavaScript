Git 常用命令
帮助命令
配置
本地命令
设置邮箱
初始化
查看本地分支
删除本地分支
创建分支
查看状态
添加新文件
Commit 修改
回滚
检查修改内容
合并到上次提交
放弃本地修改或新增的文件
切换分支
搜索提交log
提交历史 log日志
查看历史提交的内容差异
移除文件
移动文件
ignore 文件
SSH 命令
Git Remote 相关命令
Git Rebase
Git cherry-pick
Squash
Changing remote URL
帮助命令
git help command // eg: git commit help
windows 打开默认的浏览器显示帮助内容， mac直接显示

配置
git config --global setting value
示例：git config --global user.name "Your Name"
示例：git config --global user.email "you@someplace.com"
git config --global --list // 列出全局配置项
配置内容保存在当前用户目录下的.gitconfig文件中

本地命令
设置邮箱
设置全局邮箱
方式一： 运行命令： git config --global user.email "joe.lea@foxmail.com" 方式二: 编辑文件 .gitconfig, 一般在用户目录下，上面的命令运行后也同样会修改这个文件

[user]
name =xiaoming
email = xiaoming@qq.com
设置项目的提交邮箱
编辑文件 .git/config 即可

github 项目只有设置了提交者的邮箱，才会在contibutors中you展示。 比如：https://github.com/choelea/markdown-cms/graphs/contributors

初始化
方式一：

cd projects/
git init git-demo  // projects下面创建文件夹 git-demo, 并初始化； 初始化其实就是在文件夹下面创建了相关内容存放在.git 隐藏文件夹下面
方式二：

cd projects/
mkdir website
cd website/
git init // 初始化
方式三： 大多数的方式，我们从clone一个git 库开始的。

git clone 'url'
查看本地分支
git branch -vv  // 列出本地分支 * 标识当前分支
git branch -a // 列出所有分支
删除本地分支
git branch -d <BranchName>
创建分支
git checkout -b <BranchName>  // 创建分支并切换至新建分支
查看状态
git status // Shows which files have been modified in the working directory vs Git's staging area.
添加新文件
git add file-name  // Adds the new or newly modified file-name to Git's staging area (index).
当很多文件修改，而且这些文件不属于同一个功能修改，想分开多个commit来提交的时候，可选择通过git add <file> 先将指定的文件Stage，然后使用git commit -m 来只提交stage的文件。

Commit 修改
git commit -m "A really good commit message" // Commits all files currently in Git's staging area.
上面的命令只有所有的文件都在staging area在有效。 git commit -am "A really good commit message" 可以省掉git add这步，不过新文件必须先add下。

回滚
git add . // Add all new and newly modified files.
git reset HEAD file-name // Unstage the specified file from stage area. 修改的内容还在
git checkout -- file-name // 回滚本次修改
git reset --hard HEAD^  // 回滚到远程仓库的版本，放弃本地所有包括commit的修改
检查修改内容
git diff // 查看unstage状态下的文件的修改内容，staged的无法查看
合并到上次提交
git add . // 将修改的文件 stage
git commit --amend // 将当前的staged的修改合并到上次commit，并打开编辑器修改commit
git commit --amend -m "New commit message" // 将当前的staged的修改合并到上次commit，并实用新的Message
使用Interactive Rebasing/squash也可以达到合并的效果，区别就是一个是事先（commit 前）就合并，一个是事后（commit 后）合并。

放弃本地修改或新增的文件
放弃modified的文件

git checkout <file> // 重新checkout文件file，相当于丢掉了本地的修改
git checkout src/* // 使用通配符来checkout src文件夹下面所有的修改
git reset --hard // 丢掉所有的修改modified 文件
git clean -fd    // 移除所有untrack的文件和文件夹 
git clean -fd src/* // 移除src目录下面所有的新增的文件
git clean -fd 中 -f means force, -d means 'remove directories'

切换分支
切换分支前必须保证工作空间是干净的。（没有未提交的修改和新增）

git checkout branchename // 切换到branchname分支
搜索提交log
便捷的方式找出谁提交的这行代码git log -S "mention here line of code" [file-path] 示例：

git log -S "businessService.findAll()" src/main/java/net/shopxx/controller/admin/BusinessController.java
提交历史 log日志
git log  // 默认不用任何参数的话，git log 会按提交时间列出所有的更新，最近的更新排在最上面。
git log --oneline --graph --decorate --color
git log -- <filepath>  // 查看某个文件的日志
查看历史提交的内容差异
git log -p -2
我们常用 -p 选项展开显示每次提交的内容差异，用 -2 则仅显示最近的两次更新：

移除文件
方式一：完全通过git命令

git rm debug.log  // remove and stage the change
git commit -m 'remove file debug.log'
方式二： 非git 命令删除文件后，运行下面的命令

git add -u // git 2.0 以前的版本  stage删除的change
git add file-name // git 2.0 后也可以通过这个命令达到上面的命令的效果
git commit -m 'commit message'
移动文件
git mv index.html web/  // 移动index.html 到web文件夹内。 命令完成后直接进入staging 状态
git commit -m 'move index.html into web folder'
ignore 文件
编辑 .gitignore 文件

SSH 命令
windows cmd并没有自带ssh命令，我们可以通过git bash命令窗来运行这些命令。 假定在当前用户的目录下：

cd .ssh
ssh-keygen -t rsa -C "your email" // 生成SSH Key， 将id_rsa.pub公钥配置到github/bitbucket 等服务器上
ssh -T git@github.com // 验证SSH 配置成功
Git Remote 相关命令
关联一个远程的Repo。 （针对前两种初始化方式，一般情况用不上）

git remote add remote-name remote-repository-location // 示例: git remote add origin git@github.com:choelea/keycloak-demo.git
git push -u remote-name branch-name // 示例: git push -u origin master;  The -u parameter is needed the first time you push a branch to the remote.
git remote -v // list the names of all the remote repositories