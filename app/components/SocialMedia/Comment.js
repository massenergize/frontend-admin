import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@mui/material/Typography';
import Type from 'dan-styles/Typography.scss';
import { withStyles } from "@mui/styles";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Send from '@mui/icons-material/Send';
import Input from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
// import withMobileDialog from '@mui/material/withMobileDialog';
import dummy from 'dan-api/dummy/dummyContents';
import styles from './jss/socialMedia-jss';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Comment extends React.Component {
  state = {
    comment: ''
  };

  handleChange = event => {
    this.setState({ comment: event.target.value });
  };

  handleSubmit = comment => {
    const { submitComment } = this.props;
    submitComment(comment);
    this.setState({ comment: '' });
  }

  render() {
    const {
      open,
      handleClose,
      classes,
      dataComment,
      fullScreen
    } = this.props;
    const { comment } = this.state;
    const getItem = dataArray => dataArray.map(data => (
      <Fragment key={data.get('id')}>
        <ListItem>
          <div className={classes.commentContent}>
            <div className={classes.commentHead}>
              <Avatar alt="avatar" src={data.get('avatar')} className={classes.avatarComment} />
              <section>
                <Typography variant="subtitle1">{data.get('from')}</Typography>
                <Typography variant="caption"><span className={classNames(Type.light, Type.textGrey)}>{data.get('date')}</span></Typography>
              </section>
            </div>
            <Typography className={classes.commentText}>{data.get('message')}</Typography>
          </div>
        </ListItem>
        <Divider />
      </Fragment>
    ));

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">
            <CommentIcon />
            &nbsp;
            {dataComment !== undefined && dataComment.size}
            &nbsp;
            Comment
            {dataComment !== undefined && dataComment.size > 1 ? 's' : ''}
            <IconButton onClick={handleClose} className={classes.buttonClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <List>
              {dataComment !== undefined && getItem(dataComment)}
            </List>
          </DialogContent>
          <DialogActions className={classes.commentAction}>
            <div className={classes.commentForm}>
              <Avatar alt="avatar" src={dummy.user.avatar} className={classes.avatarMini} />
              <Input
                placeholder="Write Comment"
                onChange={this.handleChange}
                value={comment}
                className={classes.input}
                inputProps={{
                  'aria-label': 'Comment',
                }}
              />
              <Fab size="small" onClick={() => this.handleSubmit(comment)} color="secondary" aria-label="send" className={classes.button}>
                <Send />
              </Fab>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Comment.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  dataComment: PropTypes.object,
  fullScreen: PropTypes.bool.isRequired,
};

Comment.defaultProps = {
  dataComment: undefined
};

const CommentResponsive = (Comment);
export default withStyles(styles)(CommentResponsive);
