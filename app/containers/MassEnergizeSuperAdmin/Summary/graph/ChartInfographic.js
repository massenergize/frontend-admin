import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import OndemandVideo from "@mui/icons-material/OndemandVideo";
import SupervisorAccount from "@mui/icons-material/SupervisorAccount";
import CollectionsBookmark from "@mui/icons-material/CollectionsBookmark";
import TrendingUp from "@mui/icons-material/TrendingUp";
import colorfull from "dan-api/palette/colorfull";
import { CounterWidget } from "dan-components";
import styles from "dan-components/Widget/widget-jss";

const custom = {
  touchableOpacity: {
    "&:hover": {
      opacity: ".75",
      transition: ".2s ease-out",
      transform: "scale(1.03)"
    },
    "& svg": { color: "white" },
  },
};

class IconInfographic extends React.Component {
  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.rootCounterFull} style={{ width: "100%" }}>
        <Grid container spacing={8}>
          {data &&
            data.map((d, i) => (
              <Grid
                item
                xs={6}
                md={2}
                key={d.title}
                className={classes.touchableOpacity}
              >
                <Link to={d.link} style={{ textDecoration: "none" }}>
                  <CounterWidget
                    color={colorfull[i % colorfull.length]}
                    start={0}
                    end={d.value}
                    duration={3}
                    title={d.title}
                  >
                    <TrendingUp
                      className={classes.counterIcon}
                      style={{ fontSize: 30 }}
                    />
                  </CounterWidget>
                </Link>
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

IconInfographic.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles({ ...styles, ...custom })(IconInfographic);
