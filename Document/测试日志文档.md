# 测试模型和日志
version 1.0

## 1.简介
根据测试计划制定模型并进行测试

## 2.具体测试流程和结果

### 2.1 功能和用户界面测试

| 功能 | 相关操作 | 期望输出 | 实际输出 | 结果 | 备注 |
| :----- | :----- | :----- | :----- | :----- | :----- |
| 登录 | 用户输入正确的账号密码 | 数据库识别成功，判断成功登录 | 数据库识别成功，判断成功登录 | 正确 | 无 |
| 登录 | 用户输入错误的密码 | 数据库识别成功，判断密码错误，UI显示您的用户名或密码错误 | 数据库识别成功，判断密码错误，UI显示您的用户名或密码错误 | 正确 | 无 |
| 登录 | 用户输入错误的账号 | 数据库识别失败，判断无此用户，UI显示您的用户名或密码错误 | 数据库识别失败，判断无此用户，UI显示您的用户名或密码错误 | 正确 | 无 |
| 注册 | 用户输入正确的学生信息 | 数据库识别成功，判断成功注册 | 数据库识别成功，判断成功注册 | 正确 | 无 |
| 注册 | 用户按照错误的格式输入信息 | 前端识别失败，提醒输入正确格式 | 前端识别失败，提醒输入正确格式 | 正确 | 无 |
| 注册 | 用户输入错误的学生信息 | 数据库无法识别该用户的成分，判断注册失败 | 数据库无法识别该用户的成分，判断注册失败 | 正确 | 无 |
| 注册验证 | 用户从手机邮箱获取验证码激活 | 通过验证码成功激活 | 功能未完成 | 错误 | 进度原因未能完成 |
| 个人信息维护 | 用户输入正确的信息修改和密码 | 数据库识别成功，判断为本人操作，更新数据库，在 UI成功显示出来 | 数据库识别成功，判断为本人操作，更新数据库，在 UI成功显示出来 | 正确 | 无 |
| 个人信息维护 | 用户输入错误的密码 | 数据库识别成功，判断非本人操作，无法修改 | 数据库识别成功，判断非本人操作，无法修改 | 正确 | 无 |
| 课程功能（老师） | 增删改查课程相关信息 | 数据库识别成功，判断成功修改，UI重新显示 | 数据库识别成功，判断成功修改，UI重新显示 | 正确 | 无 |
| 课程功能（老师） | 增删改查课程学生 | 数据库识别成功，判断成功修改，UI重新显示 | 数据库识别成功，判断成功修改，UI重新显示 | 正确 | 无 |
| 课程功能（老师） | 通过excel批量导入学生信息 | 前端与数据库识别成功，判断成功修改，UI重新显示 | 功能未完成 | 错误 | 进度原因未能完成 |
| 课程功能（学生） | 查看搜索筛选课程（所有，进行中，未完成）| 前端与数据库识别成功，根据条件显示 | 前端与数据库识别成功，根据条件显示 | 成功 | 无 |
| 作业功能（老师） | 发布作业 | 前端与数据库识别成功，发布成功 | 前端与数据库识别成功，发布成功 | 成功 | 无 |
| 作业功能（学生） | 发布作业收到通知 | 前端与数据库识别成功，成功收到通知 | 功能未完成 | 错误 | 进度原因未能完成 |
| 作业功能（学生） | 作业提交 | 前端发起请求，数据库成功存入url，作业存到服务器，更新提交状态 | 前端发起请求，数据库成功存入url，作业存到服务器 | 成功 | 进度原因烬模拟了图片，且前端ui还有bug （bug紧急修复完成）|
| 作业功能（老师） | 作业下载 | 前端与数据库识别成功，获取作业下载 | 后端能够下载，但前后端交互还有问题 | 错误 | 进度原因前后端交互的开发出现问题 |
| 作业功能（老师） | 批改分数修改 | 前端与数据库识别成功，数据库更新分数 | 前端与数据库识别成功，数据库更新分数 | 正确 | 无 |
| 作业功能（学生） | 批改分数查看 | 前端与数据库识别成功，UI更新分数 | 前端与数据库识别成功，UI更新分数 | 正确 | 无 |

界面效果如下：
登录界面：
![RUNOOB 登录](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%EF%BC%88%E5%86%B2%E5%88%BA1%EF%BC%89.PNG)
注册界面：
![RUNOOB 注册](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E6%B3%A8%E5%86%8C%E7%95%8C%E9%9D%A2%EF%BC%88%E5%86%B2%E5%88%BA1%EF%BC%89.PNG)
个人信息管理界面：
![RUNOOB 个人信息](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E7%95%8C%E9%9D%A2%EF%BC%88%E5%86%B2%E5%88%BA1%EF%BC%89.PNG)
老师课程功能界面：
![RUNOOB 老师课程](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E8%AF%BE%E7%A8%8B_%E6%95%99%E5%B8%88%E5%8A%9F%E8%83%BD%EF%BC%88%E5%86%B2%E5%88%BA1%EF%BC%89.PNG)
学生课程功能界面：
![RUNOOB 学生课程](https://github.com/samchen45/Software-Engineering-Project/blob/sprint1/Document/pic/%E8%AF%BE%E7%A8%8B_%E5%AD%A6%E7%94%9F%E5%8A%9F%E8%83%BD%EF%BC%88%E5%86%B2%E5%88%BA1%EF%BC%89.PNG)
老师作业布置功能界面：  
![RUNOOB 布置作业](https://github.com/samchen45/Software-Engineering-Project/blob/sprint2/Document/pic/%E4%BD%9C%E4%B8%9A%E5%B8%83%E7%BD%AE%EF%BC%88%E5%86%B2%E5%88%BA2%EF%BC%89.PNG)
学生作业查看界面：  
![RUNOOB 学生作业查看](https://github.com/samchen45/Software-Engineering-Project/blob/sprint2/Document/pic/%E4%BD%9C%E4%B8%9A%E5%8A%9F%E8%83%BD1%EF%BC%88%E5%86%B2%E5%88%BA2%EF%BC%89.PNG)
学生作业提交模态框：  
![RUNOOB 学生作业提交](https://github.com/samchen45/Software-Engineering-Project/blob/sprint2/Document/pic/%E4%BD%9C%E4%B8%9A%E5%8A%9F%E8%83%BD2%EF%BC%88%E5%86%B2%E5%88%BA2%EF%BC%89.PNG)
老师批改界面：  
![RUNOOB 老师作业批改](https://github.com/samchen45/Software-Engineering-Project/blob/sprint2/Document/pic/%E4%BD%9C%E4%B8%9A%E6%89%B9%E6%94%B9%EF%BC%88%E5%86%B2%E5%88%BA2%EF%BC%89.PNG)
### 2.3 非功能测试
进度原因未完成相关测试
