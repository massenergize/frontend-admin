import React from 'react'
import { Grid, CircularProgress, Paper, LinearProgress} from "@mui/material";
import { makeStyles } from '@mui/styles';
import styles from "../../../components/Widget/widget-jss";
// ../../../components/Widget/widget-jss
const useStyles = makeStyles(styles);

export default function Loader(props) {
    const classes = useStyles(props);
  return (
    <Grid>
      <Grid item xs={12} md={4}>
        <center>
          <Paper className={classes.root} style={{ padding: 15 }}>
            <div className={classes.root}>
              {/* <CircularProgress size={"6rem"} /> */}
              <CircularProgress
                className={classes.circularProgress}
                size={90}
                thickness={2}
                color="secondary"
              />
              <br />
              <h1>{props.message || "Please wait as we load your data."}</h1>
            </div>
          </Paper>
        </center>
      </Grid>
    </Grid>
  );
}
