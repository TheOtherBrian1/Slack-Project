
//Import Views---------------------------------------------------------------------------------
const initationBlock = require("../views/initiationBlock");
const pickExamBlock = require("../views/pick_exam_block");

//Import Schemas------------------------------------------------------------------------------
const Employee = require('../schemas/employee');

module.exports = (app)=>{
    // Listens to incoming messages that contain "initiate test", prmopt to open test menu--------------------------------------
    app.message('initiate test', async ({ message, say }) => {
        const upsert = {identifier: message.user}
        const employee = await Employee.findOne (upsert);
        let res;
        if(!employee)
        res = await Employee.create(upsert);
        await say(initationBlock(message));
    });
    
    //Open Test Menu-----------------------------------------------------------
    app.action('initiate test', async ({body, client, ack}) =>{
        await ack();
        client.views.open({trigger_id: body.trigger_id, view: pickExamBlock()});
    });
}