require("dotenv").config();
const Employee = require('./schemas/employee');
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
const burnout = require('./views/burnout tests');
const pickExamBlock = require("./views/pick_exam_block");

// Listens to incoming messages that contain "hello"
app.message('initiate test', async ({ message, say }) => {
  console.log(message);
  const upsert = {identifier: message.user}
  const employee = await Employee.findOne (upsert);
  let res;
  if(!employee)
     res = await Employee.create(upsert);
  await say(initationBlock(message));
});

app.action('initiate test', async ({body, client, ack}) =>{
  await ack();
  client.views.open({trigger_id: body.trigger_id, view: pickExamBlock()});
});

app.action('burnout', async ({ body, client, ack }) => {
  await ack();
  // console.log(burnout().blocks[1]);
  client.views.push({trigger_id: body.trigger_id, view: burnout()});
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();