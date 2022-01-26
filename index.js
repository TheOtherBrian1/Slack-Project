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
const burnout = require('./views/burnout tests');
const pickExamBlock = require("./views/pick_exam_block");

//Import Schemas------------------------------------------------------------------------------
const Employee = require('./schemas/employee');
const Tests = require('./schemas/tests');

// Listens to incoming messages that contain "hello"
app.message('initiate test', async ({ message, say }) => {
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
  const{username, id, name, team_id} = body.user;
  const testExists = await Tests.findOne({isSubmitted: false});
  if(!testExists)
    await Tests.create({id, username, name, team_id, isSubmitted: false, test: 'Burnout Exam', activeIndex: 0});
  client.views.push({trigger_id: body.trigger_id, view: burnout()});
});

app.action('drop_down', async ({ body, ack}) => {
  await ack();
});

app.action('next', async ({ body,client, ack}) => {
  await ack();
  //database values----------
  const id = body.user.id;
  const testTitle = body.view.title.text
  const testSection = body.view.blocks[0].text.text;
  const testScores = []

  const testAnswers = body.view.state.values;
  for(const key in testAnswers){
    testScores.push(testAnswers[key].drop_down.selected_option.value);
  }
  //Updating database
  const test = await Tests.findOne({id, test: testTitle});
  const {sections, activeIndex} = test;
  const sectionIndex = sections.findIndex(section=>section.title===testSection)
  if(sectionIndex !== -1){
    sections[sectionIndex].scores = testScores;
    const check = await Tests.findByIdAndUpdate(test._id,{sections})
  }
  else{
    try{
    const check = await Tests.findByIdAndUpdate(test._id,{sections:[{title: testSection, scores: testScores}]})
    }
    catch(err){
      console.error(err);
    }
  }
  client.views.push({trigger_id: body.trigger_id, view: burnout(activeIndex+1)});
});


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();