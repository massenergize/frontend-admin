import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { apiCall } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';

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
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});


class AddRemoveAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      community: {},
      formJson: null
    };
  }


  async componentDidMount() {
    const communityResponse = await apiCall('/communities.info');

    if (communityResponse && communityResponse.data) {
      const community = communityResponse.data;
      await this.setStateAsync({ community });
    }

    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  createFormJson = async () => {
    const { pathname } = window.location;
    const formJson = {
      title: 'Add New Adminstrator for this Community (DO NOT TEST YET!!!)',
      subTitle: '',
      method: '/communities.admins.add',
      successRedirectPage: pathname,
      fields: [
        {
          label: 'About this Admin',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'email',
              label: 'Email',
              placeholder: 'eg. ellen.tohn@gmail.com',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'email',
              readOnly: false
            },
          ]
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div />);
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
      </div>
    );
  }
}

AddRemoveAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(AddRemoveAdmin);
