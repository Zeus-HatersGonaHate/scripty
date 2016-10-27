import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableHighlight } from 'react-native';
import QuestionPrompt from './QuestionPrompt';
import AnswerButton from './AnswerButton';
import NextButton from './NextButton';


class Lesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      currentQuestion: 0,
      questions: [],
      pressedButton: ''
    }
    this.getQuestions();
  }

  // Fetch the questions from the API
  getQuestions() {
    let url = 'http://127.0.0.1:3011/api/lessons/58115c426eb84b305e25fc07';

    fetch(url)
    .then(data => {
      return data.json()
    })
    .then(data => {
      let questions = data.lessonContent.sort((a, b) => a.order - b.order)
      this.setState({'questions': questions})
    })
  }

  // Push to the navigator to navigate between views
  navigate (routeName) {
    this.props.navigator.push({name:routeName});
  }

  // When any choice is clicked, change the state of this parent component to reflect that action
  handleAnswerButtonClick(buttonText) {
    this.setState({ clicked: true });
    this.setState({ pressedButton: buttonText });
  }

  // Move the pointer to the next question
  // Rather than try to figure out the navigator here, we simply change the state,
  // triggering a re-render with the currentQuestion set to the next one
  handleNextButtonClick() {
    let questions = this.state.questions;

    if (this.state.currentQuestion >= questions.length - 1) {
      this.navigate("LessonComplete");
    } else {
      this.setState({currentQuestion: this.state.currentQuestion + 1,
        clicked: false})
    }
  }

  // Find the Question Text, if the questions have loaded

  displayQuestionText() {
    let question = this.state.questions[this.state.currentQuestion];
    if (question) {
      return <QuestionPrompt text={question.text} /> 
    }
  }

  // If the questions have loaded, display the question

  displayQuestionChoices() { 
    let question = this.state.questions[this.state.currentQuestion];

    if (question && question.choices)
    return question.choices.map(choice => {
      let isCorrectAnswer;
      let isPressedAnswer;
  
      // Once the user has made a choice, determine if this choice is
      // The correct one, the one they pressed, or neither.
      // For styling purposes inside of the AnswerButton component.
      if (this.state.clicked) {
        isCorrectAnswer = choice === question.answer;
        isPressedAnswer = choice === this.state.pressedButton;
      }

      return <AnswerButton possibleAnswer={choice} key={choice}
      handleAnswerButtonClick={this.handleAnswerButtonClick.bind(this)}
      isCorrectAnswer={isCorrectAnswer} isPressedAnswer={isPressedAnswer} />
    })
  }

  // Only display next button when a choice has been pressed
  displayNextButton() {
    let question = this.state.questions[this.state.currentQuestion];
    if (this.state.clicked || !question || !question.choices) {
      return <NextButton handleNextButtonClick={this.handleNextButtonClick.bind(this)}/>
    }
  }

  render() {
    const {viewStyle} = styles;

    return (
      <View style={viewStyle}>
        { this.displayQuestionText() }
        { this.displayQuestionChoices() }
        { this.displayNextButton() }
      </View>
    )
  }
};

const coral = '#FA848A';

const styles = {
  viewStyle: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    height: Dimensions.get("window").height,
  }
}

export default Lesson;