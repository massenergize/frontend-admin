import { alpha,darken } from "@mui/material/styles";
import CustomJss from "../../../../../utils/jss/Custom-jss";
const common = {
  textDecoration: "none !important",
  padding: "10px 30px",
  color: "white",
  minWidth: "160px",
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "capitalize",
  "&:hover": {
    background: "#d8e4e8 !important",
    color: "#5d7488 !important",
    transition: ".2s ease-in-out",
  },
};
const custom = {
  goLiveBtn: {
    ...common,
  },
  publishBtn: {
    ...common,
    background: "crimson",
  },
  leAnchor: {
    ...common,
    background: "#9d58c0",
  },
  inline: {
    display: "inline-block",
  },
};
const raise = CustomJss;

const styles = (theme) => ({
  ...custom,
  ...raise,
  root: {
    flexGrow: 1,
  },
  cover: {
    "& $name, & $subheading": {
      color: theme.palette.common.white,
    },
    position: "relative",
    width: "100%",
    overflow: "hidden",
    height: 480,
    backgroundColor:
      theme.palette.type === "dark"
        ? darken(theme.palette.primary.dark, 0.8)
        : "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundSize: "cover",
    textAlign: "center",
    boxShadow: theme.shadows[7],
    backgroundPosition: "bottom center",
    borderRadius: theme.rounded.medium,
  },
  profileTab: {
    marginTop: -72,
    [theme.breakpoints.down("sm")]: {
      marginTop: -48,
    },
    borderRadius: `0 0 ${theme.rounded.medium} ${theme.rounded.medium}`,
    background: alpha(theme.palette.background.paper, 0.8),
    position: "relative",
  },
  content: {
    //background: alpha(theme.palette.secondary.main, 0.3),
    height: "100%",
    width: "100%",
    padding: `70px ${theme.spacing(3)}px 30px`,
  },
  name: {},
  subheading: {},
  avatar: {
    margin: `0 auto ${theme.spacing(2)}px`,
    width: 120,
    height: 120,
    boxShadow: theme.glow.medium,
  },
  opt: {
    position: "absolute",
    top: 10,
    right: 10,
    "& button": {
      color: theme.palette.common.white,
    },
  },
  verified: {
    margin: theme.spacing(1),
    position: "relative",
  },
  button: {
    marginTop: theme.spacing(1),
  },
});

export default styles;
