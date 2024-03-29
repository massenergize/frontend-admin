import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Grid from '@mui/material/Grid';
import classNames from 'classnames';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Computer from '@mui/icons-material/Computer';
import Toys from '@mui/icons-material/Toys';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Style from '@mui/icons-material/Style';
import Typography from '@mui/material/Typography';
import purple from '@mui/material/colors/purple';
import blue from '@mui/material/colors/blue';
import cyan from '@mui/material/colors/cyan';
import pink from '@mui/material/colors/pink';
import colorfull from 'dan-api/palette/colorfull';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart, Pie, Cell,
  Legend
} from 'recharts';
import { dataSales } from 'dan-api/chart/chartData';
import { data2 } from 'dan-api/chart/chartMiniData';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

const color = ({
  primary: colorfull[6],
  secondary: colorfull[3],
  third: colorfull[2],
  fourth: colorfull[4],
});

const colorsPie = [purple[500], blue[500], cyan[500], pink[500]];

class SalesChartWidget extends PureComponent {
  render() {
    const {
      classes,
    } = this.props;
    return (
      <PapperBlock whiteBg noMargin title="Product Sales Stats" icon="ios-stats-outline" desc="">
        <Grid container spacing={16}>
          <Grid item md={8} xs={12}>
            <ul className={classes.bigResume}>
              <li>
                <Avatar className={classNames(classes.avatar, classes.indigoAvatar)}>
                  <LocalLibrary />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.indigoText}>4321</span>
                  <Typography>Fashions</Typography>
                </Typography>
              </li>
              <li>
                <Avatar className={classNames(classes.avatar, classes.tealAvatar)}>
                  <Computer />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.tealText}>9876</span>
                  <Typography>Electronics</Typography>
                </Typography>
              </li>
              <li>
                <Avatar className={classNames(classes.avatar, classes.blueAvatar)}>
                  <Toys />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.blueText}>345</span>
                  <Typography>Toys</Typography>
                </Typography>
              </li>
              <li>
                <Avatar className={classNames(classes.avatar, classes.orangeAvatar)}>
                  <Style />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.orangeText}>1021</span>
                  <Typography>Vouchers</Typography>
                </Typography>
              </li>
            </ul>
            <div className={classes.chartWrap}>
              <div className={classes.chartFluid}>
                <ResponsiveContainer>
                  <BarChart
                    data={dataSales}
                  >
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis axisLine={false} tickSize={3} tickLine={false} tick={{ stroke: 'none' }} />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <CartesianAxis />
                    <Tooltip />
                    <Bar dataKey="Fashions" fill={color.primary} />
                    <Bar dataKey="Electronics" fill={color.secondary} />
                    <Bar dataKey="Toys" fill={color.third} />
                    <Bar dataKey="Vouchers" fill={color.fourth} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography className={classes.smallTitle} variant="button">
              <CardGiftcard className={classes.leftIcon} />
              Today Sales
            </Typography>
            <Divider className={classes.divider} />
            <Grid container className={classes.secondaryWrap}>
              <PieChart width={300} height={300}>
                <Pie
                  data={data2}
                  cx={150}
                  cy={100}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#FFFFFF"
                  paddingAngle={5}
                  label
                >
                  {
                    data2.map((entry, index) => <Cell key={index.toString()} fill={colorsPie[index % colorsPie.length]} />)
                  }
                </Pie>
                <Legend iconType="circle" verticalALign="bottom" iconSize={10} />
              </PieChart>
            </Grid>
          </Grid>
        </Grid>
      </PapperBlock>
    );
  }
}

SalesChartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SalesChartWidget);
