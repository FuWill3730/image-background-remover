#!/bin/bash

# 自动推送脚本

# 获取当前时间作为提交信息的一部分
CURRENT_TIME=$(date +"%Y-%m-%d %H:%M:%S")

# 获取当前分支名称
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "当前分支: $BRANCH"

# 添加所有变更
git add .

# 生成提交信息
COMMIT_MSG="自动提交代码 - $CURRENT_TIME"

# 提交变更
git commit -m "$COMMIT_MSG"

# 推送到远程仓库当前分支
git push origin "$BRANCH"

echo "代码已推送，提交信息是：$COMMIT_MSG"
