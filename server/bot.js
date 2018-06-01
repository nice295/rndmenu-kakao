const express = require('express');
const router = express.Router();
const message = require('./services/messages');
const Bot = require('./services/botService');
const getMenu = require('./services/getMenu');
const getTomorrowMenu = require('./services/getTomorrowMenu');
const getApiai = require('./services/getApiai');
const saveMenu = require('./services/saveMenu');

var ua = require('universal-analytics');
var visitor = ua('UA-51117181-7');

//setInterval(saveMenu, 1000*60*60);
saveMenu()
setInterval(saveMenu, 3*1000*60*60);

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

router.get('/test', (req, res) => {

  var returnStrint;

  getApiai("하이", function(data) {
    console.log(data);
  });

  getMenu(11, function(data) {
    console.log(data);
    returnStrint += data;
  });

  getMenu(12, function(data) {
    console.log(data);
    returnStrint += data;
  });

  getMenu(13, function(data) {
    console.log(data);
    returnStrint += data;
  });

  getMenu(21, function(data) {
    console.log(data);
    returnStrint += data;
  });

  getMenu(22, function(data) {
    console.log(data);
    returnStrint += data;
  });

   getMenu(23, function(data) {
    console.log(data);
    returnStrint += data;
  });

  getTomorrowMenu(function(data) {
    console.log(data);
    returnStrint += data;
  });

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(message.baseType(returnStrint)));
});

router.get('/keyboard', (req, res) => {
  visitor.pageview("/").send();
  visitor.event("keyboard", "keyboard", req.body.user_key, 0).send();

  res.set({
    'content-type': 'application/json'
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
