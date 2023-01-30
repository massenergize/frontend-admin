import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@mui/material/TextField';
import { withStyles } from "@mui/styles";
import { styles, vanish, uploadBox } from './../styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@mui/icons-material/Close';
import imgApi from 'dan-api/images/photos';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import unavailableImage from './../../../../../public/images/unavailable.jpg';
class SimpleEventCard extends React.Component {




  render() {
    const { classes } = this.props;
    const image = this.props.wholeObj.image;
    const start = this.props.wholeObj.start_date_and_time;
    const end = this.props.end_date_and_time;
    const title = this.props.title;
    return (
      <div style={{ position: 'relative' }}>
        <Paper className={classes.root} elevation={4} style={{ margin: 6, padding: 0 }}>
          <img src={image ? image.url : unavailableImage} style={{ height: 180, objectFit: 'cover', width: "100%" }} />
          <div style={{ padding: 10 }}>
            <small>{title.length > 70 ? title.length.substring(0,70)+"...": title}</small><br />
            <small><b>Starting : {start}</b></small><br />
            <small><b>Ending : {end} </b></small>
            <Fab size="small"
              onClick={() => { this.props.removeEventFxn(this.props.id) }}
              style={{ background: '#ab0a29', color: 'white', position: 'absolute', top: 15, right: 20 }}
              aria-label="add"
              className={classes.button}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(SimpleEventCard);