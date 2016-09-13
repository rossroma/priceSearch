var fs = require("fs"),
		querystring = require("querystring"),
		cheerio = require("cheerio"),
		iconv = require("iconv-lite"),
		http = require('http'),
		origin = require('./data/origin-1'),
		stream = require('./stream');
var id = 0;
var keyword = origin.arr.shift();	
var keyword2 = encodeURI(keyword);
var path = "http://www.gwdang.com/search?crc64=1&s_product=" + keyword2;
httpGet(path, keyword, id);

function httpGet(path, keyword, id) {
	var html = [];
	//获取搜索结果数据
	http.get(path, function(res) {
		res.on('data', function(data){
			html.push(data);
		});
		res.on('end', function(){
			var result = iconv.decode(Buffer.concat(html), 'gb2312');
			$ =  cheerio.load(result, {decodeEntities: false});
			var items = $('.search_list_list li').eq(0);

			var img = $(items).find('img').data('original'); 
			var href = 'http://www.gwdang.com' + $(items).find('.pic a').attr('href'); 
			var title = $(items).find('.pic a').attr('title');
			var prices = $(items).find('dd .onsale_list'); 
			var jdPrice = '';
			var onePrice = '';
			var tmPrice = '';
			var other = '';
			var otPrice = '';
			prices.each(function(ind, ite) {
				var text = $(ite).find('.hui999').text();
				if(text === '京东商城'){
					jdPrice = $(ite).find('.aral').text().replace('nbsp','#160');
				}else if(text === '一号店'){
					onePrice = $(ite).find('.aral').text().replace('nbsp','#160');
				}else if(text === '天猫'){
					tmPrice = $(ite).find('.aral').text().replace('nbsp','#160');
				}else{
					other = text;
					otPrice = $(ite).find('.aral').text().replace('nbsp','#160');
				}
			});

			if(items.length === 1){
				// 将数据写入到xml
				var xmlData = '<GOOD><ID>'+id+'</ID><ORIGIN>'+keyword+'</ORIGIN><TITLE>'+title+'</TITLE><JDPRICE>'+jdPrice+'</JDPRICE><ONEPRICE>'+onePrice+'</ONEPRICE><TMPRICE>'+tmPrice+'</TMPRICE><OTHER>'+other+': '+otPrice+'</OTHER><IMG>'+img+'</IMG></GOOD>';
				stream.writeStream(xmlData);
			}else{
				var xmlData = '未检索到信息！';
			}

			if(origin.arr.length) {
				keyword = origin.arr.shift();	
				keyword2 = encodeURI(keyword);
				path = "http://www.gwdang.com/search?crc64=1&s_product=" + keyword2;
				id++;
				httpGet(path, keyword, id);			
			}	

		})
	}).on('error', function(error) {
		cosole.log('错误：' + error.message);
	})

}
