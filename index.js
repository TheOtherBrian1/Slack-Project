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

//Import tests--------------------------------------------------------------------------------
const burnoutQuestions = require('./Tests/Burnout Assessment Test');

//Import Views---------------------------------------------------------------------------------
const initationBlock = require("./views/initiationBlock");
const burnout = require('./views/burnout tests');
const pickExamBlock = require("./views/pick_exam_block");

//Import Schemas------------------------------------------------------------------------------
const Employee = require('./schemas/employee');
const Tests = require('./schemas/tests');



// Listens to incoming messages that contain "initiate test"--------------------------------------
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
  const testExists = await Tests.findOne({id, isSubmitted: false});
  if(!testExists){
    await Tests.create({id, username, name, team_id, isSubmitted: false, test: 'Burnout Exam', activeIndex: 0});
    client.views.push({trigger_id: body.trigger_id, view: burnout()});
  }
  else
    client.views.push({trigger_id: body.trigger_id, view: burnout(testExists.activeIndex, testExists.sections[testExists.activeIndex].scores)});
});


app.action('drop_down', async ({ body, ack}) => {
  await ack();
});


app.action('next', async ({ body,client, ack}) => {
  await ack();
  const maxSections = burnoutQuestions.length - 1;
  //database values----------
  const id = body.user.id;
  const testTitle = body.view.title.text
  const testSection = body.view.blocks[0].text.text;
  const testScores = []

  const testAnswers = body.view.state.values;
  for(const key in testAnswers){
    testScores.push(testAnswers[key].drop_down.selected_option.value);
  }

  //Updating database-------------------
  const test = await Tests.findOne({id, test: testTitle});
  let {sections, activeIndex} = test;
  const {scores, title} = sections;
  const sectionIndex = sections.findIndex(section=>section.title===testSection)
  activeIndex = maxSections === activeIndex? maxSections: activeIndex + 1;
  const newSection = sectionIndex === -1;
  if(newSection){
    sections[sectionIndex].scores = testScores;
    const check = await Tests.findByIdAndUpdate(test._id,{sections, activeIndex:0 })
  }
  else{
    try{
      test.sections[activeIndex] = {title: testSection, scores: testScores}
      const check = await Tests.findByIdAndUpdate(test._id,{sections: test.sections, activeIndex})
    }
    catch(err){
      console.error(err);
    }
  }

  //updating view------------------------
  const result = await client.views.update({
    view_id: body.view.id,
    hash: body.view.hash,
    view: burnout(activeIndex, newSection?0: sections[activeIndex])
  });
});


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();