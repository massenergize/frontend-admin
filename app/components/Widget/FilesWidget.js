import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
// import GridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import imgData from 'dan-api/images/imgData';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

import { ImageListItem, ImageList, ImageListItemBar } from "@mui/material";
class FilesWidget extends PureComponent {
  render() {
    const {
      classes,
    } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item md={4} sm={12} xs={12}>
          <PapperBlock whiteBg noMargin title="Your Storage" icon="ios-cloud-outline" desc="">
            <div className={classes.secondaryWrap}>
              <div className={classes.centerItem}>
                <Chip label="Almost Full" className={classes.chip} color="secondary" />
                <CircularProgress variant="determinate" className={classes.progressCircle} size={140} thickness={4} value={60} />
              </div>
              <ul className={classes.storageInfo}>
                <li>
                  <Typography variant="h6" color="primary" gutterBottom>120 GB</Typography>
                  <Typography variant="caption" gutterBottom>60% used</Typography>
                </li>
                <li>
                  <Typography variant="h6" gutterBottom>200 GB</Typography>
                  <Typography variant="caption" gutterBottom>total storage</Typography>
                </li>
              </ul>
            </div>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" variant="contained" className={classes.button}>
                Upgrade Space
              </Button>
            </Grid>
          </PapperBlock>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <PapperBlock title="Your Photos" icon="ios-images-outline" whiteBg desc="">
            <div className={classes.albumRoot}>
              <ImageList cellHeight={120} className={classes.gridList}>
                {
                  imgData.map((tile, index) => {
                    if (index >= 4) {
                      return false;
                    }
                    return (
                      <ImageListItem key={index.toString()}>
                        <img
                          src={tile.img}
                          className={classes.img}
                          alt={tile.title}
                        />
                        <ImageListItemBar
                          title={tile.title}
                          subtitle={
                            <span>
                              by:&nbsp;
                              {tile.author}
                            </span>
                          }
                          actionIcon={
                            <IconButton
                              className={classes.icon}
                            >
                              <InfoIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    );
                  })
                }
              </ImageList>
            </div>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
          </PapperBlock>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <PapperBlock title="Favorites" icon="ios-heart-outline" whiteBg desc="">
            <div className={classes.albumRoot}>
              <ImageList cellHeight={120} className={classes.gridList}>
                {
                  imgData.map((tile, index) => {
                    if (index >= 4 && index < 8) {
                      return (
                        <ImageListItem key={index.toString()}>
                          <img src={tile.img} className={classes.img} alt={tile.title} />
                          <ImageListItemBar
                            title={tile.title}
                            subtitle={(
                              <span>
                                by:&nbsp;
                                {tile.author}
                              </span>
                            )}
                            actionIcon={(
                              <IconButton className={classes.icon}>
                                <InfoIcon />
                              </IconButton>
                            )}
                          />
                        </ImageListItem>
                      );
                    }
                    return false;
                  })
                }
              </ImageList>
            </div>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
          </PapperBlock>
        </Grid>
      </Grid>
    );
  }
}

FilesWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilesWidget);
