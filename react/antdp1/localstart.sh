
#!/bin/zsh


# 设置基础绝对路径
BASE_PATH="/Users/linying/ly/mygit/MyNotes/"

######************启动数据库************######
# 启动mysql
# sudo service mysql start
# 启动redis log输出到redislog.log
nohup redis-server > $BASE_PATH/react/antdp1/redislog.log 2>&1 &




######************启动前端************######
# 启动antdp1项目
cd $BASE_PATH/react/antdp1
nohup npm run dev > $BASE_PATH/react/antdp1/antdp1log.log 2>&1 &

# 启动vite react
cd $BASE_PATH/react/vitereact
nohup pnpm dev > $BASE_PATH/react/vitereact/vitereactlog.log 2>&1 &

# 启动vite react /sub
cd $BASE_PATH/react/vitereact/sub
nohup pnpm dev > $BASE_PATH/react/vitereact/sub/vitereactsublog.log 2>&1 &

# 启动vite react vue3proj
cd $BASE_PATH/react/vitereact/vue3proj
nohup pnpm dev > $BASE_PATH/react/vitereact/vue3proj/vue3projlog.log 2>&1 &

# 启动 react1作为qiankun react子应用
cd $BASE_PATH/react/react1
nohup pnpm dev > $BASE_PATH/react/react1/react1log.log 2>&1 &

# 启动 vues/vue3作为qiankun vue子应用
cd $BASE_PATH/vues/myvue-vue3
nohup pnpm dev > $BASE_PATH/vues/myvue-vue3/vue3log.log 2>&1 &




######************启动后端************######
#启动后端
# 后台启动python服务，log输出到pylog.log
cd $BASE_PATH/server/python
nohup python3 main.py > pylog.log 2>&1 &


# 启动express服务,log输出到expresslog.log
cd $BASE_PATH/server/express1
nohup node app.js > expresslog.log 2>&1 &


