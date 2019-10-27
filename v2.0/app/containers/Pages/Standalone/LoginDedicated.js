import React from 'react';
import Outer from '../../Templates/Outer';
import Login from '../../MassEnergizeSuperAdmin/LoginAndRegistration/Login';

class LoginDedicated extends React.Component {
  componentDidMount() {
    if(this.props.user){
      console.log("I am busy checking");
      window.location = "/admin";
    }
  }
  
  render() {
    const {
      user, error, signOutFxn, loginWithFacebookFxn, loginWithGoogleFxn, normalLoginFxn
    } = this.props;
    
    return (
      <Outer>
        <Login
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
