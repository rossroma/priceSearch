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


// var ws = fs.createWriteStream(__dirname + '/test/test.txt');
// for (var i = 0; i < 100; i++) {
//   var w_flag = ws.write(i.toString() + ",");
//   //当缓存区写满时，输出false
//   console.log(w_flag);
// }

fs.appendFile(__dirname + '/test.txt', '使用fs.appendFile追加文件内容', function () {
  console.log('追加内容完成');
});