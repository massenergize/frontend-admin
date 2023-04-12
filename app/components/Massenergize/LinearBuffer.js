import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { arrInRange } from "../../containers/MassEnergizeSuperAdmin/Community/utils";

const styles = {
  root: {
    flexGrow: 1,
  },
};

class LinearBuffer extends React.Component {
  state = {
    completed: 0,
    buffer: 10,
  };

  timer = null;

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    if (completed > 100) {
      this.setState({ completed: 0, buffer: 10 });
    } else {
      const diff = Math.random() * 10;
      const diff2 = Math.random() * 10;
      this.setState({
        completed: completed + diff,
        buffer: completed + diff + diff2,
      });
    }
  };

  render() {
    const { classes, message, asCard } = this.props;
    const { completed, buffer } = this.state;
    const lines = this.props.lines || 1;
    const buffLines = arrInRange(0, lines - 1);
    const asCardStyles = {
      background: "white",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    };
    return (
      <div className={classes.root} style={asCard ? asCardStyles : {}}>
        {message && <p>{message}</p>}
        {!message && (
          <div>
            <p>
              Hold tight, I am fetching data from the database. Almost done ...
              <span role="img" aria-label="smiley">
                😊
              </span>
            </p>
          </div>
        )}
        {buffLines.map((index, _) => (
          <>
            <LinearProgress
              color={index % 2 === 0 ? "secondary" : "primary"}
              variant="buffer"
              value={completed}
              valueBuffer={buffer}
            />
            <br />
          </>
        ))}
      </div>
    );
  }
}

LinearBuffer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearBuffer);
