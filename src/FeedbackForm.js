import React, { Component } from 'react';

class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      choices: [],
      selectedChoices: {},
    };
  }

  componentDidMount() {
    fetch('https://brijfeedback.pythonanywhere.com/api/get-feedback-questions/?unitID=1')
      .then(response => response.json())
      .then(data => {
        const questions = data.feedbackQuestions;
        const choices = data.choices;
        const selectedChoices = {};
        questions.forEach((question, index) => {
          selectedChoices[question] = choices[index][0];
        });
        this.setState({ questions, choices, selectedChoices });
      })
      .catch(error => console.error('Error fetching feedback questions:', error));
  }

  handleChoiceChange = (question, choice) => {
    const { selectedChoices } = this.state;
    selectedChoices[question] = choice;
    this.setState({ selectedChoices });
  };

  handleSubmit = () => {
    const { questions, selectedChoices } = this.state;
    const feedback = {
      questions,
      choices: questions.map(question => selectedChoices[question]),
    };
    console.log('Submitted Feedback:', feedback);
  };

  render() {
    const { questions, choices, selectedChoices } = this.state;

    return (
      <div>
        <form>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              {choices[index].map((choice, choiceIndex) => (
                <label key={choiceIndex}>
                  <input
                    type="radio"
                    name={`choice-${index}`}
                    value={choice}
                    checked={selectedChoices[question] === choice}
                    onChange={() => this.handleChoiceChange(question, choice)}
                  />
                  {choice}
                </label>
              ))}
            </div>
          ))}
          <button type="button" onClick={this.handleSubmit}>
            Submit Feedback
          </button>
        </form>
      </div>
    );
  }
}

export default FeedbackForm;
