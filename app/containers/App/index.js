import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import firebase from "firebase/app";
import "firebase/auth";
// import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Application from "./Application";
import LoginDedicated from "../Pages/Standalone/LoginDedicated";
import ThemeWrapper, { AppContext } from "./ThemeWrapper";
import { googleProvider, facebookProvider } from "./fire-config";
import Auth from "./Auth";
import { apiCall } from "../../utils/messenger";
import {
  reduxSignOut,
  reduxCallIdToken,
  reduxLoadAuthAdmin,
} from "../../redux/redux-actions/adminActions";
import { LAST_VISITED } from "../../utils/constants";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

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
      started: false,
    };
    this.saveCurrentLocation();
    this.signOut = this.signOut.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.normalLogin = this.normalLogin.bind(this);
  }

  async componentDidMount() {
    const { data } = await apiCall("auth.whoami");

    let user = null;
    if (data && Object.keys(data).length > 0) {
      user = data;
    } else if (firebase.auth().currentUser) {
      const idToken = await firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true);
      const newLoggedInUserResponse = await apiCall("auth.login", { idToken });
      user = newLoggedInUserResponse.data;
    }

    if (user) {
      // set the user in the redux state
      this.props.reduxLoadAuthAdmin(user);
      this.goHome();
    }
  }

  signOut = () => {
    this.props.reduxSignOut();
  };

  loginWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then(async () => {
        const token = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true);
        this.requestMassToken(token);
      })
      .catch((err) => {
        console.log("Error", err);
        this.setState({ error: err });
      });
  };

  requestMassToken = (fireToken) => {
    this.setState({ error: null });
    const me = this;
    const body = { idToken: fireToken };
    var successURL = localStorage.getItem(LAST_VISITED) || "/";
    apiCall("auth.login", body)
      .then((res) => {
        const { error } = res;
        if (error) {
          me.setState({ error, started: false });
          // window.location.href = '/login';
          return;
        }
        window.location.href = successURL;
      })
      .catch((err) => {
        console.log("sign_in_error: ", err);
        me.setState({
          error: "Sorry, we could not sign you in!",
          started: false,
        });
      });
  };

  loginWithGoogle = () => {
    this.setState({ started: true });
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(async () => {
        const token = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true);
        this.requestMassToken(token);
      })
      .catch((err) => {
        this.setState({ error: err.message, started: false });
      });
  };

  normalLogin = (email, password) => {
    this.setState({ started: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const token = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true);
        this.requestMassToken(token);
      })
      .catch((err) => {
        console.log("Error:", err.message);
        this.setState({ error: err.message, started: false });
      });
  };

  goHome = () => {
    const { state } = this.props;
    return (
      <Redirect
        push
        to={{
          pathname: "/",
          state,
        }}
      />
    );
  };

  getAuthenticatedUserProfile = () => {
    const me = this;
    apiCall("auth.whoami")
      .then((userObj) => {
        const user = userObj.data;
        if (user && (user.is_community_admin || user.is_super_admin)) {
          localStorage.setItem("authUser", JSON.stringify(user));
          me.props.reduxLoadAuthAdmin(user);
          this.goHome();
        } else if (user && Object.keys(user).length > 0) {
          me.setState({
            error: `Sorry ${user.preferred_name}, you are not an admin :(`,
            started: false,
          });
        } else {
          console.log("error occurred while signing you in");
          me.setState({
            error: "Error occurred while signing you in",
            started: false,
          });
        }
      })
      .catch((err) => {
        console.log("could_not_identify_user: ", err);
        me.setState({
          error: "Sorry, something went wrong, please try again!",
          started: false,
        });
      });
  };

  saveCurrentLocation() {
    var url = window.location.href;
    const canSaveThisURL = !["login"].find((kw) => url.includes(kw));
    // Save the last visited url in local storage unless its the login page
    if (canSaveThisURL) window.localStorage.setItem(LAST_VISITED, url);
  }

  render() {
    const { error, started } = this.state;
    const { auth } = this.props;
    const user = auth;
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

              {user && (
                <Route
                  path="/"
                  render={(props) => (
                    <Application
                      {...props}
                      changeMode={changeMode}
                      signOut={this.signOut}
                    />
                  )}
                />
              )}
              {!user && (
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
              )}
              <Route component={Auth} />
            </Switch>
          )}
        </AppContext.Consumer>
      </ThemeWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    state,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reduxCallIdToken,
      reduxLoadAuthAdmin,
      reduxSignOut,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
