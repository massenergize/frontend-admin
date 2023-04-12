import React, { Component } from "react";
import Button from "@mui/material/Button";
// import classnames from "classnames";
const styles = {
  container: {
    zIndex: 99,
    position: "absolute",
    background: "#000",
    width: "100%",
    opacity: 0.5,
    height: window.innerHeight,
  },
  envelope: {
    padding: 25,
    position: "absolute",
    zIndex: 100,
    background: "white",
    border: "solid 1px white",
    borderRadius: 15,
    boxShadow: "0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19",
    marginTop: "-6%",
    width: "75%",
    height: (3 / 4) * window.innerHeight,
    marginLeft: "4%",
  },
  content: {
    overflow: "scroll",
    height: (3 / 4) * window.innerHeight - 85,
  },
  button: {
    fontWeight: "bold",
    float: "right",
  },
  // previewContent: {
  //   cursor: "pointer",
  //   "&:hover": {
  //     background: "red",
  //   },
  // },
};
class PreviewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        {/* <div style={styles.container} /> */}
        <div style={styles.envelope}>
          <div style={styles.content}>
            <h3 style={{ marginBottom: 5 }}>
              This is what your content will look like when it gets to users
            </h3>
            <p style={{ color: "gray" }}>
              <b>"</b>
              {this.props.title}
              <b>"</b>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: this.props.content }}
              className="preview-content"
            />
          </div>
          <Button
            position="right"
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={() => this.props.closeModal()}
          >
            Okay, I'm done
          </Button>
        </div>
      </div>
    );
  }
}

export default PreviewModal;
