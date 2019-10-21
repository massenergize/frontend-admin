import React from 'react';
import Outer from '../../Templates/Outer';
import Login from '../../MassEnergizeSuperAdmin/LoginAndRegistration/Login';

class LoginDedicated extends React.Component {
  render() {
    if(this.props.user){
      window.location = "/dash-summary"
    }
    return (
      <Outer>
        <Login error = {this.props.error} signOutFxn ={this.props.signOutFxn } loginWithFacebookFxn = {this.props.loginWithFacebookFxn } normalLoginFxn = {this.props.normalLoginFxn} loginWithGoogleFxn = {this.props.loginWithGoogleFxn}/>
      </Outer>
    );
  }
}

export default LoginDedicated;
