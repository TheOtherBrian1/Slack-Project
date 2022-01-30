//Import Views---------------------------------------------------------------------------------
const burnout = require('../views/burnout tests');

//Import Schemas------------------------------------------------------------------------
const Tests = require('../schemas/tests');

//Import tests--------------------------------------------------------------------------------
const burnoutQuestions = require('../Tests/Burnout Assessment Test');



module.exports = (app)=>{
    //NEXT BUTTON--------------------------------------------------------------------------------
    app.action('next', async ({ body,client, ack}) => {
        await ack();
        //database values-------------------------
            const id = body.user.id;
            const testTitle = body.view.title.text
            const testSectionHeader = body.view.blocks[0].text.text;
            
            const testScores = []
            for(const key in body.view.state.values){
                testScores.push(body.view.state.values[key].drop_down.selected_option.value);
            }
    
        //Updating database-------------------
            let {sections, activeIndex, _id} = await Tests.findOne({id, test: testTitle, isSubmitted: false});
            const sectionIndex = sections.findIndex(section=>section.title===testSectionHeader)

            const totalSections = burnoutQuestions.length;
            const nextIndex = totalSections > activeIndex? totalSections: activeIndex + 1;
            console.log('totalSections:', totalSections, 'currentIndex:', activeIndex, 'nextIndex:', nextIndex, 'compareison:', totalSections=== activeIndex, 'comparison outcome', totalSections > activeIndex? totalSections: activeIndex + 1)
            sections[activeIndex] = {title:testSectionHeader, scores: testScores}
            await Tests.findByIdAndUpdate(_id,{sections, activeIndex: nextIndex})
    
        //updating view------------------------
            const scores = sections[nextIndex]?.scores || [];
            console.log('scores', scores)
            const result = await client.views.update({
                view_id: body.view.id,
                hash: body.view.hash,
                view: burnout(nextIndex, scores, totalSections < activeIndex)
            });
    });


    //ACTIVATE BURNOUT TEST-----------------------------------------------
    app.action('burnout', async ({ body, client, ack }) => {
        await ack();
        const{username, id, name, team_id} = body.user;
        const {test, activeIndex, sections} = await Tests.findOne({id, isSubmitted: false}) || {};

        if(!test){
            await Tests.create({id, username, name, team_id, isSubmitted: false, test: 'Burnout Exam', activeIndex: 0});
            client.views.push({trigger_id: body.trigger_id, view: burnout()});
        }
        else{
            const scores = sections[activeIndex.scores]
            client.views.push({trigger_id: body.trigger_id, view: burnout(activeIndex, scores)});
        }
    });
}