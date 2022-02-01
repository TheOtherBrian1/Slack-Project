//Import Views---------------------------------------------------------------------------------
const burnout = require('../views/burnout tests');
const results = require('../views/results');

//Import Schemas------------------------------------------------------------------------
const Tests = require('../schemas/tests');

//Import tests--------------------------------------------------------------------------------
const burnoutQuestions = require('../Tests/Burnout Assessment Test');




module.exports = (app)=>{
    //NEXT BUTTON--------------------------------------------------------------------------------
    app.action('next', async ({ body,client,ack}) => {
        await ack();
        //database values-------------------------
            const id = body.user.id;
            const testTitle = body.view.title.text
            const testSectionHeader = body.view.blocks[0].text.text;

            const testScores = []
            for(const key in body.view.state.values){
                testScores.push(body.view.state.values[key].burnout_drop_down.selected_option.value);
            }
    
        //Updating database-------------------
            let {sections, activeIndex, _id} = await Tests.findOne({id, test: testTitle, isSubmitted: false});
            console.log('activeIndex', activeIndex);
            const sectionIndex = sections.findIndex(section=>section.title===testSectionHeader)
            console.log('fetching burnout:', activeIndex);
            const totalSections = burnoutQuestions.length;
            const nextIndex = totalSections < activeIndex? totalSections: activeIndex + 1;
            console.log('next Index', nextIndex);
            sections[activeIndex] = {title:testSectionHeader, scores: testScores}
            await Tests.findByIdAndUpdate(_id,{sections, activeIndex: nextIndex})
            
        //updating view------------------------
            const scores = sections[nextIndex]?.scores;
            const result = await client.views.update({
                view_id: body.view.id,
                hash: body.view.hash,
                view: burnout(nextIndex, scores)
            });
    });


    //PREV BUTTON--------------------------------------------------------------------------------
    app.action('prev', async ({ body,client, ack}) => {
        console.log(body)
        await ack();
        //database values-------------------------
            const id = body.user.id;
            const testTitle = body.view.title.text
            const testSectionHeader = body.view.blocks[0].text.text;

            const testScores = []
            for(const key in body.view.state.values){
                testScores.push(body.view.state.values[key].burnout_drop_down.selected_option.value);
            }
    
        //Updating database-------------------
            let {sections, activeIndex, _id} = await Tests.findOne({id, test: testTitle, isSubmitted: false});
            console.log('activeIndex', activeIndex);
            const sectionIndex = sections.findIndex(section=>section.title===testSectionHeader)
            console.log('fetching burnout:', activeIndex);
            const minSections = 0;
            const prevIndex = minSections > activeIndex? minSections: activeIndex - 1;
            console.log('prev Index', prevIndex);
            sections[activeIndex] = {title:testSectionHeader, scores: testScores}
            await Tests.findByIdAndUpdate(_id,{sections, activeIndex: prevIndex})
            
        //updating view------------------------
            const scores = sections[prevIndex]?.scores;
            const result = await client.views.update({
                view_id: body.view.id,
                hash: body.view.hash,
                view: burnout(prevIndex, scores)
            });
    });


    //ACTIVATE BURNOUT TEST-----------------------------------------------
    app.action('burnout', async ({ body, client, ack }) => {
        await ack();
        const{username, id, name, team_id} = body.user;
        const {test, activeIndex, sections} = await Tests.findOne({id, isSubmitted: false, test: 'Burnout Exam'}) || {};
        console.log('burnout initiate', activeIndex);
        if(!test){
            await Tests.create({id, username, name, team_id, isSubmitted: false, test: 'Burnout Exam', activeIndex: 0});
            console.log('burnout not exist', activeIndex)
            client.views.push({trigger_id: body.trigger_id, view: burnout()});
        }
        else{
            const scores = sections[activeIndex.scores]
            client.views.push({trigger_id: body.trigger_id, view: burnout(activeIndex, scores)});
        }
    });

    //Handle Submission-----------------------------------------------
    app.view('burnout-submit', async ({ body, client, ack }) => {
        //Values to populate document---------------------------
            const testSectionHeader = body.view.blocks[0].text.text;
            const testScores = []
            for(const key in body.view.state.values){
                testScores.push(body.view.state.values[key].burnout_drop_down.selected_option.value);
            }





        //Saving Chart Data------------------------------------------------------------------------
        const{username, id, name, team_id} = body.user;
        const {_id, sections, activeIndex} = await Tests.findOne({id, isSubmitted: false, test: 'Burnout Exam'}) || {};
        sections[activeIndex] = {title: testSectionHeader, scores: testScores}
        let sum = 0;
        for(const score of sections)
            for(const val of score.scores)
                sum+=val
        await Tests.findByIdAndUpdate(_id, {sections, isSubmitted: true, submissionDate: new Date(), cumulative: sum})
        
        sum = [];
        const labels = [];
        for(const section of sections){
            sum.push(section.scores.reduce((a,b)=>a+b)/section.scores.length);
            labels.push(section.title);
        }

        //Populating charts ------------------------------------------------------------------------
        let data = await Tests.find({isSubmitted: true, test: 'Burnout Exam'}).limit(10);
        const scores_over_time = data.map(val=>val.cumulative);


        //Pushing view------------------------------------------------------------------
        console.log(body, 'milk')
        const view = await results();
        ack({response_action:"update", view})
    });
}