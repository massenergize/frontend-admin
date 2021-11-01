import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});


class Impact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      graph: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const graphResponse = await apiCall('/graphs.actions.completed', { community_id: id });
    if (graphResponse && !graphResponse.success) {
      return;
    }

    const graph = graphResponse.data;
    await this.setStateAsync({ graph });

    const communityResponse = await apiCall('/communities.info', { community_id: id });
    if (communityResponse && communityResponse.data) {
      await this.setStateAsync({ goal: communityResponse.data.goal });
    } else {
      await this.setStateAsync({ noDataFound: true });
      return;
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
    const { graph } = this.state;
    const { community } = graph;

    const goal = this.state.goal;

    const formJson = {
      title: 'Community Goals and Reported Data',
      subTitle: '',
      method: '/graphs.data.update',
      successRedirectPage: window.location.href,
      fields: 
      [
        {
          name: "id",
          label: "Community ID",
          placeholder: "eg. 10",
          fieldType: "TextField",
          contentType: "number",
          isRequired: true,
          defaultValue: community.id,
          dbName: "community_id",
          readOnly: true,
        },
        {
          label: 'Community Goals and current statistics.',
          fieldType: 'Section',
          children: 
          [
            {
              label: 'Actions completed',
              fieldType: 'Section',
              children: 
              [
    
                // 9/2021 - eliminate initial_number_of_actions',
                {
                  name: 'attained_number_of_actions',
                  label: 'State/Partner reported: Attained Number of Actions',
                  placeholder: '',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.attained_number_of_actions,
                  dbName: 'attained_number_of_actions',
                  readOnly: true
                },
                {
                  name: 'organic_attained_number_of_actions',
                  label: 'User Reported: Number of Completed Actions',
                  placeholder: '',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.organic_attained_number_of_actions,
                  dbName: 'organic_attained_number_of_actions',
                  readOnly: true
                },
                {
                  name: 'target_number_of_actions',
                  label: 'Goal: Target Number of Actions for current period',
                  placeholder: 'eg. 2000',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.target_number_of_actions,
                  dbName: 'target_number_of_actions',
                  readOnly: false
                },
              ]
            },
            {
              label: 'Households Engaged',
              fieldType: 'Section',
              children: 
              [
                {
                  name: 'attained_number_of_households',
                  label: 'State/Partner reported: Estimated number of households',
                  placeholder: '',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.attained_number_of_households,
                  dbName: 'attained_number_of_households',
                  readOnly: true
                },
                {
                  name: 'organic_attained_number_of_households',
                  label: 'User Reported: How many households joined this community',
                  placeholder: '',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.organic_attained_number_of_households,
                  dbName: 'organic_attained_number_of_households',
                  readOnly: true
                },
                {
                  name: 'initial_number_of_households',
                  label: 'Manual Input: Number of households taking action, not included in those listed above',
                  placeholder: 'eg. 0',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.initial_number_of_households,
                  dbName: 'initial_number_of_households',
                  readOnly: false
                },
                {
                  name: 'target_number_of_households',
                  label: 'Goal: How many households are expected to join this community?',
                  placeholder: 'eg. 1000',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.target_number_of_households,
                  dbName: 'target_number_of_households',
                  readOnly: false
                },
              ]
            },
            {
              label: 'Carbon Footprint reduction in lbs of CO2 annual savings',
              fieldType: 'Section',
              children: 
              [
                {
                  name: 'organic_attained_carbon_footprint_reduction',
                  label: 'User Reported: Carbon Footprint Reduction from Actions Completed',
                  placeholder: '',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.organic_attained_carbon_footprint_reduction,
                  dbName: 'organic_attained_carbon_footprint_reduction',
                  readOnly: true
                },
                {
                  name: 'initial_carbon_footprint_reduction',
                  label: 'Manual Input: Carbon footprint reduction attained from previous programs',
                  placeholder: 'eg. 0',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.initial_carbon_footprint_reduction,
                  dbName: 'initial_carbon_footprint_reduction',
                  readOnly: false
                },
                {
                  name: 'target_carbon_footprint_reduction',
                  label: 'Goal: Target Carbon Footprint Reduction',
                  placeholder: 'eg. 10000000',
                  fieldType: 'TextField',
                  contentType: 'number',
                  isRequired: false,
                  defaultValue: goal && goal.target_carbon_footprint_reduction,
                  dbName: 'target_carbon_footprint_reduction',
                  readOnly: false
                },
              ]
            },
          ]
        }
      ]
    };

    const categoryFields = graph && graph.data.map(d => (
      {
        label: `Category: ${d.name} - Actions Completed`,
        fieldType: 'Section',
        children: [
          {
            name: `reported_value_${d.id}`,
            label: 'State/Other Reported Actions',
            placeholder: 'eg. 10',
            fieldType: 'TextField',
            contentType: 'number',
            isRequired: true,
            defaultValue: d.reported_value,
            dbName: `reported_value_${d.id}`,
            readOnly: false
          },
          {
            name: `value_${d.id}`,
            label: 'Actions reported from users on your Portal - Cannot Edit',
            placeholder: 'eg. 10',
            fieldType: 'TextField',
            contentType: 'number',
            isRequired: true,
            defaultValue: d.value,
            dbName: `value_${d.id}`,
            readOnly: true
          }
        ]
      })
    );

    const moreFields = [
        {
          label: 'State and partner reported data, in addition to website usage.  Enter number of actions for each category',
          fieldType: 'Section',
          children: 
          [ ...categoryFields,
          ]
        },
    ]

    formJson.fields = formJson.fields.concat(moreFields);

    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div>Hold tight! Fetching Data ...</div>);
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

Impact.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(Impact);
