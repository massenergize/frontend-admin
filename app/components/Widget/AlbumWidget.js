import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
// import GridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import imgData from 'dan-api/images/imgData';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './widget-jss';
import { ImageListItem, ImageList, ImageListItemBar } from "@mui/material";

class AlbumWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <PapperBlock noMargin title="My Albums (4)" whiteBg desc="">
        <div className={classes.albumRoot}>
          <ImageList cellHeight={180} className={classes.gridList}>
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
                        <IconButton className={classes.icon}>
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
      </PapperBlock>
    );
  }
}

AlbumWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlbumWidget);
