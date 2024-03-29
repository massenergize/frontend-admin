import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, ButtonBase, Hidden, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { withStyles } from "@mui/styles";
import styles from './cardStyle-jss';

class HeadlineCard extends React.Component {
  render() {
    const {
      classes,
      thumbnail,
      title,
      desc,
    } = this.props;
    return (
      <Paper className={classes.mainFeaturedPost}>
        <ButtonBase
          focusRipple
          className={classes.imageFull}
          focusVisibleClassName={classes.focusVisible}
          component={Link}
          to="/blog/article"
        >
          <div className={classes.mainFeaturedPostContent}>
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${thumbnail})`
              }}
            />
            <span className={classes.imageBackdrop} />
            <div className={classes.imageButton}>
              <Grid container>
                <Grid item md={6}>
                  <Typography component="h1" variant="h2" color="inherit" gutterBottom>
                    {title}
                  </Typography>
                  <Hidden smDown>
                    <Typography component="p" variant="subtitle1" color="inherit" paragraph>
                      {desc}
                    </Typography>
                  </Hidden>
                </Grid>
              </Grid>
            </div>
          </div>
        </ButtonBase>
      </Paper>
    );
  }
}

HeadlineCard.propTypes = {
  classes: PropTypes.object.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default withStyles(styles)(HeadlineCard);
