import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import cardanoLogo from 'dan-images/crypto/cardano.png';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

class TransferCryptoWidget extends PureComponent {
  state = {
    address: 'fcno485oreifj90dfsfk3012ikreopjdfs9fj',
    amount: 1,
    coin: 'ADA'
  };

  handleChangeAmount = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleChangeCoin = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeAddress = event => {
    this.setState({ address: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { address, amount, coin } = this.state;
    return (
      <PapperBlock whiteBg noMargin title="Transfer Coin" icon="ios-arrow-dropright" desc="">
        <Grid container spacing={16}>
          <Grid item sm={9} xs={6}>
            <FormControl className={classes.formControlTrade}>
              <InputLabel htmlFor="coin-simple">Coin</InputLabel>
              <Select
                value={coin}
                onChange={this.handleChangeCoin}
                inputProps={{
                  name: 'coin',
                  id: 'coin-simple',
                }}
              >
                <MenuItem value="BNB">BNB (Binance)</MenuItem>
                <MenuItem value="BTC">BTC (Bitcoin)</MenuItem>
                <MenuItem value="BCN">BCN (Bytecoin)</MenuItem>
                <MenuItem value="ADA">ADA (Cardano)</MenuItem>
                <MenuItem value="DCR">DCR (Decred)</MenuItem>
                <MenuItem value="ICX">ICX (Iconic)</MenuItem>
                <MenuItem value="IOTA">IOTA (Iota)</MenuItem>
                <MenuItem value="LTC">LTC (Litecoin)</MenuItem>
                <MenuItem value="XMR">XMR (Monero)</MenuItem>
                <MenuItem value="NANO">NANO (Nano Coin)</MenuItem>
                <MenuItem value="NEM">NEM (Nem)</MenuItem>
                <MenuItem value="PPT">PPT (Papulous)</MenuItem>
                <MenuItem value="XRP">XRP (Ripple)</MenuItem>
                <MenuItem value="XLM">XLM (Stellar Lumens)</MenuItem>
                <MenuItem value="STRAT">STRAT (Stratis)</MenuItem>
                <MenuItem value="TRX">TRX (Tron)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={3} xs={6}>
            <FormControl fullWidth className={classes.formControlTrade}>
              <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
              <Input
                id="adornment-amount"
                value={amount}
                onChange={this.handleChangeAmount('amount')}
                endAdornment={<InputAdornment position="end">{coin}</InputAdornment>}
              />
            </FormControl>
          </Grid>
        </Grid>
        <FormHelperText className={classes.walletLabel}>Cardano wallet address</FormHelperText>
        <FormControl fullWidth className={classes.formControlTrade}>
          <Input
            id="adornment-address"
            onChange={this.handleChangeAddress}
            value={address}
            startAdornment={(
              <InputAdornment position="start">
                <Avatar alt="bitcoin" src={cardanoLogo} className={classNames(classes.avatar, classes.mc)} />
              </InputAdornment>
            )}
          />
        </FormControl>
        <Divider className={classes.divider} />
        <div className={classes.textRight}>
          <Button color="secondary" variant="contained" className={classes.button}>
            Transfer Now
          </Button>
        </div>
      </PapperBlock>
    );
  }
}

TransferCryptoWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransferCryptoWidget);
