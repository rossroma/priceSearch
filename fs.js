var fs = require('fs');

//简单文件写入
// var config = {
// 	maxFiles: 20,
// 	maxConnections: 15,
// 	rootPath: "/webroot"
// };
// var configTxt = JSON.stringify(config);
// var options = {encoding: 'utf8', flag: 'w'};
// fs.writeFile('./config.txt', configTxt, options, function(err){
// 	if (err){
// 		console.log("Config Write Failed.");
// 	} else {
// 		console.log("Config Saved.")
// 	}
// });

//非简单文件写入

// var fruitBowl = ['apple', 'orange', 'banana', 'grapes'];
// function writeFruit(fd){
// 	if (fruitBowl.length){
// 		var fruit = fruitBowl.pop() + " ";
// 		fs.write(fd, fruit, null, null, function(err, bytes){
// 			if (err){
// 				console.log("File Write Failed.");
// 			} else {
// 				console.log("Wrote: %s %dbytes", fruit, bytes);
// 				writeFruit(fd);
// 			}
// 		})
// 	} else {
// 		fs.close(fd)
// 	}
// }

// fs.open('./config.txt', 'w', function(err, fd){
// 	writeFruit(fd);
// })

//流文件写入
var grains = ['wheat', 'rice', 'oats'];
var options = { encoding: 'utf8', flag: 'w'};
var fileWriteStream = fs.createWriteStream("./grains.txt", options);
fileWriteStream.on("close", function(){
	console.log("File Closed.");
});

while(grains.length){
	var data = grains.pop() + ",";
	fileWriteStream.write(data);
	console.log("Write: %s", data);
}

fileWriteStream.end();