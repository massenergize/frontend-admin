/* eslint-disable camelcase */
import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { withStyles } from "@mui/styles";
import styles from "./jss/cover-jss";
import { apiCall } from "../../../../utils/messenger";
import { PORTAL_HOST } from "../../../../config/constants";

class Cover extends React.Component {
  goLive = async () => {
    const { community, liveOrNotFxn } = this.props;
    const { is_published } = community;
    const { id } = community;
    const body = { is_published: !is_published, community_id: id };
    liveOrNotFxn(community);
    await apiCall("/communities.update", body);
  };

  showLiveBtn = () => {
    const { community } = this.props;
    const { is_published } = community;
    const { classes } = this.props;
    if (is_published) {
      return (
        <div style={{ flex: "1" }}>
          <Button
            onClick={() => {
              this.goLive();
            }}
            variant="contained"
            color="secondary"
            className={classes.publishBtn}
          >
            Unpublish
          </Button>
        </div>
      );
    }

    return (
      <div>
        <Button
          onClick={() => {
            this.goLive();
          }}
          variant="contained"
          color="secondary"
          className={classes.goLiveBtn}
        >
          Go Live
        </Button>
      </div>
    );
  };

  render() {
    const { classes, name, desc, coverImg, community } = this.props;
    const coverStyle = {
      height: 250,
      textAlign: "left",
      justifyContent: "flex-start",
      backgroundImage: `url(${coverImg})`,
    };
    const contentStyle = {
      display: "inline-block",
      marginLeft: 20,
      marginBottom: 2,
      fontSize: "1.8rem",
      fontWeight: "500px",
      textTransform: "capitalize",
      flex: "1",
    };

    return (
      <div className={classes.cover} style={coverStyle}>
        <div className={classes.content}>
          <div style={{ display: "flex", flex: "2", alignItems: "center" }}>
            <h2 style={contentStyle}>
              {name}
              {community.is_approved && (
                <VerifiedUser
                  style={{
                    color: "#0095ff",
                    marginTop: -2,
                    display: "inline-block",
                  }}
                  className={classes.verified}
                />
              )}
            </h2>
            <div style={{ flex: "1", marginLeft: "auto" }}>
              <center style={{ display: "flex", flex: "3" }}>
                {this.showLiveBtn()}
                <a
                  style={{ fontSize: 14, flex: "1" }}
                  className={classes.leAnchor}
                  href={
                    community
                      ? `${PORTAL_HOST}/${community.subdomain}?sandbox=true`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  Preview
                </a>
                <a
                  style={{ fontSize: 14, flex: "1", background: "green" }}
                  className={classes.leAnchor}
                  href={
                    community ? `${PORTAL_HOST}/${community.subdomain}` : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  Visit Portal
                </a>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
  community: PropTypes.object.isRequired,
  liveOrNotFxn: PropTypes.func.isRequired,
};

export default withStyles(styles)(Cover);
