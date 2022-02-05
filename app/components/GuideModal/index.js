import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import AssignmentIcon from '@material-ui/icons/Assignment';
import styles from './guide-jss';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class GuideModal extends React.Component {
  handleClose = () => {
    const { closeGuide } = this.props;
    closeGuide();
  }

  render() {
    const {
      classes,
      openGuide,
      closeGuide
    } = this.props;

    return (
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={openGuide}
        onClose={closeGuide}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.root}
      >
        <DialogContent className={classes.rootContent}>
          <Typography variant="h4" align="center">Need Help?</Typography>
          {/*<Typography variant="body1" align="center">We have a variety of resources.</Typography> */}
          <Typography variant="body1" align="center">Take advantage of these helpful resources:</Typography>
          <Button className={classes.button}
            href="https://docs.google.com/document/d/1Xo7gn4wMRUpoTDlo7O2dfJL1THvMxl1jHFkH2OS7Vf8/edit?usp=sharing" target="_blank">
            <AssignmentIcon /> &nbsp; Written Guides
          </Button>
          {/* <Button className={classes.button}
            href="https://docs.google.com/document/d/1M4FZHv0PeXglXIS3esieDD330bCrg8wfK5Mju5FBt1w/edit?usp=sharing" target="_blank">
            <VideoLibraryIcon /> &nbsp; Video Tutorials
          </Button> */}
        </DialogContent>
      </Dialog>
    );
  }
}

GuideModal.propTypes = {
  openGuide: PropTypes.bool.isRequired,
  closeGuide: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(GuideModal);
