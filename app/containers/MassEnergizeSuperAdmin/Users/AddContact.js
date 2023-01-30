import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import Add from '@mui/icons-material/Add';
import FloatingPanel from 'dan-components/Panel/FloatingPanel';
import AddContactForm from './AddContactForm';
import styles from './contact-jss';

class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '',
      files: []
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(filesVal) {
    const { files } = this.state;
    let oldFiles = files;
    const filesLimit = 2;
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      console.log('Cannot upload more than ' + filesLimit + ' items.');
    } else {
      this.setState({ img: filesVal[0].preview || '/pic' + filesVal[0].path });
    }
  }

  sendValues = (values) => {
    const { submit } = this.props;
    const { img } = this.state;
    setTimeout(() => {
      submit(values, img);
      this.setState({ img: '' });
    }, 500);
  }

  render() {
    const {
      classes,
      openForm,
      closeForm,
      avatarInit,
      addContact
    } = this.props;
    const { img } = this.state;
    const branch = '';
    return (
      <div>
        <Tooltip title="Add New Contact">
          <Fab color="secondary" onClick={() => addContact()} className={classes.addBtn}>
            <Add />
          </Fab>
        </Tooltip>
        <FloatingPanel openForm={openForm} branch={branch} closeForm={closeForm}>
          <AddContactForm
            onSubmit={this.sendValues}
            onDrop={this.onDrop}
            imgAvatar={img === '' ? avatarInit : img}
          />
        </FloatingPanel>
      </div>
    );
  }
}

AddContact.propTypes = {
  classes: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  addContact: PropTypes.func.isRequired,
  openForm: PropTypes.bool.isRequired,
  avatarInit: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default withStyles(styles)(AddContact);
