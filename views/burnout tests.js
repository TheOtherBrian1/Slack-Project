const burnoutExamQuestions = require('../Tests/Burnout Assessment Test')
const { Modal, Section, Input, StaticSelect, Actions, Button, Surfaces, Divider, Header, Bits, Option, BlockCollection }= require('slack-block-builder');



module.exports = (index = 0, prevOptions=null, series=burnoutExamQuestions)=>{
	console.log(index, 'index in json');
	const len = series[index].questions.length;
	const defaultSelects = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

	//If the user has started the test, but hasn't finished, his responses are saved as prevQuestions------
		if(!prevOptions)
			prevOptions = new Array(len).fill(3);
	//Creating Question Blocks-----------------------------------------------------------------------------
		const questions = []
			series[index].questions.forEach((question, index)=>{
				questions.push(Divider());
				console.log(prevOptions, 'online dvd');
				const input = Input({label: question}).element(
					StaticSelect()
						.actionId('burnout_drop_down')
						.options(...defaultSelects.map((text, i)=>Option({text, value: (i+1).toString()})))
						.initialOption(Option({text: defaultSelects[prevOptions[index]-1], value: prevOptions[index] + ''}))
				)
				questions.push(input);
			})
	
	//Creating Button Blocks-----------------------------------------------------------------
		const responseButtons = ['prev', 'next'].map(val=>Button({
			text:val, 
			style: 'next'=== val?'primary':'danger',
			actionId: val
		}))
		
		if(!index)
			responseButtons.shift();
		if(index === len)
			responseButtons.pop();

	//Creating Full Modal---------------------------------------------------------------
		return(
			Modal({title: 'Burnout Exam', submit: 'Submit', close: 'Save for Later'})
			.callbackId('burnout-submit')
			.blocks(
					Header({text: 'Section: ' + series[index].section}),
					Divider(),
					...questions,
					Actions()
						.elements(
							...responseButtons
						)
			).buildToJSON()
		)
}
