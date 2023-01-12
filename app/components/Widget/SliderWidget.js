import React from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Type from 'dan-styles/Typography.scss';
import Slider from 'react-animated-slider';
import 'dan-styles/vendors/react-animated-slider/react-animated-slider.css';
import imgApi from 'dan-api/images/photos';

const styles = theme => ({
  tag: {
    background: fade(theme.palette.primary.light, 0.8),
    color: theme.palette.primary.dark,
    position: 'absolute',
    right: 10,
    top: 10,
    padding: theme.spacing(1),
    borderRadius: theme.rounded.big,
    fontSize: 11,
    fontWeight: theme.typography.fontWeightMedium,
    boxShadow: theme.shadows[3]
  },
  title: {
    color: theme.palette.common.white
  }
});

const content = [
  {
    title: 'Title',
    description:'Description',
    button: 'Watch Video',
    image: imgApi[8],
    label: 'Uploaded to',
    tag: 'Just Uploaded',
    to: 'Video',
    userProfile: imgApi[54],
    type: 'video',
  },
  {
    title: 'Title',
    description:'Description',
    button: 'See Post',
    image: imgApi[15],
    label: 'Posted to',
    tag: 'Newest Post',
    to: 'Video',
    userProfile: imgApi[53],
    type: 'article'
  },
  {
    title: 'Title',
    description:'Description',
    button: 'Read Article',
    image: imgApi[29],
    label: 'Posted to',
    tag: 'Latest Article',
    to: 'Video',
    userProfile: imgApi[58],
    type: 'article'
  }
];

function SliderWidget(props) {
  const { classes } = props;
  return (
    <div>
      <Slider className="slider-wrapper short">
        {content.map((item, index) => (
          <div
            key={index.toString()}
            className="slider-content"
            style={{ background: `url('${item.image}') no-repeat center center` }}
          >
            <span className={classes.tag}>{item.tag}</span>
            <div className="inner">
              <Typography variant="subtitle1" component="h3" className={classNames(classes.title, Type.light)} gutterBottom>{item.title}</Typography>
              <Button variant="contained" color="primary">
                {item.type === 'video' && <Icon>play_arrow</Icon>}
                {item.button}
              </Button>
            </div>
            <section>
              <img src={item.userProfile} alt={item.user} />
              <span>
                {item.label}
                &nbsp;
                <strong>
                  {item.to}
                </strong>
              </span>
            </section>
          </div>
        ))}
      </Slider>
    </div>
  );
}

SliderWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SliderWidget);
