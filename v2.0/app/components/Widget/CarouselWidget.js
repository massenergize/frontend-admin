import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Icon from '@material-ui/core/Icon';
import carouselData from 'dan-api/images/carouselData';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './widget-jss';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="nav-next"
      onClick={onClick}
    >
      <ArrowForward />
    </IconButton>
  );
}

SampleNextArrow.propTypes = {
  onClick: PropTypes.func,
};

SampleNextArrow.defaultProps = {
  onClick: undefined,
};

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      className="nav-prev"
      onClick={onClick}
    >
      <ArrowBack />
    </IconButton>
  );
}

SamplePrevArrow.propTypes = {
  onClick: PropTypes.func,
};

SamplePrevArrow.defaultProps = {
  onClick: undefined,
};

class CarouselWidget extends React.Component {
  render() {
    const testimonialsData = this.props.goals;
    const colorArray = ['#7CB342','#00ACC1','#00BFA5','#F57F17','#546E7A' ];
    const { classes } = this.props;
    const settings = {
      dots: true,
      infinite: true,
      centerMode: false,
      speed: 500,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
      ],
      cssEase: 'ease-out',
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };
    return (
      
      <div className="container custom-arrow">
        <Slider {...settings}>
          {testimonialsData.map((item, index) => (
            <div key={index.toString()}>
              <div style={{ backgroundColor: colorArray[Math.floor(Math.random() * 5)] }} className={classes.carouselItem}>
                    <Icon className={classes.iconBg}>{item.icon}</Icon>
                <Typography className={classes.carouselDesc} variant="subtitle1">
                   {/* <Icon>{'done'}</Icon> */}
                  {item.title}
                </Typography>
                <div style={{marginBottom:10}}></div>
                <Typography className={classes.carouselDesc}>{item.body}</Typography>
                <div style={{marginBottom:10}}></div>
                <small style={{marginRight:5,color:'white'}}>
                  <b>{item.is_approved ? 'Approved,' : 'Not Approved,'}</b>
                  </small>
                <small style={{color:'white'}}>
                  <b>Made by {item.user.preferred_name}</b>
                </small>
                <br/>
                  {/* <small style={{color:'white'}}><b> {item.created_at}</b></small><br/> */}
                <br/>
                <br/>
                <br/>
                <Button variant="outlined" size="small" className={classes.buttonReadMore}>
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

CarouselWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CarouselWidget);
