const cheerio = require('cheerio');
const request = require('request');
const Iconv1 = require('iconv').Iconv
const firebase = require('firebase');

//var returnString = "";

var restaurantMap = [
    ["/img/menu/seoulrnd/dayMenu/menu_b_spring.gif", "봄이온소반"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_sandwich.gif", "테이크아웃 1"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_brown.gif", "브라운그릴"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_dodam.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_woori.gif", "우리미각면"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_brown.gif", "브라운그릴"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_korean.gif", "아시안픽스"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_bibim.gif", "헬스기빙365"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_singfu.gif", "싱푸차이나"],

    ["/img/menu/seoulrnd/dayMenu/menu_b_to_juice.gif", "테이크아웃 1"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_picnic.gif", "테이크아웃 2"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_pizza.gif", "테이크아웃 3"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_bibim.gif", "테이크아웃 4"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_fruit.gif", "테이크아웃 5"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_gosel.gif", "고슬고슬비빈"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_theme.gif", "헬스기빙365"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_snap_snack.gif", "테이크아웃 6"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_snap.gif", "스냅스넥"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_juice.gif", "테이크아웃 7"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_to_bread.gif", "테이크아웃 8"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_health_salad.gif", "테이크아웃 9"],
    ["/img/menu/seoulrnd/dayMenu/menu_b_gats.gif", "가츠엔"],

    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_01.gif", "봄이온소반"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_05.gif", "싱푸차이나"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_02.gif", "도담찌개"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_china_01.gif", "싱푸차이나 1"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_china_02.gif", "싱푸차이나 2"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_dodam_01.gif", "도담찌개 1"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_dodam_02.gif", "도담찌개 2"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_03.gif", "테이스티가든"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_08.gif", "테이크아웃 1"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_04.gif", "가츠엔"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_09.gif", "테이크아웃 2"],
    ["/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_healthy.gif", "테이크아웃 3"]
    
];

// Initialize Firebase
var config = {
  apiKey: "AIzaSyASEMR2PC7ngVtgEQ50TVJJeAYHPTrztW8",
  authDomain: "rndmenu.firebaseapp.com",
  databaseURL: "https://rndmenu.firebaseio.com",
  projectId: "rndmenu",
  storageBucket: "rndmenu.appspot.com",
  messagingSenderId: "430408163918"
};
//firebase.initializeApp(config);
var db = firebase.database();
var ref = db.ref("menu");
var refFood= db.ref("foods");

function saveMenu() {
    _saveMenu(12);
    _saveMenu(21);
    _saveMenu(22);
    _saveMenu(23);
}

function _saveMenu(cafe) {
    request({
            url: 'http://www.welstory.com/menu/seoulrnd/menu.jsp',
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

            var myMap = new Map(restaurantMap);

            var date = $('.date', '#layer2').text().replace("년", "").replace("월", "").replace("일", "").trim();
            date = date.replace(/\s/g, '');            
            //console.log('Date:' + date);

            var usersRef = ref.child(date);
            var cafeteriaRef12 = usersRef.child("1식당/점심");
            var cafeteriaRef21 = usersRef.child("2식당/아침");     
            var cafeteriaRef22 = usersRef.child("2식당/점심");   
            var cafeteriaRef23 = usersRef.child("2식당/저녁");   

            if (cafe == 11) {
                //console.log("점심 - Cafeteria 1");
                //returnString = "< 1식당(AB타워) - 아침> (하하)";

                $('.cafeB_tit', '#layer1').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        menuTitle = menuTitle
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

                        console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);
                        //console.log("\n\n");
                    } else {
                        console.log("*** No restaurant: " + $(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } else if (cafe == 12) {
                //console.log("점심 - Cafeteria 1");
                //returnString = "< 1식당(AB타워) - 점심> (하하)";

                $('.cafeB_tit', '#layer2').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        menuTitle = menuTitle
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

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);

                        var restaurantRef = cafeteriaRef12.child(restaurant);

                        restaurantRef.update(
                        {
                            menu: menuTitle,
                            restaurant: restaurant,
                            description: description
                        });

                        var newFood = refFood.child(menuTitle);
                        newFood.update(
                        {
                            restaurant: restaurant,
                            cafeteria: "Cafeteria 12"
                        });
                    } else {
                        console.log("*** No restaurant: " + $(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } else if (cafe == 13) {
                //console.log("점심 - Cafeteria 1");
                //returnString = "< 1식당(AB타워) - 저녁>";

                $('.cafeB_tit', '#layer3').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        menuTitle = menuTitle
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

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);
                        //console.log("\n\n");

                    } else {
                        console.log("*** No restaurant: " + $(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } else if (cafe == 21) {
                //console.log("점심- Cafeteria 2");
                //returnString = "< 2식당(D타워) - 아침> (굿)";
                $('.cafeA_tit', '#layer1').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();
                        //menuTitle = menuTitle.replace(/\s+/g, '').replace('[','(').replace(']',')').replace('/',',');
                        //description = description.replace(/\s+/g, '').replace(' ', '').replace('[','(').replace(']',')').replace('/',',');
                        var nm = "(선택식)닭가슴살망고샐러드(계육:국내산)";

                        menuTitle = menuTitle
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

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);
                        //console.log("\n\n");

                        var restaurantRef = cafeteriaRef21.child(restaurant);

                        restaurantRef.update(
                        {
                            menu: menuTitle,
                            restaurant: restaurant,
                            description: description
                        });

                        var newFood = refFood.child(menuTitle);
                        newFood.update(
                        {
                            restaurant: restaurant,
                            cafeteria: "Cafeteria 21"
                        });
                    } else {
                        console.error("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } // cafe == 2
            else if (cafe == 22) {
                //console.log("점심- Cafeteria 2");
                //returnString = "< 2식당(D타워) - 점심> (아잉)";
                $('.cafeA_tit', '#layer2').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();
                        //menuTitle = menuTitle.replace(/\s+/g, '').replace('[','(').replace(']',')').replace('/',',');
                        //description = description.replace(/\s+/g, '').replace(' ', '').replace('[','(').replace(']',')').replace('/',',');
                        var nm = "(선택식)닭가슴살망고샐러드(계육:국내산)";

                        menuTitle = menuTitle
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

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);
                        //console.log("\n\n");

                        var restaurantRef = cafeteriaRef22.child(restaurant);

                        restaurantRef.update(
                        {
                            menu: menuTitle,
                            restaurant: restaurant,
                            description: description
                        });

                        var newFood = refFood.child(menuTitle);
                        newFood.update(
                        {
                            restaurant: restaurant,
                            cafeteria: "Cafeteria 22"
                        });
                    } else {
                        console.error("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } // cafe == 2
            else if (cafe == 23) {
                //console.log("점심- Cafeteria 2");
                //returnString = "< 2식당(D타워) - 저녁> (감동)";
                $('.cafeA_tit', '#layer3').each(function () {
                    var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();
                        //menuTitle = menuTitle.replace(/\s+/g, '').replace('[','(').replace(']',')').replace('/',',');
                        //description = description.replace(/\s+/g, '').replace(' ', '').replace('[','(').replace(']',')').replace('/',',');
                        var nm = "(선택식)닭가슴살망고샐러드(계육:국내산)";

                        menuTitle = menuTitle
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

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);
                        //console.log("\n\n");

                        var restaurantRef = cafeteriaRef23.child(restaurant);

                        restaurantRef.update(
                        {
                            menu: menuTitle,
                            restaurant: restaurant,
                            description: description
                        });

                        var newFood = refFood.child(menuTitle);
                        newFood.update(
                        {
                            restaurant: restaurant,
                            cafeteria: "Cafeteria 23"
                        });
                    } else {
                        console.error("*** No restaurant: " + $(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } // cafe == 2
        });
}

module.exports = saveMenu;
