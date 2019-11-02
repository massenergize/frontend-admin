import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Auth from './Auth';
import Application from './Application';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import firebase, { googleProvider, facebookProvider } from './fire-config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall, fetchData, rawCall } from './../../utils/messenger';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
import { reduxSignOut, reduxCallIdToken, reduxLoadAuthAdmin } from './../../../app/redux/redux-actions/adminActions';

/*
    1. Collect user Auth user From Firebase 
    2. Strip out the user's idToken and sent it to /auth/verify
    3. /auth/verify returns another token 
      save that token in the local storage to be used in the 
      'messenger.js' file for apiCalls
    4. Shoot that token to /auth/whoami
    5. returns user if .. exists or the usual 
    ----All failures bring a success == false && data == null

    6. After user is obtained, save user in redux, and save user in
      localStorage too ( with this, even when the user refreshes 
        the entire page and redux is cleared, the app can quickly 
        use the local auth obj to sign the user in, while checking 
        firebase too. 
        1. If the firebase request comes in positive, it just fixes into 
        redux and the local storage again, like nothing happened! 
        Lol! 
        If firebase comes in negative, it just takes the user back to re-login.
        like "Hey, my bad! You are not authenticated, please follow protocol! LOOL!"
        )
  */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      started: false
    };
    this.signOut = this.signOut.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.normalLogin = this.normalLogin.bind(this);
  }

  componentDidMount() {
    //this.authListener();
  }

  signOut = () => {
    this.props.reduxSignOut();
  }

  loginWithFacebook = () => {
    firebase.auth().signInWithPopup(facebookProvider).then(res => {
      localStorage.setItem('authUser', JSON.stringify(res.user));
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error', err);
        this.setState({ error: err });
      });
  }

  requestMassToken = (fireToken) => {
    const me = this;
    const body = { idToken: fireToken };
    rawCall("auth/verify", body).then(massToken => {
      const idToken = massToken.data.idToken;
      localStorage.setItem("idToken", idToken.toString());
      this.getAuthenticatedUserProfile();
    }).catch(err => {
      console.log("Error MASSTOKEN: ", err);
      me.setState({ error: "Sorry, we could not sign you in!", started: false });
    });
  }
  loginWithGoogle = () => {
    this.setState({ started: true })
    const me = this;
    firebase.auth().signInWithPopup(googleProvider).then(res => {
      me.requestMassToken(res.user._lat);
    })
      .catch(err => {
        me.setState({ error: err.message, started: false });

      });
  }

  normalLogin = (email, password) => {
    this.setState({ started: true });
    const me = this;
    firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
      me.requestMassToken(res.user._lat);
    })
      .catch(err => {
        console.log('Error:', err.message);
        this.setState({ error: err.message, started: false });
      });
  }
  goHome = ()=>{
    window.location = "/";
  }

  getAuthenticatedUserProfile = () => {
    const me = this;
    rawCall("auth/whoami").then(userObj => {
      console.log(userObj);
      const user = userObj.data;
      if (user.is_community_admin === true || user.is_super_admin === true) {
        localStorage.setItem('authUser', JSON.stringify(user))
        me.props.reduxLoadAuthAdmin(user);
        this.goHome();
      }
      else {
        me.setState({ error: `Sorry ${user.preferred_name}, you are not an admin :(`, started: false })
      }
    })
      .catch(err => {
        console.log("Error WHOAMI: ", err);
        me.setState({ error: "Sorry, something went wrong, please try again!", started: false })
      })
  }

  // authListener() {
  //   if (firebase) {
  //     firebase.auth().onAuthStateChanged(u => {
  //       this.props.reduxCallIdToken();
  //       if (u) {
  //         console.log("I am the listen", u);
  //         localStorage.setItem('authUser', JSON.stringify(u));
  //         //will be removed later
  //         this.setState({ user: u });
  //       }
  //     });
  //   }
  // }

  render() {
    const { error, started } = this.state;
    const user = this.props.auth;
    console.log("testing le props", this.props.auth);
    return (
      <ThemeWrapper>
        <AppContext.Consumer>
          {(changeMode) => (
            <Switch>
              <Route
                path="/login"
                exact
                render={(props) => (
                  <LoginDedicated
                    {...props}
                    signOutFxn={this.signOut}
                    started={started}
                    error={error}
                    user={user}
                    normalLoginFxn={this.normalLogin}
                    loginWithFacebookFxn={this.loginWithFacebook}
                    loginWithGoogleFxn={this.loginWithGoogle}
                  />
                )}
              />
              <Route
                path="/logout"
                exact
                render={(props) => (
                  <LoginDedicated
                    {...props}
                    signOutFxn={this.signOut}
                    started={started}
                    error={error}
                    user={user}
                    normalLoginFxn={this.normalLogin}
                    loginWithFacebookFxn={this.loginWithFacebook}
                    loginWithGoogleFxn={this.loginWithGoogle}
                  />
                )}
              />


              {/* <Route path="/login" exact render={(props) => <LoginDedicated {...props} signOutFxn={this.signOut.bind(this)} user={this.state.user} error={this.state.error} normalLoginFxn={this.normalLogin.bind(this)} loginWithFacebookFxn={this.loginWithFacebook.bind(this)} loginWithGoogleFxn={this.loginWithGoogle.bind(this)} />} /> */}
              {user
                && (
                  <Route
                    path="/"
                    render={(props) => <Application {...props} changeMode={changeMode} signOut={this.signOut} />}
                  />
                )
              }
              {!user
                && (
                  <Route
                    path="/"
                    exact
                    render={(props) => (
                      <LoginDedicated
                        {...props}
                        signOutFxn={this.signOut}
                        error={error}
                        user={user}
                        normalLoginFxn={this.normalLogin}
                        loginWithFacebookFxn={this.loginWithFacebook}
                        loginWithGoogleFxn={this.loginWithGoogle}
                      />
                    )}
                  />
                )
              }

              {/* <Route
                path="/admin"
                render={(props) => <Application {...props} changeMode={changeMode} signOut = {this.signOut}/>}
              /> */}
              <Route component={Auth} />
              <Route component={NotFound} />
            </Switch>
          )}
        </AppContext.Consumer>
      </ThemeWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth'])
  }
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    reduxCallIdToken: reduxCallIdToken,
    reduxLoadAuthAdmin: reduxLoadAuthAdmin,
    reduxSignOut: reduxSignOut
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
