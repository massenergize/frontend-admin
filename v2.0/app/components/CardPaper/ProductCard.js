import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import FileCopy from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Type from 'dan-styles/Typography.scss';
import Rating from '../Rating/Rating';
import styles from './cardStyle-jss';
import { Link } from 'react-router-dom';


class ProductCard extends React.Component {
  render() {
    const {
      id,
      classes,
      discount,
      soldout,
      thumbnail,
      name,
      desc,
      rating,
      price,
      prevPrice,
      list,
      detailOpen,
      addToCart,
      width,
    } = this.props;
    return (
      <Card className={classNames(classes.cardProduct, isWidthUp('sm', width) && list ? classes.cardList : '')}>
        <div className={classes.status}>
          {discount !== '' && (
            <Chip label={'Discount ' + discount} className={classes.chipDiscount} />
          )}
          {soldout && (
            <Chip label="Sold Out" className={classes.chipSold} />
          )}
        </div>
        <CardMedia
          className={classes.mediaProduct}
          image={thumbnail}
          title={name}
        />
        <CardContent className={classes.floatingButtonWrap}>
          {!soldout && (
            <Tooltip title="Duplicate this Action" placement="top">
              <Fab onClick={addToCart} size="small" color="secondary" aria-label="add" className={classes.buttonAdd}>
                <FileCopy />
              </Fab>
            </Tooltip>
          )}
          <Typography noWrap gutterBottom variant="h5" className={classes.title} component="h2">
            {name}
          </Typography>
          <Typography component="p" className={classes.desc}>
            {desc}
          </Typography>
          {/* <div className={classes.rating}>
            <Rating value={rating} max={5} readOnly />
          </div> */}
        </CardContent>
        <CardActions className={classes.price}>
          <Typography variant="h5">
            <span>
              Carbon Score:
              { price }
            </span>
          </Typography>
          {prevPrice > 0 && (
            <Typography variant="caption" component="h5">
              <span className={Type.lineThrought}>
                $
                {prevPrice}
              </span>
            </Typography>
          )}
          <div className={classes.rightAction}>
            <Link to={`/admin/read/action/${id}`}>
              <Button size="small" variant="outlined" color="secondary">
                See Detail
              </Button>
            </Link>

            {!soldout && (
              <Tooltip title="Add to cart" placement="top">
                <IconButton color="secondary" onClick={addToCart} className={classes.buttonAddList}>
                  {/* <AddShoppingCart /> */}
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>
      </Card>
    );
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  discount: PropTypes.string,
  width: PropTypes.string.isRequired,
  soldout: PropTypes.bool,
  thumbnail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  prevPrice: PropTypes.number,
  list: PropTypes.bool,
  detailOpen: PropTypes.func,
  addToCart: PropTypes.func,
};

ProductCard.defaultProps = {
  discount: '',
  soldout: false,
  prevPrice: 0,
  list: false,
  detailOpen: (id) => {
    // window.location.href = `/admin/action/${id}/edit`;
    // console.log(id);
  },
  addToCart: () => (false),
};

const ProductCardResponsive = withWidth()(ProductCard);
export default withStyles(styles)(ProductCardResponsive);
