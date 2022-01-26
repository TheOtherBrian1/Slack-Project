const defaultExams = [
	"burnout",
    "engagement",
    "loneliness",
    "anxiety"
]

const pickExamBlock = (title = 'Pick a Test', exams = defaultExams)=>{

    const buttons = exams.map(exam=>{

        return (
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": exam
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Take Test",
                        "emoji": true
                    },
                    "value": exam,
                    "action_id": exam
                }
            }
        )
    });
    
    return {
        title: {
            type: "plain_text",
            text: title
        },
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": title,
                    "emoji": true
                }
            },
            ...buttons,
        ],
        type: "modal"
    }
}



module.exports = pickExamBlock;