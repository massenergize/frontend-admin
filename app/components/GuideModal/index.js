import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AssignmentIcon from "@mui/icons-material/Assignment";
import styles from "./guide-jss";
import { Link } from "@mui/material";

// const adminWrittenInstructionsLink = "https://docs.google.com/document/d/e/2PACX-1vT2ahP7U1gWS5ktfr7nG9CdH8cCazVo9qzOLHB5Ook2GhKD79GOWxRgvv-pOQRkIT1mogcAhzM8T5wE/pub"
const adminWrittenInstructionsLink = "https://resources.massenergize.org/courses/admin-training";
const adminVideoInstructionsLink = null;
const adminResourceCenterLink = "https://resources.massenergize.org/collections";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class GuideModal extends React.Component {
  handleClose = () => {
    const { closeGuide } = this.props;
    closeGuide();
  };

  render() {
    const { classes, openGuide, closeGuide } = this.props;

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
          <Typography
            variant="h4"
            align="center"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "left"
            }}
          >
            Need Help
          </Typography>
          {/*<Typography variant="body1" align="center">We have a variety of resources.</Typography> */}
          <Typography
            variant="body1"
            style={{
              margin: "10px 0px",
              textAlign: "left"
            }}
          >
            Visit our{" "}
            <Button
              target="_blank"
              style={{
                textTransform: "capitalize",
                fontSize: "1rem",
                padding: "0px 5px"
              }}
              href={adminResourceCenterLink}
            >
              Resource Center,
            </Button>
            check out the
            <Button
              style={{
                textTransform: "capitalize",
                fontSize: "1rem",
                padding: "0px 5px"
              }}
              href={adminWrittenInstructionsLink}
              target="_blank"
            >
              {" "}
              Website Admin Training course,
            </Button>{" "}
            and sign up by emailing{" "}
            <Button
              style={{
                textTransform: "lowercase",
                fontSize: "1rem",
                padding: "2px 5px"
              }}
              href={`mailto:support@massenergize.org`}
              target="_blank"
            >
              support@massenergize.org
            </Button>
          </Typography>
          {/* {adminWrittenInstructionsLink ? (
            <Button
              className={classes.button}
              href={adminWrittenInstructionsLink}
              target="_blank"
              style={{ margin: 0 }}
            >
              <AssignmentIcon /> &nbsp; Written Guides
            </Button>
          ) : null}
          {adminVideoInstructionsLink ? (
            <Button
              className={classes.button}
              href={adminVideoInstructionsLink}
              target="_blank"
            >
              <VideoLibraryIcon /> &nbsp; Video Tutorials
            </Button>
          ) : null} */}
        </DialogContent>
      </Dialog>
    );
  }
}

GuideModal.propTypes = {
  openGuide: PropTypes.bool.isRequired,
  closeGuide: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(GuideModal);
