import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import Application from './Application';
class ProtectedRoutes extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { user } = this.props;
    console.log("lets try", user);
    return (
      <Route
        render={(props) => user ? <Application {...props} /> :<Redirect to="/login"/>  }
      />
    )
  }
}

export default ProtectedRoutes
