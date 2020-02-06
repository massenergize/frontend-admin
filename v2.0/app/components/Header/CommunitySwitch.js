import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { bindActionCreators } from 'redux';
import { reduxLoadSelectedCommunity } from '../../redux/redux-actions/adminActions';
import styles from './header-jss';

class CommunitySwitch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }


  findCommunityObj = (name) => {
    const { auth } = this.props;
    const section = auth ? auth.admin_at : [];
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }

  chooseCommunity = (event) => {
    const obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    this.props.actionToPerform(obj.id);
  }


  render() {
    const { classes, auth, selected_community } = this.props;
    const communities = auth ? auth.admin_at : {};
    const firstCom = auth ? auth.admin_at[0].name : 'Choose Community';
    const community = selected_community ? selected_community.name : firstCom;
    return (
      <div>
        <TextField
          id="outlined-select-currency"
          select
          label=""
          className={classes.textField}
          value={community}
          fullWidth
          onChange={option => { this.chooseCommunity(option); }}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Select Community"
          margin="normal"
          variant="outlined"
        >
          {communities.map(option => (
            <MenuItem key={option.id.toString()} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  }
}

CommunitySwitch.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(['auth']),
  // communities: state.getIn(['communities']),
  selected_community: state.getIn(['selected_community'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCommunity: reduxLoadSelectedCommunity
}, dispatch);
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(CommunitySwitch);

export default withStyles(styles)(summaryMapped);
