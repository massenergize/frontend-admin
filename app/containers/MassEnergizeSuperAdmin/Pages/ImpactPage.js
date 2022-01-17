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


class ImpactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      pageData: null,
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const pageData = await apiCall('/impact_page_settings.info', { community_id: id });
    if (pageData && pageData.success) {
      await this.setStateAsync({ pageData: pageData.data });
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
    const { pageData } = this.state;
    const { community,  more_info } = pageData;

    // more_info contains the info on what graphs enabled, and which data sources used
    const display_households = (more_info && "display_households" in more_info) ? more_info.display_households : true;
    const display_actions = (more_info && "display_actions" in more_info) ? more_info.display_actions : true;
    const display_carbon = (more_info && "display_carbon" in more_info) ? more_info.display_carbon : true;
    const platform_households = (more_info && "platform_households" in more_info) ? more_info.platform_households : true;
    const state_households = (more_info && "state_households" in more_info) ? more_info.state_households : true;
    const manual_households = (more_info && "manual_households" in more_info) ? more_info.manual_households : false;
    const platform_actions = (more_info && "platform_actions" in more_info) ? more_info.platform_actions : true;
    const state_actions = (more_info && "state_actions" in more_info) ? more_info.state_actions : true;
    const platform_carbon = (more_info && "platform_carbon" in more_info) ? more_info.platform_carbon : true;
    const manual_carbon = (more_info && "manual_carbon" in more_info) ? more_info.manual_carbon : false;

    const formJson = {
      title: `Edit ${community ? community.name + '\'s' : 'Community\'s'} - Impact Page`,
      subTitle: '',
      method: '/impact_page_settings.update',
      //successRedirectPage: window.location.href,
      fields: [
        {
            name: 'id',
            label: 'ID',
            placeholder: 'eg. 1',
            fieldType: 'TextField',
            contentType: 'number',
            isRequired: true,
            defaultValue: `${pageData.id}`,
            dbName: 'id',
            readOnly: true
          },
          {
            name: 'title',
            label: 'Main Title',
            placeholder: 'eg. Our Community Impact',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: false,
            defaultValue: `${pageData.title}`,
            dbName: 'title',
            readOnly: false
          },
          {
            name: 'description',
            label: 'Paragraph to be displayed below the title',
            placeholder: 'Tell us more ...',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: false,
            isMultiline: true,
            defaultValue: `${pageData.description}`,
            dbName: 'description',
            readOnly: false
          },
          {
            label: 'Selection of graphs and data.  These affect graphs on both the Impact page and Home page',
            fieldType: 'Section',
            children: 
            [
              {
                name: 'display_households',
                label: 'Display Households graph?',
                fieldType: 'Radio',
                defaultValue: display_households ? "true" : "false",
                dbName: 'display_households',
                readOnly: false,
                data: [
                  { id: 'false', value: 'No' },
                  { id: 'true', value: 'Yes' },
                ],
                child: {
                  valueToCheck: 'true',
                  fields: [
                    {
                      name: 'include_in_househods',
                      label: 'Check ALL that you wish to be included in the household count for your community',
                      fieldType: 'Section',
                      children: [
                        {
                          name: 'platform_households',
                          label: 'Reported households from platform users',
                          fieldType: 'Checkbox',
                          defaultValue: platform_households ? "true" : "false",
                          dbName: 'platform_households',
                        },
                        {
                          name: 'state_households',
                          label: 'Reported households from state solar installations',
                          fieldType: 'Checkbox',
                          defaultValue: state_households ? "true" : "false",
                          dbName: 'state_households',
                        },
                        {
                          name: 'manual_households',
                          label: 'Additional manual input households',
                          fieldType: 'Checkbox',
                          defaultValue: manual_households ? "true" : "false",
                          dbName: 'manual_households',
                        }
                      ]
                    },
                  ]
                }
              },
              {
                name: 'display_actions',
                label: 'Display Actions graph?',
                fieldType: 'Radio',
                defaultValue: display_actions ? "true" : "false",
                dbName: 'display_actions',
                readOnly: false,
                data: [
                  { id: 'false', value: 'No' },
                  { id: 'true', value: 'Yes' }
                ],
                child: {
                  valueToCheck: 'true',
                  fields: [
                    {
                      label: 'Check ALL that you wish to be included in the actions count for your community',
                      fieldType: 'Section',
                      children: 
                      [
                        {
                          name: 'platform_actions',
                          label: 'Reported actions from platform users',
                          fieldType: 'Checkbox',
                          defaultValue: platform_actions ? "true" : "false",
                          dbName: 'platform_actions',
                        },
                        {
                          name: 'state_actions',
                          label: 'Reported actions from state data by category',
                          fieldType: 'Checkbox',
                          defaultValue: state_actions ? "true" : "false",
                          dbName: 'state_actions',
                        },
                        // No manual actions adding - need to add them to the categories
                      ]
                    }
                  ]
                }
              },
              {
                name: 'display_carbon',
                label: 'Display carbon graph?',
                fieldType: 'Radio',
                defaultValue: display_carbon  ? "true" : "false",
                dbName: 'display_carbon',
                readOnly: false,
                data: [
                  { id: 'false', value: 'No' },
                  { id: 'true', value: 'Yes' }
                ],
                child: {
                  valueToCheck: 'true',
                  fields: [
                    {
                      label: 'Check ALL that you wish to be included in the carbon count for your community',
                      fieldType: 'Section',
                      children: 
                      [
                        {
                          name: 'platform_carbon',
                          label: 'Carbon estimated from actions reported on platform',
                          fieldType: 'Checkbox',
                          defaultValue: platform_carbon ? "true" : "false",
                          dbName: 'platform_carbon',
                        },
                        //{  we will figure out how to do this...
                        //  name: 'state_carbon',
                        //  label: 'Reported households from state solar installations',
                        //  fieldType: 'Checkbox',
                        //  defaultValue: state_carbon,
                        //  dbName: 'state_carbon',
                        //},
                        {
                          name: 'manual_carbon',
                          label: 'Additional manual carbon estimate from previous programs',
                          fieldType: 'Checkbox',
                          defaultValue: manual_carbon ? "true" : "false",
                          dbName: 'manual_carbon',
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
          name: 'enable',
          fieldType: 'Radio',
          dbName: 'is_published',
          label: 'This page is enabled if checked',
          isRequired: false,
          defaultValue: `${pageData.is_published}`,
          data: [
            { id: 'false', value: 'No' },
            { id: 'true', value: 'Yes' }
          ],
        },  
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div>Hold tight! Fetching Data ...</div>);
    console.log(formJson)
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

ImpactPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(ImpactPage);
