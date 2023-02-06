import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Card, CardActions, CardContent } from "@mui/material";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Comment from '@mui/icons-material/Comment';
import styles from './cardStyle-jss';
class GeneralCard extends React.Component {
  render() {
    const {
      classes,
      children,
      liked,
      shared,
      commented
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          {children}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites" className={classes.button}>
            <FavoriteIcon className={liked > 0 && classes.liked} />
            <span className={classes.num}>{liked}</span>
          </IconButton>
          <IconButton aria-label="Share" className={classes.button}>
            <ShareIcon className={shared > 0 && classes.shared} />
            <span className={classes.num}>{shared}</span>
          </IconButton>
          <IconButton aria-label="Comment" className={classes.rightIcon}>
            <Comment />
            <span className={classes.num}>{commented}</span>
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

GeneralCard.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  liked: PropTypes.number.isRequired,
  shared: PropTypes.number.isRequired,
  commented: PropTypes.number.isRequired,
};

export default withStyles(styles)(GeneralCard);
