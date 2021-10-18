import React from 'react';
import Outer from '../../Templates/Outer';
import Login from '../../MassEnergizeSuperAdmin/LoginAndRegistration/Login';

class LoginDedicated extends React.Component {
  componentDidMount() {
    if(this.props.user){
      window.location = "/admin";
    }
  }
  
  render() {
    const {
      user, started,error, signOutFxn, loginWithFacebookFxn, loginWithGoogleFxn, normalLoginFxn
    } = this.props;
    
    return (
      <Outer>
        <Login
          started = {started}
          error={error}
          signOutFxn={signOutFxn}
          loginWithFacebookFxn={loginWithFacebookFxn}
          normalLoginFxn={normalLoginFxn}
          loginWithGoogleFxn={loginWithGoogleFxn}
        />
      </Outer>
    );
  }
}

export default LoginDedicated;
