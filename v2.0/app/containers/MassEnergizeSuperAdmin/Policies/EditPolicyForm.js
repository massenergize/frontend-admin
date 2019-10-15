import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select2 from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';

import { apiCall } from '../../../utils/messenger';


// validation functions
// const required = value => (value == null ? 'Required' : undefined);

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


class EditPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      community: null,
      error: null,
      successMsg: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;    
    const policyResponse = await apiCall('/policies.info', { policy_id: id });


    if (policyResponse && policyResponse.success) {
      const formData = { ...policyResponse.data };
      if (formData.community) {
        await this.setStateAsync({ community: formData.community.name });
        delete formData.community;
      }
      delete formData.is_deleted;
      delete formData.is_published;
      delete formData.is_global;
      await this.setStateAsync({ ...this.state, formData });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  handleChangeMultiple = (event) => {
    const { target } = event;
    const { name, options } = target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      formData: { [name]: value }
    });
  };

  handleFormDataChange = (event) => {
    const { target } = event;
    if (!target) return;
    const { name, value } = target;
    const { formData } = this.state;
    this.setState({
      formData: { ...formData, [name]: value }
    });
  }

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const cleanedValues = { ...formData };
    cleanedValues.policy_id = cleanedValues.id;
    delete cleanedValues.id;
    const response = await apiCall('/policies.update', cleanedValues);
    if (response && !response.success) {
      await this.setStateAsync({ error: response.error, successMsg: null });
    } else if (response && response.success) {
      await this.setStateAsync({ successMsg: 'Successfully Updated', error: null });
    }
  }

  async updateForm(fieldName, value) {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: {
        ...formData,
        [fieldName]: value
      }
    }
    );
  }

  render() {
    const trueBool = true;
    const {
      classes,
      submitting,
    } = this.props;
    const {
      formData, error, successMsg, communities
    } = this.state;
    const {
      name,
      id,
      description,
      community
    } = formData;


    if (!id) {
      return (
        <div style={{ margin: 30 }}>
          <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
            <Grid item xs={12} md={6}>
              <Paper className={classes.root} elevation={4} style={{ padding: 30 }}>
                <div style={{ margin: 30 }} />
                <Typography variant="h5" component="h3">
                 Loading Data ...
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    }

    return (
      <div style={{ margin: 30 }}>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root} elevation={4} style={{ padding: 30 }}>
              <div style={{ margin: 30 }} />
              <Typography variant="h5" component="h3">
                {`Edit Policy with ID: ${id}`}
                {`${community ? 'Community: '+community : ''}`}
              </Typography>
              <div style={{ margin: 50 }} />
              <form onSubmit={this.submitForm} noValidate autoComplete="off">
                <div>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={error != null}
                    autoHideDuration={6000}
                    onClose={this.handleCloseStyle}
                  >
                    <MySnackbarContentWrapper
                      onClose={this.handleCloseStyle}
                      variant="error"
                      message={`Error Occurred: ${error}`}
                    />
                  </Snackbar>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={successMsg != null}
                    autoHideDuration={6000}
                    onClose={this.handleCloseStyle}
                  >
                    <MySnackbarContentWrapper
                      onClose={this.handleCloseStyle}
                      className={classes.snackbar}
                      classes={classes}
                      variant="success"
                      message="Successfully Updated this Policy"
                    />
                  </Snackbar>


                  {error
                  && (
                    <p style={{ color: 'red' }}>{error}</p>
                  )
                  }
                  {successMsg
                  && (
                    <p style={{ color: 'green' }}>{successMsg}</p>
                  )
                  }
                </div>
                <TextField
                  id="outline-required"
                  required
                  name="name"
                  onChange={this.handleFormDataChange}
                  label="Name"
                  placeholder="eg. Terms and Conditions"
                  className={classes.field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={name}
                />

                <TextField
                  name="description"
                  className={classes.field}
                  placeholder="eg. Description ..."
                  label="Describe this Policy"
                  multiline={trueBool}
                  rows={4}
                  onChange={this.handleFormDataChange}
                  defaultValue={description}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div>
                  <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                    Submit
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(EditPolicyForm);
