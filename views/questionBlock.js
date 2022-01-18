const defaultQuestions = [
	"this", 
	"is",
	"now",
	"working",
	"well"
]



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

const populateQuestions = (titleText='Title', headerText='header', questions=defaultQuestions)=>{
	const title = {
		type: "plain_text",
		text: titleText
	};

	const submit = {
		type: "plain_text",
		text: "Submit"
	}

	const header = {
		type: "header",
		text: {
			type: "plain_text",
			text: headerText
		}
	}

	const questionsBlock = questions.map((question, index)=>{		
		return(
				{
					text: {
						type: "plain_text",
						text: `*${question}*`,
					},
					value: (index+1).toString()
				}
		);
	});
	const options = [{
		type: "radio_buttons",
		options: questionsBlock,
		action_id: 'test_buttons'
	}]
	return ({
		title,
		submit,
		blocks:[
			{...header},
			{
			 	type: 'actions',
			 	elements: options
			},
			{...buttons}
		],
		type: "modal",

	})
}


console.log(populateQuestions())
module.exports = populateQuestions;