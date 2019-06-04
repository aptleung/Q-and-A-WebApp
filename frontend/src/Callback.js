import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";

// Responsible for :
// 1. Calls handleAuthentication() method to fetch hashed profile and id tokens
// 2. Redirects users to home page via history.replace('/') after it finishes handleAuthentication
// Shows "Loading Profile..." while this occurs

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    this.props.history.replace("/");
  }

  render() {
    return <p>Loading Profile...</p>;
  }
}

export default withRouter(Callback);
