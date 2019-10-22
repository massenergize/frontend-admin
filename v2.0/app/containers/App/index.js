import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Auth from './Auth';
import Application from './Application';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import Login from './../MassEnergizeSuperAdmin/LoginAndRegistration/Login';
import firebase, { googleProvider, facebookProvider } from './fire-config';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, error: null };
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      this.setState({ user: null, error: null });
    });
  }

  loginWithFacebook() {
    firebase.auth().signInWithPopup(facebookProvider).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error', err);
        this.setState({ error: err });
      });
  }

  loginWithGoogle() {
    firebase.auth().signInWithPopup(googleProvider).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error', err);
        this.setState({ error: err });
      });
  }

  normalLogin(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error:', err.message);
        this.setState({ error: err });
      });
  }

  redirectIfUser(user) {
    if (user) {
      window.location = '/dash-summary';
    }
  }

  authListner() {
    if (firebase) {
      firebase.auth().onAuthStateChanged(user => {
        if (user && !this.state.user) {
          this.setState({ user });
        }
      });
    }
  }

  componentDidMount() {
    this.authListner();
  }

  render() {
    return (
      <ThemeWrapper>
        <AppContext.Consumer>
          {(changeMode) => (
            <Switch>
              <Route path="/" exact render={(props) => <LoginDedicated {...props} signOutFxn={this.signOut.bind(this)} error={this.state.error} user={this.state.user} normalLoginFxn={this.normalLogin.bind(this)} loginWithFacebookFxn={this.loginWithFacebook.bind(this)} loginWithGoogleFxn={this.loginWithGoogle.bind(this)} />} />
              <Route path="/login" exact render={(props) => <LoginDedicated {...props} signOutFxn={this.signOut.bind(this)} user={this.state.user} error={this.state.error} normalLoginFxn={this.normalLogin.bind(this)} loginWithFacebookFxn={this.loginWithFacebook.bind(this)} loginWithGoogleFxn={this.loginWithGoogle.bind(this)} />} />
              {this.state.user
                ? <Route
                  path="/"
                  render={(props) => <Application {...props} changeMode={changeMode} />}
                />
                :                null
              }
              {/* <Route
                  path="/admin"
                  render={(props) => <Application {...props} changeMode={changeMode} />}
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

export default App;
