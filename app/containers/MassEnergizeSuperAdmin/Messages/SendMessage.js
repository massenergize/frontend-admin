import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@mui/styles";

import { withRouter, useParams } from "react-router-dom";
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
  LinearProgress,
  Box,
  Chip,
  Grid,
  Checkbox,
} from "@mui/material";
import TinyEditor from "../_FormGenerator/TinyMassEnergizeEditor";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import ScheduleMessageModal from "./ScheduleMessageModal";
import { apiCall } from "../../../utils/messenger";
import { LOADING } from "../../../utils/constants";
import Loading from "dan-components/Loading";
import { reduxLoadMetaDataAction, reduxLoadScheduledMessages, reduxToggleUniversalModal, reduxToggleUniversalToast } from "../../../redux/redux-actions/adminActions";

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;
/**
 *
 * whenever audience type changes reset audience
 */

const AUDIENCE_TYPE = [
  { id: "SUPER_ADMIN", value: "Super Admins" },
  { id: "COMMUNITY_CONTACTS", value: "Community Contacts" },
  { id: "COMMUNITY_ADMIN", value: "Community Admins" },
  { id: "USERS", value: "Users" },
];

const getAudienceType = (id) => {
  return AUDIENCE_TYPE.find((a) => a.id === id).value;
};

function SendMessage({ classes, communities, users, meta, ...props }) {
  const [currentFilter, setCurrentFilter] = useState("SUPER_ADMIN");
  const [usersQuery, setQuery] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedCommunities, setSelectedCommunities] = React.useState([]);
  const [audience, setAudience] = React.useState([]);
  const [sub_audience_type, setSubAudienceType] = React.useState("FROM_COMMUNITY");
  const [loading, setLoading] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);


  const UrlParams = useParams();
  
  useEffect(() => {
    setSelectedCommunities([]);
    setAudience([]);
  }, [currentFilter]);

  useEffect(() => {
    const { id } = UrlParams;
    if (!id) return;

    if (props?.messages === LOADING) return;
    let message = (props.messages || [])?.filter(
      (m) => m.id?.toString() === id?.toString()
    )[0];
    if (message) {
      let {
        audience_type,
        sub_audience_type,
        audience,
        community_ids,
      } = message?.schedule_info?.recipients;

      setCurrentFilter(audience_type);
      setSubAudienceType(sub_audience_type);
      setQuery({
        message: message?.body,
        subject: message?.title,
      });
      fetchListOfAudience(audience, community_ids, audience_type);
    }
  }, [UrlParams?.id, props?.messages]);

  const SUB_AUDIENCE_TYPE = [
    { id: "FROM_COMMUNITY", value: "From Community" },
    { id: "SPECIFIC", value: `Specific ${getAudienceType(currentFilter)}` },
  ];

  if (props?.messages === LOADING) return <Loading />;

  const fetchListOfAudience = (audience_ids, community_id, audience_type) => {
    if (community_id) {
      apiCall("/communities.listForCommunityAdmin", {
        community_ids: community_id?.split(","),
      }).then((res) => {
        if (res?.success) {
          setSelectedCommunities(res?.data);
        }
      });
    }

    if (!isAll(audience_ids)) {
      let args = ["COMMUNITY_CONTACTS"].includes(audience_type)
        ? { community_ids: audience_ids }
        : { user_ids: audience_ids };
      if (audience_ids) {
        apiCall(getEndpoint(audience_type), args).then((res) => {
          if (res?.success) {
            setAudience(res?.data);
          }
        });
      }
    }
  };

  const buildQuery = (name, item) => {
    const obj = { ...usersQuery, [name]: item };
    setQuery(obj);
  };
  const getValue = (name, _default = null) => {
    if (!name) return null;
    return usersQuery[name] || _default;
  };

  const getEndpoint = (audience_type = currentFilter) => {
    if (audience_type === "COMMUNITY_CONTACTS")
      return "/communities.listForCommunityAdmin";
    return "/users.listNoPagination";
  };

  const toggleMembership = () => {
    if (currentFilter === "SUPER_ADMIN") return ["Super Admin"];
    else if (currentFilter === "COMMUNITY_ADMIN") return ["Community Admin"];
    else if (currentFilter === "COMMUNITY_CONTACTS")
      return ["Community Contact"];
    return ["Member"];
  };

  const isAll = (item) => {
    if (!item) return false;
    if (item?.includes("all")) return true;
    return false;
  };


  const audienceDisplayName = (item) => {
    if(currentFilter==="COMMUNITY_CONTACTS"){
      return `${item?.name}: ${item?.owner_name} (${item?.owner_email})`
    }
    return `${item?.full_name}(${item?.email})`;
  }

  const onFormSubmit = (data = usersQuery) => {
    setLoading(true);
     let msgs = props?.messages || [];
    data = {
      ...data,
      audience: isAll(audience) ? audience : audience?.map((a) => a.id),
      community_ids: selectedCommunities?.length ? selectedCommunities?.map((a) => a.id): null,
      audience_type:currentFilter,
      sub_audience_type: sub_audience_type,
    };
    if(UrlParams?.id){
      data.id = UrlParams.id;
    }
    setOpen(false);
    apiCall("/messages.send", data).then((res) => {
      setLoading(false);
      if (res?.success) {

        if(!UrlParams?.id){
          props.putScheduledMessagesToRedux([res?.data, ...msgs]);
          props.updateTableMeta({
            ...meta,
            ["scheduledMessages"]: {
              ...meta["scheduledMessages"],
              count: meta["scheduledMessages"].count + 1,
            },
          });

        }
        else{
          let filtered = msgs.filter((m) => m.id?.toString() !== UrlParams.id?.toString());
          props.putScheduledMessagesToRedux([res?.data, ...filtered]);
        }
        props.history.push(
          data?.schedule
            ? "/admin/scheduled/messages"
            : "/admin/read/community-admin-messages"
        );
      }
      else{
        console.log("MESSAGE_SEND_ERROR", res?.error);
        props?.toggleToast({
          open: true,
          message:
            "An error occurred while deleting the message",
          variant: "error",
        });
      }
      setOpen(false);
    });
  };
  const renderSubAudience = () => {
    if (["COMMUNITY_ADMIN", "USERS"].includes(currentFilter)) {
      return (
        <div>
          <FormLabel component="label">{"Filter Down the Audience"}</FormLabel>
          <RadioGroup
            value={sub_audience_type}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => {
              const value = ev.target.value;
              setSubAudienceType(value);
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
          defaultSelected={selectedCommunities || []}
          multiple={true}
          isAsync={true}
          endpoint={"/communities.listForSuperAdmin"}
          onChange={(selected) => setSelectedCommunities(selected)}
          data={[]}
          labelExtractor={(item) => item?.name}
          valueExtractor={(item) => item?.id}
        />
        <div>{renderAudienceForm()}</div>
      </>
    );
  };

  const renderAudienceForm = () => {
    let community = selectedCommunities || [];
    if (sub_audience_type === "FROM_COMMUNITY" && community?.length > 0) {
      community = community?.map((c) => c.name);
    }
    return (
      <>
        <FormLabel component="label">{"Audience"}</FormLabel>
        <LightAutoComplete
          defaultSelected={audience || []}
          multiple={true}
          isAsync={true}
          endpoint={getEndpoint()}
          params={{
            membership: toggleMembership(),
            community,
            sort_params: { name: "full_name", direction: "asc" },
          }}
          onChange={(selected) => setAudience(selected)}
          data={[]}
          labelExtractor={(item) => audienceDisplayName(item)}
          valueExtractor={(item) => item?.id}
          placeholder="Select audience"
          args={{ limit: 1000 }}
          key={currentFilter}
          showHiddenList={(items) => toggleFullAudienceListModal(items)}
          // renderItemsListDisplayName={(items) => renderAudienceListComponent(items)}
        />
      </>
    );
  };

  const renderAudienceList = () => {
    // const {sub_audience_type} = usersQuery
    if (["SUPER_ADMIN", "COMMUNITY_CONTACTS"].includes(currentFilter)) {
      return renderAudienceForm();
    }
    if (sub_audience_type === "SPECIFIC") {
      return renderAudienceForm();
    }

    if (sub_audience_type === "FROM_COMMUNITY") {
      return renderFromCommunities();
    }
  };

    const toggleFullAudienceListModal = (items) => {
      console.log('==items ===', items)
      setCheckedItems(items || []);
      console.log("=== checkedItems ===", checkedItems);
    const { toggleModal } = props;
    toggleModal({
      show: true,
      component: renderFullAudienceList(items),
      onConfirm: () => toggleModal({ show: false, component: null }),
      closeAfterConfirmation: true,
      title: "Full Communities List",
      noTitle: false,
      noCancel: true,
      okText: "Close",
    });
  }
  const handleChecked = (e, item) => {
    let itemAlreadyIn = checkedItems.filter((i) => i.id === item.id)?.length>0
    if (!itemAlreadyIn) {
      setCheckedItems([...checkedItems, item]);
    } else {
      setCheckedItems(checkedItems.filter((i) => i.id !== item.id));
    }
    
  }

  const renderFullAudienceList = (items) => {
    return(
       <Grid container spacing={1} sx={{maxHeight: "50vh", overflow: 'auto'}}>
        {items.map((item, index) => {
          return (
            <Grid item xs={6} md={6} lg={6} xl={6} key={index}>
              <Chip
                label={audienceDisplayName(item)}
                variant="outlined"
                icon={
                  <Checkbox
                    checked={checkedItems.filter((i) => i.id === item.id)?.length>0}
                    onChange={(e) => {
                      handleChecked(e, item);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                    // value={item?.id}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      border: "1px solid ##f6eeee",
                    }}
                  />
                }
              />
            </Grid>
          );
        })}
        </Grid>
    )
  };



  const renderAudienceListComponent = (items)=>{
    return <Button variant="outlined" onClick={() => toggleFullAudienceListModal(items)}>View All Selected Audience</Button>;
  }

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

        <>
          {loading ? (
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <LinearProgress />
            </Box>
          ) : (
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
          )}
        </>
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
  sadmins: state.getIn(["sadmins"]),
  messages: state.getIn(["scheduledMessages"]),
  meta: state.getIn(["paginationMetaData"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putScheduledMessagesToRedux: reduxLoadScheduledMessages,
      updateTableMeta: reduxLoadMetaDataAction,
      toggleToast: reduxToggleUniversalToast,
      toggleModal: reduxToggleUniversalModal,
    },
    dispatch
  );
};
const SendMessageWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMessage);
export default withStyles(styles)(withRouter(SendMessageWithProps));