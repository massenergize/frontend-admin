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
  };
};
