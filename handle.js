var fs = require("fs"),
		querystring = require("querystring"),
		cheerio = require("cheerio"),
		iconv = require("iconv-lite"),
		http = require('http'),
		stream = require('./stream');

function handle(response, postData){
	//判断是否有数据提交
	if(!postData){
		fs.readFile("./index.html",function(err, data) {
			if (err) return console.error(err);
			var htmlCon = data.toString(); 
			writeHtml(response, htmlCon);
		});
	}else{
		var keyword = querystring.parse(postData).text;
		var keyword2 = encodeURI(keyword);
		var path = "http://www.gwdang.com/search?crc64=1&s_product=" + keyword2;
		var html = [];

		//获取搜索结果数据
		http.get(path, function(res) {
			res.on('data', function(data){
				html.push(data);
			});
			res.on('end', function(){
				var result = iconv.decode(Buffer.concat(html), 'gb2312');
				$ =  cheerio.load(result, {decodeEntities: false});
				var items = $('.search_list_list li');
				var itemhtml = [];

				//将获取到的搜索数据写入数组
				items.each(function(index, item) {
					var img = $(item).find('img').data('original'); 
					var href = 'http://www.gwdang.com' + $(item).find('.pic a').attr('href'); 
					var title = $(item).find('.pic a').attr('title');
					var prices = $(item).find('dd .onsale_list'); 
					var jdPrice,onePrice,tmPrice;
					prices.each(function(ind, ite) {
						var text = $(ite).find('.hui999').text();
						if(text === '京东商城'){
							jdPrice = $(ite).find('.aral').text();
						}else if(text === '一号店'){
							onePrice = $(ite).find('.aral').text();
						}else if(text === '天猫'){
							tmPrice = $(ite).find('.aral').text();
						}
					})

					itemhtml[index] = {
						img: img,
						title: title,
						href: href,
						prices: prices,
						jdPrice: jdPrice ? jdPrice : '',
						onePrice: onePrice ? onePrice : '',
						tmPrice: tmPrice ? tmPrice : ''
					};
				});

				//是否查询到商品数据
				if(itemhtml.length!=0){ 
					var formData = "";

					//遍历数组，并生成html
					for(var i=0; i<itemhtml.length; i++){
						formData += '<tr><td><img src='+itemhtml[i].img+'></td><td><a target="_blank" href="'+itemhtml[i].href+'">'+itemhtml[i].title+'</a></td><td>'+itemhtml[i].jdPrice+'</td><td>'+itemhtml[i].onePrice+'</td><td>'+itemhtml[i].tmPrice+'</td><td></td></tr>';
					}

					// 将第一个数据写入的文件
					// var xmlData = '<GOOD><TITLE>'+itemhtml[0].title+'</TITLE><JDPRICE>'+itemhtml[0].jdPrice+'</JDPRICE><ONEPRICE>'+itemhtml[0].onePrice+'</ONEPRICE><TMPRICE>'+itemhtml[0].tmPrice+'</TMPRICE><OTHER></OTHER><IMG>'+itemhtml[0].img+'</IMG></GOOD>';
					// stream.writeStream(xmlData);

					//将生成的html写入到页面
					fs.readFile("./index.html",function(err, data) {
						if (err) return console.error(err);
						var htmlCon = data.toString(); 
						ch = cheerio.load(htmlCon);
						ch("table").append(formData);
						ch("input").val(keyword);
						var newHtml = ch.html();
						writeHtml(response, newHtml);
					});
				}else{

					//未查询到上品信息
					fs.readFile("./index.html",function(err, data) {
						if (err) return console.error(err);
						var htmlCon = data.toString(); 
						ch = cheerio.load(htmlCon);
						ch("table").replaceWith('<h3>找不到该商品，请换一个关键词试试</h3>');
						var newHtml = ch.html();
						writeHtml(response, newHtml);
					});
				}
			})
		}).on('error', function(error) {
			cosole.log('错误：' + error.message);
		})
	}
}

//输出到页面
function writeHtml(response, htmlCon){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(htmlCon);
	response.end();
}

exports.handle = handle;