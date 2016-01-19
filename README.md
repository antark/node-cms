####介绍：
<sup><sub>本项目是使用 Node 实现的一个轻量级 CMS (Content Managment System) 系统，可以不加修改地运行在 BAE (Baidu App Engine) 3.0 之上。</sub></sup><br />
<sup><sub>虽然项目使用的是 BAE 限制的 Node 技术，然而并没有额外地使用任何 BAE 扩展，也就是说本应用是一个纯粹的 Node 应用，完全可以本地运行或是运行在其他 Node App Engine 之上，譬如 openshift。</sub></sup><br />
<sup><sub>项目本意是设计一个文档系统，文档使用 project 作为划分大类、 tags 作为划分小类。文档的写作由注册用户完成， 所以本项目实际上是一个多人博客系统。 然而本应用又以用户为中心来管理文字、图片和文件，将来可能演化成一个 SNS 系统。</sub></sup><br />

<sup><sub>演示 ：<http://www.lrj.name> ~~http://doc4doc.duapp.com (BAE 3.0)~~    ~~http://newteck.duapp.com  (BAE 2.0)~~</sub></sup><br />

####功能 ：

<sup><sub>1. 提供用户注册、登陆和退出，用户信息编辑功能；</sub></sup><br />
<sup><sub>2. 为注册用户提供文字编辑功能，图片上传和管理、普通文件上传和管理功能；</sub></sup><br />
<sup><sub>3. 按项目大类、标签小类管理用户的文字；</sub></sup><br />
<sup><sub>4. 按用户管理文字、图片和其他文件功能；</sub></sup><br />
<sup><sub>5. 系统上所有的内容对任何访问者都是 public 的；</sub></sup><br />
<sup><sub>6. 按用户组织编辑、修改和删除权限； 设有唯一的 admin 管理员；</sub></sup><br />
<sup><sub>7. 更多的功能有待 u 的挖掘 ...</sub></sup><br />

####注意 ：

<sup><sub>1. 项目使用了一些 Node 模块，包括 express 、ejs 、mongodb 、formidable ，使用前先安装这些模块；</sub></sup><br />
<sup><sub>2. 项目使用的是 MongoDB 数据库，所以正常使用要安装 MongoDB 数据库；</sub></sup><br />

### 关于 BAE 3.0 和 BAE 2.0 的不兼容问题：
<sup><sub>(1) BAE3 和 BAE2 在使用上有些不兼容，比如数据库的连接和 NPM 包的管理上；</sub></sup><br />
<sup><sub>(2) MongoDB 的数据库连接使用的不在是环境变量的形式，而是 app 的一些字符串，具体的可以看 app-config.json 中的 database_bae 部分；</sub></sup><br />
<sup><sub>(3) NPM 包的使用是在 package.json 中设置；虽然官方文档说“几乎所有的包都可以使用”，鄙人的使用情况是“一些包的某些高版本可能不能使用”；</sub></sup><br />



