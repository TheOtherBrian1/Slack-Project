const initationBlock = (message)=>({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me"
          },
          "action_id": "initiate test"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });

  module.exports = initationBlock;