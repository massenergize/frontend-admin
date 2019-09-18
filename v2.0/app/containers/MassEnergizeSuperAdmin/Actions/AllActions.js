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

  renderActions = (data, classes) => {
    return (
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
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  render() {
    const title = brand.name + ' - All Communities';
    const description = brand.desc;
    const { actions } = this.state;
    const { classes } = this.props;
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
          {this.renderActions(actions, classes)}
        </PapperBlock>
      </div>
    );
  }
}

// export default AllActions;

AllActions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllActions);
