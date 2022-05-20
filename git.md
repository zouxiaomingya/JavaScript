**1.如何查看 git 操作？**

答：.git 文件中会记录每次用户的每次操作，可以通过 cat .git/config 查看配置

**2.Git 基本配置**

（1）配置用户基本信息：

    $git config --global user.name zouxiaomingya
    $git config --global user.eamil 13870939865@163.com

(2)配置行尾及颜色：
$git config --global core.autocrlf true
$git config --global core.autocrlf input
$git config --global color.ui auto
$git diff
说明：红色为正在进行处理、绿色通常指运行正常

(3)Git config 优先级

优先级 local>global>system

**3.init --项目初始化**

(1)建立一个目录并初始化仓库

    $mkdir git-tutorial
    $cd git -tutorial
    $git init

说明：在 github 上新建仓库的时候，可以指定是私有还是公开，可以创建一个 readme 文件来对项目做一些简单说明，在.gitignore 通常用来说明哪些文件不希望纳入版本控制之中

(2)如何将本地仓库与 github 仓库（远程）连接
$git remote add origin xxxxx.git
$git push -u origin master

**4.commit --源码提交**

(1)command(命令行方式)

    $ls -la 可查看当前目录下的文件状态，如果有修改会有颜色区分，有点类似于git status，需要生成、查看或编辑文件时touch、cat/vi xx.index.html;
    $git add xx.index.html 将文件添加到暂存区的持久化容器中
    $git status 可以查看输出状态已经不同了，由红色变成绿色，每一次提交更改都需经过暂存区，这是Git架构的关键部分
    $git commit -m "modify introduce" 如果直接git commit,git实际上会打开一个文本编辑器，让你输入，输入完后，执行esc + :wq，否则将不会允许提交

（2）github 官网

点击进入对应的文件，点击 edit,在浏览器中会提供一个简单的文本编辑器，编辑完成后输入 commit summary 也可以进行 commit change。

（3）桌面版 github

可以选择暂存哪些文件然后提交，支持批处理，比在 github 官网上要有效率多了，可以作为比较完美的对命令行的方式做个替代

**5.diff --类似于 SVN diff 查看文件更改**

常规使用：
$git diff
特殊场景(使用技巧)：

（1）假设已经存档了某些文件（即 add 进了暂存区），想查看暂存区文件和最近提交的历史文件有什么区别？

    $git diff --staged

(2) 如果想继续修改暂存区的文件（暂存并不意味着不能再次修改它），如果继续对同一文件进行修改，在 git status 的时候会提示文件已暂存，未缓存修改，diff 命令可以帮助跳过正在暂存的区域,并告知在最后一次 commit 之后所做的所有修改。输入以下命令，将工作树和头一次提交相比较。

    $git diff HEAD

(3) 上述命令可能只能得到一个比较笼统的修改范围（某行或某块小区域），不能体现到具体的某个小改动（某个文字或数字），这是 Git 处理文本差异的方式，有时并不十分有用，可以加上
$git diff --color-word或者$git diff --word-diff
(4)阻止 diff 显示修改的内容，仅仅显示更改了的文件,针对这类场景(可能只是需要锁定一个被修改过的特定文件)

    $git diff -stat

**5.log --日志输出，了解仓库的管理**

简要说明：在我们的终端直接键入$git log, 会显示项目的 commit 信息，最上面的记录是我们最新的提交，最早的提交位于最底部，每条日志信息由四部分构成。如果有多次提交，可以用上下方向键来滚动提交内容。

1.40 个字符的十六进制编码--提交的唯一标志，提交引用；

2.提交者的用户名和邮件地址；

3.提交发生的时间；

4.提交的内容本身。

(1).过滤日志信息,仅显示 commitid 简写和提交的内容，很清晰的了解整个项目的脉络和演变。

    $git log --oneline

(2).查看每次提交包含了哪些文件,相当于在$git log 的基础上多出了一项，即文件的变更（代码的增删改查）信息，相对改变也会以加减符号列出。

    $git log --stat

(3).查看每次提交哪些内容改变了,相当于在$git log --stat 的基础上多出了一项，具体哪些内容改变了，有点类似于 diff 操作，只不过针对的对象不同，这里针对的是已经 commit 过的。

    $git log --patch

(4).以上功能可以进行排列组合来得到想要的输出日志,具体指代含义也是一目了然，不予赘述。

    $git log --patch --oneline 也可以 $git log --stat --oneline

(5).展示提交结构为$git log --graph,也可以增加几个选项（排列组合）,来简洁输出并得到一些其他的信息。这里的话会给我们展示每次提交的一行概括，包含提供每个分支的标签以及提交的其他的标志。

    $git log --graph --all --decorate --online

**6.remove --删除文件**

简要说明：此段只要是列举出删除文件的两种方式，一种是 add,还有一种是 remove。

(1)如果只有一个文件要删除，直接$git rm file.txt,会从文件系统中删除该文件，并且会暂存这个文件已经被删除的事实，可以通过git status查看。如果提交了，这个文件不会从之前的历史中消失，但会从未来的提交中消失。有时候未留意直接$rm file.txt,发现文件已经消失，但是通过 git status 查看时发现改变没有被暂存，这时依然可以通过$git rm 命令来暂存它(并不在意文件已经不存在了)。
$git rm file.txt(后面两行目的一致，意义基本相同)
$rm file.txt
$git rm file.txt

(2)在实际的清除场景中，可能有许多文件要删除，不可能每次通过命令行来操作。git status 时发现已经有些文件已经被删除了，通过其他途径，这时通过$git add -u .会遍历工作树，寻找之前已经识别的文件，现在要消失的文件，他会它们作为新的删除来暂存。后面这个.是当前工作目录的简写。当它看到 add 时会从当前坐在目录低轨道最深处去寻找能够添加的文件，或者说在这个场景下能够删除的所有文件。

    $git add -u .

(3)有时可能需要删除一个文件，但并不想从文件系统中真正的删除它。换个说法，想告诉 git,不再跟踪这个文件，但是把它保留在工作树中，具体命令如下所示。如果不想被不在跟踪的这个文件影响，可以用 ignore 来处理，后续补充说明。

    $git rm --cached file.txt

以上操作也可通过 github 官方桌面端实现，很方便。

（4）取消暂存文件 (就是 撤回 git add 添加的文件)
git restore --staged xxxx.txt

**7.move --移动文件**

简要说明：主要是介绍几种移动文件的不同方式，通过使用 mv 命令以及 add 命令。

(1)mv 命令处理。通过 git status 可以看到 git 已经暂存了 move 发生的事实。

    $git mv 原路径 目标路径 ==>  例：git mv head.jpg source/head.jpg

如果只是简单的使用 mv 命令移动文件，忘了告诉 git。git 注意到某个地方出现了一个本不应该出现的新文件，同时注意到原来的文件区域已经被删除掉了，这时可以通过以下命令开解决它。

    $mv prod.log production.log
    $git rm  prod.log //删除原来的文件
    $git add production.log //添加新文件

(2)add 命令处理。在实际移动过程中个，可能会通过 finder 以及 ide 等其他渠道来移动文件，类似于批处理，这个时候用以下命令即可处理，.代表从当前目录无限向下递归。

    $git add -A . //发现所有移动过去的新文件，删除所有原来的旧文件

上述移动文件简单情况下可以这样处理。在实际应用过程中，从一个目录移动到另一个目录时可能会改变一点文件，这种是不受影响的。
$git add -A tutorials/
$git status //可得知 git 仍然把它看做一次移动
$git commit -m "moved lesson4 into the proper subfolder" //每一次最终都要 commit

(3)用日志命令来展示文件在移动过程中的历史。
$git log --stat --tutorials/intermediate/lesson6.html(当前/最新的路径) =>跟 SVN 选中文件显示日志一个效果，不会定位到移动的日志。
$git log --stat -M --follow --tutorials/intermediate/lesson6.html (告诉日志在文件移动过程中跟踪文件，just can reach the result)

在提交移动时 git 会提供一个相似度阈值，默认为 50%，超过这个值 git 会在移动过程中追踪它。认为它是一个移动而不仅仅是删除和添加。但是这个阈值可以我们自己配置，通过在开关-M 之后加一个数字。
**8.ignore --忽视、避免暂存或提交文件**

(1)The .gitignore File。在工程中创建一个.gitignore 文件，并上传到仓库,ignore 匹配规则应用到目录中的所有文件。前面加个#号可以添加注释，鼓励这种做法。具体处理如下，也可以直接在 github 官网上直接进行编辑。

    $touch .gitignore
    $git add .gitignore
    $git commit -m "Preparing to ignore temporary files"
    $vim .gitignore
    insert:
    		#sass缓存不纳入版本管理
    		.sass-cache
    		*.log
    		tmp/
    :wq

(2)选择忽略模式。如果想查看仓库中哪些文件被忽略了，又不想打开.gitignore 看规则。

    $git ls-file --others --ignored --exclude-standard //显示出被忽略的文件

**9.branch --创建、删除/转换分支**

简要说明：master 主干是对产品特性的一种体现，当我们需要多业务并行开发就可以新建一个分支，然后在分支上自由工作，保证我们安全工作并远离 master 分支。

(1)创建和删除分支(Creating&Deleting)

    $git branch => 查看分支
    $git branch app-startup-scripts(新分支名字)
    $git branch -d 分支名字 =>如果他没有完全被合并将会报错，告诉你将-d替换成-D，忽略未合并的事实，强制删除，后续章节会讲解合并

(2)转换/切换分支(Switching)

值得一提的是我们切换分支时任何出现在面板区的工作或者工作目录都会跟着我们转过来，如果我们处于这个活动目录或者面板区的文件被覆盖的话是无法切换到新分支的。什么意思了？打个比方在当前分支下有个 index.html,你 add 进暂存区了，但是没有提交，然后自己又在这个文件目录下，就会出现这种情况。还有一种情况你 $ls 的时候可能看到文件消失和重现，在切换分支的时候不用担心这个，他们会待在各自的分支里，直到被合并为止。

    $git checkout 分支名字

**10.checkout --改变分支**

(1)查看当前在那个分支可以通过 git branch(带\*号的)或者 git status

(2)除了上述提到的用来切换分支之外，另一个目的就是把你项目下的工作树、目录和文件等东西做一个更加详细的 commit。执行完下面这条命令后，会处于 detached HEAD(游离状态)，在这个状态下进行的 commit 不会对你的远程分支产生影响。要深入理解游离状态以及应用可参考https://blog.csdn.net/trochiluses/article/details/8991701，讲的很透彻。

    $git checkout 提交引用（commit Id）

(3)checkout 另一个作用是用来撤销和丢弃编辑的内容。

    $git checkout index.text (丢弃当前修改，保持跟暂存区/上一次提交的一致)

(4)缩短一些其他步骤，如果想创建一个分支然后切换到它，只需要运行：

    $git checkout -b 新分支的名字

**11.merge --分支合并**
简要说明：把分支和多条线的历史操作汇聚起来。
1.git merge
通过 merge 可以把两个 j 或者多个分支的历史汇聚起来然后在工作树中展示，所有这些分支全部 commit 的累积结果。对于一个经典的工作流，我们通过运行如下指令来合并我们需要的 commit。

        $git merge 分支名字

2.解决冲突
合并过程中遇到冲突意味着两个文件的变化非常的相似，Git 不知道如何去解决这些冲突，或者把他们合并在一个文件里。
为了解决这个我们可以直接 git status 查看冲突文件，然后手动解决冲突在 git add-git commit 一遍

3.--abort 指令
有一种情况是遇到了文件冲突，但是并不想马上解决它或者只想抛弃它，这个时候可以运行以下指令,这将会从你当前分支的最后一次提交中清除你的工作目录，并且同样会清除暂存区

    $git merge --abort

4.--squash 指令
如果不想把历史汇聚起来，但是想要一个具体分支中的全部 commit 简单的运行。

    $git merge --squash 目标分支上的名字

在你目前切换到的分支上创建一个新的提交，这代表了发生在目标分支上的所有改变

5.清除已经合并完的分支
一旦成功合并完了分支，没必要保存分支标签或者名字，因为可以从最终的分支或者当前的分支看到所有的历史，所有的提交，要做的就是

    $git branch -d 分支名字

**12.Network** 1.远端(Remotes)

    $git remote add 目的地名字 整个URL地址
    $git remote add set-url 目的地名字 修改URL地址
    $git remote rm 远端名字
    $git remote -v 得到全部的输出

远端追踪的分支是分支间的中间人，这些分支有一些不同的唯一原因是在所有分支名字前面有一个前缀用来响应远程控制的，大部分情况加这个 origin/。

2.fetch、pull、push
fetch 命令本身是去 GitHub.com 抓取任何信息下载下来，把它放在远程追踪分支里。

    $git fetch origin
    $git pull origin
    $git push origin

**13.图形化用户界面**
推荐 sourceTree , github for mac , windows GUI, 免费的远程仓库，码云以及 github for personal

**14.Reset**
简要说明：git reset 是一个允许你塑造仓库历史的命令，无论你想撤销一些修改还是把你的 commit 弄得不一样，都可以用这个来实现。这里主要简述三种模式，分别是 soft、mixed、hard 模式

mixed 模式，它修改了历史和工作目录，所以叫做混合模式，修改了多个东西。
soft 模式，选取一条或多条 commit，把他们的全部改变放回到暂存区，让你在此基础上继续创建新的提交
hard 模式，是一个具有破坏性的操作，这意味着要删除你不在想保存的东西

1.mixed 是推荐模式，大部分新手都是用它，因为它们会显示在 status 命令中 d。当你在暂存区有一些改动的时候，输入 git status,我们可以看到会出现 git reset head <file>,这允许我们把这些改变移除暂存区，把它们放回在工作目录中，使用 mixed 选项。

2.soft 是这样一种方式，我把一些改动，这些改动可能太过分散，但这些 commit 都属于同一个事项把它们全部弄到一起通过以下命令，所以通过以下命令可以将这 5 条 commit 当做一次提交，压缩进暂存区

    $git reset --soft HEAD~5 将最新的5条提交

3.如果你想完全丢掉一些你的工作，可能想丢掉一些不再发挥作用的改动，可以通过以下指令来完全丢掉这些提交

    $git reset --hard

扩展：有另外一个相像的命令经常 l 拿来与 reset 讨论--checkout，两者其实有些不同，它经常操作的是整个仓库的历史，checkout 更加关注在一个目录或者文件级别的精度上，不是撤销或者改变某一条提交，我们可以回到某一个特定文件的某次提交历史上，然后把这个文件和版本拉回到我们当前的工作目录。

**15.Reflog**
1、 Git reflog
它会追踪你对修改内容的修改。

Git 用户首先会发现他们在仓库的每次提交是一个实时的记录快照，会展示代码库是怎么发展的，但是更高级的 git 用户会发现 reflog 会追踪制造的 commit 以及丢弃的 commit。这提供了一个 30 天的缓冲时间，在这期间，你可以从任何错误中回复，包括 git reset 命令带来的不好的部分，分支的删除或者可能 rebase 消失了。

Git reset 对每个分支都很特别，你会注意到，如果你选择去观察，在.git 目录下有一个子目录叫做 logs，在那下面，每个分支都有具体的文件，你本地仓库里有的分支。每个这些日志都追踪你做的变动，包括前进和后退方向的。Git reflog 命令是做到这个的用户接口，它打印出大部分最近的历史，分页机制让你可以通过已经发生的旧的入口去到你目前已经切换到的分支上。

2、 Using a GUI
Reflog 提供的线性历史是很难查看的，哪一个是孤单的分支？哪一个是不在代码库里一部分的提交，一些有技巧和创造性的命令行可以把 reflog 的结果通过管道到一个图形用户界面：

    $ gitk --all ‘ git reflog | cut -c1-7 ’ &

这样很容易看出来哪些分支是独立的，哪些提交不再是这个分支的一部分，哪些东西你想要恢复，通过捕获他们的哈希值和使用 reset --hard 命令。

3、 Frequent commits

Git reflog 是你做频繁提交的动力，频繁提交意味着，在 reflog 里有历史存储着，不管你 reset 了它们，抛弃了提交，修改它们还是犯了一个错误。没有提交的所有东西，在工作区或者暂存区都是有风险的。但是，如果它被提交了，你可以恢复它们，这最近的 30 天有一个保证措施允许你采取大的，勇敢的步骤使用 Git 的其他特性。

**15.Rebase**

**16.Stash**

常用 git stash 命令：

（1）git stash save "save message" : 执行存储时，添加备注，方便查找，只有 git stash 也要可以的，但查找时不方便识别。

（2）git stash list ：查看 stash 了哪些存储

（3）git stash show ：显示做了哪些改动，默认 show 第一个存储,如果要显示其他存贮，后面加 stash@{$num}，比如第二个 git stash show stash@{1}

（4）git stash show -p : 显示第一个存储的改动，如果想显示其他存存储，命令：git stash show stash@{$num} -p ，比如第二个：git stash show stash@{1} -p

（5）git stash apply :应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即 stash@{0}，如果要使用其他个，git stash apply stash@{$num} ， 比如第二个：git stash apply stash@{1}

（6）git stash pop ：命令恢复之前缓存的工作目录，将缓存堆栈中的对应 stash 删除，并将对应修改应用到当前的工作目录下,默认为第一个 stash,即 stash@{0}，如果要应用并删除其他 stash，命令：git stash pop stash@{$num} ，比如应用并删除第二个：git stash pop stash@{1}

（7）git stash drop stash@{$num} ：丢弃stash@{$num}存储，从列表中删除这个存储

（8）git stash clear ：删除所有缓存的 stash

**17. merge**
当前分支合并远端的 master
//查询当前远程的版本
$ git remote -v
```
  //获取最新代码到本地(本地当前分支为[branch]，获取的远端的分支为[origin/branch])
  $ git fetch origin master  [示例1：获取远端的origin/master分支]
  $ git fetch origin dev [示例2：获取远端的origin/dev分支]

  //查看版本差异
  $ git log -p master..origin/master [示例1：查看本地master与远端origin/master的版本差异]
  $ git log -p dev..origin/dev   [示例2：查看本地dev与远端origin/dev的版本差异]

  //合并最新代码到本地分支
  $ git merge origin/master  [示例1：合并远端分支origin/master到当前分支]
  $ git merge origin/dev [示例2：合并远端分支origin/dev到当前分支]
```md


**18. git删除并添加忽略已提交的文件或目录**

```
有时候上传远程仓库之后发现不小心把应该要忽略的文件或目录给push上去了（如.idea目录），这时候再去编辑project目录下的.gitignore文件并添加忽略已经不起作用了，因为.gitignore只对从来没有commit过的文件起作用。

这时我们可以通过git命令删除已提交的文件或目录，命令如下：

git rm --cached -r .idea
然后编辑project目录下的.gitignore文件（不同位置文件或目录的忽略编辑不同位置的.gitignore文件），比如添加忽略.idea目录，如下：

.idea
在.gitignore文件里边添加上面的内容，然后再进行commit和push，这样就删除了远程的已提交的内容，这样下次提交的时候就不会再提交上面忽略的内容了。

```md