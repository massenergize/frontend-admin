import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { factory } from "./HTML/HTMLShop";
import toolPic from "./imgs/4.png";
import startPic from "./imgs/3.png";
import optionsPic from "./imgs/2.png";
import plusPic from "./imgs/1.png";
import inlinePic from "./imgs/5.png";
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
    height: 770,
    marginLeft: "4%",
  },
  content: {
    // paddingRight:20,
    // overflowY:"scroll",
    height: (3 / 4) * window.innerHeight +10,
  },
  button: {
    marginTop: 15,
    fontWeight: "bold",
    float: "right",
  },
  littleMargin: {
    marginTop: 0,
    marginBottom: 3,
    fontSize:14
  },
  header: {
    marginBottom: 3,
    fontWeight: "bold",
  },
  red: {
    color: "red",
  },
};
class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/* <div style={styles.container} /> */}
        <div style={styles.envelope}>
          <div style={styles.content}>
            <h3 style={styles.header}>HOW TO ACCESS ALL YOUR TOOLS</h3>
            <p style={styles.littleMargin}>
              Everytime you click on the editor to "Start typing...", two
              buttons will appear -- one on your left, and the other on your right
            </p>
            <p style={styles.littleMargin}>
              Look out for the <b>plus sign</b>,{" "}
              <img src={plusPic} style={{ display: "inlin-block" }} /> everytime
              you click it, you get access to a hovering toolbar as shown below
            </p>
            <img src={toolPic} />
            <p style={styles.littleMargin}>
              From the toolbar, you can tap the <b>H</b> to add header, tap the{" "}
              <b>T</b> to add a normal paragraph or tap the list bars to add a
              list
            </p>
            <h3 style={styles.header}>
              More Options{" "}
              <img src={optionsPic} style={{ display: "inline-block" }} />
            </h3>
            <p style={styles.littleMargin}>
              After you have chosen to go with an <b>H</b>, a <b>T</b> or{" "}
              <b>list</b> from your toolbar . The button on your right that
              looks like four dots, will give more options on how you can modify
              the tool.
            </p>
            <p style={styles.header}>For Lists</p>
            <p style={styles.littleMargin}>
              That is where you will either change to <b>bullets, or numbers</b>
            </p>
            <p style={styles.header}>For Headers</p>
            <p style={styles.littleMargin}>
              You get to switch between bigger and smaller header tags from (H1
              to H6){" "}
            </p>
            <p style={styles.header}>
              NEED TO ADD SPACE BETWEEN TWO LINES? EASY!
            </p>
            <p style={styles.littleMargin}>
              Just move to a <b>new line</b> and put a dot/fullstop, like this{" "}
              <span style={{ ...styles.red, fontSize: 25 }}>
                <b>.</b>
              </span>{" "}
              or simply type{" "}
              <span style={styles.red}>
                <b>[SPACE]</b>
              </span>{" "}
              on a new line{" "}
            </p>
            <p style={styles.header}>ADD LINKS</p>
            <p style={styles.littleMargin}>
              Select any portion of text to get access to an inline toolbar like this <img src={inlinePic} style={{ display: "inline-block" }} />
              from there, you can select the link icon and add a link, right away. <b>NB: All links will open a new tab!</b>
            </p>
            <p style={styles.header}>ADD AN IMAGE</p>
            <p style={styles.littleMargin}>
              Need to spruce up your post with an image, thats simple tooo. Just
              move to a new line, and paste a link to an image online, the editor
              will take it from there!<br/>
              <small>
                Want to see this in action? Copy and page this link into the
                editor <b>https://www.massenergize.org/wp-content/uploads/2019/08/GENERAL2019.jpg</b>
              </small>
            </p>
          </div>
          <Button
            position="right"
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={() => this.props.toggle(false)}
          >
            I understand
          </Button>
        </div>
      </div>
    );
  }
}

export default HelpModal;
