import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import imgApi from 'dan-api/images/photos';
import NewsCard from '../CardPaper/NewsCard';
import styles from './widget-jss';

const slideData = [
  {
    label: 'Heat Pump Event in Concord',
    imgPath: imgApi[11],
    desc: 'Heat Pump Event happening on Mon 22/01/2019'
  },
  {
    label: 'Solar Event in Wayland',
    imgPath: imgApi[31],
    desc: 'Heat Pump Event happening on Mon 22/01/2019'
  },
  {
    label: 'MassEnergize General Event in Wayland',
    imgPath: imgApi[38],
    desc: 'More Description to Come'
  },
  {
    label: 'Sudbury Solar Event',
    imgPath: imgApi[10],
    desc: 'More Description to Come'
  },
  {
    label: 'MassEnergize Welcoming New Communties',
    imgPath: imgApi[40],
    desc: 'More Description to Come'
  },
];

class NewsWidget extends React.Component {
  state = {
    activeStepSwipe: 0,
  };

  handleNextSwipe = () => {
    this.setState(prevState => ({
      activeStepSwipe: prevState.activeStepSwipe + 1,
    }));
  };

  handleBackSwipe = () => {
    this.setState(prevState => ({
      activeStepSwipe: prevState.activeStepSwipe - 1,
    }));
  };

  handleStepChangeSwipe = activeStepSwipe => {
    this.setState({ activeStepSwipe });
  };

  render() {
    const { classes, theme } = this.props;
    const { activeStepSwipe } = this.state;

    const maxStepsSwipe = slideData.length;
    return (
      <div>
        <Paper>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStepSwipe}
            onChangeIndex={this.handleStepChangeSwipe}
            enableMouseEvents
            className={classes.sliderWrap}
          >
            {slideData.map((slide, index) => (
              <div className={classes.figure} key={index.toString()}>
                <NewsCard
                  image={slide.imgPath}
                  title="slide.label"
                  className={classes.sliderContent}
                >
                  <Typography gutterBottom className={classes.title} variant="h6" component="h2">
                    {slide.label}
                  </Typography>
                  <Typography component="p">
                    {slide.desc}
                  </Typography>
                </NewsCard>
              </div>
            ))}
          </SwipeableViews>
          <MobileStepper
            variant="dots"
            steps={maxStepsSwipe}
            position="static"
            activeStep={activeStepSwipe}
            className={classes.mobileStepper}
            nextButton={(
              <Button size="small" onClick={this.handleNextSwipe} disabled={activeStepSwipe === maxStepsSwipe - 1}>
                Next
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            )}
            backButton={(
              <Button size="small" onClick={this.handleBackSwipe} disabled={activeStepSwipe === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                Back
              </Button>
            )}
          />
        </Paper>
      </div>
    );
  }
}

NewsWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NewsWidget);
