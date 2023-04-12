import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import LocationOn from '@mui/icons-material/LocationOn';
import { withStyles } from "@mui/styles";
import Paper from '@mui/material/Paper';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import styles from './widget-jss';

const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    {...props}
    defaultZoom={8}
    defaultCenter={{ lat: -34.300, lng: 119.344 }}
  >
    <Marker
      position={{ lat: -34.300, lng: 118.044 }}
    />
  </GoogleMap>
));

class MapWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.mapWrap}>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '200px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
        <div className={classes.address}>
          <Card className={classes.card}>
            <CardContent>
              <ListItem>
                <Avatar className={classes.avatar}>
                  <LocationOn />
                </Avatar>
                <ListItemText primary="Your Location" secondary="Town Hall Building no.45 Block C - ABC Street" />
              </ListItem>
            </CardContent>
          </Card>
        </div>
      </Paper>
    );
  }
}

MapWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapWidget);
