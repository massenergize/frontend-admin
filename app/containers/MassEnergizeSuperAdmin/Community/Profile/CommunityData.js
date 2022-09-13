import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MassEnergizeForm from '../../_FormGenerator';
import { apiCall } from '../../../../utils/messenger';

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


class CommunityData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      graph: null
    };
  }


  async componentDidMount() {
    const { id } = this.props;
    console.log(id);
    const graphResponse = await apiCall('/graphs.actions.completed', { community_id: id });
    if (graphResponse && !graphResponse.success) {
      return;
    }

    const graph = graphResponse.data;
    await this.setStateAsync({ graph });

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
    // if (!community) return {};

    const formJson = {
      title: 'Community Reported Data',
      subTitle: '',
      method: '/graphs.data.update',
      // successRedirectPage: window.location.href,
      fields: []
    };

    formJson.fields = graph && graph.data.map(d => (
      {
        label: `${d.name} Data`,
        fieldType: 'Section',
        children: [
          {
            name: `reported_value_${d.id}`,
            label: 'Reported Data',
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
            label: 'Organic Data from users on your Portal - Cannot Edit',
            placeholder: 'eg. 10',
            fieldType: 'TextField',
            contentType: 'number',
            defaultValue: d.value,
            dbName: `value_${d.id}`,
            readOnly: true
          }
        ]
      })
    );

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

CommunityData.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CommunityData);
