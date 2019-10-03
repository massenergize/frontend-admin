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
import {
  Checkbox,
  Select,
  TextField,
  Switch
} from 'redux-form-material-ui';
import { initAction, clearAction } from '../../../actions/ReduxFormActions';

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);
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

const initData = {
  text: 'Sample Text',
  email: 'sample@mail.com',
  radio: 'option1',
  selection: 'option1',
  onof: true,
  checkbox: true,
  textarea: 'This is default text'
};

class CreateNewTestimonialForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
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

  handleTexts = (event)=>{
    this.setState({ [event.target.name]:event.target.value});
  }
  render() {
    const trueBool = true;
    const {
      classes,
      handleSubmit,
      pristine,
      reset,
      submitting,
      init,
      clear
    } = this.props;
    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={10} sm={12} xs={12}>
            <Paper className={classes.root}>
              <h4 style={{color:'#585858',fontWeight:"500"}}>Use this form to create a testimonial</h4>
              <TextField
              name = "title"
                onChange={(event) => { this.handleTexts(event) }}
                fullWidth
                placeholder="Title"
                margin="normal"
                variant="outlined"
                helperText="Add the title of this story"
              />
              <TextField
              name = "description"
                onChange={(event) => {this.handleTexts(event) }}
                id="outlined-multiline-flexible"
                label="Description"
                fullWidth
                multiline
                cols="20"
                rowsMax="19"
                rows="10"
                placeholder="Write a testimonial..."
                className={classes.textField}
                margin="normal"
                helperText="Describe what happened..."
                variant="outlined"
              />
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
              <Fab
                justify="right"
                style={{ margin: 6, background: 'green' }}
                onClick={() => { console.log(  {title:"",description:"",...this.state}) }}
                variant="extended"
                color="secondary"
                aria-label="Delete"
                className={classes.button}
              > Add Testimonial </Fab>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}



export default withStyles(styles)(CreateNewTestimonialForm);
