import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { bindActionCreators } from 'redux';
import { reduxLoadSelectedCommunity } from '../../../redux/redux-actions/adminActions';
import styles from './dashboard-jss';

class CommunitySwitch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { events: [], testimonials: [], actions: [] };
  }


  findCommunityObj = (name) => {
    const auth = this.props.auth;
    let section = auth?auth.communities :[];
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }

  chooseCommunity = (event) => {
    let obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    console.log(" LOADING FOR:::", obj.name, obj.id)
    this.props.actionToPerform(obj.id);
  }


  render() {
    const {classes, auth, selected_community} = this.props;
    const communities = auth ? auth.communities : {};
    const firstCom = auth? auth.communities[0].name :"Choose Community"
    const community = selected_community ? selected_community.name :firstCom;
    return (
      <div>
        <Paper style={{ padding:20, marginBottom:10 }}>
          <h4 style={{fontWeight:'400', marginBottom:2}}>Switch Community</h4>
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
            helperText="Choose from list"
            margin="normal"
            variant="outlined"
          >
            {communities.map(option => (
              <MenuItem key={option.id.toString()} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Paper>

      </div>
    );
  }
}

CommunitySwitch.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.getIn(['auth']),
    //communities: state.getIn(['communities']), 
    selected_community: state.getIn(['selected_community'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectCommunity: reduxLoadSelectedCommunity
  }, dispatch)
}
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(CommunitySwitch);

export default withStyles(styles)(summaryMapped);
