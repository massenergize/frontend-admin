import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import FileCopy from '@material-ui/icons/FileCopy';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import styles from './cardStyle-jss';
import { fetchData, deleteItem } from '../../utils/messenger';


class ProductCard extends React.Component {
  duplicateAction = async (id) => {
    const res = await fetchData(`v2/action/${id}/copy`);
    if (res && res.success && res.data) {
      window.location.href = `/admin/read/action/${res.data.id}/edit`;
    }
  }

  handleDeleteAction = async (id) => {
    const res = await deleteItem(`v2/action/${id}`);
    if (res && res.success && res.data) {
      window.location.href = '/admin/read/actions';
    }
  }

  render() {
    const {
      id,
      classes,
      discount,
      soldout,
      thumbnail,
      name,
      desc,
      price,
      list,
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
          <Tooltip title="Duplicate this Action" placement="top">
            <Fab onClick={() => this.duplicateAction(id)} size="small" color="secondary" aria-label="add" className={classes.buttonAdd}>
              <FileCopy />
            </Fab>
          </Tooltip>
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
          {/* <Typography variant="h5">
            <h5>
              Carbon Score:
              { price }
            </h5>
          </Typography>
          <br /> */}
 
          <div className={classes.rightAction}>
            <Link to={`/admin/read/action/${id}/edit`}>
              <Button size="small" variant="outlined" color="secondary">
                See Details
              </Button>
            </Link>
            <Button onClick={() => this.handleDeleteAction(id)} size="small" variant="outlined" color="secondary">
              Delete
              <DeleteForeverIcon />
            </Button>

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
  addToCart: () => (false),
};

const ProductCardResponsive = withWidth()(ProductCard);
export default withStyles(styles)(ProductCardResponsive);
