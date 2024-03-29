import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import { withStyles } from "@mui/styles";
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import css from 'dan-styles/Table.scss';
import EditableCell from './EditableCell';
import SelectableCell from './SelectableCell';
import ToggleCell from './ToggleCell';
import DatePickerCell from './DatePickerCell';
import TimePickerCell from './TimePickerCell';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class Row extends React.Component {
  render() {
    const {
      classes,
      anchor,
      item,
      removeRow,
      updateRow,
      editRow,
      finishEditRow,
      branch
    } = this.props;
    const eventDel = () => {
      removeRow(item, branch);
    };
    const eventEdit = () => {
      editRow(item, branch);
    };
    const eventDone = () => {
      finishEditRow(item, branch);
    };
    const renderCell = dataArray => dataArray.map((itemCell, index) => {
      if (itemCell.name !== 'action' && !itemCell.hidden) {
        const inputType = anchor[index].type;
        switch (inputType) {
          case 'selection':
            return (
              <SelectableCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: itemCell.name,
                  value: item.get(itemCell.name),
                  id: item.get('id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                options={anchor[index].options}
                branch={branch}
              />
            );
          case 'toggle':
            return (
              <ToggleCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: itemCell.name,
                  value: item.get(itemCell.name),
                  id: item.get('id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          case 'date':
            return (
              <DatePickerCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: itemCell.name,
                  value: item.get(itemCell.name),
                  id: item.get('id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          case 'time':
            return (
              <TimePickerCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: itemCell.name,
                  value: item.get(itemCell.name),
                  id: item.get('id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          default:
            return (
              <EditableCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: itemCell.name,
                  value: item.get(itemCell.name),
                  id: item.get('id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                inputType={inputType}
                branch={branch}
              />
            );
        }
      }
      return false;
    });
    return (
      <tr className={item.get('edited') ? css.editing : ''}>
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
            onClick={() => eventDone(this)}
            color="secondary"
            className={classNames((!item.get('edited') ? css.hideAction : ''), classes.button)}
            aria-label="Done"
          >
            <DoneIcon />
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

Row.propTypes = {
  classes: PropTypes.object.isRequired,
  anchor: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired
};

export default withStyles(styles)(Row);
