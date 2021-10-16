import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MassEnergizeForm from '../_FormGenerator';

import { apiCall } from '../../../utils/messenger';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  menu: {
    width: 200,
  },
});


class MessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      message: null,
      communities: []

    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const messageInfoResponse = await apiCall('/messages.info', { message_id: id });

    if (messageInfoResponse && messageInfoResponse.success) {
      await this.setStateAsync({ message: messageInfoResponse.data });
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
      title: 'Reply to Message',
      subTitle: '',
      method: '/messages.replyFromCommunityAdmin',
      successRedirectPage: pathname || '/admin/read/community_admin_messages',
      fields: [
        {
          name: 'ID',
          label: 'Message ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          defaultValue: message && message.id,
          dbName: 'message_id',
          readOnly: true
        },
        {
          name: 'to_email',
          label: 'To',
          placeholder: 'eg. abc@gmail.com',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          dbName: 'to',
          defaultValue: message && message.email,
          readOnly: false
        },
        {
          name: 'title',
          label: 'Title',
          placeholder: 'eg. Re: How to get heat pumps',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          dbName: 'title',
          defaultValue: message && `Re: ${message.title}`,
          readOnly: false
        },
        {
          name: 'body',
          label: 'Body',
          placeholder: 'eg. What do you want to send to this user? ...',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          isMultiline: true,
          dbName: 'body',
          readOnly: false
        },
        // {
        //   name: 'attached_files',
        //   placeholder: 'Attach a file',
        //   fieldType: 'File',
        //   dbName: 'attached_file',
        //   label: 'Attach File(s) to email',
        //   isRequired: false,
        //   defaultValue: '',
        //   filesLimit: 10
        // },
      ]
    };
    return formJson;
  }

  createForwardMessageFormJson = async () => {
    const { message } = this.state;
    const { pathname } = window.location;

    const formJson = {
      title: 'Forward to Team Admins',
      subTitle: '',
      method: '/messages.forwardToTeamAdmins',
      successRedirectPage: pathname || '/admin/read/team_admin_messages',
      fields: [
        {
          name: 'ID',
          label: 'Message ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          defaultValue: message && message.id,
          dbName: 'message_id',
          readOnly: true
        },
        {
          name: 'title',
          label: 'Title',
          placeholder: 'eg. Re: How to get heat pumps',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          dbName: 'title',
          defaultValue: message && `FW: ${message.title}`,
          readOnly: false
        },
        {
          name: 'body',
          label: 'Email Body',
          placeholder: 'eg. What do you want to send to this user? ...',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          isMultiline: true,
          defaultValue: message && message.body,
          dbName: 'body',
          readOnly: false
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson, message } = this.state;
    if (!formJson) return (<div />);
    return (
      <div>
        <div>
          <Paper className={classes.root} elevation={4}>
            {message && message.community
              && (
                <Typography component="p">
                  Community:&nbsp;&nbsp;
                  {message.community.name}
                </Typography>
              )
            }
            {message && message.team
              && (
                <Typography component="p">
                  Team:&nbsp;&nbsp;
                  {message.team.name}
                </Typography>
              )
            }
            <br />
            <br />
            <Typography variant="h5" component="h3">
              Title:&nbsp;&nbsp;
              {message.title}
            </Typography>
            <br />
            <Typography component="p">
              Username Provided:&nbsp;&nbsp;
              {message.user_name || (message.user && message.user.full_name) }
            </Typography>
            <br />
            <Typography component="p">
              From:&nbsp;&nbsp;
              {message.email || (message.user && message.user.email) }
            </Typography>
            <br />
            <Typography component="p">
              Date:&nbsp;&nbsp;
              {message.created_at}
            </Typography>
            <br />
            <Typography component="p">
              Message body:&nbsp;&nbsp;
            </Typography>

            <Paper className={classes.root} elevation={4}>
              <Typography component="p">
                {message.body}
              </Typography>
            </Paper>
            <br />
            <br />
            {message && message.uploaded_file
              && (<img src={message.uploaded_file.url} alt="" />)
            }
          </Paper>
        </div>
        <br />
        <br />
        <br />

        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
      </div>
    );
  }
}

MessageDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(MessageDetails);
