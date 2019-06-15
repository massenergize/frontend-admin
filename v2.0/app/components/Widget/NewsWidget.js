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
    label: 'How to be success :)',
    imgPath: imgApi[11],
    desc: 'Nulla lobortis nunc vitae nisi semper semper.'
  },
  {
    label: 'Work with something that you like, like…',
    imgPath: imgApi[31],
    desc: 'Pellentesque ac bibendum tortor, vel blandit nulla.'
  },
  {
    label: 'Keep your schedule in the right time',
    imgPath: imgApi[38],
    desc: 'Aenean facilisis vitae purus facilisis semper.'
  },
  {
    label: 'Travel everytime that you have a chance',
    imgPath: imgApi[10],
    desc: 'Curabitur egestas consequat lorem, vel fermentum augue porta id.'
  },
  {
    label: 'And contribute to Material-UI :D',
    imgPath: imgApi[40],
    desc: 'Integer orci justo, fringilla at faucibus vel, pulvinar in eros.'
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
