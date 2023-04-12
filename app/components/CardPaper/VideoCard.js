import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './cardStyle-jss';

class VideoCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const {
      classes,
      title,
      cover,
      date
    } = this.props;

    return (
      <Card className={classes.cardSocmed}>
        <CardMedia
          className={classes.media}
          image={cover}
          title={title}
        >
          <IconButton className={classes.playBtn}><PlayArrowIcon /></IconButton>
        </CardMedia>
        <CardHeader
          avatar={(
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R
            </Avatar>
          )}
          action={(
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          )}
          title={title}
          subheader={date}
        />
      </Card>
    );
  }
}

VideoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default withStyles(styles)(VideoCard);
