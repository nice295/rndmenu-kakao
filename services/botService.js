const Bot = {};

const message = require('../services/messages');
const getMenu = require('../services/getMenu');
const getTomorrowMenu = require('../services/getTomorrowMenu');
const getRecomm_1Lunch = require('../services/getRecomm_1Lunch');
const getRecomm_2Lunch = require('../services/getRecomm_2Lunch');
const getApiai = require('../services/getApiai');
const cache = require('memory-cache');
const firebase = require('firebase');
const dateFormat = require('dateformat');
const time = require('time');
const moment = require('moment-timezone');

var ua = require('universal-analytics');
var visitor = ua('UA-51117181-7');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyASEMR2PC7ngVtgEQ50TVJJeAYHPTrztW8",
  authDomain: "rndmenu.firebaseapp.com",
  databaseURL: "https://rndmenu.firebaseio.com",
  projectId: "rndmenu",
  storageBucket: "rndmenu.appspot.com",
  messagingSenderId: "430408163918"
};
firebase.initializeApp(config);
var database = firebase.database();

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

function getTime () {
  var m = moment();
  m.tz("Asia/Seoul").format();
  
	var g = null; //return g
	
	var split_afternoon = 12 //24hr time to split the afternoon
	var split_evening = 17 //24hr time to split the evening
	var currentHour = parseFloat(m.format("HH"));
  console.log("currentHour is " + currentHour);
	
	if(currentHour >= split_afternoon && currentHour <= split_evening) {
		g = "afternoon";
	} else if(currentHour >= split_evening) {
		g = "evening";
	} else {
		g = "morning";
	}
	
	return g;
}

Bot.choseMenu = (req, content, callback) => {
  visitor.event("message", content, req.body.user_key, 0).send();

  switch (content) {
    // case "1식당-점심":
    // // case "점심":
    // // case "1식당":
    // // case "1":
    //   getMenu(12, function (data) {
    //     callback(null, message.baseType(data));  
    //     // callback(null, message.baseTypeWithButtons(data, message.morebuttons));        
    //   });
    //   break;

    case "🎁뭐먹지":
      if (getTime() == 'morning') {  
        console.log("cache " + cache.get('뭐먹지'));
        
        if (cache.get('뭐먹지') == "1") {
          getRecomm_2Lunch(formatDate(), function (data) {
            callback(null, data); 
            cache.put('뭐먹지', "2", 60 * 1000);
            console.log("1");
          });  
        } else {
          getRecomm_1Lunch(formatDate(), function (data) {
            callback(null, data);
            cache.put('뭐먹지', "1", 60 * 1000);
            console.log("2");
          });          
        }            
      }
      else if (getTime() == 'afternoon') {
        getRecomm_2Lunch(formatDate(), function (data) {
          callback(null, data);
        });  
      }
      else {
        callback(null, message.baseType("밤에는 그냥 집에서 치킨 시켜 드세요.(하하)"));
      }
      
      break;
      
    case "1식당-점심":
      if (cache.get('1-lunch')) {
        console.log(cache.get('1-lunch'));
        callback(null, message.baseType(cache.get('1-lunch')));
      } else {
        console.log("No 1-lunch");
        getMenu(12, function (data) {
          callback(null, message.baseType(data));
          cache.put('1-lunch', data, 1 * 60 * 60 * 1000);
        });
      }
      break;
      
    case "자세히 보기":
      getMenu(120, function (data) {
        callback(null, message.baseType(data));     
      });
      break;

    case "2식당-아침":
    // case "아침":
      if (cache.get('2-breakfast')) {
        console.log(cache.get('2-breakfast'));
        callback(null, message.baseType(cache.get('2-breakfast')));
      } else {
        console.log("No 2-breakfast");
        getMenu(21, function (data) {
          callback(null, message.baseType(data));
          cache.put('2-breakfast', data, 1 * 60 * 60 * 1000);
        });
      }
      break;

    case "2식당-점심":
    // case "2식당":
    // case "2":
      if (cache.get('2-lunch')) {
        console.log(cache.get('2-lunch'));
        callback(null, message.baseType(cache.get('2-lunch')));
      } else {
        console.log("No 2-lunch");
        getMenu(22, function (data) {
          callback(null, message.baseType(data));
          cache.put('2-lunch', data, 1 * 60 * 60 * 1000);
        });
      }
      break;

    case "2식당-저녁":
    // case "저녁":
      if (cache.get('2-dinner')) {
        console.log(cache.get('2-dinner'));
        callback(null, message.baseType(cache.get('2-dinner')));
      } else {
        console.log("No 2-dinner");
        getMenu(23, function (data) {
          callback(null, message.baseType(data));
          cache.put('2-dinner', data, 1 * 60 * 60 * 1000);
        });
      }
      break;

    case "내일 메뉴":
    // case "내일":
      if (cache.get('tomorrow-menu')) {
        console.log(cache.get('tomorrow-menu'));
        callback(null, message.baseType(cache.get('tomorrow-menu')));
      } else {
        console.log("No tomorrow-menu");
        getTomorrowMenu(function (data) {
          callback(null, message.baseType(data));
          cache.put('tomorrow-menu', data, 1 * 60 * 60 * 1000);
        });
      }
      break;

    // case "문의하기":
    //   callback(null, message.messageButtonType("아래 링크를 통해 오류와 개선제안을 하실 수 있습니다.", "문의하기", "https://docs.google.com/forms/u/0/d/e/1FAIpQLScxmXXdTB75iutcM5a9LbB-Bz3iRVacRmywu88cNo65_6F4mw/viewform?usp=sf_link"));
    //   break;

    case "🤖빅스비에게 물어보기":
      callback(null, message.baseTypeText("🤖 메뉴를 저에게 물어보세요.\n더 이상 대화를 원하지 않으시면 '끝'이라고 말해 주세요."));
      break;

    case "끝":
    case ".":
      callback(null, message.baseType("다음에 또 봐요. 🤖"));
      break;

//     case "💌 공지사항":
//       callback(null, message.baseType("삼성전자 우면사업장 서울R&D메뉴를 다시 시작합니다.\n많은 애용 및 관심부탁드립니다.(하트뿅)"));
//       break;

//     case "메뉴 사진 보기 (TBD)":
//       callback(null, message.baseType("준비 중입니다.(하트뿅)"));
//       break;

//     case "상위 메뉴":
//       callback(null, message.baseType("안녕하세요? 서울R&D메뉴입니다."));
//       break;

//     case "💌 EOS 안내":
//       callback(null, message.baseType("서울RND메뉴를 그동안 사랑해 주셔서 감사합니다.\n세계 경제 침체와 급격한 사용자 감소에 따라서\n본 서비스도 다른 삼성전자 서비스들과 같이 EOS를 하게 되었습니다.(~11월 30일)(눈물)\n그 동안 응원해 주시고 사랑해 주셔서 감사하며\n추후 더 좋은 서비스로 찾아 뵙겠습니다.(하트뿅)"));
//         break;

    default:
      getApiai(content, function (data) {
        // callback(null, message.baseTypeText(data));
        callback(null, data);
      });
      break;
  }

  var now = new time.Date();
  now.setTimezone("Asia/Seoul");
  var timeValue = now.toString()

  console.log("user_key: " + req.body.user_key);
  console.log("timeValue: " + timeValue);

//   firebase.database().ref('kakao/users/' + req.body.user_key + '/action/' + content + "/" + timeValue).set({
//     time : timeValue
//   });

//   firebase.database().ref('kakao/users/' + req.body.user_key + '/time/' + timeValue).set({
//     action : content
//   });
};

module.exports = Bot;
