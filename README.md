# priceSearch
网页爬虫，爬取购物党网站上的价格信息。

#使用介绍
本程序依赖于NodeJS，使用前请务必安装好NodeJS；  

#文档介绍
### robot.js
所有的功能函数都集中在这个文件中,包括爬取网页，获取结果，读取并输出为xml代码。

### stream.js
将xml代码写入到data/***.xml 中。

### data/origin-1.js
数据源，包含了一个关键词数组。

#start

`npm install`   

`node robot.js`

