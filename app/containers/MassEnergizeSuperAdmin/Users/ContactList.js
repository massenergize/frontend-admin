import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SearchIcon from '@material-ui/icons/Search';
import PermContactCalendar from '@material-ui/icons/PermContactCalendar';
import Add from '@material-ui/icons/Add';
import Star from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import styles from './contact-jss';

class ContactList extends React.Component {
  state = {
    filter: 'all',
  };

  handleChange = (event, value) => {
    this.setState({ filter: value });
  };

  filterUsers = (allData, val) => {
    console.log(allData)
    if (!allData) return [];
    if (val === 'all') {
      return allData;
    }
    return allData.filter(d => d.communities.filter(val) > 0);
  }

  render() {
    const {
      classes,
      dataContact,
      itemSelected,
      showDetail,
      search,
      keyword,
      clippedRight,
      addContact,
      addFn, total,
      communities
    } = this.props;
    console.log(communities);

    const { filter } = this.state;
    const getItem = dataArray => dataArray.map(data => {
      const index = dataContact.indexOf(data);
      if (data.get('full_name').toLowerCase().indexOf(keyword) === -1) {
        return false;
      }
      return (
        <ListItem
          button
          key={data.get('id')}
          className={index === itemSelected ? classes.selected : ''}
          onClick={() => showDetail(data)}
        >
          {data.get('profile_picture')
            && (<Avatar alt={data.get('full_name')} src={data.get('profile_picture').url} className={classes.avatar} />)
          }
          {!data.get('profile_picture')
            && (<Avatar className={classes.avatar}>{data.get('full_name').substring(0, 2).toUpperCase()}</Avatar>)
          }
          <ListItemText primary={data.get('full_name')} secondary={data.get('is_super_admin') ? 'Super Admin' : data.getIn('is_community_admin') ? 'Community Admin' : 'Member'} />
        </ListItem>
      );
    });
    return (
      <Fragment>
        <Drawer
          variant="permanent"
          anchor="left"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div>
            <div className={classNames(classes.toolbar, clippedRight && classes.clippedRight)}>
              <div className={classes.flex}>
                <div className={classes.searchWrapper}>
                  <div className={classes.search}>
                    <SearchIcon />
                  </div>
                  <input className={classes.input} onChange={(event) => search(event)} placeholder="Search" />
                </div>
                {/* {addFn && (
                  <Tooltip title="Add New Contact">
                    <IconButton className={classes.buttonAdd} onClick={() => addContact()} color="secondary" aria-label="Delete">
                      <Add />
                    </IconButton>
                  </Tooltip>
                )} */}
              </div>
            </div>
            <div className={classes.total}>
              {total}
              &nbsp;
              Users
            </div>
            <List>
              {getItem(dataContact, filter)}
            </List>
          </div>
        </Drawer>
        {/* <BottomNavigation value={filter} onChange={this.handleChange} className={classes.bottomFilter}>
          <BottomNavigationAction label="All" value="all" icon={<PermContactCalendar />} />
          {communities && communities.map(c => (
            <BottomNavigationAction key={c.name} label={c.name && c.name} value={c.name} icon={<PermContactCalendar />} />
          ))}
        </BottomNavigation> */}
      </Fragment>
    );
  }
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired,
  communities: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  dataContact: PropTypes.object.isRequired,
  keyword: PropTypes.string.isRequired,
  itemSelected: PropTypes.number.isRequired,
  addContact: PropTypes.func,
  addFn: PropTypes.bool,
  showDetail: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  clippedRight: PropTypes.bool,
};

ContactList.defaultProps = {
  clippedRight: false,
  addContact: () => {},
  addFn: false,
};

export default withStyles(styles)(ContactList);
