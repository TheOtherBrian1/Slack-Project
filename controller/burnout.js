//Import Views---------------------------------------------------------------------------------
const burnout = require('../views/burnout tests');

//Import Schemas------------------------------------------------------------------------
const Tests = require('../schemas/tests');

//Import tests--------------------------------------------------------------------------------
const burnoutQuestions = require('../Tests/Burnout Assessment Test');

//Import Chart creator-----------------------------------------------------------------
const QuickChart = require('quickchart-js');




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
        await ack();
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

        let chart = new QuickChart();

        
        sum = [];
        const labels = [];
        for(const section of sections){
            sum.push(section.scores.reduce((a,b)=>a+b)/section.scores.length);
            labels.push(section.title);
        }
        console.log(sum);
        chart.setConfig({
            "type": "radar",
            "data": {
              "labels": labels,
              "datasets": [
                    {
                    "backgroundColor": "rgba(255, 99, 132, 0.5)",
                    "borderColor": "rgb(255, 99, 132)",
                    "data": sum
                    }
                ],
                "options": {
                    "maintainAspectRatio": true,
                    "spanGaps": false,
                    "elements": {
                      "line": {
                        "tension": 0.000001
                      }
                    },
                    "plugins": {
                      "filler": {
                        "propagate": false
                      },
                      "samples-filler-analyser": {
                        "target": "chart-analyser"
                      }
                    }
                }
            }
        });
        console.log(chart.getUrl());

        //Populating charts ------------------------------------------------------------------------
        let data = await Tests.find({isSubmitted: true, test: 'Burnout Exam'});
        const duck = data.map(val=>val.cumulative);
        console.log(duck,'duck');      
        const duck_labels = Array.from(Array(duck.length).keys())     

        chart.setWidth(300)
        chart.setHeight(180);

        chart.setConfig({
            type: 'line',
            data: {
                labels: duck_labels,
                datasets: [
                    {
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: duck,
                        label: 'Dataset',
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                xAxes: [
                    {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                    },
                    },
                ],
                },
                title: {
                text: 'fill: false',
                display: true,
                },
            },
        });
        console.log(chart.getUrl());

    });
}