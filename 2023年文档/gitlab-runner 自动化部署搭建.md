### 自动化部署大致原理

1. 开发者通过 git 连接远端仓库在修改代码后 通过 push 将代码推送到远端仓库中(假设使用的是gitlab)
2. gitlab 监听到 commit 变化之后触发 gitlab-runner 去执行项目下的 yml 文件脚本
3. 通过脚本一般会运行 install 、build等操作，然后将打包好的包拷贝到指定的服务器下的指定目录中
4. 通过 nginx 配置到打包路径。
5. 这个时候你访问 nginx 启动的服务地址+端口号就可以看到自己的项目了 

## 安装 GitLab

 

```
版本：gitlab 14.3.0
# 安装 GitLab，需要的时间比较长
yum -y install https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-14.3.0-ce.0.el7.x86_64.rpm
#编辑配置文件
vim /etc/gitlab/gitlab.rb
```

 

找到，`external_url`, 修改 `gitlab` 访问地址。可以是域名（请确保确定域名正确解析了），服务器IP，也可以加上端口。**设置端口时，请确保自己开放了对应的端口。可以参考上面提到防火墙问题**

```Bash
# 192.168.26.139 对应的就是服务器的IP，端口为 1874 

external_url 'http://192.168.26.139:1874' 
```

 

虚拟机没有设置静态ip的话，重启IP可能会变，最好还是设置一下，参考：[「虚拟机网络NAT模式配置静态IP - 陆小呆 - 博客园」](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fluxiaodai%2Fp%2F9947343.html%23_label1)

```C#
#重载配置文件，需要的时间比较长
gitlab-ctl reconfigure

# 开放 1874 端口
firewall-cmd --permanent --zone=public --add-port=1874/tcp

# 重载防火墙
firewall-cmd --reload
```

### gitlab 常用命令

```Bash
# 启动gitlab服务
sudo gitlab-ctl start

# gitlab服务停止
sudo gitlab-ctl stop

# 重启gitlab服务
sudo gitlab-ctl restart
```

### 测试 GitLab 是否成功

 

浏览器里打开，GitLab，第一次打开首页，一般都会提示你修改密码，如果没有，可以通过命令行的方式修改，参考这篇文章 ———— [「GitLab第一打开没有修改密码提示」](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_43791338%2Farticle%2Fdetails%2F119519220)

#### 测试仓库项目是否可以正常提交和拉取

 

这个步骤就不演示了，用过 `GitHub` 的应该基本都清楚，`创建个新项目 -> 通过http仓库链接克隆项目 -> 修改项目的内容 -> 提交 ->推送`。

 

我们的重点的是 `CI/CD`，至于 `SSL、邮箱`等等，GitLab 一些其他的配置和功能我就不赘述了，大家可以网上了解下。

 

```
题外话：我安装 GitLab「切换中文」的时候，没法保存（按钮变灰了，却没有保存成功提示），不知道是什么原因，有碰到过同样问题的朋友，求解答。
```

## 配置 CI/CD

### 安装 gitlab-runner

```Bash
# 下载
wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

# 分配运行权限chmod +x /usr/local/bin/gitlab-runner

# 创建用户
useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

# 安装
gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner

# 运行
gitlab-runner start 
复制代码
```

### 新建 runner

 

![img](https://s0tsrrtqxk.feishu.cn/space/api/box/stream/download/asynccode/?code=ODFmZjRlYjE1OTg2NzQ4MGNlMjI5Mzk3OWFkMjljNmJfYTJ5eGJJMXdIZW1lT21lVEdNd2FDTVV1MVhjcFpielVfVG9rZW46Ym94Y25SYmtQTnludGFkcWJDYzNrZEZWZFRiXzE2Nzc2NTA4MjE6MTY3NzY1NDQyMV9WNA)

```C#
# 注册 runner
gitlab-runner register

# 输入 gitlab 的访问地址
http://192.168.26.139:1874 # 输入 runner token，把开 http://192.168.26.139:1874/admin/runners 页面查看63AyFAthj7s7sNy3JDwu

# runner 描述，随便填
测试webpack-vue项目部署

# runner tag
webpack-vue-cicd

# 输入（选择） shell
shell
复制代码
```

 

注册完成后，就可以在 [http://192.168.26.139:1874/admin/runners](https://link.juejin.cn?target=http%3A%2F%2F192.168.26.139%3A1874%2Fadmin%2Frunners) 里面看到创建的 runner。

 

![img](https://s0tsrrtqxk.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTA4NDRhNzRiZTc3YThmN2UxM2E0MTkyMDM1YjFiZWFfQWt1ZlRFbThLZldiVW50QW1URDBBa1lEakc2R1JWQWNfVG9rZW46Ym94Y244c3BZcU1YQkozQ1dmTXQ3M3d6SldlXzE2Nzc2NTA4MjE6MTY3NzY1NDQyMV9WNA)

### nginx 配置项目访问地址

```Bash
# 创建目录mkdir -pv /www/wwwroot/webpack_vue_demo

# 分配权限chown gitlab-runner /www/wwwroot/webpack_vue_demo/

# 开放 3001 端口
firewall-cmd --permanent --zone=public --add-port=3001/tcp

# 重载防火墙
firewall-cmd --reload
# 打开 nginx 配置文件
vim /usr/local/nginx/conf/nginx.conf

# 在第一个 server  下方 (nginx 默认的，端口为80)，加上下面的内容
server {
    listen       3001; # 端口号
    server_name  localhost; # 服务器地址

    location / {
        root   /www/wwwroot/webpack_vue_demo; # 项目存放目录index  index.html index.htm; # 默认访问的主页
    }
}

# 重新加载配置文件
nginx -s reload
```

### 编写 .gitlab-ci.yml 文件

 

`.gitlab-ci.yml` 文件是存放在项目的根目录下的，要提交到`gitlab`上面，`runner` 会根据 `.gitlab-ci.yml` 编写的规则自动部署项目。下面文件看注释，每一步是干嘛, 都写得比较了，基本都能看明白。yml 的具体语法和关键词,可以查看 gitlab 官网，就不赘述。

 

新建 `.gitlab-ci.yml`，添加下面的内容

```YAML
# 阶段stages:- build- deploy# 缓存 node_modules 减少打包时间，默认会清除 node_modules 和 dist cache:paths:- node_modules/# 拉取项目，打包build:stage: build # 阶段名称 对应，stagestags: # runner 标签(注册runner时设置的，可在 admin->runner中查看)- webpack-vue-cicdscript: # 脚本（执行的命令行）- cd ${CI_PROJECT_DIR} # 拉取项目的根目录- npm install # 安装依赖- npm run build # 运行构建命令only:- main #拉取分支artifacts:   # 把 dist 的内容传递给下一个阶paths:- dist/# 部署deploy:stage: deploy # 阶段名称 对应，stagestags: # runner 标签(注册runner时设置的)- webpack-vue-cicdscript: # 脚本（执行的命令行）- rm -rf /www/wwwroot/webpack_vue_cicd/*- cp -rf ${CI_PROJECT_DIR}/dist/* /www/wwwroot/webpack_vue_cicd/ # 把包完成，复制 dist 下的文件到对应的项目位置复制代码
```

 

**见证奇迹的时候到了！** 浏览器输入`192.168.26.139:3001`，能访问项目就证明 OK 了。你可以尝试项目内容，提交 gitlab 发现，他会自己打包了

#### https://blog.csdn.net/github_35631540/article/details/107707402