import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import styles from './guide-jss';

const adminWrittenInstructionsLink = "https://docs.google.com/document/d/e/2PACX-1vT2ahP7U1gWS5ktfr7nG9CdH8cCazVo9qzOLHB5Ook2GhKD79GOWxRgvv-pOQRkIT1mogcAhzM8T5wE/pub"
const adminVideoInstructionsLink = null

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
          { adminWrittenInstructionsLink ? (
            <Button className={classes.button}
              href={adminWrittenInstructionsLink} target="_blank">
              <AssignmentIcon /> &nbsp; Written Guides
            </Button>
           ) : null }
          { adminVideoInstructionsLink ? (
            <Button className={classes.button}
              href={adminVideoInstructionsLink} target="_blank">
              <VideoLibraryIcon /> &nbsp; Video Tutorials
            </Button>
          ) : null }
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
