import { fade, darken } from '@material-ui/core/styles/colorManipulator';
import CustomJss from '../../../utils/jss/Custom-jss';
const custom = {
  goLiveBtn:{
    padding:"9px 44px", 
    background:'white', 
    color:'#282828',
    marginBottom:12,
    textTransform:'capitalize',
    borderRadius:55,
    borderWidth:"0px !important",
    "&:hover":{
      background:"green",
      color:'white',
      transition:'.4s ease-in-out'
    }
  },
  publishBtn:{
    padding:"9px 34px", 
    background:'crimson', 
    color:'white',
    marginBottom:10,
    textTransform:'capitalize',
    borderRadius:55,
    borderWidth:"0px !important",
    "&:hover":{
      background:"black",
      color:'white',
      transition:'.4s ease-in-out'
    }
  },
  leAnchor:{
    textDecoration:'none !important',
    padding:"10px 30px", 
    background:'green', 
    color:'white',
    borderRadius:55,
    "&:hover":{
      background:"#d8e4e8",
      color:'#5d7488',
      transition:'.4s ease-in-out'
    }
  }, 
  inline:{
    display:'inline-block'
  }
}
const raise = CustomJss;

const styles = theme => ({
  ...custom,
  ...raise,
  root: {
    flexGrow: 1,
  },
  cover: {
    '& $name, & $subheading': {
      color: theme.palette.common.white
    },
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    height: 480,
    backgroundColor: theme.palette.type === 'dark' ? darken(theme.palette.primary.dark, 0.8) : "white",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundSize: 'cover',
    textAlign: 'center',
    boxShadow: theme.shadows[7],
    backgroundPosition: 'bottom center',
    borderRadius: theme.rounded.medium,
  },
  profileTab: {
    marginTop: -72,
    [theme.breakpoints.down('sm')]: {
      marginTop: -48,
    },
    borderRadius: `0 0 ${theme.rounded.medium} ${theme.rounded.medium}`,
    background: fade(theme.palette.background.paper, 0.8),
    position: 'relative'
  },
  content: {
    //background: fade(theme.palette.secondary.main, 0.3),
    height: '100%',
    width: '100%',
    padding: `70px ${theme.spacing.unit * 3}px 30px`
  },
  name: {},
  subheading: {},
  avatar: {
    margin: `0 auto ${theme.spacing.unit * 2}px`,
    width: 120,
    height: 120,
    boxShadow: theme.glow.medium
  },
  opt: {
    position: 'absolute',
    top: 10,
    right: 10,
    '& button': {
      color: theme.palette.common.white
    }
  },
  verified: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  button: {
    marginTop: theme.spacing.unit
  }
});

export default styles;
