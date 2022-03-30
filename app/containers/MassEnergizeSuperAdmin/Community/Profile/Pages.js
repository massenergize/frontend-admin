import React from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import styles from "./profile-jss";
import { withRouter } from "react-router-dom";

class Pages extends React.Component {
  goHere = (link) => {
    // window.location = link;
    this.props.history.push(link);
  };

  render() {
    const { classes, community } = this.props;
    const homeLink = `/admin/edit/${community ? community.id : null}/home`;
    const allActions = `/admin/edit/${
      community ? community.id : null
    }/all-actions`;
    const about = `/admin/edit/${community ? community.id : null}/about`;
    const contactUs = `/admin/edit/${
      community ? community.id : null
    }/contact_us`;
    const donate = `/admin/edit/${community ? community.id : null}/donate`;
    const impactPageLink = `/admin/edit/${
      community ? community.id : null
    }/impact`;
    const impactsLink = `/admin/edit/${
      community ? community.id : null
    }/impacts`;
    const teams = `/admin/edit/${community ? community.id : null}/teams`;
    const events = `/admin/edit/${community ? community.id : null}/events`;
    const vendors = `/admin/edit/${community ? community.id : null}/vendors`;
    const testimonials = `/admin/edit/${
      community ? community.id : null
    }/testimonials`;
    //const registration = `/admin/edit/${community ? community.id : null}/registration`;
    const signin = `/admin/edit/${community ? community.id : null}/signin`;

    // @TODO : If number of items in this array increases, a dropdown is probably a better Idea
    const PAGES = [
      { name: "Home Page", key: "homepage", link: homeLink },
      {
        name: "Community Goals And Impact Data",
        key: "community-goals",
        link: impactsLink,
      },
      { name: "Impact Page", key: "homepage", link: impactPageLink },
      { name: "About Us Page", key: "homepage", link: about },
      { name: "Donate Page", key: "homepage", link: donate },
      { name: "Contact Us Page", key: "homepage", link: contactUs },
      { name: "All Actions Page", key: "homepage", link: allActions },
      { name: "All Events Page", key: "homepage", link: events },
      { name: "All Teams Page", key: "homepage", link: teams },
      { name: "All Testimonials Page", key: "homepage", link: testimonials },
      { name: "All Services Page", key: "homepage", link: vendors },
      //{ name: "Registration Page", key: "homepage", link: registration },
      { name: "Sign In Page", key: "homepage", link: signin },
    ];

    return (
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        direction="row"
        spacing={16}
      >
        <Grid item md={12} sm={12} xs={12} style={{ marginTop: -35 }}>
          <Paper className={classes.root} elevation={1} style={{ padding: 50 }}>
            <h1 style={{ fontSize: "1.3rem", fontWeight: "400" }}>
              Edit this community's pages here
            </h1>

            {PAGES.map((page, index) => {
              return (
                <Paper
                  key={index}
                  onClick={() => this.goHere(page.link)}
                  className={`${classes.pageCard}`}
                >
                  <Typography style={{ fontWeight: "600", fontSize: "1rem" }}>
                    {page.name}
                  </Typography>
                  <Icon style={{ marginLeft: "auto", color: "green" }}>
                    forward
                  </Icon>
                </Paper>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Pages));
