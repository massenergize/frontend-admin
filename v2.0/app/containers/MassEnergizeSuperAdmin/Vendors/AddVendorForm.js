import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Type from 'dan-styles/Typography.scss';
import Fab from '@material-ui/core/Fab';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import {
  Select,
  TextField,
  Switch
} from 'redux-form-material-ui';
import { fetchData, sendJson } from '../../../utils/messenger';
import { initAction, clearAction } from '../../../actions/ReduxFormActions';



const uploadBox = {
  border: 'solid 1px #e0e0e0',
  borderRadius: 5,
  padding: 25
}
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

const SCOPE = [
  "State wide",
  "City"
]
const DEFAULTS = {
  company_name:"",
  address:"",
  name:"",
  email:"",
  phone:"",
  county:"", 
  town:"",
  services:"",
  onboarding_name:"",
  onboarding_date:""
}
class AddVendorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      national: false,
      residential: false,
      commercial: false,
      verified: false,
      community: { id: null, name: "Choose Community" },
      communities: [],
      scope:""


    }
  }

  componentDidMount() {
    const me = this;
    fetchData('v2/communities').then(res => {
      me.setState({ communities: res.data });
    });
  }
  showFileList() {
    const { files } = this.state;
    if (files.length === 0) return "You have not selected any image ";
    var string = "";
    for (var i = 0; i < files.length; i++) {
      if (string !== "") {
        string += ", " + files[i].name;
      }
      else {
        string = files[i].name;
      }
    }
    return string;
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleCommunitiesChoice = (event) => {
    var obj = this.findCommunityObj(event.target.value);
    this.setState({
      community: obj
    })
  }

  handleTexts = (event)=>{
    this.setState({[event.target.name]:event.target.value});
  }
  findCommunityObj = (name) => {
    var section = this.state.communities;
    for (var i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }

  ejectButton = (classes) => {
    if (this.state.verified) {
      return (
        <Fab
          justify="right"
          style={{ margin: 6, background: 'green' }}
          onClick={() => { this.addVendor() }}
          variant="extended"
          color="secondary"
          aria-label="Delete"
          className={classes.button}
        > Add Vendor </Fab>
      )
    }
  }

  addVendor = ()=>{
   const data =  this.state;
  
   const final = {...DEFAULTS, ...data};
  
  }
  render() {

    const { classes } = this.props;
    const {scope,verified, national, communities, residential, commercial } = this.state;
    const community = this.state.community.name;

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={10} sm={12} xs={12}>
            <Paper className={classes.root}>
              <h4 style={{ color: '#585858', fontWeight: "500" }}>Use this form to add new vendor</h4>
              <TextField
                name="company_name"
                onChange={(event) => { this.handleTexts(event) }}
                fullWidth
                placeholder="Company Name"
                margin="normal"
                variant="outlined"

              />
              <TextField
                name="address"
                onChange={(event) => { this.handleTexts(event) }}
                fullWidth
                placeholder="Address"
                margin="normal"
                variant="outlined"

              />
              <div style={{ border: '1px solid rgb(229, 238, 245)', padding: 15, borderRadius: 6 }}>
                <p>KEY CONTACT</p>

                <TextField
                  name="name"
                  onChange={(event) => { this.handleTexts(event) }}
                  fullWidth
                  placeholder="Name"
                  margin="normal"
                  variant="outlined"

                />
                <TextField
                  name="email"
                  onChange={(event) => { this.handleTexts(event) }}
                  fullWidth
                  placeholder="Email"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  name="phone"
                  onChange={(event) => { this.handleTexts(event) }}
                  fullWidth
                  type="number"
                  placeholder="Phone"
                  margin="normal"
                  variant="outlined"

                />
              </div>
              <div style={{ border: '1px solid rgb(229, 238, 245)', padding: 15, borderRadius: 6, margin: "8px 0px" }}>
                <p>SERVICE AREA</p>
                <div>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={national}
                        onChange={this.handleChange('national')}
                        value="national"
                      />
                    )}
                    label="National"
                  />
                  <TextField
                    name="county"
                    onChange={(event) => { this.handleTexts(event) }}
                    fullWidth
                    placeholder="County"
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    name="town"
                    onChange={(event) => { this.handleTexts(event) }}
                    fullWidth
                    placeholder="Town Name or Zip Code "
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Choose scope"
                    className={classes.textField}
                    value={scope}
                    fullWidth
                    onChange={option => { this.setState({scope:option.target.value})}}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    helperText="Please select scope"
                    margin="normal"
                    variant="outlined"
                  >
                    {SCOPE.map(option => (
                      <MenuItem key={option.toString()} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              <TextField
                name="services"
                onChange={(event) => { this.handleTexts(event) }}
                fullWidth
                placeholder="List Services"
                margin="normal"
                variant="outlined"
              />

              <div style={{ border: '1px solid rgb(229, 238, 245)', padding: 15, borderRadius: 6, margin: "8px 0px" }}>
                <p>PROPERTY SERVICE</p>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={residential}
                      onChange={this.handleChange('residential')}
                      value="residential"
                    />
                  )}
                  label="Residential"
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={commercial}
                      onChange={this.handleChange('commercial')}
                      value="commercial"
                    />
                  )}
                  label="Commercial"
                />

              </div>
              <div style={{ border: '1px solid rgb(229, 238, 245)', padding: 15, borderRadius: 6, margin: "8px 0px" }}>
                <p>ONBOARDING CONTACT</p>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Select Community"
                  className={classes.textField}
                  value={community}
                  fullWidth
                  onChange={option => { this.handleCommunitiesChoice(option) }}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  helperText="Please select the community"
                  margin="normal"
                  variant="outlined"
                >
                  {communities.map(option => (
                    <MenuItem key={option.id.toString()} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="onboarding_name"
                  onChange={(event) => { this.handleTexts(event) }}
                  fullWidth
                  placeholder="Name"
                  margin="normal"
                  variant="outlined"

                />
                <TextField
                  name="onboarding_date"
                  onChange={(event) => { this.handleTexts(event) }}
                  fullWidth
                  type="date"
                  placeholder="Name"
                  margin="normal"
                  variant="outlined"

                />

              </div>


              <div style={uploadBox}>
                <Typography className={Type.textGrey} gutterBottom>
                  Upload an image
              </Typography>
                <Typography className={Type.textGreyLight} gutterBottom>
                  {this.showFileList()}
                </Typography>
                <input
                  onChange={info => { this.setState({ files: info.target.files }) }}
                  style={{ display: 'none' }}
                  accept="image/*"
                  className={classes.inputUpload}
                  id="raised-button-file"
                  type="file"
                />
                { /* eslint-disable-next-line */}
                <label htmlFor="raised-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    id="raised-button-file"
                    className={classes.button}
                  >
                    Upload
                </Button>
                </label>
              </div>
              <div style={{ padding: 20, background: '#fff4e4', marginBottom: 6, marginTop: 9, borderRadius: 7 }}>
                <p> <b>1. Community-Vendor MOU is signed</b></p>
                <p> <b>2. We have researched the vendor</b></p>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={verified}
                      onChange={this.handleChange('verified')}
                      value="verified"
                    />
                  )}
                  label="I confirm that I have completed the above steps"
                />
              </div>
              {this.ejectButton(classes)}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}



export default withStyles(styles)(AddVendorForm);
