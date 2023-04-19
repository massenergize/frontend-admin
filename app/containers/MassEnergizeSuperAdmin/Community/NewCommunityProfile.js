import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";

function NewCommunityProfile() {
  return (
    <div>
      <MEPaperBlock containerStyle={{ padding: 0, position: "relative" }}>
        <div style={{ padding: "20px 30px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              Energizing Wayland{" "}
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              <small>Date Registered</small>
              <br />
              <Typography
                variant="body"
                style={{ color: "#9D58C0", fontWeight: "bold" }}
              >
                22nd March 1998
              </Typography>
            </div>
          </div>
          <Typography style={{ marginTop: 10 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            sagittis justo at enim ullamcorper, vel hendrerit elit luctus. In
            hac habitasse platea dictumst. Vivamus vel pulvinar velit. Fusce
            faucibus lorem nec nisl fermentum ullamcorper. Maecenas gravida
            tellus sit amet tellus interdum, at pretium velit tempor. Fusce
            bibendum, nulla non dapibus
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: 21,
              fontStyle: "italic",
              marginTop: 13,
            }}
          >
            <small style={{ marginRight: 10 }}>
              <i className="fa fa-user" /> <span>Kaat VanderYYY</span>
            </small>
            <small style={{ marginRight: 10 }}>
              <i className="fa fa-envelope" /> <span>Kaat@email.com</span>
            </small>
            <small style={{ marginRight: 10 }}>
              <i className="fa fa-phone" /> <span>01234567</span>
            </small>
          </div>
          <br />
          <br />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "#FBFBFB",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 160,
              fontWeight: "bold",
              background: "#9D58C0",
            }}
          >
            PREVIEW
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 160,
              fontWeight: "bold",
              background: "#08995C",
            }}
          >
            VISIT PORTAL
          </Button>

          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              marginLeft: "auto",
              borderRadius: 0,
              padding: 10,
              width: 160,
              fontWeight: "bold",
              background: "#00BCD4",
            }}
          >
            <span style={{ marginRight: 5 }}>🎊</span>
            <span>GO LIVE</span>
          </Button>
        </div>
      </MEPaperBlock>

      <Grid container columnSpacing={2} style={{ marginTop: 20 }}>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          item
          md={9}
        >
          <MEPaperBlock
            title="EDIT YOUR COMMUNITY PAGES"
            titleStyle={{ fontSize: 20 }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => {
              return (
                <div
                  className="touchable-opacity"
                  style={{
                    padding: "15px 30px",
                    border: "solid 1px #EAEAEA",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <Typography variant="body" style={{ fontWeight: "bold" }}>
                      Home Page
                    </Typography>
                    <br />
                    <Typography variant="body">
                      Customize what your community homepage looks like
                    </Typography>
                  </div>
                  <i
                    style={{ marginLeft: "auto", fontSize: 20, opacity: "20%" }}
                    className="fa fa-edit"
                  />
                </div>
              );
            })}
          </MEPaperBlock>
        </Grid>

        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
          }}
          item
          md={3}
        >
          <MEPaperBlock
            title="GOAL PROGRESS"
            titleStyle={{ fontSize: 18, marginBottom: 20 }}
          />
          <MEPaperBlock
            title="COMMUNITY ADMINS"
            titleStyle={{ fontSize: 18, marginBottom: 20 }}
          />
          <MEPaperBlock
            title="CSV REQUESTS"
            titleStyle={{ fontSize: 18, marginBottom: 20 }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default NewCommunityProfile;
