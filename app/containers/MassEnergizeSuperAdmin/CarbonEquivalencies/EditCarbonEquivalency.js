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


class EditCarbonEquivalencyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carbonEquivalency: null,
      loading: true,
      formJson: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const response = await apiCall('/data.carbonEquivalency.info', { id: id });

    if (response && response.success) {
      await this.setStateAsync({ carbonEquivalency: response.data });
    }
    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson, loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { carbonEquivalency } = this.state;
    const formJson = {
      title: 'Edit Carbon Equivalency',
      subTitle: '',
      cancelLink: '/admin/read/carbon-equivalencies',
      method: '/data.carbonEquivalency.update',
      successRedirectPage: `/admin/edit/${carbonEquivalency.id}/carbon-equivalency`, //pathname || '/admin/read/carbon-equivalencies',
      fields: [
        {
          label: 'About this Carbon Equivalency',
          fieldType: 'Section',
          children: [
            {
              name: 'id',
              label: 'ID',
              placeholder: 'eg. 2',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              defaultValue: carbonEquivalency.id,
              dbName: 'id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of Carbon Equivalency',
              placeholder: 'eg. Trees',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: carbonEquivalency.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'title',
              label: 'Short title for display',
              placeholder: 'eg. Number of Trees',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: carbonEquivalency.title,
              dbName: 'title',
              readOnly: false
            },
            {
              name: 'value',
              label: 'Value',
              placeholder: 'eg. 1.0',
              fieldType: 'TextField',
              contentType: 'number',
              step: 'any',
              isRequired: true,
              defaultValue: carbonEquivalency.value,
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
              defaultValue: carbonEquivalency.icon,
            },
            {
              name: 'explanation',
              label: 'Please explain this equivancy in clear terms',
              placeholder: '',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: carbonEquivalency.explanation,
              dbName: 'explanation',
              readOnly: false
            },
            {
              name: 'reference',
              label: 'Link to a trusted reference',
              placeholder: '',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: carbonEquivalency.reference,
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

EditCarbonEquivalencyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(EditCarbonEquivalencyForm);
