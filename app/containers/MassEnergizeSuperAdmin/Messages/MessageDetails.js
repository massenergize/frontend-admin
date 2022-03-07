import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { apiCall } from "../../../utils/messenger";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getHumanFriendlyDate } from "../../../utils/common";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  menu: {
    width: 200,
  },
  mainHead: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

class MessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      message: undefined,
      loading: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { messages, teamMessages, match } = props;
    const { id } = match.params;
    if (state.message === undefined) {
      const msg = [...(messages || []), ...(teamMessages || [])].find(
        (m) => m.id === id
      );
      return { message: msg || null, loading: false };
    }

    return null;
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const messageInfoResponse = await apiCall("/messages.info", {
      message_id: id,
    });
    if (messageInfoResponse && messageInfoResponse.success) {
      await this.setStateAsync({
        message: messageInfoResponse.data,
        loading: false,
      });
    } else {
      return;
    }

    const { message } = this.state;
    if (message && message.is_team_admin_message) {
      const formJson = await this.createForwardMessageFormJson();
      await this.setStateAsync({ formJson });
    } else {
      const formJson = await this.createFormJson();
      await this.setStateAsync({ formJson });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { message } = this.state;
    const { pathname } = window.location;

    const formJson = {
      title: "Reply to Message",
      subTitle: "",
      method: "/messages.replyFromCommunityAdmin",
      successRedirectPage: pathname || "/admin/read/community-admin-messages",
      fields: [
        {
          name: "ID",
          label: "Message ID",
          placeholder: "eg. 1",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          defaultValue: message && message.id,
          dbName: "message_id",
          readOnly: true,
        },
        {
          name: "to_email",
          label: "To",
          placeholder: "eg. abc@gmail.com",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          dbName: "to",
          defaultValue: message && message.email,
          readOnly: false,
        },
        {
          name: "title",
          label: "Title",
          placeholder: "eg. Re: How to get heat pumps",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          dbName: "title",
          defaultValue: message && `Re: ${message.title}`,
          readOnly: false,
        },
        {
          name: "body",
          label: "Body",
          placeholder: "eg. What do you want to send to this user? ...",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          isMultiline: true,
          dbName: "body",
          readOnly: false,
        },
      ],
    };
    return formJson;
  };

  createForwardMessageFormJson = async () => {
    const { message } = this.state;
    const { pathname } = window.location;

    const formJson = {
      title: "Forward to Team Admins",
      subTitle: "",
      method: "/messages.forwardToTeamAdmins",
      successRedirectPage: pathname || "/admin/read/team-admin-messages",
      fields: [
        {
          name: "ID",
          label: "Message ID",
          placeholder: "eg. 1",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          defaultValue: message && message.id,
          dbName: "message_id",
          readOnly: true,
        },
        {
          name: "title",
          label: "Title",
          placeholder: "eg. Re: How to get heat pumps",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          dbName: "title",
          defaultValue: message && `FW: ${message.title}`,
          readOnly: false,
        },
        {
          name: "body",
          label: "Email Body",
          placeholder: "eg. What do you want to send to this user? ...",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          isMultiline: true,
          defaultValue: message && message.body,
          dbName: "body",
          readOnly: false,
        },
      ],
    };
    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson, message, loading } = this.state;
    if (!formJson) return <div />;
    if (loading) return <Loading />;
    return (
      <div>
        <div>
          <Paper className={classes.root} elevation={4}>
            <div className={classes.mainHead}>
              <div>
                <Typography variant="h6" style={{ marginBottom: 3 }}>
                  <b>{(message && message.user_name) || "..."}</b>
                </Typography>

                <Typography variant="small" style={{}} color="primary">
                  {(message && message.email) || "..."}
                </Typography>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Typography variant="small" color="textSecondary">
                  {getHumanFriendlyDate(message && message.created_at)}
                </Typography>
              </div>
            </div>
            <hr style={{ color: "#EBEBEB" }} />
            <div>
              <Typography variant="h6">{message && message.title}</Typography>
              <br />

              <Typography variant="paragraph" color="textPrimary">
                {(message && message.body) || "..."}
              </Typography>
              <br />

              <Typography variant="small" color="textSecondary">
                <b>
                  {(message && message.community && message.community.name) ||
                    "..."}
                </b>
              </Typography>
            </div>
          </Paper>
        </div>
        <br />
        <br/>

        <MassEnergizeForm classes={classes} formJson={formJson} />
      </div>
    );
  }
}

MessageDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    messages: state.getIn(["messages"]),
    teamMessages: state.getIn(["messages"]),
  };
};
const MessagesWrapped = connect(mapStateToProps)(MessageDetails);
export default withStyles(styles, { withTheme: true })(MessagesWrapped);
