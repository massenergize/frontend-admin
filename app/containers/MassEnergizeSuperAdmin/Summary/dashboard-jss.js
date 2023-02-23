const styles = (theme) => ({
  pageCard: {
    borderRadius: 5,
    fontSize: 20,
    margin: 9,
    padding: "30px 29px 27px",
    cursor: "pointer",
    "&:hover": {
      background: "floralwhite",
      transition: ".4s",
    },
  },
  colList: {
    "& li": {
      padding: "10px 0",
    },
    "& $avatar": {
      margin: 0,
    },
  },
  root: {
    flexGrow: 1,
  },
  rootGeneral: {
    padding: theme.spacing(3),
  },
  divider: {
    margin: `${theme.spacing(1.5)}px 0`,
    background: "none",
  },
  sliderWrap: {
    position: "relative",
    display: "block",
    boxShadow: theme.shadows[1],
    width: "100%",
    borderRadius: theme.rounded.medium,
    overflow: "hidden",
  },
  noPadding: {
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    [theme.breakpoints.up("sm")]: {
      padding: "0 !important",
    },
  },
  acti: {
    display: "grid",
    gridTemplateColumns: "1fr",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "2fr 1fr",
      gridColumnGap: 15,
    },
  },
});

export default styles;
