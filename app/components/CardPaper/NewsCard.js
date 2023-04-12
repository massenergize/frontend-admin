import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styles from './cardStyle-jss';

class NewsCard extends React.Component {
  render() {
    const {
      classes,
      children,
      title,
      image,
      ...rest
    } = this.props;
    return (
      <Card className={classes.cardMedia} {...rest}>
        <CardMedia
          className={classes.media}
          image={image}
          title={title}
        />
        <CardContent>
          {children}
        </CardContent>
        <CardActions>
            {/* <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button> */}
        </CardActions>
      </Card>
    );
  }
}

NewsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default withStyles(styles)(NewsCard);
