# Software Architecture Document-软件架构文档

## 1 简介

### 1.1 目的

  本文档将从构架方面对SJTU云作业系统进行综合概述，其中会使用多种不同的构架视图来描述系统的各个方面。它用于记录并表述已对系统的构架方面作出的重要决策。

### 1.2 范围

  本架构文档主要适用于SJTU云作业平台前三次迭代的系统设计。

### 1.3 定义、首字母缩写词和缩略语

  暂略

### 1.4 参考资料

  无

### 1.5 概述

  本文档包含此软件架构的表示方式，并依次具体给出这些视图。

## 2 架构表示方式

  由于本项目组技术有限等原因，目前本软件无法采用开题所选的微服务架构，先以B/S架构进行开发，主要给出以下视图：

  * 用例视图

  * 逻辑视图

  * 进程视图

  * 部署视图

  * 实施视图

## 3 架构目标和约束

  本软件的架构主要需要满足安全性、保密性、可用性、可移植性，并且需要在这个学期前完成。

## 4 用例视图

  ![RUNOOB 用例](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E7%94%A8%E4%BE%8B%E8%A7%86%E5%9B%BE.png)

  本软件的用户主要有教师和学生，教师的用例有创建、修改课程、发布、修改作业、给作业评分等，学生的用例有加入课程、提交作业等，所有用户都需要用到注册和登录的功能。

## 5 逻辑视图

  采用B/S架构，整个系统逻辑图如下所示：
  ![RUNOOB 逻辑](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E9%80%BB%E8%BE%91%E8%A7%86%E5%9B%BE.png)

## 6 进程视图

  ![RUNOOB 进程](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E8%BF%9B%E7%A8%8B%E8%A7%86%E5%9B%BE.png)

## 7 部署视图

  ![RUNOOB 部署](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E9%83%A8%E7%BD%B2%E8%A7%86%E5%9B%BE.png)

  本软件使用的设备主要有客户机和服务器。前端和后端功能分别在两者上实现。

## 8 实施视图

  ![RUNOOB 实施](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E5%AE%9E%E6%96%BD%E8%A7%86%E5%9B%BE.png)


