/**
 * Created by cheese on 2017. 2. 10..
 */

let message = {};

/*
message.buttons = [ '🏠 1식당-점심',
                    '2식당-아침', '2식당-점심', "2식당-저녁",
                    "내일 뭐먹지?", "문의하기", "🤖 박스비와 대화하기 (실험실)"];
*/

message.buttons = [ '1식당-점심',
                    '2식당-아침', '2식당-점심', "2식당-저녁",
                    "내일 뭐먹지?", "💌 공지사항"];

message.morebuttons = [ '자세히 보기',
                    '메뉴 사진 보기 (TBD)',
                    '상위 메뉴'];

message.buttonsType = () => {
    return {
        type: 'buttons',
        buttons: message.buttons
    }
};

message.baseType = (text) => {
    return {
        message: {
            text: text,
        },
        keyboard: {
            type: 'buttons',
            buttons: message.buttons
        }
    }
};

message.baseTypeWithButtons = (text, buttons) => {
    return {
        message: {
            text: text,
        },
        keyboard: {
            type: 'buttons',
            buttons: buttons
        }
    }
};

message.baseTypeText = (text) => {
    return {
        message: {
            text: text,
        },
        keyboard: {
            type: 'text',
        }
    }
};

message.photoType = (text, url_photo, label, url_button) => {
    return {
      message: {
        text: text,
        photo: {
          url: url_photo,
          width: 640,
          height: 480
        },
        message_button: {
          label: label,
          url: url_button,
        }
      },
      keyboard: {
        type: 'buttons',
        buttons: message.buttons
      }
    }
};

message.messageButtonType = (text, label, url_button) => {
    return {
      message: {
        text: text,
        message_button: {
          label: label,
          url: url_button,
        }
      },
      keyboard: {
        type: 'buttons',
        buttons: message.buttons
      }
    }
};

module.exports = message;
