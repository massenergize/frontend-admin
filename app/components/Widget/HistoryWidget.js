import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

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

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class HistoryWidget extends PureComponent {
  state = {
    value: 0,
  };

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <PapperBlock whiteBg noMargin title="Trade History" icon="ios-swap" desc="">
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Buy" />
            <Tab label="Sell" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir="ltr">
            <div className={classes.tabContainer}>
              <div className={classes.rootTable}>
                <Table padding="none" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="dense">Date</TableCell>
                      <TableCell padding="dense">Coin</TableCell>
                      <TableCell align="right" padding="dense">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(n => ([
                      <TableRow key={n.id}>
                        <TableCell padding="dense">
                          {n.time}
                        </TableCell>
                        <TableCell padding="dense">
                          <Typography variant="subtitle1">
                            {n.market}
                          </Typography>
                          <Typography variant="caption">
                            $&nbsp;
                            {n.price}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" padding="dense">
                          <Typography variant="subtitle1">
                            $&nbsp;
                            {n.total}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ]))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabContainer>
          <TabContainer dir="ltr">
            <div className={classes.tabContainer}>
              <div className={classes.rootTable}>
                <Table padding="none" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="dense">Date</TableCell>
                      <TableCell padding="dense">Coin</TableCell>
                      <TableCell align="right" padding="dense">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(n => ([
                      <TableRow key={n.id}>
                        <TableCell padding="dense">
                          {n.time}
                        </TableCell>
                        <TableCell padding="dense">
                          <Typography variant="subtitle1">
                            {n.market}
                          </Typography>
                          <Typography variant="caption">
                            $&nbsp;
                            {n.price}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" padding="dense">
                          <Typography variant="subtitle1">
                            $&nbsp;
                            {n.total}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ]))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabContainer>
        </SwipeableViews>
      </PapperBlock>
    );
  }
}

HistoryWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryWidget);
