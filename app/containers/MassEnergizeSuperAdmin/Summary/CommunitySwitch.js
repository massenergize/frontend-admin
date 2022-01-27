import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { bindActionCreators } from "redux";
import { reduxLoadSelectedCommunity } from "../../../redux/redux-actions/adminActions";
import styles from "./dashboard-jss";

class CommunitySwitch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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
  };

  chooseCommunity = (event) => {
    const obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    this.props.actionToPerform(obj && obj.id);
  };

  render() {
    const { classes, auth, selected_community } = this.props;
    const communities = auth ? auth.admin_at : [];
    const firstCom =
      communities && communities[0]
        ? communities[0].name
        : "--- Please Select a Community ---";
    const communityName = selected_community
      ? selected_community.name
      : firstCom;
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
            helperText="Choose from list"
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
