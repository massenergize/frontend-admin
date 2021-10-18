import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import CardGiftcard from '@material-ui/icons/CardGiftcard';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import FlareIcon from '@material-ui/icons/Flare';
import Computer from '@material-ui/icons/Computer';
import Toys from '@material-ui/icons/Toys';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Style from '@material-ui/icons/Style';
import Typography from '@material-ui/core/Typography';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import cyan from '@material-ui/core/colors/cyan';
import pink from '@material-ui/core/colors/pink';
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
import PapperBlock from 'dan-components/PapperBlock/PapperBlock';
import styles from './widget-jss';
import LinearBuffer from '../../../../components/Massenergize/LinearBuffer';

const color = ({
  primary: colorfull[6],
  secondary: colorfull[3],
  third: colorfull[2],
  fourth: colorfull[4],
});

const colorsPie = [purple[500], blue[500], cyan[500], pink[500]];

const transformActionsCompletedData = (actionsCompletedData) => {
  if (!actionsCompletedData) return [];
  const res = {};
  const communities = [];
  actionsCompletedData.forEach(c => {
    const data = Object.values(c)[0];
    const commName = Object.keys(c)[0];
    communities.push(commName);
    data.forEach(t => {
      if (t.name in res) {
        res[t.name][commName] = t.value + t.reported_value;
      } else {
        res[t.name] = { name: t.name };
        res[t.name][commName] = t.value + t.reported_value;
      }
    });
  });

  return [communities, Object.values(res)];
};

const transformCommunitiesImpactData = (communitiesImpactData) => {
  if (!communitiesImpactData) return [];
  const res = [];
  const communities = [];
  communitiesImpactData.forEach(c => {
    const commName = c.community.name;
    communities.push(commName);
    res.push({ name: commName, value: c.households_engaged });
  });

  return [communities, res];
};


class ActionsChartWidget extends PureComponent {
  render() {
    const {
      classes,
      data
    } = this.props;

    const { actions_completed, communities_impact } = data;
    const [communities, dataToGraph] = transformActionsCompletedData(actions_completed);
    const texts = [classes.indigoText, classes.tealText, classes.blueText, classes.orangeText];
    const avatarColor = [classes.indigoAvatar, classes.tealAvatar, classes.blueAvatar, classes.orangeAvatar];
    const colors = [color.primary, color.secondary, color.third, color.fourth];
    const [householdsEngagedCommunities, householdsEngagedData] = transformCommunitiesImpactData(communities_impact);

    if (!communities && !dataToGraph) {
      return (
        <PapperBlock whiteBg noMargin title="Community Engagement" icon="ios-stats-outline" desc="">
          <Grid container spacing={16}>
            <LinearBuffer />
          </Grid>
        </PapperBlock>
      );
    }
    return (
      <PapperBlock whiteBg noMargin title="Community Engagement" icon="ios-stats-outline" desc="">
        <Grid container spacing={16}>
          <Grid item md={8} xs={12}>
            <ul className={classes.bigResume}>
              {communities && communities.map((c, i) => (
                <li key={c}>
                  <Avatar className={classNames(classes.avatar, avatarColor[i % avatarColor.length])}>
                    <FlareIcon />
                  </Avatar>
                  <Typography variant="h6">
                    <span className={avatarColor[i % texts.length]}>{' '}</span>
                    <Typography>{c}</Typography>
                  </Typography>
                </li>
              ))}
            </ul>
            <div className={classes.chartWrap}>
              <div className={classes.chartFluid}>
                <ResponsiveContainer>
                  <BarChart
                    data={dataToGraph}
                  >
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis axisLine={false} tickSize={3} tickLine={false} tick={{ stroke: 'none' }} />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <CartesianAxis />
                    <Tooltip />
                    {communities && communities.map((c, i) => (
                      <Bar key={c} dataKey={c} fill={colors[i % colors.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography className={classes.smallTitle} variant="button">
              <CardGiftcard className={classes.leftIcon} />
              Households Engaged
            </Typography>
            <Divider className={classes.divider} />
            <Grid container className={classes.secondaryWrap}>
              <PieChart width={300} height={300}>
                <Pie
                  data={householdsEngagedData}
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
                    householdsEngagedData.map((entry, index) => <Cell key={index.toString()} fill={colorsPie[index % colorsPie.length]} />)
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

ActionsChartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionsChartWidget);
