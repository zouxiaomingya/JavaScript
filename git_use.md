### commit之后，想撤销commit
> git reset --soft HEAD^

注意，仅仅是撤回commit操作，您写的代码仍然保留。

这里撤回的是commit 暂缓区还是没有撤回，如果需要撤回暂缓区
> git reset HEAD

HEAD^的意思是上一个版本，也可以写成HEAD~1

如果你进行了2次commit，想都撤回，可以使用HEAD~2

后面的参数：
--mixed 
意思是：不删除工作空间改动代码，撤销commit，并且撤销git add . 操作
这个为默认参数,git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。

--soft  
不删除工作空间改动代码，撤销commit，不撤销git add . 

--hard
删除工作空间改动代码，撤销commit，撤销git add . 

注意完成这个操作后，就恢复到了上一次的commit状态。


### git 怎么撤销一次 merge


### git 修改已经提交过的所有 commit 的用户名和邮箱
#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="your-old-email@example.com"
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="your-correct-email@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags



### 
> push 代码出现问题：fatal: unable to access 'https://github.com/zouxiaomingya/JavaScript.git/': Failed to connect to github.com port 443 after 21090 ms: Timed out

```
先
git config --global --unset http.proxy
再
git push 
```

设置完成之后 
> pull 代码出现问题：fatal: unable to access 'https://github.com/zouxiaomingya/JavaScript.git/': OpenSSL SSL_read: Connection was reset, errno 10054l



git修改分支名称

想要修改为 newName

1. 本地分支重命名(还没有推送到远程)
git branch -m oldName newName


2. 远程分支重命名 (已经推送远程-假设本地分支和远程对应分支名称相同)
  a. 重命名远程分支对应的本地分支

  git branch -m oldName newName
  b. 删除远程分支

  git push --delete origin oldName
  c. 上传新命名的本地分支

  git push origin newName
  d.把修改后的本地分支与远程分支关联

  git branch --set-upstream-to origin/newName


### git 忽略已经曾经没有忽略过的文件，需要重新 cached 
规则很简单，不做过多解释，但是有时候在项目开发过程中，突然心血来潮想把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效，原因是.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交：

在版本控制目录下 右键—》Git bash here  打开命令行工具

$ 是提示符 每行 输入后 按 回车键 执行 

登录后复制 
$ git rm -r --cached .

$ git add .

$ git commit -m 'update .gitignore'
