import React from 'react';
import PropTypes from 'prop-types';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { PapperBlock } from 'dan-components';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import imgApi from 'dan-api/images/photos';
import Email from '@material-ui/icons/Email';
import messageStyles from 'dan-styles/Messages.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { ProductCard } from '../../../components';

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { actions: [] };
  }

  async componentDidMount() { 
    const response = await fetchData('v2/actions');
    await this.setStateAsync({ actions: response && response.data });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  renderActions = (data) => (
    <Grid
      container
      alignItems="flex-start"
      justify="center"
      direction="row"
      spacing={16}
    >
      {data.map(n => (
        <Grid item md={4} key={n.id}>
          <ProductCard
            thumbnail={n.image ? n.image.url : imgApi[21]}
            name={n.title}
            desc={n.title}
            rating={n.id}
            price={n.average_carbon_score}
            id={n.id}
          />
        </Grid>
      ))}
    </Grid>
  )

  render() {
    const title = brand.name + ' - All Actions';
    const description = brand.desc;
    const { actions } = this.state;

    if (!actions || actions.length === 0) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={this.props.classes.root}>
              <div className={this.props.classes.root}>
                <LinearProgress />
                <h1>Fetching all Actions.  This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

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
        <PapperBlock title="All Actions" desc="">
          {this.renderActions(actions)}
        </PapperBlock>
      </div>
    );
  }
}

// export default AllActions;

export default withStyles(styles)(AllActions);
