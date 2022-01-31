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
  console.log(app.event(e=>console.log(e)))
//Import Controllers--------------------------------------------------
  require('./controller/burnout')(app);
  require('./controller/pickTests')(app);



app.action('drop_down', async ({ body, ack}) => {
  await ack();
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();