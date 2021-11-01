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
import unavailableImage from './../../../public/images/unavailable.jpg';

class NewsWidget extends React.Component {
  constructor(props){
    super(props); 
    this.state  = { activeStepSwipe: 0}
  }

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

  eventElements = (dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe) =>{
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
            {dataCollection.map((slide, index) => (
              <div className={classes.figure} key={index.toString()}>
                <NewsCard
                  image={slide.image? slide.image.url: unavailableImage}
                  title="slide.label"
                  className={classes.sliderContent}
                >
                  <small style={{marginRight:5}}><b>Start Date : {slide.start_date_and_time}</b></small>
                  <br/><small style={{marginRight:5}}><b>Start EndDate : {slide.end_date_and_time}</b></small>
                  <br/><small style={{marginRight:5}}><b>{slide.name}</b></small>
                  <br/><small style={{marginRight:5}}>
                    <b>
                      Location: { 
                        slide.location? slide.location.state+', '+slide.location.city+', '+slide.location.street: ' Not Available'
                        }
                    </b>
                  </small>
            
                  <Typography gutterBottom className={classes.title} variant="h6" component="p">
                    {slide.description}
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
  actionElements = (dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe)=>{
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
            {dataCollection.map((slide, index) => (
              <div className={classes.figure} key={index.toString()}>
                <NewsCard
                  image={slide.image? slide.image.url: unavailableImage}
                  title="slide.label"
                  className={classes.sliderContent}
                >
                  <Typography gutterBottom className={classes.title} variant="h6" component="h2">
                    {slide.title}
                  </Typography>
                  <Typography component="p">
                    {slide.about.length > 70 ? slide.about.substring(0,70) +"...": slide.about}
                  </Typography>
                  <small>
                    {slide.steps_to_take.length > 20 ? slide.steps_to_take.substring(0,20) +"...": slide.steps_to_take }
                  </small>
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
  ejectElements = (dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe) =>{
    if (this.props.kind === "action"){
      return this.actionElements(dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe)
    }
    else if(this.props.kind ==="event"){
      return this.eventElements(dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe)
    }
  }

  render() {
    const dataCollection = this.props.dataCollection;
    const { classes, theme } = this.props;
    const { activeStepSwipe } = this.state;
    const maxStepsSwipe = dataCollection.length;
    return (
      <div> 
        {this.ejectElements(dataCollection,classes,theme,activeStepSwipe,maxStepsSwipe)}
      </div>
    );
  }
}

NewsWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NewsWidget);
