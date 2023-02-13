# Linux

https://s0tsrrtqxk.feishu.cn/wiki/wikcnoItBDVCKJnp7L4ouZc6Yx9

### 指令

| 新建文件   | touch file1.txt |     |
| ---------- | --------------- | --- |
| 新建文件夹 | mkdir xxx       |     |
|            |                 |     |
|            |                 |     |
|            |                 |     |
|            |                 |     |

#### 不知道插件安装地址的可以通过 find 命令查找：比如查找 nginx 安装位置

find / -name nginx

#### **free 命令**

free 命令显示系统使用和空闲的内存情况，包括物理内存、交互区内存(swap)和内核缓冲区内存。

直接输入 free 命令

free 命令默认是显示单位 kb，可以采用 free -m 和 free -g 命令查看，分别表示 MB 和 GB

另外，free -h 会自动选择以适合理解的容量单位显示

```Markdown
Mem:表示物理内存统计，如果机器剩余内存非常小，一般小于总内存的20%，则判断为系统物理内存不够
Swap: 表示硬盘上交换分区的使用情况，如剩余空间较小，需要留意当前系统内存使用情况及负载，当Swap的used值大于0时，则表示操作系统物理内存不够，已经开始使用硬盘内存了。
第1行数据15G表示物理内存总量；1.8G表示总计分配给缓存(包含buffers与cache)使用的数量，但其中可能部分缓存并未实际使用；
8.1G表示未被分配的内存；shared表示共享内存；5.6G表示系统分配但未被使用的buffers数量；13G表示系统分配但未被使用的available数量
```

### Linux 安装 node

```Markdown
下载地址：http://nodejs.cn/download/


// 下载 可以直接在 url 修改相应的版本
// arm版本
wget https://registry.npmmirror.com/-/binary/node/v16.14.2/node-v16.14.2-linux-arm64.tar.xz
// x64
wget https://nodejs.org/dist/v19.3.0/node-v19.3.0-linux-x64.tar.xz


// 将 tar.xz 压缩文件转成 node-v16.14.2-linux-arm64.tar
xz -d node-v16.14.2-linux-arm64.tar.xz

// 再用 tar xvf node-v16.14.2-linux-arm64.tar 解压缩文件
tar -xvf node-v16.14.2-linux-arm64.tar

// 可修改名字（也可以不改名字的）
mv node-v16.14.2-linux-arm64 node

// 配置环境变量
vim /etc/profile
// 添加环境变量   // Node所在路径
export NODE_HOME=/yiliu/node
export PATH=$NODE_HOME/bin:$PATH
// 编译/etc/profile 使配置生效
source /etc/profile
```

### 查看进程

三、常用命令

根据端口 port 查进程

netstat 和 lsof 两种方式

```Shell
netstat -nap | grep port

lsof  -i:port
```

根据进程 pid 查端口

```Shell
netstat -nap | grep pid

lsof -i | grep pid
```
