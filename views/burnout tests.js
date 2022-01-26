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
			"value": "prev"
		},
		{
			"type": "button",
			"text": {
				"type": "plain_text",
				"emoji": true,
				"text": "next"
			},
			"style": "primary",
			"value": "next"
		}
	]
}



//BURNOUT TEST--------------------------------------------------------
const burnout = (titleText='Title', index = 0, headerText='header', series=burnoutExamQuestions, actionid = 'duck')=>{
	const title = {
		type: "plain_text",
		text: titleText
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
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": `*${headerText}*`
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
			...questions(series, index),
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
function options(defaultText = 'Sometimes', defaultVal="3"){
	const opt = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
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
				"text": defaultText,
				"emoji": true
			},
			"value": `${defaultVal}`
		}
	})
}

function questions(series, index){
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
					'action_id': 'milk' + index,
					"placeholder": {
						"type": "plain_text",
						"emoji": true,
						"text": "Your Response"
					},
					...options(),
				}
			}
		);
		questionElements.push(divider());
	});
	return questionElements;
}
