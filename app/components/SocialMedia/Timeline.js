import React, { Fragment } from 'react';
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
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Comment from './Comment';
import styles from './jss/timeline-jss';

const optionsOpt = [
  'Option 1',
  'Option 2',
  'Option 3',
];

const ITEM_HEIGHT = 48;

class Timeline extends React.Component {
  state = {
    anchorElOpt: null,
    openComment: false,
  };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = () => {
    this.setState({ anchorElOpt: null });
  };

  handleOpenComment = (data) => {
    const { fetchComment } = this.props;
    fetchComment(data);
    this.setState({ openComment: true });
  };

  handleCloseComment = () => {
    this.setState({ openComment: false });
  };

  render() {
    const {
      classes,
      dataTimeline,
      onlike,
      commentIndex,
      submitComment,
    } = this.props;
    const { anchorElOpt, openComment } = this.state;
    const getItem = dataArray => dataArray.map(data => (
      <li key={data.get('id')}>
        <div className={classes.iconBullet}>
          <Tooltip id={'tooltip-icon-' + data.get('id')} title={data.get('time')}>
            <Icon className={classes.icon}>
              {data.get('icon')}
            </Icon>
          </Tooltip>
        </div>
        <Card className={classes.cardSocmed}>
          <CardHeader
            avatar={
              <Avatar alt="avatar" src={data.get('avatar')} className={classes.avatar} />
            }
            action={(
              <IconButton
                aria-label="More"
                aria-owns={anchorElOpt ? 'long-menu' : null}
                aria-haspopup="true"
                className={classes.button}
                onClick={this.handleClickOpt}
              >
                <MoreVertIcon />
              </IconButton>
            )}
            title={data.get('name')}
            subheader={data.get('date')}
          />
          { data.get('image') !== '' && (
            <CardMedia
              className={classes.media}
              image={data.get('image')}
              title={data.get('name')}
            />
          )}
          <CardContent>
            <Typography component="p">
              {data.get('content')}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Like this" onClick={() => onlike(data)}>
              <FavoriteIcon className={data.get('liked') ? classes.liked : ''} />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <div className={classes.rightIcon}>
              <Typography variant="caption" component="span">
                {data.get('comments') !== undefined ? data.get('comments').size : 0}
              </Typography>
              <IconButton aria-label="Comment" onClick={() => this.handleOpenComment(data)}>
                <CommentIcon />
              </IconButton>
            </div>
          </CardActions>
        </Card>
      </li>
    ));
    return (
      <Fragment>
        <Menu
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
            <MenuItem key={option} onClick={this.handleCloseOpt}>
              {option}
            </MenuItem>
          ))}
        </Menu>
        <Comment
          open={openComment}
          handleClose={this.handleCloseComment}
          submitComment={submitComment}
          // dataComment={dataTimeline.getIn([commentIndex, 'comments'])}
          dataComment="Test"
        />
        <ul className={classes.timeline}>
          {getItem(dataTimeline)}
        </ul>
      </Fragment>
    );
  }
}

Timeline.propTypes = {
  classes: PropTypes.object.isRequired,
  // onlike: PropTypes.func,
  // dataTimeline: PropTypes.object.isRequired,
  // fetchComment: PropTypes.func,
  // submitComment: PropTypes.func,
  // commentIndex: PropTypes.number,
};

Timeline.defaultProps = {
  onlike: () => (false),
  fetchComment: () => {},
  submitComment: () => {},
  commentIndex: 0,
};

export default withStyles(styles)(Timeline);
