import React, { Component } from 'react';
import { Container, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Typography, FormLabel, RadioGroup, Paper, Radio, FormControlLabel, Button, FormControl } from '@mui/material';

class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      choices: [],
      selectedChoices: {},
      isDialogOpen: false,

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

  handleOpenDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  handleSubmit = () => {
    const { questions, selectedChoices } = this.state;
    const feedback = {
      questions,
      choices: questions.map(question => selectedChoices[question]),
    };
    console.log('Submitted Feedback:', feedback);
    this.handleOpenDialog();
  };

  render() {
    const { questions, choices, selectedChoices, isDialogOpen } = this.state;
    
    return (
      <div style={{ backgroundColor: '#FFD36C', color: 'white' }}>
      <Container style={{ backgroundColor: '#ffb404', color: 'white'}}
>        
        <Typography variant="h3" align="center" gutterBottom paddingTop={2} fontWeight="Bold">
          Share Your Feedback
        </Typography>
          {questions.map((question, index) => (
            <div key={index} style={{ marginBottom: '16px' } }>
              <Paper elevation={3} style={{ padding: '16px' ,backgroundColor: '#FFF8E8'}}>
                <Typography variant="h6" align="center" gutterBottom fontWeight="Bold" color='#635739'>
                  {question}
                </Typography>
              
                  {choices[index].map((choice, choiceIndex) => (
                    <div key={choiceIndex}>
                    <FormControlLabel
                      key={choiceIndex}
                      value={choice}
                      control={<Radio color="primary"
                      checked={selectedChoices[question] === choice}                        
                      onChange={() => this.handleChoiceChange(question, choice)}
                      />}
                      label={choice}
                    />
                    </div>
                    ))}
                    </Paper>
                    </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '16px' }}>
            <Button variant="contained" 
             onClick={this.handleSubmit}>
              Submit Feedback
            </Button>
          </div>
          <Dialog open={isDialogOpen} onClose={this.handleCloseDialog}>
            <DialogTitle>Feedback Submitted</DialogTitle>
            <DialogContent>
              <DialogContentText>Your feedback has been successfully submitted!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
      </Container>
      </div>
    );
  }
}

export default FeedbackForm;