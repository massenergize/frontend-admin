import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

import { reduxForm } from 'redux-form/immutable';
import { bindActionCreators } from 'redux';
import FormControl from '@material-ui/core/FormControl';
import Select2 from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { apiCall } from '../../../utils/messenger';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';

import { initAction, clearAction } from '../../../actions/ReduxFormActions';


// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

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


class CreatePolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      communities: [],
      error: null,
      successMsg: null
    };
  }


  async componentDidMount() {
    const communitiesResponse = await apiCall('/communities.listForSuperAdmin');
    if (communitiesResponse && communitiesResponse.success) {
      this.setStateAsync({ communities: communitiesResponse.data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

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
    if (cleanedValues.community) {
      cleanedValues.community_id = cleanedValues.community;
    }
    if (cleanedValues.team) {
      cleanedValues.team_id = cleanedValues.team;
    }
    delete cleanedValues.community;
    delete cleanedValues.team;

    const response = await apiCall('/policies.create', cleanedValues);
    if (response && !response.success) {
      await this.setStateAsync({ error: response.error, successMsg: null });
    } else if (response && response.success) {
      await this.setStateAsync({ successMsg: 'Successfully Created this Policy', error: null });
      window.location.href = '/admin/read/policies';
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
      formData, communities, error, successMsg
    } = this.state;
    const { community } = formData;
    let communitySelected = communities.filter(c => c.id === community)[0];
    communitySelected = communitySelected ? communitySelected.name : '';


    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <form onSubmit={this.submitForm}>

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
                    variant="success"
                    message={successMsg}
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
                />
                

                <FormControl className={classes.field}>
                  <InputLabel htmlFor="community_id">Community</InputLabel>
                  <Select2
                    native
                    name="community_id"
                    onChange={async (newValue) => { await this.updateForm('community_id', parseInt(newValue.target.value, 10)); }}
                    inputProps={{
                      id: 'age-native-simple',
                    }}
                  >
                    <option value={community}>{communitySelected}</option>
                    { communities
                          && communities.map(c => (
                            <option value={c.id} key={c.id}>{c.name}</option>
                          ))
                    }
                  </Select2>
                </FormControl>

                <TextField
                  name="description"
                  className={classes.field}
                  placeholder="eg. Our terms and conditions ..."
                  label="Describe this Goal"
                  multiline={trueBool}
                  rows={4}
                  onChange={this.handleFormDataChange}
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


CreatePolicyForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  init: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(CreatePolicyForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
