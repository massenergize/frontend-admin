import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Comment from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './cardStyle-jss';

const optionsOpt = [
  'Report this post',
  'Hide this post',
  'Copy link',
];

const ITEM_HEIGHT = 48;

class PostCard extends React.Component {
  state = { anchorElOpt: null };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = () => {
    this.setState({ anchorElOpt: null });
  };

  render() {
    const {
      classes,
      avatar,
      name,
      date,
      image,
      content,
      liked,
      shared,
      commented,
      data1,
      data2,
      data3
    } = this.props;
    const { anchorElOpt } = this.state;
    return (
      <Card className={classes.cardSocmed}>
        <CardHeader
          avatar={
            <Avatar alt="avatar" src={avatar} className={classes.avatar} />
          }
          action={(
            <IconButton
              aria-label="More"
              aria-owns={anchorElOpt ? 'long-menu' : null}
              aria-haspopup="true"
              className={classes.button}
              onClick={this.handleClickOpt}
            >
              {/* <MoreVertIcon /> */}
            </IconButton>
          )}
          title={name}
          subheader={date}
        />
        {/* <Menu
          id="long-menu"
          anchorEl={anchorElOpt}
          open={Boolean(anchorElOpt)}
          onClose={this.handleCloseOpt}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {optionsOpt.map(option => (
            <MenuItem key={option} selected={option === 'Edit Profile'} onClick={this.handleCloseOpt}>
              {option}
            </MenuItem>
          ))}
        </Menu> */}
        { image !== '' && (
          <CardMedia
            className={classes.media}
            image={image}
            title="Contemplative Reptile"
          />
        )}
        <CardContent>
          <Typography component="p">
            {content}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography component="p">
            
            {data1}
            <br />
            {data2}
            <br />
            {data3}
          </Typography>
        </CardContent>
        {/* <CardActions className={classes.actions} disableActionSpacing>
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
        </CardActions> */}
      </Card>
    );
  }
}

PostCard.propTypes = {
  classes: PropTypes.object.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  image: PropTypes.string,
  content: PropTypes.string.isRequired,
  // liked: PropTypes.number.isRequired,
  // shared: PropTypes.number.isRequired,
  // commented: PropTypes.number.isRequired,
};

PostCard.defaultProps = {
  image: ''
};

export default withStyles(styles)(PostCard);
