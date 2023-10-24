import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, makeStyles } from "@mui/styles";

import { withRouter } from "react-router-dom";
import PapperBlock from "../../../components/PapperBlock/PapperBlock";
import Seo from "../../../components/Seo/Seo";
import styles from "../../../components/Widget/widget-jss";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  FormLabel,
} from "@mui/material";
import TinyEditor from "../_FormGenerator/TinyMassEnergizeEditor";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import ScheduleMessageModal from "./ScheduleMessageModal";
import { apiCall } from "../../../utils/messenger";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;
/**
 * 
 * whenever audience type changes reset audience
 */
const error = {
  background: "rgb(255, 214, 214)",
  color: "rgb(170, 28, 28)",
  width: "100%",
  marginTop: 6,
  padding: "16px 25px",
  borderRadius: 5,
  cursor: "pointer",
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: 5,
  },
  error: {
    background: "rgb(255, 214, 214)",
    color: "rgb(170, 28, 28)",
    width: "100%",
    marginTop: 6,
    padding: "16px 25px",
    borderRadius: 5,
    cursor: "pointer",
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  dropdownArea: {
    marginBottom: theme.spacing(1),
  },
  success: {
    ...error,
    background: "rgb(174, 223, 174)",
    color: "rgb(12, 131, 30)",
  },
}));

const AUDIENCE_TYPE = [
  { id: "SUPER_ADMIN", value: "Super Admins" },
  { id: "COMMUNITY_CONTACTS", value: "Community Contacts" },
  { id: "COMMUNITY_ADMIN", value: "Community Admins" },
  { id: "USERS", value: "Users" },
];

const getAudienceType = (id) => {
  return AUDIENCE_TYPE.find((a) => a.id === id).value
}



function SendMessage({ classes, communities, users, ...props }) {
  const [currentFilter, setCurrentFilter] = useState("SUPER_ADMIN");
  const [usersQuery, setQuery] = useState({ audience_type: "SUPER_ADMIN", sub_audience_type: "ALL" });
  const [open, setOpen] = React.useState(false);

  const SUB_AUDIENCE_TYPE = [
    { id: "ALL", value: "All" },
    { id: "FROM_COMMUNITY", value: "From Community" },
    { id: "SPECIFIC", value: `Specific ${getAudienceType(currentFilter)}` },
  ];


  useEffect(() => {
    setQuery({
      ...usersQuery,
      audience:[],
      sub_audience_type:"ALL"
    })
    
  }, [currentFilter]);

  const buildQuery = (name, item) => {
    const obj = { ...usersQuery, [name]: item };
    setQuery(obj);
  };
  const getValue = (name, _default = null) => {
    if (!name) return null;
    return usersQuery[name] || _default;
  };

  const toggleMembership = () => {
    if (currentFilter === "SUPER_ADMIN") return ["Super Admin"];
    else if (currentFilter === "COMMUNITY_ADMIN") return ["Community Admin"];
    else if (currentFilter === "COMMUNITY_CONTACTS")
      return ["Community Contact"];
    return ["Member"];
  };

  const onFormSubmit = (data = usersQuery) => {
    data = {
      ...data,
      audience: currentFilter==="COMMUNITY_CONTACTS" ? data?.audience: data?.audience?.map((a)=>a.id),
    }
    apiCall("/messages.send", data).then((res) => {
      console.log("== res ===", res);
      setOpen(false);
    });
  };

  const renderSubAudience = () => {
    if (["COMMUNITY_ADMIN", "USERS"].includes(currentFilter)) {
      return (
        <div>
          <FormLabel component="label">{"Filter Down the Audience"}</FormLabel>
          <RadioGroup
            value={getValue("sub_audience_type", "")}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => {
              const value = ev.target.value;
              buildQuery("sub_audience_type", value);
            }}
          >
            {SUB_AUDIENCE_TYPE.map((option) => (
              <FormControlLabel
                name={option.key}
                key={option.key}
                value={option.id}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                  >
                    <Tooltip
                      title={"Filter by " + option.value}
                      placement="top"
                      style={{ fontWeight: "bold" }}
                    >
                      {option.value}
                    </Tooltip>
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </div>
      );
    }
  };

  const renderFromCommunities = () => {
    return (
      <>
        <FormLabel component="label">{"Communities"}</FormLabel>
        <LightAutoComplete
          defaultSelected={getValue("community", []) || []}
          multiple={true}
          isAsync={true}
          endpoint={"/communities.listForSuperAdmin"}
          onChange={(selected) => buildQuery("community", selected)}
          data={[]}
          labelExtractor={(item) => item?.name}
          valueExtractor={(item) => item?.id}
        />
        <div>{renderAudienceForm()}</div>
      </>
    );
  };

  const renderAudienceForm = () => {
    let community = getValue("community", []);
    let {sub_audience_type} = usersQuery
    if(sub_audience_type === "FROM_COMMUNITY" && community?.length > 0) {
      community = community?.map((c) => c.name);
    }

    if (currentFilter === "COMMUNITY_CONTACTS") 
      return (
          <div>
            <MEDropdown
              onItemSelected={(selected) => buildQuery("audience", selected)}
              value={getValue("audience", [])}
              smartDropdown={false}
              multiple
              allowClearAndSelectAll
              labelExtractor={(item) => item?.name}
              valueExtractor={(item) => item?.id}
              data={(communities || [])}
              placeholder="Select communities"
            />
          </div>
      );

 
    return (
      <>
        <FormLabel component="label">{"Audience"}</FormLabel>
        <LightAutoComplete
          defaultSelected={getValue("audience", []) || []}
          multiple={true}
          isAsync={true}
          endpoint={"/users.listForSuperAdmin"}
          params={{ membership: toggleMembership(), community }}
          onChange={(selected) =>{
            console.log("=== selected ===", selected)
             buildQuery("audience", selected);
          }}
          data={[]}
          labelExtractor={(item) => item?.full_name}
          valueExtractor={(item) => item?.id}
          placeholder="Select audience"
        />
      </>
    );
  };

  const renderAudienceList = () => {
    const {sub_audience_type} = usersQuery
    if (["SUPER_ADMIN", "COMMUNITY_CONTACTS"].includes(currentFilter)) {
      return renderAudienceForm();
    }
    if (sub_audience_type === "SPECIFIC") {
      return renderAudienceForm();
    }

    if(sub_audience_type === "FROM_COMMUNITY") {
      return renderFromCommunities();
    } 
  };

  return (
    <PapperBlock
      title="Send Message"
      desc="Send a message to all audience or specific audience."
    >
      <Seo name={"Send Message"} />
      <>
        <FormLabel>Audience Type</FormLabel>
        <RadioGroup
          value={currentFilter}
          style={{ display: "flex", flexDirection: "row" }}
          onChange={(ev) => {
            const value = ev.target.value;
            buildQuery("audience_type", value);
            setCurrentFilter(value);
          }}
        >
          {AUDIENCE_TYPE.map((option) => (
            <FormControlLabel
              name={option.key}
              key={option.key}
              value={option.id}
              control={<Radio />}
              label={
                <Typography
                  variant="body2"
                  style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                >
                  <Tooltip
                    title={option.context}
                    placement="top"
                    style={{ fontWeight: "bold" }}
                  >
                    {option.value}
                  </Tooltip>
                </Typography>
              }
            />
          ))}
        </RadioGroup>
        {renderSubAudience()}
        <div>{renderAudienceList()}</div>

        <div style={{ marginTop: 20 }}>
          <TextField
            fullWidth
            label="Subject"
            value={getValue("subject", "")}
            id="fullWidth"
            onChange={(e) => buildQuery("subject", e.target.value)}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Typography>{"Body"}</Typography>
          <TinyEditor
            id={"message"}
            value={getValue("message", "")}
            onEditorChange={(content, editor) => {
              buildQuery("message", content);
            }}
            toolbar="undo redo | blocks | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | link | image | bullist numlist outdent indent | fontfamily | fontsize |"
            plugins="advlist autolink lists link image charmap print preview anchor forecolor"
            init={{
              height: 350,
              menubar: false,
              default_link_target: "_blank",
              forced_root_blocks: true,
              forced_root_block: false,
            }}
            apiKey={TINY_MCE_API_KEY}
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                props.history.push("/admin/scheduled/messages");
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onFormSubmit();
              }}
            >
              Send Now
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(true)}
              sx={{ marginLeft: 2 }}
            >
              Schedule
            </Button>
          </div>
        </div>
      </>
      <ScheduleMessageModal
        open={open}
        handleClose={() => setOpen(false)}
        data={usersQuery}
        onSubmit={onFormSubmit}
      />
    </PapperBlock>
  );
}
const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  users: state.getIn(["allUsers"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
const SendMessageWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMessage);
export default withStyles(styles)(withRouter(SendMessageWithProps));
