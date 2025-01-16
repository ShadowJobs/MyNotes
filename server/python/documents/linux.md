# 1. 查看 Linux 系统版本：

```bash
cat /etc/os-release
# 查看发行版信息：
lsb_release -a
# 查看系统版本文件：
# Ubuntu/Debian
cat /etc/issue
# CentOS/RHEL
cat /etc/redhat-release

hostnamectl

uname -a
```

# 2. rsync 二次执行会出现目录重复的问题，解决方法：

#### 方法1：使用尾部斜杠，同时确保源路径和目标路径的正确

确保使用尾部斜杠将源目录的内容同步到目标目录下。

```bash
#!/bin/bash
source ~/.zshrc

# 使用尾部斜杠同步目录内容
rsync -avz ./patch/ root@$SERVER_IP:~/ly/running/dify/patch
```

在这种方式下，无论目标目录是否存在，示例中`./patch/`会将其内容粘贴到`~/ly/running/dify/patch`而不是嵌套目录。

#### 方法2 (推荐) ：使用`rsync`的`--relative`标识确保路径结构

此外`rsync`还提供了一种称为`--relative`的选项来保持源路径结构，这样可以更清晰的管理同步目录内容。

```bash
#!/bin/bash
source ~/.zshrc

# 使用--relative实现增量同步确保不重复嵌套
rsync -avz --relative ./root@$SERVER_IP:~/ly/running/dify/patch
```

确保相对路径组合映射。

### 检查改动

执行命令前，建议检查目录树的变动描述如下，如实描绘目的：

```bash
rsync --dry-run -avz ./patch/ root@$SERVER_IP:~/ly/running/dify/patch
```

这种`--dry-run`(模拟运行)主要用于测试并展示同步过程包括内容路径控制了解执行命令影响。 

### rsync a b,如果a,b同时有修改，并且，b还是后修改的，那么，a里的内容还会覆盖b吗？

1. rsync 的默认行为：默认不比较文件内容，通常会比较源和目标文件的修改时间和大小。

2. 时间戳比较：
   - 如果目标文件（b）的修改时间比源文件（a）新，rsync 通常不会覆盖它。
      要注意文件系统的时间戳精度。某些系统可能只精确到秒，这可能导致在非常短的时间内修改的文件被错误地覆盖。

3. 确保预期行为的 rsync 选项：
   - `-u` 或 `--update`：仅复制较新的文件。
   - `-c` 或 `--checksum`：使用校验和而不是时间戳来决定文件是否需要更新。
   - `--ignore-times`：忽略时间戳，总是比较文件。
   
4. 对于重要数据：
   考虑使用 `--backup` 选项创建已存在文件的备份，以防意外覆盖。

5. 安全同步的建议：
   - 使用 `-n` 或 `--dry-run` 选项进行测试运行，查看哪些文件会被传输。
   - 使用 `-v` 或 `--verbose` 选项获得详细输出。

6. 示例命令：
   ```
   rsync -av --update source/ destination/
   ```
   这将只复制源中比目标新的文件。


# 3. vi替换
%s/registry\.cn-hangzhou\.aliyuncs\.com/mirror\.ccs\.tencentyun\.com/g
<!-- %s/mirror\.ccs\.tencentyun\.com/docker\.mirrors\.ustc\.edu\.cn/g -->
%s/mirror\.aliyuncs\.com/dockerhub.icu/g
%s/dockerhub.icu/a88uijg4.mirror.aliyuncs.com/g

# 4. curl www.qq.com为什么返回302
qq使用了重定向，可以使用`curl -L www.qq.com`来跟随重定向。

使用 curl -v www.qq.com 查看http请求的详细信息，不跟随重定向


curl -L -k www.qq.com 忽略证书验证
curl -L -A "Mozilla/5.0" www.qq.com 指定用户代理
使用-L 会拿到重定向后的代码，显示要执行一段js，所以仍然没有拿到qq的html代码。
curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0" www.qq.com


# 5. 计算时间
start=$(date +%s)
npm run build
end=$(date +%s)
duration=$((end-start))
echo "Build time: $((end-start)) seconds"
echo "Build time: $duration minutes"

# 6. docker + echo 
通常echo -e xxx a.txt会将xxx写入a.txt，但是如果是 debian 12 系统，那么会将-e xxx写入a.txt，这是因为debian 12的echo不支持-e参数

另外docker也不支持 \ 和 \n 
```bash
# 这种写法如果是在shell里就没问题，但是在docker里又会有换行的问题，而且也不能识别\n，会直接将’\n‘写入文件
RUN cat > /etc/apt/sources.list << EOF \
deb http://artifactory.momenta.works/artifactory/debian/ bookworm main non-free contrib \
deb http://artifactory.momenta.works/artifactory/debian/ bookworm-updates main non-free contrib \
EOF
# 只能分开，这样写
RUN echo "deb http://artifactory.momenta.works/artifactory/debian/ bookworm main non-free contrib" > /etc/apt/sources.list && \
    echo "deb http://artifactory.momenta.works/artifactory/debian/ bookworm-updates main non-free contrib" >> /etc/apt/sources.list && \
```

# 7. apt-get 安装问题
  - apt的源配置在 /etc/apt/sources.list 和 /etc/apt/sources.list.d/ 目录下，如果apt-get update后还是无法安装
  - apt search xxx 可以搜索软件包
  - apt-cache search 搜索本地？

# 8. 查看系统版本
```bash
cat /etc/os-release  #通用
lsb_release -a #通用
cat /etc/issue #ubuntu
cat /etc/redhat-release #centos
```

# 9. tree 
-L 2 表示只显示两层目录
-I node_modules 表示忽略node_modules目录,多个用|分隔 -I 'node_modules|dist'

# 10. 查端口占用
```bash
lsof -i:5001 # mac
[1]+  Killed                  nohup npm run start --port=5006 > output.log 2>&1
这种情况是

netstat -tunlp | grep 3000

netstat -tuln | grep :5006
tcp        0      0 0.0.0.0:5006            0.0.0.0:*               LISTEN
# lsof可能不准，netstat准确

sudo ss -tulpn | grep :5006  #这个命令最准确，可能看到所有进程
tcp   LISTEN 0      511          0.0.0.0:5006       0.0.0.0:*    users:(("next-server (v1",pid=3279956,fd=26))

ps aux | grep -E "node|npm" #查看node和npm进程
```

# 11. nginx 
# 11.1 启动,停止
```shell
#mac
brew services start nginx
brew services stop nginx
或者直接输入 nginx
#ubuntu 
systemctl start nginx
systemctl stop nginx
# 错误
root@hcss-ecs-fed8:/ly/running/express# systemctl start nginx
Job for nginx.service failed because the control process exited with error code.
See "systemctl status nginx.service" and "journalctl -xeu nginx.service" for details.
原因：1， nginx.conf配置错误，2，nginx要用的端口被占用

```
# 11.2 安装nginx 
centos: 
输入：yum  install nginx -y
nginx 启动  加-t可以测试nginx配置能否正常启动
此时，访问 http://119.29.250.68 可以看到 Nginx 的测试页面 
2，打开 Nginx 的默认配置文件 /etc/nginx/nginx.conf ，mac下（/usr/local/etc/nginx/nginx.conf）修改 Nginx 配置，将默认的 root /usr/share/nginx/html; 修改为: root /data/www;，如下：（这里是nginx的启动路径）
指定配置可以用nginx -c /a.conf
配置文件将 /data/www/static 作为所有静态资源请求的根路径，如访问: http://119.29.250.68/static/index.js，将会去 /data/www/static/ 目录下去查找 index.js。现在我们需要重启 Nginx 让新的配置生效，如：
mac : nginx -s reload
ubuntu : systemctl restart nginx
重启后，现在我们应该已经可以使用我们的静态服务器了，现在让我们新建一个静态文件，查看服务是否运行正常。
首先让我们在 /data 目录 下创建 www 目录，如：
mkdir -p /data/www
3,在 /data/www 目录下创建我们的第一个静态文件 index.html
现在访问 http://119.29.250.68/index.html 应该可以看到页面输出 
Hello world!

4,405 not found 解决办法：
问题：浏览器能直接打开或者下载某文件，因为浏览器会自动拼成正确的header，服务器不会报错，但是在c代码或者curl命令下，报405错误。
例如打开 http://www.lyandwzy.cn/lua/test.lua文件，这个是个静态的文件（非可执行的，比如php），所以在使用curl请求时，是POST请求，nginx不允许这么做，所以解决办法1，改用php或者其他语言来接受并处理请求，或者2，修改nginx.conf,将405错误直接改成200并处理。如下：/的意思是指根目录如何映射.root表示指定根目录，index表示默认的html文件
  location / {    
root www.data;
index index.html
                error_page 405 =200 /lua/test.lua;
        }
将405的返回重新处理为200，并返回（实际/lua/test.lua执行从nginx读取的路径下的相对位置，并不是从根目录的开始，注意！）路径下的test.lua
7,nginx log error_log，和access_log 见conf文件的字段，通过log_format配置log内容和格式
 默认的access_log里没有请求中附带的参数值，如果要这些值，需要加入变量$request_body，这里能取到Post的信息
默认log位置 /var/log/nginx/error.log

# 11.3 nginx证书配置 mac
主要有三种方案：
- 使用 Let's Encrypt 免费证书（推荐）
- 自签名证书（测试环境使用）
- 购买商业 SSL 证书
这里为第二种：自签名证书
```shell
# 1. 创建工作目录（如果还没创建）
mkdir ~/ssl_cert
cd ~/ssl_cert

# 2. 生成私钥
openssl genrsa -out a.sd.com.key 2048

# 3. 生成证书签名请求（CSR），这里域名改成了 a.sd.com
openssl req -new -key a.sd.com.key -out a.sd.com.csr -subj "/CN=a.sd.com"

# 4. 生成自签名证书
openssl x509 -req -days 365 -in a.sd.com.csr -signkey a.sd.com.key -out a.sd.com_bundle.crt

# 5. 设置权限
chmod 400 a.sd.com.key
chmod 444 a.sd.com_bundle.crt
```
nginx配置
```shell
server{
    # 证书路径（根据实际位置修改）
    ssl_certificate /Users/你的用户名/ssl_cert/a.sd.com_bundle.crt;
    ssl_certificate_key /Users/你的用户名/ssl_cert/a.sd.com.key;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
```
访问前先修改host 127.0.0.1 a.sd.com
重启nginx 