const burnoutExamQuestions = require('../Tests/Burnout Assessment Test')
const buttons = {
	"type": "actions",
	"elements": [
		{
			"type": "button",
			"text": {
				"type": "plain_text",
				"emoji": true,
				"text": "prev"
			},
			"style": "danger",
			"value": "prev",
			'action_id': 'prev'
		},
		{
			"type": "button",
			"text": {
				"type": "plain_text",
				"emoji": true,
				"text": "next"
			},
			"style": "primary",
			"value": "next",
			'action_id': 'next'
		}
	]
}



//BURNOUT TEST--------------------------------------------------------
const burnout = (index = 0, prevResponses=[],series=burnoutExamQuestions)=>{
	console.log(index, series[index])
	const title = {
		type: "plain_text",
		text: "Burnout Exam"
	};
	const close = {
			"type": "plain_text",
			"text": "Cancel",
	};
	const submit = {
		type: "plain_text",
		text: "Submit"
	};
	const header = {
		"type": "header",
		"text": {
			"type": "plain_text",
			"text": 'Section: ' + series[index].section,
			"emoji": true
		}
	}

	return ({
		type: 'modal',
		title,
		submit,
		close,
		blocks:[
			header,
			{...divider()},
			...questions(series, index, prevResponses),
			buttons
		]	})
}


module.exports = burnout;

//Helper Functions --------------------------------------------------------------
function divider(){
	return {
		type: 'divider'
	}
}
function options(prevResponse){
	const opt = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
	return({
			"options": [
				...opt.map((text, index)=>({
						"text": {
							"type": "plain_text",
							"emoji": true,
							text
						},
						"value": `${index+1}`
					}))
			],
			"initial_option": {
				"text": {
					"type": "plain_text",
					"text": opt[prevResponse] ?? 'Sometimes',
					"emoji": true
				},
				"value": `${prevResponse ?? 3}`
			}
	})
}

function questions(series, index, prevResponses){
	const questionElements = [];
	const questionsBlock = series[index].questions.forEach((question, index)=>{		
		questionElements.push(
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": question
				},
				"accessory": {
					"type": "static_select",
					'action_id': 'drop_down',
					"placeholder": {
						"type": "plain_text",
						"emoji": true,
						"text": "Your Response"
					},
					...options(prevResponses[index]),
				}
			}
		);
		questionElements.push(divider());
	});
	return questionElements;
}
