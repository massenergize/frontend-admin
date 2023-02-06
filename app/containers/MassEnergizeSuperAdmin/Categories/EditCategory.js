import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
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
    margin: theme.spacing(4),
    textAlign: 'center'
  },
});


class CreateNewTagCollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagCollection: null,
      loading: true,
      formJson: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const tagCollectionResponse = await apiCall('/tag_collections.info', { tag_collection_id: id });

    if (tagCollectionResponse && tagCollectionResponse.success) {
      await this.setStateAsync({ tagCollection: tagCollectionResponse.data });
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
    const { tagCollection } = this.state;
    const { pathname } = window.location;
    const formJson = {
      title: 'Edit Tag Collection',
      subTitle: '',
      // cancelLink: '/admin/read/categories',
      method: '/tag_collections.update',
      successRedirectPage: pathname || '/admin/read/categories',
      fields: [
        {
          label: 'About this Tag Collection',
          fieldType: 'Section',
          children: [
            {
              name: 'id',
              label: 'ID',
              placeholder: 'eg. 2',
              fieldType: 'TextField',
              contentType: 'text',
              defaultValue: tagCollection.id,
              dbName: 'id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of Tag Collection',
              placeholder: 'eg. Category',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: tagCollection.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'rank',
              label: 'Rank of Category (Lower comes first)',
              placeholder: 'eg. 1',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: tagCollection.rank,
              dbName: 'rank',
              readOnly: false
            },
          ]
        },
      ]
    };

    if (tagCollection && tagCollection.tags) {
      const tagFields = [];
      tagCollection.tags.forEach((t, i) => {
        tagFields.push(
          {
            name: `tag_${t.id}`,
            label: `Tag #${i + 1}`,
            placeholder: 'eg. High',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: false,
            defaultValue: t.name,
            dbName: `tag_${t.id}`,
            readOnly: false
          },
          {
            name: `tag_${t.id}_rank`,
            label: `Tag #${i + 1} Rank`,
            placeholder: 'eg. 1',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: false,
            defaultValue: t.order,
            dbName: `tag_${t.id}_rank`,
            readOnly: false
          }
        );
      });

      if (tagFields.length > 0) {
        formJson.fields.push(
          {
            label: 'Individual Tags',
            fieldType: 'Section',
            children: tagFields
          },
        );
      }

      formJson.fields.push(
        {
          name: 'tags_to_add',
          label: 'Type new tags here separated by commas',
          placeholder: 'eg. High',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: '',
          dbName: 'tags_to_add',
          readOnly: false
        },
      );

      formJson.fields.push(
        {
          name: 'tags_to_delete',
          label: 'Want to delete some tags? Type their names here separated by commas',
          placeholder: 'eg. Low, High',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: '',
          dbName: 'tags_to_delete',
          readOnly: false
        },
      );
    }

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
          enableCancel
        />
      </div>
    );
  }
}

CreateNewTagCollectionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewTagCollectionForm);
