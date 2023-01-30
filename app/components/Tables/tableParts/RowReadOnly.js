import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import { withStyles } from "@mui/styles";
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';
import css from 'dan-styles/Table.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/BorderColor';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class RowReadOnly extends React.Component {
  render() {
    const {
      anchor,
      classes,
      item,
      removeRow,
      editRow,
      branch
    } = this.props;
    const eventDel = () => {
      removeRow(item, branch);
    };
    const eventEdit = () => {
      editRow(item, branch);
    };
    const renderCell = dataArray => dataArray.map((itemCell, index) => {
      if (itemCell.name !== 'action' && !itemCell.hidden) {
        return (
          <TableCell padding="none" key={index.toString()}>
            {item.get(itemCell.name) !== undefined ? item.get(itemCell.name).toString() : ''}
          </TableCell>
        );
      }
      return false;
    });
    return (
      <tr>
        {renderCell(anchor)}
        <TableCell padding="none">
          <IconButton
            onClick={() => eventEdit(this)}
            className={classNames((item.get('edited') ? css.hideAction : ''), classes.button)}
            aria-label="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => eventDel(this)}
            className={classes.button}
            aria-label="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </tr>
    );
  }
}

RowReadOnly.propTypes = {
  anchor: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  removeRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired,
};

export default withStyles(styles)(RowReadOnly);
