#!/bin/bash
source ~/.zshrc
# 不执行source，有些命令会找不到，nvm
# set -e ： 遇到错误后立即停止，否则后续的代码依旧会执行
set -e

# Uncomment publicPath in config.ts
# 在 MacOS 上，sed -i 命令需要一个额外的参数用于备份。你可以通过提供一个空字符串来解决这个问题，例如 sed -i '' 's/foo/bar/g' filename
# sed -i '' "s/\/\/ publicPath: '\/ly\/',/publicPath: '\/ly\/',/" ./config/config.ts
nvm use 16 && npm run build
# sed -i '' "s/publicPath: '\/ly\/',/\/\/ publicPath: '\/ly\/',/" ./config/config.ts

# 方法1：rm + scp太慢了，改用rsync
# ssh root@$SERVER_IP "rm -rf ~/ly/running/antdp1"
# scp -r ./dist/ root@$SERVER_IP:~/ly/running/antdp1 

# 方法2
rsync -avz ./dist/ root@$SERVER_IP:~/ly/running/antdp1

echo "Deployment completed."
