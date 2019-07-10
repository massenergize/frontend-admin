import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import {
  CounterChartWidget,
  // SalesChartWidget,
  CarouselWidget,
  NewsWidget,
} from 'dan-components';
import styles from './dashboard-jss';

const API_URL = 'http://localhost:8000';
// const API_URL = 'http://api.massenergize.org:8000';


class SummaryDashboard extends PureComponent {
  sendToBackEnd = (dataToSend, destinationUrl) => {
    fetch(`${API_URL}/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
    }).then(response => response.json()).then(jsonResponse => {
      const { csrfToken } = jsonResponse.data;
      console.log(csrfToken);
      return fetch(destinationUrl, {
        credentials: 'include',
        method: 'POST',
        headers: {
          // Accept: 'application/json',
          // 'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(dataToSend)
      })
        .then(response => response.json()).then(data => {
          console.log(data);
        });
    }).catch(error => {
      console.log(error.message);
    });
  }

  render() {
    const title = brand.name + ' - Summary Dashboard';
    const description = brand.desc;
    const { classes } = this.props;
    this.sendToBackEnd({ a: 1, b: 3 }, `${API_URL}/user/create/account`);

    // fetch(API_URL + '/super-admin/actions', {
    //   credentials: 'include',
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   }
    // }).then(rawResponse => rawResponse.text()).then(data => {
    //   console.log(JSON.parse(data));
    // }).catch(error => {
    //   console.log(error);
    // });

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Grid container className={classes.root}>
          <CounterChartWidget />
        </Grid>
        <Divider className={classes.divider} />
        {/* <SalesChartWidget /> */}
        <Divider className={classes.divider} />
        <Grid container spacing={24} className={classes.root}>
          <Grid item md={4} xs={12}>
            <CarouselWidget />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <NewsWidget />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <CarouselWidget />
          </Grid>
        </Grid>
      </div>
    );
  }
}

SummaryDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SummaryDashboard);
