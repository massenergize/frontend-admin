import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import styles from './guide-jss';
import MetricsPrefs from './MetricsPrefs';


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MetricsModal extends React.Component {
  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  render() {
    const {
      classes,
      openModal,
      closeModal, 
      communities,
      featureToEdit,
      featureFlags,
    } = this.props;

    return (
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={openModal}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.root}
      >
        <DialogContent className={classes.rootContent}>
          <Typography variant="h4" align="center">{"All Metrics CSV  Download"}</Typography>
          
          <MetricsPrefs
          communities={communities}
          featureFlags={featureFlags}
          featureToEdit={featureToEdit}
          handleClose={this.handleClose}
        />
        </DialogContent>
      </Dialog>
    );
  }
}

MetricsModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MetricsModal);
