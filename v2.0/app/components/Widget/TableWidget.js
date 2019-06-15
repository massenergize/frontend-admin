import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import messageStyles from 'dan-styles/Messages.scss';
import progressStyles from 'dan-styles/Progress.scss';
import imgApi from 'dan-api/images/photos';
import avatarApi from 'dan-api/images/avatars';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './widget-jss';

function createData(id, name, date, total, avatar, buyerName, photo, type, currentStock, totalStock, status, statusMessage) {
  return {
    id,
    name,
    date,
    total,
    avatar,
    buyerName,
    photo,
    type,
    currentStock,
    totalStock,
    status,
    statusMessage,
  };
}

const data = [
  createData('QWE123', 'Woman Bag', '23 Oct 2018', 300, avatarApi[6], 'John Doe', imgApi[21], 'blur_on', 14, 30, 'Error', 'Canceled'),
  createData('ABC890', 'Laptop', '11 Nov 2018', 230, avatarApi[8], 'Jim Doe', imgApi[29], 'computer', 25, 70, 'Success', 'Sent'),
  createData('GHI556', 'Pinapple Jam', '5 Nov 2018', 34, avatarApi[2], 'Jane Doe', imgApi[25], 'restaurant_menu', 35, 50, 'Warning', 'Pending'),
  createData('MNO444', 'Action Figure', '22 Sept 2018', 17, avatarApi[9], 'Jack Doe', imgApi[30], 'toys', 9, 85, 'Info', 'Paid'),
  createData('JKL345', 'Man Shoes', '19 Sept 2018', 208, avatarApi[5], 'Jessica Doe', imgApi[22], 'blur_on', 18, 33, 'Default', 'Returned'),
];

function TableWidget(props) {
  const { classes } = props;
  const getStatus = status => {
    switch (status) {
      case 'Error': return messageStyles.bgError;
      case 'Warning': return messageStyles.bgWarning;
      case 'Info': return messageStyles.bgInfo;
      case 'Success': return messageStyles.bgSuccess;
      default: return messageStyles.bgDefault;
    }
  };
  const getProgress = status => {
    switch (status) {
      case 'Error': return progressStyles.bgError;
      case 'Warning': return progressStyles.bgWarning;
      case 'Info': return progressStyles.bgInfo;
      case 'Success': return progressStyles.bgSuccess;
      default: return progressStyles.bgDefault;
    }
  };
  return (
    <PapperBlock noMargin title="Latest Sales" icon="ios-share-outline" whiteBg desc="Monitoring Your products. Tracking sales, and shipping status here.">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Products</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Avatar alt={n.name} src={n.photo} className={classes.productPhoto} />
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                      <Typography variant="subtitle1">{n.name}</Typography>
                      <a href="/app/pages/invoice" className={classes.downloadInvoice}>
                        <ArrowDownward />
                        &nbsp;INVOICE_
                        {n.id}
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <Avatar alt={n.buyerName} src={n.avatar} className={classNames(classes.avatar, classes.sm)} />
                    <div>
                      <Typography>{n.buyerName}</Typography>
                      <Typography variant="caption">
                        Purchased date:&nbsp;
                        {n.date}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="button">
                    $
                    {n.total}
                    ,00
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.statusMessage} className={classNames(classes.chip, getStatus(n.status))} />
                </TableCell>
                <TableCell>
                  <div className={classes.taskStatus}>
                    <Icon className={classes.taskIcon}>{n.type}</Icon>
                    <Typography variant="caption">
                      {n.currentStock}
                      &nbsp;/&nbsp;
                      {n.totalStock}
                    </Typography>
                  </div>
                  <LinearProgress variant="determinate" className={getProgress(n.status)} value={(n.currentStock / n.totalStock) * 100} />
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  );
}

TableWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableWidget);
