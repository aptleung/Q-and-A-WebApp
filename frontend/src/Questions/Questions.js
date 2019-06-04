import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: null
    };
  }

  // When react finishes mounting component, GET request through axios.get() to get questions
  // When response is received, state is updated with setState -> re-render component
  async componentDidMount() {
    const questions = (await axios.get("http://localhost:8081/")).data;
    this.setState({
      questions
    });
  }

  // Component renders with 'Loading Questions...' while getting response from backend
  // Link (from react-router-dom) redirects users to the path when clicked
  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.questions === null && <p>Loading Questions...</p>}
          {this.state.questions &&
            this.state.questions.map(question => (
              <div key={question.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/question/${question.id}`}>
                  <div className="card text-white bg-success mb-3">
                    <div className="card-header">
                      Answers: {question.answers}
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{question.title}</h4>
                      <p className="card-text">{question.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default Questions;
