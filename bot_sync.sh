#! /bin/bash
git reset --hard origin/master
git clean -f
git pull origin master
npm install
node_modules\\.bin\\cross-env NODE_ENV=production PORT=9961 TZ='Asia/Shanghai' pm2 restart ohnkyta-bot --update-env
