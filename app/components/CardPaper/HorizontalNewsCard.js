import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { withStyles } from "@mui/styles";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styles from './cardStyle-jss';

class HorizontalNewsCard extends React.Component {
  render() {
    const {
      classes,
      thumbnail,
      title,
      desc,
    } = this.props;
    return (
      <Card className={classes.newsList}>
        <CardContent className={classes.newsListContent}>
          <Typography noWrap gutterBottom variant="h5" className={classes.title} component="h2">
            {title}
          </Typography>
          <Typography component="p" className={classes.desc}>
            {desc}
          </Typography>
          <div className={classes.actionArea}>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Read More
            </Button>
          </div>
        </CardContent>
        <CardMedia
          className={classes.mediaNews}
          image={thumbnail}
          title={title}
        />
      </Card>
    );
  }
}

HorizontalNewsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default withStyles(styles)(HorizontalNewsCard);
