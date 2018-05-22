const cheerio = require('cheerio');
const request = require('request');
const Iconv1 = require('iconv').Iconv
const firebase = require('firebase');

const GoogleImages = require('google-images');
const client = new GoogleImages('006341800035892376322:rrzsjzbfwfs', 'AIzaSyANl_jRq8GJVBCwyh_HIEXHnV5QF7_cess');

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
    console.log("Starting save menu...")
    _saveMenu(12);
    _saveMenu(21);
    _saveMenu(22);
    _saveMenu(23);
}

function _saveMenu(cafe) {
    request({
            url: 'http://www.welstory.com/menu/seoulrnd/menu.jsp',
            //url: 'http://www.welstory.com/menu/seoulrnd/menu.jsp?meal_type=2&course=AA&dtFlag=2',
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
                    //var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        menuTitle = menuTitle
                            .replace(/\s+/g, '')
                            .replace('(선택식)', '')
                            .replace('[선택식]', '')
                            .replace(/\[.*\]/gi, '')
                            .replace(/\(.*\)/gi, '')
                            .replace(/\//g, '')
                            .replace(/,/g, '');
                        description = description
                            .replace(/\s+/g, '')
                            .replace('(선택식)', '')
                            .replace('[선택식]', '')
                            .replace(/\[.*\]/gi, '')
                            .replace(/\(.*\)/gi, '')
                            .replace(/\//g, ',')
                            .replace(/,/g, ',');

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
                    //var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    var restaurant = $(this).find('span.img_orange').text();
                    if (restaurant) {
                        var menuTitle = $(this).parent().find('.cafeB_tit').text();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        restaurant = restaurant
                            .replace(/\//g, '');

                        menuTitle = menuTitle
                            .replace(restaurant, '')
                            .replace(/\s+/g, '')
                            .replace('(선택식)', '')
                            .replace('[선택식]', '')
                            .replace(/\[.*\]/gi, '')
                            .replace(/\(.*\)/gi, '')
                            .replace(/\//g, '')
                            .replace(/,/g, '');
                        description = description
                            .replace(/\s+/g, '')
                            .replace('(선택식)', '')
                            .replace('[선택식]', '')
                            .replace(/\[.*\]/gi, '')
                            .replace(/\(.*\)/gi, '')
                            .replace(/\//g, '')
                            .replace(/,/g, '');

                        //console.log(restaurant + ': ' + menuTitle);
                        //returnString += "\n" + menuTitle + " - " + restaurant;
                        //console.log("Description: " + description);

                        var restaurantRef = cafeteriaRef12.child(restaurant);

                        restaurantRef.update(
                        {
                            menu: menuTitle,
                            restaurant: restaurant,
                            description: description,
                            photoUrl: "https://placekitten.com/200/200"
                        });

                        var newFood = refFood.child(menuTitle);
                        newFood.update(
                        {
                            restaurant: restaurant,
                            cafeteria: "Cafeteria 12",
                            photoUrl: "https://placekitten.com/200/200"
                        });

                        client.search(menuTitle)
                            .then(images => {
                                //console.log(images[0].url)
                                //console.log("Length: " + images.length)
                                for (var i = 0; i < images.length; i++) {
                                    imageUrl = images[i].url
                                    if (imageUrl.substring(imageUrl.length - 4) == '.jpg') {
                                        console.log(menuTitle + "'s URL is " + imageUrl)

                                        restaurantRef.update(
                                            {
                                                 photoUrl: imageUrl
                                            });

                                            newFood.update(
                                            {
                                                photoUrl: imageUrl
                                            });

                                        break;
                                    }
                                }
                        });

                    } else {
                        //console.log("*** No restaurant: " + $(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    }
                });

                //callback(returnString);
            } else if (cafe == 13) {
                //console.log("점심 - Cafeteria 1");
                //returnString = "< 1식당(AB타워) - 저녁>";

                $('.cafeB_tit', '#layer3').each(function () {
                    //var restaurant = myMap.get($(this).find('span.cafeB_restaurant').find('img').attr('src'));
                    var restaurant = $(this).find('span.img_orange').text();
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeB_txt').text();

                        restaurant = restaurant
                            .replace(/\//g, '');

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
                    //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    var restaurant = $(this).find('span.img_green').text();
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();

                        restaurant = restaurant
                            .replace(/\//g, '');

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
                    //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    var restaurant = $(this).find('span.img_green').text();
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();


                        restaurant = restaurant
                            .replace(/\//g, '');

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
                    //var restaurant = myMap.get($(this).find('span.cafeA_restaurant').find('img').attr('src'));
                    var restaurant = $(this).find('span.img_green').text();
                    if (restaurant) {
                        var menuTitle = $(this).text().trim();
                        var description = $(this).parent().find('.cafeA_txt').text();

                        restaurant = restaurant
                            .replace(/\//g, '');

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
