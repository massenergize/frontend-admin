/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Info from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import styles from './jss/cover-jss';
import { apiCall } from '../../../../utils/messenger';
import { SANDBOX_PORTAL_HOST, PORTAL_HOST } from '../../../../config/constants';


const optionsOpt = [
  'Edit Profile',
  'Change Cover',
];

const ITEM_HEIGHT = 48;

class Cover extends React.Component {
  state = {
    anchorElOpt: null,
  };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = () => {
    this.setState({ anchorElOpt: null });
  };

  goLive = async () => {
    const { community, liveOrNotFxn } = this.props;
    const { is_published } = community;
    const { id } = community;
    const body = { is_published: !is_published, community_id: id };
    liveOrNotFxn(community);
    await apiCall('/communities.update', body);
  }

  showLiveBtn = () => {
    const { community } = this.props;
    const { is_published } = community;
    const { classes } = this.props;
    if (is_published) {
      return (
        <div>
          <Button onClick={() => { this.goLive(); }} variant="outlined" color="secondary" className={classes.publishBtn + ' ' + classes.raise}>
            Unpublish
          </Button>
        </div>
      );
    }

    return (
      <div>
        <Button onClick={() => { this.goLive(); }} variant="outlined" color="primary" className={classes.goLiveBtn + ' ' + classes.raise}>
          Go Live
        </Button>
      </div>
    );
  }

  render() {
    const {
      classes,
      name,
      desc,
      coverImg,
      community
    } = this.props;


    const { anchorElOpt } = this.state;
    const coverStyle = {
      height: 250, textAlign: 'left', justifyContent: 'flex-start', backgroundImage: `url(${coverImg})`
    };
    const contentStyle = {
      display: 'inline-block', marginLeft: 20, marginBottom: 2, fontSize: '1.8rem', fontWeight: '500px', textTransform: 'capitalize'
    };

    return (
      <div className={classes.cover} style={coverStyle}>
        <div className={classes.opt}>
          <IconButton className={classes.button} aria-label="Delete">
            <Info style={{ color: '#585858' }} />
          </IconButton>
          <IconButton
            aria-label="More"
            aria-owns={anchorElOpt ? 'long-menu' : null}
            aria-haspopup="true"
            className={classes.button}
            onClick={this.handleClickOpt}
          >
            <MoreVertIcon style={{ color: '#585858' }} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorElOpt}
            open={Boolean(anchorElOpt)}
            onClose={this.handleCloseOpt}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,

              },
            }}
          >
            {optionsOpt.map(option => (
              <MenuItem key={option} selected={option === 'Edit Profile'} onClick={this.handleCloseOpt}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className={classes.content} style={{ display: 'inline-block' }}>
          <div>
            <h2 style={contentStyle}>{name}</h2>
            {community.is_approved
                && <VerifiedUser style={{ color: '#0095ff', marginTop: -2, display: 'inline-block', }} className={classes.verified} />
            }
            <div style={{ float: 'right' }}>
              <center>
                {this.showLiveBtn()}
                <a
                  style={{ fontSize: 14 }}
                  className={classes.leAnchor}
                  href={community ? `${SANDBOX_PORTAL_HOST}/${community.subdomain}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  Preview Site
                </a>
                <a
                  style={{ fontSize: 14 }}
                  className={classes.leAnchor}
                  href={community ? `${PORTAL_HOST}/${community.subdomain}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  Visit Portal
                </a>
              </center>
            </div>
          </div>
          <p style={{ marginLeft: 20, color: 'darkgray' }}>{desc}</p>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
  community: PropTypes.object.isRequired,
  liveOrNotFxn: PropTypes.func.isRequired
};

export default withStyles(styles)(Cover);
