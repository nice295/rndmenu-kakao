var apiai = require('apiai');
var getMenu = require('../services/getMenu');
var getRecommendation = require('../services/getRecommendation');
var getTomorrowMenu = require('../services/getTomorrowMenu');
var cache = require('memory-cache');
var message = require('../services/messages');

var app = apiai("d4b5d4ef59554718923eb5d424b3c50e");

var INTENT_DEFAULT = 'Default Fallback Intent'
var INTENT_TODAY = 'today-menu'
var INTENT_TOMORROW = 'tomorrow-menu'
var INTENT_RECOMMENDATION = 'recommendation'
var INTENT_BAD_WORD = 'bad-word'

function getApiai(quetion, callback){
    var request = app.textRequest(quetion, {
        sessionId: '123'
    });
    
    request.on('response', function(response) {
        console.log(response)
        var intent = response.result.metadata.intentName
        var number = response.result.parameters.number
        var time = response.result.parameters.time
        var actionIncomplete = response.result.actionIncomplete        
        console.log('intentName: ' + intent)

      if (intent == INTENT_DEFAULT)
          callback(message.baseTypeText(response.result.fulfillment.speech));
        else if (intent == INTENT_TODAY) {
          var number = response.result.parameters.number
          var time = response.result.parameters.time
          var actionIncomplete = response.result.actionIncomplete
          if (actionIncomplete == true)
            callback(message.baseTypeText(response.result.fulfillment.speech));            
          else {
            if (number == '1') {
              if (time == '점심') {
                if (cache.get('1-lunch')) {
                  console.log(cache.get('1-lunch'));
                  callback(message.baseTypeText(cache.get('1-lunch')));
                }
                else {
                  console.log("No 1-lunch");
                  getMenu(12, function (data) {
                    callback(message.baseTypeText(data));
                    cache.put('1-lunch', data, 1 * 60 * 60 * 1000);
                  });
                }
              }
              else {
                callback(message.baseTypeText('1식당에는 점심만 제공합니다.')); 
              }
            }
            else if (number == '2') {
              if (time == '아침') {
                if (cache.get('2-breakfast')) {
                  console.log(cache.get('2-breakfast'));
                  callback(message.baseTypeText(cache.get('2-breakfast')));
                }
                else {
                  console.log("No 2-breakfast");
                  getMenu(21, function (data) {
                    callback(message.baseTypeText(data));
                    cache.put('2-breakfast', data, 1 * 60 * 60 * 1000);
                  });
                }
              }
              else if (time == '점심') {
                if (cache.get('2-lunch')) {
                  console.log(cache.get('2-lunch'));
                  callback(message.baseTypeText(cache.get('2-lunch')));
                }
                else {
                  console.log("No 2-lunch");
                  getMenu(22, function (data) {
                    callback(message.baseTypeText(data));
                    cache.put('2-lunch', data, 1 * 60 * 60 * 1000);
                  });
                }
              }
              else if (time == '저녁') {
                if (cache.get('2-dinner')) {
                  console.log(cache.get('2-dinner'));
                  callback(message.baseTypeText(cache.get('2-dinner')));
                }
                else {
                  console.log("No 2-dinner");
                  getMenu(23, function (data) {
                    callback(message.baseTypeText(data));
                    cache.put('2-dinner', data, 1 * 60 * 60 * 1000);
                  });
                }
              }
            }
            else {
              callback(message.baseTypeText('현재는 1식당과 2식당만 있습니다.')); 
            } 
          }
        }
        else if (intent == INTENT_TOMORROW) {
          if (cache.get('tomorrow-menu')) {
            console.log(cache.get('tomorrow-menu'));
              callback(message.baseTypeText(cache.get('tomorrow-menu')));
            }
          else {
            console.log("No tomorrow-menu");
            getTomorrowMenu(function (data) {
              callback(message.baseTypeText(data));
              cache.put('tomorrow-menu', data, 1 * 60 * 60 * 1000);
            });
          }      
        }
        else if (intent == INTENT_RECOMMENDATION) {
          if (actionIncomplete == true) {
            callback(message.baseTypeText(response.result.fulfillment.speech));    
          }
          else {
            // (`${number}식당에서는 피자가 최고죠.`);
            getRecommendation(12, function (data) {
              callback(data);
            });
          }
        }      
        else {
          callback(message.baseTypeText(response.result.fulfillment.speech));
        }     
    });
    
    request.on('error', function(error) {
        callback(message.baseTypeText("허거덕..."));
    });      

    request.end();
}

module.exports = getApiai;