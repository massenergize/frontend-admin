import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
class MySnackbarContent extends Component {
  render() {
    const {
      message,
      onClose,
      variant,
    } = this.props;

    return (
      <Alert
        onClose={onClose}
        severity={variant || "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <small style={{ marginLeft: 15, fontSize: 15 }}>{message}</small>
      </Alert>
    );
  }
}

MySnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};


MySnackbarContent.defaultProps = {
  onClose: () => {}
};

export default MySnackbarContent;
