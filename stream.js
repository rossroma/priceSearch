//fs.createWriteStream(path, [options])
/**
 * path 文件路径
 * [options] flags:指定文件操作，默认'w',；encoding,指定读取流编码；start指定写入文件的位置
 */

/* ws.write(chunk, [encoding], [callback]);
 * chunk,  可以为Buffer对象或一个字符串，要写入的数据
 * [encoding],  编码
 * [callback],  写入后回调
 */

/* ws.end([chunk], [encoding], [callback]);
 * [chunk],  要写入的数据
 * [encoding],  编码
 * [callback],  写入后回调
 */
var fs = require('fs');

var index = 0;
function writeStream(html) {
	fs.appendFile(__dirname + '/data/goods-1.xml', html, function () {
	  console.log('成功添加--' + index);
	  index++;
	});
}

exports.writeStream = writeStream;