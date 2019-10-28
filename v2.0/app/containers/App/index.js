import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Auth from './Auth';
import Application from './Application';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import firebase, { googleProvider, facebookProvider } from './fire-config';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, error: null };

    this.signOut = this.signOut.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.normalLogin = this.normalLogin.bind(this);
  }


  componentDidMount() {
    this.authListener();
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.setState({ user: null, error: null });
    });
  }

  loginWithFacebook = () => {
    firebase.auth().signInWithPopup(facebookProvider).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error', err);
        this.setState({ error: err });
      });
  }

  loginWithGoogle = () => {
    firebase.auth().signInWithPopup(googleProvider).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error', err);
        this.setState({ error: err });
      });
  }

  normalLogin = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
      this.setState({ user: res.user });
    })
      .catch(err => {
        console.log('Error:', err.message);
        this.setState({ error: err });
      });
  }

  redirectIfUser = (user) => {
    if (user) {
      window.location = '/dash-summary';
    }
  }

  authListener() {
    const { user } = this.state;
    if (firebase) {
      firebase.auth().onAuthStateChanged(u => {
        if (u && !user) {
          this.setState({ user });
        }
      });
    }
  }


  render() {
    const { user, error } = this.state;
    console.log(user)

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
                    render={(props) => <Application {...props} changeMode={changeMode} />}
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


              <Route
                path="/admin"
                render={(props) => <Application {...props} changeMode={changeMode} />}
              />
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
