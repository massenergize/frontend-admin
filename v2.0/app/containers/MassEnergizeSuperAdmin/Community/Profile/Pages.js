import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import datas from 'dan-api/apps/connectionData';
import ProfileCard from 'dan-components/CardPaper/ProfileCard';
import styles from './profile-jss';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
class Pages extends React.Component {

  goHere(link){
    window.location = link;
  }
  render() {
    const { classes, community } = this.props;
    const homeLink =`/admin/edit/${community? community.id: null}/home`;
    const allActions =`/admin/edit/${community? community.id: null}/all-actions`;
    const about =`/admin/edit/${community? community.id: null}/about`;
    const contactUs =`/admin/edit/${community? community.id: null}/contact_us`;
    const donate =`/admin/edit/${community? community.id: null}/donate`;

    return (
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        direction="row"
        spacing={16}
      
      >
        <Grid item md={12} sm={12} xs={12} style={{ marginTop: -35,  }}>
          <Paper className={classes.root} elevation={1} style={{padding: 50}}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '300' }}>Edit this community's pages here</h1>
            <Paper  onClick ={()=>this.goHere(homeLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{fontWeight:'600'}} component="h3">
                HOME PAGE <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
            </Typography>
            </Paper>
            <Paper onClick ={()=>this.goHere(allActions)}className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{fontWeight:'600'}} component="h3">
                ALL ACTIONS PAGE <Icon style={{paddingTop:3, color:'green'}}>forward</Icon>
            </Typography>
            </Paper>
            <Paper onClick ={()=>this.goHere(about)}className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{fontWeight:'600'}} component="h3">
                ABOUT PAGE <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
            </Typography>
            </Paper>
            <Paper onClick ={()=>this.goHere(contactUs)}className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{fontWeight:'600'}} component="h3">
                CONTACT US PAGE <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
            </Typography>
            </Paper>
            <Paper onClick ={()=>this.goHere(donate)}className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{fontWeight:'600'}} component="h3">
                DONATE PAGE <Icon style={{paddingTop:3, color:"green"}}>forward</Icon>
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
