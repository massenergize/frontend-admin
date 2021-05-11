import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import styles from './profile-jss';
class Pages extends React.Component {
  goHere = (link) => {
    window.location = link;
  }

  render() {
    const { classes, community } = this.props;
    const homeLink = `/admin/edit/${community ? community.id: null}/home`;
    const allActions = `/admin/edit/${community ? community.id: null}/all-actions`;
    const about = `/admin/edit/${community ? community.id: null}/about`;
    const contactUs = `/admin/edit/${community ? community.id: null}/contact_us`;
    const donate = `/admin/edit/${community ? community.id: null}/donate`;
    const impactPageLink = `/admin/edit/${community ? community.id: null}/impact`;
    const impactsLink = `/admin/edit/${community ? community.id: null}/impacts`;
    const teams = `/admin/edit/${community ? community.id: null}/teams`;
    const events = `/admin/edit/${community ? community.id: null}/events`;
    const vendors = `/admin/edit/${community ? community.id: null}/vendors`;
    const testimonials = `/admin/edit/${community ? community.id: null}/testimonials`;

    return (
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        direction="row"
        spacing={16}

      >
        <Grid item md={12} sm={12} xs={12} style={{ marginTop: -35, }}>
          <Paper className={classes.root} elevation={1} style={{ padding: 50 }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '300' }}>Edit this community's pages here</h1>

            <Paper onClick={() => this.goHere(homeLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                HOME PAGE
                {' '}
                <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(impactsLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                COMMUNITY IMPACT DATA
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(impactPageLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                IMPACT PAGE
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(about)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ABOUT PAGE
                {' '}
                <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(donate)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                DONATE PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(contactUs)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                CONTACT US PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(allActions)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ALL ACTIONS PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(teams)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ALL TEAMS PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(events)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ALL EVENTS PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(testimonials)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ALL TESTIMONIALS PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

            <Paper onClick={() => this.goHere(vendors)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                ALL SERVICE PROVIDERS PAGE 
                {' '}
                <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
              </Typography>
            </Paper>

          </Paper>

        </Grid>
      </Grid>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Pages);
