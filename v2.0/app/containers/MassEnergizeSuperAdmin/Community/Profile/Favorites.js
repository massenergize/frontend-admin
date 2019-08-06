import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import imgApi from 'dan-api/images/photos';
import avatarApi from 'dan-api/images/avatars';
import GeneralCard from 'dan-components/CardPaper/GeneralCard';
import PostCard from 'dan-components/CardPaper/PostCard';
import Quote from 'dan-components/Quote/Quote';

const styles = theme => ({
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    background: 'none'
  },
});

class Favorites extends React.Component {
  render() {
    const { classes, data } = this.props;
    const { events, testimonials } = data;
    console.log(events, testimonials);
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <Grid
        container
        justify="center"
        direction="row"
        spacing={24}
      >
        <Grid item md={6}>
          {
            testimonials
            && testimonials.map((t, i) => (
              <div>
                <PostCard
                  liked={90}
                  shared={10}
                  commented={22}
                  avatar={t.user && t.user.profile_picture ? t.user.profile_picture.url : avatarApi[11]}
                  date={`Submitted at: ${t.created_at}`}
                  content={`${t.body}`}
                  name={`${t.user ? t.user.full_name : 'Anonymous'}`}
                  data1={`Vendor: ${t.vendor ? t.vendor.name : ''}`}
                  data2={`Action: ${t.vendor ? t.action.title : ''}`}
                  data3={`ID: ${t ? t.id : ''}`}
                />
                <Divider className={classes.divider} />
              </div>
            ))
          }
        </Grid>


        <Grid item md={6}>
          {
            events
              && events.map((e, i) => (
                <div>
                  <PostCard
                    liked={1}
                    shared={20}
                    commented={15}
                    date={`Start At: ${e.start_date_and_time}  Ends At:${e.start_date_and_time}`}
                    content={`${e.description}`}
                    image={e.image ? e.image.url : imgApi[5]}
                    avatar={e.community && e.community.logo ? e.community.logo.url : avatarApi[6]}
                    name={`${e.name}`}
                  />
                  <Divider className={classes.divider} />
                </div>
              )
              )
          }
        </Grid>
      </Grid>
    );
  }
}

Favorites.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Favorites);
