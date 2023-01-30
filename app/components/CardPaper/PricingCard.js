import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import styles from './cardStyle-jss';

class PricingCard extends React.Component {
  render() {
    const {
      classes,
      title,
      price,
      feature,
      tier
    } = this.props;

    const getTier = lv => {
      switch (lv) {
        case 'cheap':
          return classes.cheap;
        case 'expensive':
          return classes.expensive;
        case 'more-expensive':
          return classes.moreExpensive;
        default:
          return classes.free;
      }
    };

    return (
      <Card className={classNames(classes.priceCard, getTier(tier))}>
        <div className={classes.priceHead}>
          <Typography variant="h5">{title}</Typography>
          <Typography component="h4" variant="h2">{price}</Typography>
        </div>
        <CardContent className={classes.featureList}>
          <ul>
            {feature.map((item, index) => (
              <li key={index.toString()}>{item}</li>
            ))}
          </ul>
        </CardContent>
        <CardActions className={classes.btnArea}>
          <Button variant="outlined" size="large" className={classes.lightButton}>Get in now</Button>
        </CardActions>
      </Card>
    );
  }
}

PricingCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
  feature: PropTypes.array.isRequired,
};

export default withStyles(styles)(PricingCard);
