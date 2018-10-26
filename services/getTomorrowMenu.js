const message = require('../services/messages');
var cheerio = require('cheerio');
var request = require('request');
var Iconv1 = require('iconv').Iconv
const dateFormat = require('dateformat');
const time = require('time');

var returnString = "";

/*
var restaurantMap = [
    ["/img/menu/seoulrnd/dayMenu/menu_b_spring.gif", "봄이온소반"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_sandwich.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_brown.gif", "브라운그릴"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_dodam.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_woori.gif", "우리미각면"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_brown.gif", "브라운그릴"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_korean.gif", "아시안픽스"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_bibim.gif", "헬스기빙365"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_singfu.gif", "싱푸차이나"],

    ["/img/menu/seoulrnd/dayMenu/menu_b_to_juice.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_picnic.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_pizza.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_bibim.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_fruit.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_gosel.gif", "고슬고슬비빈"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_theme.gif", "헬스기빙365"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_snap_snack.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_snap.gif", "스냅스넥"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_juice.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_bread.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_salad.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_gats.gif", "가츠엔"],

    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_01.gif", "봄이온소반"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_05.gif", "싱푸차이나"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_02.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_china_01.gif", "싱푸차이나"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_china_02.gif", "싱푸차이나"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_dodam_01.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_dodam_02.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_03.gif", "테이스티가든"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_08.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_04.gif", "가츠엔"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_09.gif", "테이크아웃"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_healthy.gif", "테이크아웃"]
];
*/

function getTomorrowMenu(callback) {
    request({
            url: 'http://www.welstory.com/menu/seoulrnd/menu.jsp?meal_type=2&course=AA&dtFlag=2',
            encoding: 'binary'
        },
        function (error, response, html) {
            if (error) {
                console.error("error" + error);
                throw error
            };

            var strContents = new Buffer(html, 'binary')
            iconv = new Iconv1('euc-kr', 'UTF8')
            strContents = iconv.convert(strContents).toString()

            var $ = cheerio.load(strContents);

            //var myMap = new Map(restaurantMap);

            var date = $('.date', '#layer2').text();
            returnString = "내일 메뉴 - "+ date;

            returnString += "\n\n< 1식당(AB타워) - 점심> (하하)";

            $('.cafeB_tit', '#layer2').each(function () {
                //var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                var restaurant = $(this).find('span.img_orange').text();
                if (restaurant) {
                    var description = $(this).parent().find('.cafeB_txt').text();
                    var menuTitle = $(this).text().trim();

                    menuTitle = menuTitle
                        .replace(restaurant, '')
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');
                    description = description
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');

                    console.log('restaurant : ' + restaurant);
                    console.log('menuTitle : ' + menuTitle);
                    console.log('description : ' + description);

                    returnString += "\n" + menuTitle + " (" + restaurant + ")";
                } else {
                    console.log("*** No restaurant: " + $(this).find('span.cafeB_restaurant').find('img').attr('src'));
                }
            });

            //console.log("점심- Cafeteria 2");
            returnString += "\n\n< 2식당(D타워) - 아침> (굿)";
            $('.cafeA_tit', '#layer1').each(function () {
                //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                var restaurant = $(this).find('span.img_green').text();
                if (restaurant) {
                    var description = $(this).parent().find('.cafeB_txt').text();
                    var menuTitle = $(this).text().trim();

                    menuTitle = menuTitle
                        .replace(restaurant, '')
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');
                    description = description
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');

                    console.log('restaurant : ' + restaurant);
                    console.log('menuTitle : ' + menuTitle);
                    console.log('description : ' + description);

                    returnString += "\n" + menuTitle + " (" + restaurant + ")";
                } else {
                    console.log("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                }
            });

            //callback(returnString);

            //console.log("점심- Cafeteria 2");
            returnString += "\n\n< 2식당(D타워) - 점심> (아잉)";
            $('.cafeA_tit', '#layer2').each(function () {
                //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                var restaurant = $(this).find('span.img_green').text();
                if (restaurant) {
                    var menuTitle = $(this).text().trim();
                    var description = $(this).parent().find('.cafeA_txt').text();
                    //menuTitle = menuTitle.replace(/\s+/g, '').replace('[','(').replace(']',')').replace('/',',');
                    //description = description.replace(/\s+/g, '').replace(' ', '').replace('[','(').replace(']',')').replace('/',',');
                    var nm = "(선택식)닭가슴살망고샐러드(계육:국내산)";

                    menuTitle = menuTitle
                        .replace(restaurant, '')
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');
                    description = description
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');

                    console.log('restaurant : ' + restaurant);
                    console.log('menuTitle : ' + menuTitle);
                    console.log('description : ' + description);

                    returnString += "\n" + menuTitle + " (" + restaurant + ")";
                } else {
                    console.log("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                }
            });

            //callback(returnString);

            //console.log("점심- Cafeteria 2");
            returnString += "\n\n< 2식당(D타워) - 저녁> (감동)";
            $('.cafeA_tit', '#layer3').each(function () {
                //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                var restaurant = $(this).find('span.img_green').text();
                if (restaurant) {
                    var menuTitle = $(this).text().trim();
                    var description = $(this).parent().find('.cafeA_txt').text();
                    //menuTitle = menuTitle.replace(/\s+/g, '').replace('[','(').replace(']',')').replace('/',',');
                    //description = description.replace(/\s+/g, '').replace(' ', '').replace('[','(').replace(']',')').replace('/',',');
                    var nm = "(선택식)닭가슴살망고샐러드(계육:국내산)";

                    menuTitle = menuTitle
                        .replace(restaurant, '')
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');
                    description = description
                        .replace(/\s+/g, '')
                        .replace('(선택식)', '')
                        .replace('[선택식]', '')
                        .replace(/\[.*\]/gi, '')
                        .replace(/\(.*\)/gi, '')
                        .replace(/\//g, ',')
                        .replace(/,/g, ', ');

                    console.log('restaurant : ' + restaurant);
                    console.log('menuTitle : ' + menuTitle);
                    console.log('description : ' + description);

                    returnString += "\n" + menuTitle + " (" + restaurant + ")";
                } else {
                    console.log("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                }
            });

            returnString += "\n\n내일 먹을 음식을 미리 준비하는 당신은 멋집니다.\n건강을 위한 운동도 잊지마세요. 🤖"
            callback(returnString);
        });
}

module.exports = getTomorrowMenu;
