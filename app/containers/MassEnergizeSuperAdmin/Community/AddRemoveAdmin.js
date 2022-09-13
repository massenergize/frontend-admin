import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import CallMadeIcon from '@material-ui/icons/CallMade';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
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


class AddRemoveAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formJson: null,
      columns: this.getColumns(),
      community: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const communityAdminResponse = await apiCall('/admins.community.list', { community_id: id });
    if (communityAdminResponse && communityAdminResponse.data) {
      const members = communityAdminResponse.data.members || [];
      const pending = communityAdminResponse.data.pending_members || [];
      const data = members.map(d => (
        [
          {
            id: d.email,
            image: d.profile_picture,
            initials: `${d.preferred_name && d.preferred_name.substring(0, 2).toUpperCase()}`
          },
          d.full_name,
          d.preferred_name,
          d.email,
          'Accepted'
        ]
      ));
      pending.forEach(p => {
        data.push(
          [
            {
              id: p.email,
              image: null,
              initials: `${p.name && p.name.substring(0, 2).toUpperCase()}`
            },
            p.name,
            p.name,
            p.email,
            'Pending',
          ]
        );
      });
      await this.setStateAsync({ data, community: communityAdminResponse.data.community });
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
    const { pathname } = window.location;
    const { community } = this.state;
    const formJson = {
      title: `Add New Administrator for ${community ? community.name : 'this Community'}`,
      subTitle: '',
      method: '/admins.community.add',
      successRedirectPage: pathname,
      fields: [
        {
          label: 'About this Admin',
          fieldType: 'Section',
          children: [
            {
              name: 'community_id',
              label: 'Community ID',
              placeholder: 'eg. 67',
              fieldType: 'TextField',
              contentType: 'text',
              defaultValue: community && community.id,
              dbName: 'community_id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name',
              placeholder: 'eg. Grace Tsu',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'email',
              label: 'Email',
              placeholder: 'eg. johny.appleseed@gmail.com',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'email',
              readOnly: false
            },
          ]
        },
      ]
    };
    return formJson;
  }


  getColumns = () => [
    {
      name: 'Image',
      key: 'image',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />
            }
            {!d.image
              && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
            }
          </div>
        )
      }
    },
    {
      name: 'Name',
      key: 'name',
      options: {
        filter: false,
      }
    },
    {
      name: 'Preferred Name',
      key: 'preferred_name',
      options: {
        filter: false,
      }
    },
    {
      name: 'Email',
      key: 'email',
      options: {
        filter: false,
      }
    },
    {
      name: 'Status',
      key: 'status',
      options: {
        filter: false,
      }
    },
  ]

  render() {
    const { classes } = this.props;
    const {
      formJson, data, columns, community
    } = this.state;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const { pathname } = window.location;
        idsToDelete.forEach(async d => {
          const email = data[d.dataIndex][0].id;
          await apiCall('/admins.community.remove', { email, community_id: community.id });
          window.location.href = pathname;
        });
      }
    };


    if (!formJson) return (<div />);
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
        <br />
        <br />
        <div className={classes.table}>
          <MUIDataTable
            title={`Community Admins ${community && ' In ' + community.name}`}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AddRemoveAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(AddRemoveAdmin);
