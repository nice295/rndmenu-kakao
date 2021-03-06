const express = require('express');
const router = express.Router();
const message = require('./services/messages');
const Bot = require('./services/botService');
const getMenu = require('./services/getMenu');
const getTomorrowMenu = require('./services/getTomorrowMenu');
const getApiai = require('./services/getApiai');
//const saveMenu = require('./services/saveMenu');
const getRecomm_1Lunch = require('./services/getRecomm_1Lunch');
const getRecomm_2Lunch = require('./services/getRecomm_2Lunch');

const moment = require('moment-timezone');

var ua = require('universal-analytics');
var visitor = ua('UA-51117181-7');

//setInterval(saveMenu, 1000*60*60);
//saveMenu()
//setInterval(saveMenu, 3*1000*60*60);

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

const checkUserKey = (req, res, next)=>{
  if(req.body.user_key !== undefined){
    next();
  }else{
    res.status(500).send({ error: 'user_key is undefined' });
  }
};

router.get('/tomorrow', (req, res) => {

  getTomorrowMenu(function(data) {
    console.log(data);

    res.set({
      'content-type': 'application/json'
    }).send(JSON.stringify(message.baseType(data)));
  });
});

router.get('/', (req, res) => {
  res.send('<h1>Hello</h1>');
});

router.get('/test', (req, res) => {
  console.log("time is " + getTime());
  getRecomm_2Lunch(formatDate(), function (data) {
  // getRecomm_1Lunch('20181029', function (data) {
    res.send(data);
  });  
});

router.get('/keyboard', (req, res) => {
  visitor.pageview("/").send();
  visitor.event("keyboard", "keyboard", req.body.user_key, 0).send();

  res.set({
    'content-type': 'application/json'
  // }).send(JSON.stringify(
  //   {
  //     "type": "text"
  //   }
  //   ));
  }).send(JSON.stringify(message.buttonsType()));
});

router.post('/message', checkUserKey, (req, res) => {
  const _obj = {
    user_key: req.body.user_key,
    type: req.body.type,
    content: req.body.content
  };

  console.log(`Type is ${_obj.type}`);
  Bot.choseMenu(req, _obj.content, (err, result) => {
    if (!err) {
      res.set({
        'content-type': 'application/json'
      }).send(JSON.stringify(result));
    } else {
      res.set({
        'content-type': 'application/json'
      }).send(JSON.stringify(message.baseType('다시 시도해 주세요')));
    }
  });
});

router.post('/friend', checkUserKey, (req, res) => {
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 쳇팅방에 참가했습니다.`);
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

router.delete('/friend', checkUserKey, (req, res) => {
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 쳇팅방을 차단했습니다.`);
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

router.delete('/friend/test', checkUserKey, (req, res) => {
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 쳇팅방을 차단했습니다.`);
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

router.delete('/chat_room/:user_key', checkUserKey, (req, res) => {
  const user_key = req.params.user_key;
  console.log(`${user_key}님이 쳇팅방에서 나갔습니다.`);
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

module.exports = router;
