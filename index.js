require("dotenv").config();

//Connect to mongoDB------------------------------------------------------------------------------------
const mongoose = require('mongoose');
const uri = `mongodb+srv://Brian:${process.env.DATABASE_PASSWORD}@cluster0.i56gr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(uri).
  then(()=>console.log('connected to mongodb')).
  catch(error => console(error));


//Connect to slack--------------------------------------------------------------------------------------
const { App, LogLevel } = require('@slack/bolt');
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
});

//Import Views---------------------------------------------------------------------------------
const initationBlock = require("./views/initiationBlock");
const questionBlock = require('./views/questionBlock');

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  await say(initationBlock(message));
});

app.action('button_click', async ({ body, client, ack }) => {
  await ack();
  client.views.open({trigger_id: body.trigger_id, view: questionBlock()});
});

// Listens to incoming messages that contain "goodbye"

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();