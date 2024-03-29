import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import styles from 'dan-components/Tables/tableStyle-jss';
import messageStyles from 'dan-styles/Messages.scss';
import PapperBlock from '../PapperBlock/PapperBlock';

let id = 0;
function createData(time, market, price, total, get, status) {
  id += 1;
  return {
    id,
    time,
    market,
    price,
    total,
    get,
    status,
  };
}

const data = [
  createData('12 Sep 2018', 'BTC', 7324, 300, 0.053, 'Pending'),
  createData('1 Sep 2018', 'LTC', 1.2, 10, 12, 'Cancelled'),
  createData('27 Aug 2018', 'XLM', 0.78, 15, 14.3, 'Complete'),
  createData('11 Aug 201', 'ADA', 29.5, 12, 1.56, 'Pending'),
  createData('11 Aug 2018', 'BTC', 7124, 12, 1.77, 'Complete'),
];

function LatestTransactionWidget(props) {
  const { classes } = props;
  const getStatus = status => {
    switch (status) {
      case 'Cancelled': return messageStyles.bgError;
      case 'Pending': return messageStyles.bgWarning;
      case 'Info': return messageStyles.bgInfo;
      case 'Complete': return messageStyles.bgSuccess;
      default: return messageStyles.bgDefault;
    }
  };
  return (
    <PapperBlock whiteBg noMargin title="Latest Transaction" icon="ios-time-outline" desc="">
      <div className={classes.rootTable}>
        <Table padding="none" className={classes.tableSmall}>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Date</TableCell>
              <TableCell padding="dense">Coin</TableCell>
              <TableCell padding="dense">Total</TableCell>
              <TableCell padding="dense">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  {n.time}
                </TableCell>
                <TableCell padding="dense">
                  <Typography variant="subtitle1">{n.market}</Typography>
                  <Typography variant="caption">
                    $&nbsp;
                    {n.price}
                  </Typography>
                </TableCell>
                <TableCell align="right" padding="dense">
                  <Typography variant="subtitle1">
                    $
                    {n.total}
                  </Typography>
                  <Typography variant="caption">
                    {n.get}
                    &nbsp;
                    {n.market}
                  </Typography>
                </TableCell>
                <TableCell padding="none">
                  <Chip label={n.status} className={classNames(classes.tableChip, getStatus(n.status))} />
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  );
}

LatestTransactionWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LatestTransactionWidget);
