var cheerio = require('cheerio');
var request = require('request');
const recommendMenus = require('../services/recommendMenus');
const message = require('../services/messages');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRecomm_2Lunch(date, callback) {
    request.post({
            url: `http://mydish.welstory.com/todaymenu.do?restaurantCode=REST000049&toDay=${date}&mealType=2`,
            encoding: 'utf-8'
        },
        function (error, response, html) {
            if (error) {
                console.error("error" + error);
                throw error
            }

            var $ = cheerio.load(html);
            var returnString = "";

            console.log("점심 - Cafeteria 2");
            returnString = "점심 추천 메뉴<br>";
            returnString += "2식당(DE타워)<br>";
      
            var memuArray = new Array();
            var imageArray = new Array();
            

            $('li').each(function () {
                var menu = $(this).find('.thumbnail_tit strong').text();
                if (menu) {
                    // console.log(`menu: ${menu}`);
                    // returnString += menu + '<br>';                  
                }

                var imgUrl = $(this).find('.box_imgcont img').attr('src');
                if (imgUrl) {
                    // console.log(`Image url: ${imgUrl}`);
                    // returnString += `<img src='${imgUrl}'><br><br>`; 
                }
              
                if (menu && imgUrl) {
                  recommendMenus.menus.forEach(function (item, index, array) {
                    if (menu.includes(item) > 0) {
                      console.log(menu);
                      
                      memuArray.push(menu);
                      imageArray.push(imgUrl);                      
                    }
                  });     
                }              
            });
      
            // console.log("length: " + map.size);
      
            if (memuArray.length > 0) {
              var index = getRandomInt(memuArray.length);
              console.log("Random # is " + index);
              console.log(memuArray[index]);
              console.log(imageArray[index]);

              returnString += `<img src='${imageArray[index]}'><br><br>`; 
              returnString += memuArray[index] + '<br>'; 
              memuArray[index] = memuArray[index].replace(/\s+/g, '')
                              .replace('(선택식)', '')
                              .replace('[선택식]', '')
                              .replace(/\[.*\]/gi, '')
                              .replace(/\(.*\)/gi, '')
                              .replace(/\//g, ',')
                              .replace(/,/g, ', ');

              var indexInfo = getRandomInt(message.info.length);
              var infoMessage = message.info[indexInfo];

              // callback(returnString);
              callback(message.photoOnlyType(
                    `(하하)빅스비 추천 메뉴 나갑니다.\n마음에 드셨으면 좋겠습니다.\n\n2식당(DE타워) 점심\n- ${memuArray[index]}\n\n💌${infoMessage}`,
                    imageArray[index]));
            }
            else {
              callback(message.baseType("오늘은 식당 운영을 하지 않습니다.(민망)"));
            }
        });
}

module.exports = getRecomm_2Lunch;
