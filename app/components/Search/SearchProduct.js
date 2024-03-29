import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import ViewList from '@mui/icons-material/ViewList';
import GridOn from '@mui/icons-material/GridOn';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Cart from '../Cart/Cart';
import styles from './search-jss';

class SearchProduct extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, } = this.state;
    const {
      classes,
      dataCart,
      removeItem,
      checkout,
      totalItems,
      totalPrice,
      search,
      keyword,
      dataProduct,
      handleSwitchView,
      listView
    } = this.props;

    const getTotalResult = dataArray => {
      let totalResult = 0;
      for (let i = 0; i < dataArray.size; i += 1) {
        if (dataArray.getIn([i, 'name']) === undefined) {
          return false;
        }
        if (dataArray.getIn([i, 'name']).toLowerCase().indexOf(keyword) !== -1) {
          totalResult += 1;
        }
      }
      return totalResult;
    };

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <div className={classes.flex}>
              <div className={classes.wrapper}>
                <div className={classes.search}>
                  <SearchIcon />
                </div>
                <input className={classes.input} placeholder="Search Product" onChange={(event) => search(event)} />
              </div>
            </div>
            <Typography variant="caption" className={classes.result}>
              {getTotalResult(dataProduct)}
              &nbsp;Results
            </Typography>
            <Hidden mdDown>
              <div className={classes.toggleContainer}>
                <ToggleButtonGroup value={listView} exclusive onChange={handleSwitchView}>
                  <ToggleButton value="grid">
                    <GridOn />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Hidden>
            <div className={classes.cart}>
              <IconButton
                color="inherit"
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <Badge badgeContent={totalItems} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Cart
                anchorEl={anchorEl}
                dataCart={dataCart}
                close={this.handleClose}
                removeItem={removeItem}
                checkout={checkout}
                totalPrice={totalPrice}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

SearchProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  dataCart: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  checkout: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  keyword: PropTypes.string.isRequired,
  dataProduct: PropTypes.object.isRequired,
  handleSwitchView: PropTypes.func.isRequired,
  listView: PropTypes.string.isRequired,
};

export default withStyles(styles)(SearchProduct);
