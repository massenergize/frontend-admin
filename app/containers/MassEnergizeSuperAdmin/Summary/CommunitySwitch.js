import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import { connect } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { bindActionCreators } from "redux";
import { reduxLoadSelectedCommunity } from "../../../redux/redux-actions/adminActions";
import styles from "./dashboard-jss";

class CommunitySwitch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  findCommunityObj = (name) => {
    const [section] = this.getDropdownCommunities();
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  };

  chooseCommunity = (event) => {
    const obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    this.props.actionToPerform(obj && obj.id);
  };

  getDropdownCommunities() {
    var { auth, communities } = this.props;

    communities = communities && communities.items|| [];
    var firstCom = communities[0] || {};
    if (!auth) return [];
    if (auth.is_super_admin) return [communities, communities[0] || firstCom];
    communities = (auth && auth.admin_at) || [];
    var firstCom = communities[0] || {};
    if (auth.is_community_admin) return [communities, firstCom];
    return [[], {}];
  }

  render() {
    const { classes, selected_community } = this.props;
    const [communities, first] = this.getDropdownCommunities();
    const communityName = selected_community
      ? selected_community.name
      : (first && first.name) || "-------";
    return (
      <div>
        <Paper style={{ padding: 20, marginBottom: 10 }}>
          <h4 style={{ fontWeight: "400", marginBottom: 2 }}>
            Switch Community
          </h4>
          <TextField
            id="outlined-select-currency"
            select
            label=""
            className={classes.textField}
            value={communityName}
            fullWidth
            onChange={(option) => {
              this.chooseCommunity(option);
            }}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Use the dropdown to switch between communities you manage"
            margin="normal"
            variant="outlined"
          >
            {communities.map((option) => (
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

const mapStateToProps = (state) => ({
  communities: state.getIn(["communities"]),
  auth: state.getIn(["auth"]),
  selected_community:
    state.getIn(["selected_community"]) ||
    state.getIn(["full_selected_community"]),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      selectCommunity: reduxLoadSelectedCommunity,
    },
    dispatch
  );
const summaryMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunitySwitch);

export default withStyles(styles)(summaryMapped);
