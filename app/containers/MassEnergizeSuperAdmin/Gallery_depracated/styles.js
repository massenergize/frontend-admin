export const styles = (theme) => {
  return {
    title: { color: "white" },
    container: { minHeight: 400, padding: 20, marginTop: 15 },
    thumbnailContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    filterBox: {
      border: "solid 0px #fafafa",
      borderBottomWidth: 2,
      marginBottom: 10,
      display: "flex",
      flexDirection: "row",
    },
    button: {
      padding: "10px 40px",
      margin: 10,
    },
    sideSheetWrapper: {
      height: "100vh",
      position: "fixed",
      right: 0,
      top: 0,

      opacity: 0,
      width: 250,
      zIndex: "5000",
    },
    sideSheetContainer: {
      height: "100%",
      width: "100%",

      display: "flex",
      flexDirection: "column",
      overflowY: "scroll",
    },

    sideSheetInnerContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  };
};

export const filterStyles = (theme) => {
  return {
    dropdownTop: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      marginTop: 10,
    },
    resetOneFilter: {
      marginLeft: "auto",
      color: "#c17272",
      textDecoration: "underline",
      cursor: "pointer",
      marginRight: 15,
    },
    filterFooter: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      flex: "2",
      position: "absolute",
      bottom: 0,
    },
    content: {
      padding: "20px 15px",
      overflowY: "scroll",
      minHeight: 410,
      maxHeight: 410,
      marginBottom: 30,
    },
    contentArea: {
      opacity: 0,
      // height: 300,
      width: 450,
      background: "white",
      marginBottom: 5,
      position: "absolute",
      right: 0,
      top: 40,
      zIndex: 20,
      borderBottomRightRadius: 6,
      borderBottomLeftRadius: 6,
      boxShadow:
        "0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;",
    },
    ghostCurtain: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "white",
      opacity: 0,
      zIndex: 19,
    },
    root: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
    },
    toggleWrapper: {
      marginLeft: "auto",
      padding: "6px 10px",
      borderRadius: 4,
      cursor: "pointer",
      display: "inline-flex",
      flexDirection: "row",
      "& small": {
        marginLeft: 5,
      },
      "&:hover": {
        background: "#f6f6f6",
        transition: ".3s ease-out",
      },
    },
  };
};
