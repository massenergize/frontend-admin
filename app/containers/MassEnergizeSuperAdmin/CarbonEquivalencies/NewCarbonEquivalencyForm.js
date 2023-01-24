import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
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
    margin: theme.spacing(1) * 4,
    textAlign: 'center'
  },
});


class NewCarbonEquivalencyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null
    };
  }


  async componentDidMount() {
    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const formJson = {
      title: 'Create New Carbon Equivalency',
      subTitle: '',
      cancelLink: '/admin/read/carbon-equivalencies',
      method: '/data.carbonEquivalency.create',
      successRedirectPage: '/admin/read/carbon-equivalencies',
      fields: [
        {
          label: 'About this Carbon Equivalency',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of Carbon Equivalency',
              placeholder: 'eg. Trees',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'title',
              label: 'Short title for display',
              placeholder: 'eg. Number of trees',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'title',
              readOnly: false
            },
            {
              name: 'value',
              label: 'Value (number per metric Ton of CO2)',
              placeholder: 'eg. 1.0',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: '',
              step: 'any',
              dbName: 'value',
              readOnly: false
            },
            {
              name: 'icon',
              placeholder: 'Select an Image',
              fieldType: 'Icon',
              contentType: 'text',
              dbName: 'icon',
              label: 'Pick a FontAwesome icon',
              isRequired: true,
              defaultValue: 'fa-tree',
            },
            {
              name: 'explanation',
              label: 'Please explain this equivancy in clear terms',
              placeholder: '',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              isMultiline: true,
              defaultValue: '',
              dbName: 'explanation',
              readOnly: false
            },
            {
              name: 'reference',
              label: 'Link to a trusted reference',
              placeholder: '',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              isMultiline: true,
              defaultValue: '',
              dbName: 'reference',
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

NewCarbonEquivalencyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(NewCarbonEquivalencyForm);
