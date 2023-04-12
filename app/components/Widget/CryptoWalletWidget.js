import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Input from '@mui/material/Input';
import ContentCopy from '@mui/icons-material/ContentCopy';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import bitcoinLogo from 'dan-images/crypto/bitcoin.png';
import litecoinLogo from 'dan-images/crypto/litecoin.png';
import cardanoLogo from 'dan-images/crypto/cardano.png';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class CryptoWalletWidget extends PureComponent {
  state = {
    bitcoin: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    litecoin: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    cardano: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  };

  render() {
    const { classes } = this.props;
    const { bitcoin, litecoin, cardano } = this.state;
    return (
      <PapperBlock whiteBg noMargin title="My Wallet" icon="ios-archive-outline" desc="">
        <FormHelperText className={classes.walletLabel}>Bitcoin wallet address</FormHelperText>
        <FormControl fullWidth className={classes.formControlTrade}>
          <Input
            id="adornment-amount"
            value={bitcoin}
            disabled
            startAdornment={(
              <InputAdornment position="start">
                <Avatar alt="bitcoin" src={bitcoinLogo} className={classNames(classes.avatar, classes.mc)} />
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <Tooltip title="copy">
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )}
          />
        </FormControl>
        <FormHelperText className={classes.walletLabel}>Litecoin wallet address</FormHelperText>
        <FormControl fullWidth className={classes.formControlTrade}>
          <Input
            id="adornment-amount"
            value={litecoin}
            disabled
            startAdornment={(
              <InputAdornment position="start">
                <Avatar alt="bitcoin" src={litecoinLogo} className={classNames(classes.avatar, classes.mc)} />
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <Tooltip title="copy">
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )}
          />
        </FormControl>
        <FormHelperText className={classes.walletLabel}>Cardano wallet address</FormHelperText>
        <FormControl fullWidth className={classes.formControlTrade}>
          <Input
            id="adornment-amount"
            value={cardano}
            disabled
            startAdornment={(
              <InputAdornment position="start">
                <Avatar alt="bitcoin" src={cardanoLogo} className={classNames(classes.avatar, classes.mc)} />
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <Tooltip title="copy">
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )}
          />
        </FormControl>
        <Divider className={classes.divider} />
        <div className={classes.textRight}>
          <Button color="secondary" variant="outlined" className={classes.button}>
            View All
          </Button>
          <Button color="secondary" variant="contained" className={classes.button}>
            Settings
          </Button>
        </div>
      </PapperBlock>
    );
  }
}

CryptoWalletWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CryptoWalletWidget);
