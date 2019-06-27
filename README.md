# 侃影评

侃影评是一个电影影评小程序，该项目允许用户对时下最热门的电影撰写影评。除此之外，用户还可收藏并分享电影影评。

本分支是基于基于**原生云开发**进行后端开发的，[mpvue分支](https://github.com/fujianlian/movie/tree/mpvue)也是采用**云开发**进行后端开发的，不过代码编写采用了[mpvue](http://mpvue.com/)，[tencent-cloud分支](https://github.com/fujianlian/movie/tree/tencent-cloud)是基于**腾讯云服务**进行后端开发的。

相对于**腾讯云服务**模式，**云开发**相比来说比较简单，建议选择**云开发**模式开发

![qrcode](./data/gh_dce00e83a5a9_258.jpg)

## 目录

- [UI交互图](#UI交互图)

- [实现页面列表](#实现页面列表)

- [项目运行](#项目运行)

- [云开发参考文档](#云开发参考文档)

- [贡献](#贡献)

## UI交互图

点击[此处](https://s3.cn-north-1.amazonaws.com.cn/static-documents/nd666/%E7%9C%8B%E7%9C%8B%E4%BE%83%E4%BE%83%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90/%E4%BA%A4%E4%BA%92%E5%9B%BE2.png)在新标签页打开大图

![UI](./data/jiaohu.png)

## 实现页面列表

* 首页：随机展示当前热门电影的某一条影评。
* 电影列表页：展示当前最热门的若干部电影（至少5部）。
* 电影详情页：展示电影详情信息。
* 影评列表页：展示某电影的影评列表。
* 影评详情页：展示某条具体的影评内容。
* 影评编辑页：用户能在此页面编辑自己的影评内容。
* 影评预览页：预览已编辑完成的影评。
* 个人中心页：展示用户已收藏和已发布的影评列表。

## 项目运行

### 运行准备

注册[小程序开发帐号](https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index)，完成注册之后，登录[微信公众平台官网](https://mp.weixin.qq.com/) ，点击 **“设置 -> 开发设置”**，获取你的 **AppID 帐号**，后面初始化项目需要用到。

### 运行项目

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 下载源码，打开微信开发者，选择小程序导入源码，**AppID改为自己申请的**

3. 接下来申请云开发功能，进入云开发页面

* 在存储里创建 **movie-photo 和 audio** 文件夹，将data/images里的所有图片上传到movie-photo文件夹中

* 在数据库里创建 **favorite/movie/review** 四个集合，将data/movie.json导入到movie集合中，注意修改image的地址前缀

* env修改，可参考[这篇文章](https://blog.csdn.net/Sprintf_HelloWorld/article/details/86746684)

* 上传云函数，运行即可

## 云开发参考文档 

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) 

## 贡献

* 如果你在使用过程中遇到问题，欢迎给我提Issue

* 如果你有好的想法，欢迎pull request

* 觉得不错的话，顺手 **点个Star**，笔者需要您的支持