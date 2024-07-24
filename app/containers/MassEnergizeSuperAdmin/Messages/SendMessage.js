import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@mui/styles';

import { useParams, withRouter } from 'react-router-dom';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Loading from 'dan-components/Loading';
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import Seo from '../../../components/Seo/Seo';
import styles from '../../../components/Widget/widget-jss';
import TinyEditor from '../_FormGenerator/TinyMassEnergizeEditor';
import LightAutoComplete from '../Gallery/tools/LightAutoComplete';
import ScheduleMessageModal from './ScheduleMessageModal';
import { apiCall } from '../../../utils/messenger';
import { AUDIENCES_CONFIG, LOADING } from '../../../utils/constants';
import {
  cacheMessageInfoAction,
  reduxLoadMetaDataAction,
  reduxLoadScheduledMessages,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast
} from '../../../redux/redux-actions/adminActions';
import FullAudienceList from './FullAudienceList';
import MEDropdown from '../ME  Tools/dropdown/MEDropdown';

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;
/**
 *
 * whenever audience type changes reset audience
 */

const SUPER_ADMIN = "SUPER_ADMIN";
const COMMUNITY_CONTACTS = "COMMUNITY_CONTACTS";
const COMMUNITY_ADMIN = "COMMUNITY_ADMIN";
const USERS = "USERS";

const AUDIENCE_TYPE = [
  { id: SUPER_ADMIN, value: "Super Admins" },
  { id: COMMUNITY_CONTACTS, value: "Community Contacts" },
  { id: COMMUNITY_ADMIN, value: "Community Admins" },
  { id: USERS, value: "Users" },
];

const getAudienceType = (id) => AUDIENCE_TYPE?.find((a) => a?.id === id)?.value;

const args = {
  limit: 5,
  params: JSON.stringify({
    membership: ["Super Admin"]
  })
};

function SendMessage({
  classes, meta, auth, ...props 
}) {
  const [currentFilter, setCurrentFilter] = useState(!auth?.is_super_admin ? COMMUNITY_ADMIN : SUPER_ADMIN);
  const [usersQuery, setQuery] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedCommunities, setSelectedCommunities] = React.useState([]);
  const [audience, setAudience] = React.useState([]);
  const [sub_audience_type, setSubAudienceType] = React.useState("FROM_COMMUNITY");
  const [loading, setLoading] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [message, setMessage] = React.useState({});

  const UrlParams = useParams();

  const SUB_AUDIENCE_TYPE = [
    { id: "FROM_COMMUNITY", value: "From Community" },
    { id: "SPECIFIC", value: `Specific ${getAudienceType(currentFilter)}`, },
  ];

  useEffect(() => {
    setSelectedCommunities([]);
    setAudience([]);
  }, [currentFilter, sub_audience_type]);


  useEffect(() => {
    const { id } = UrlParams;
    const { cachedMessageInfo, saveMessageInfoToCache } = props;
    if (!id) return;
    setLoading(true);
    const cache = cachedMessageInfo[id];

    if (cache) {
      const { audience_type, sub_audience_type, audience, community_ids } = cache?.schedule_info?.recipients;

      const _audience = audience !== "all" ? audience : [audience];
      setSelectedCommunities(community_ids);
      setAudience(_audience);
      setCurrentFilter(audience_type);
      setSubAudienceType(sub_audience_type);
      setQuery({ message: cache?.body, subject: cache?.title });
      setMessage(cache);
      setLoading(false);
      return;
    }

    apiCall("/messages.info", { message_id: id }).then((res) => {

      if (res?.success) {

        saveMessageInfoToCache({ ...cachedMessageInfo, [id]: res?.data });
        setMessage(res?.data);

        const {audience_type, sub_audience_type, audience, community_ids} = res?.data?.schedule_info?.recipients;

        const _audience = audience !== "all" ? audience : [audience];
        setSelectedCommunities(community_ids);
        setAudience(_audience);
        setCurrentFilter(audience_type);
        setSubAudienceType(sub_audience_type);
        setQuery({ message: res?.data?.body, subject: res?.data?.title });
      }
      setLoading(false);
    });
  }, [UrlParams?.id, props?.cachedMessageInfo, message]);


  const buildQuery = (name, item) => {
    const obj = { ...usersQuery, [name]: item };
    setQuery(obj);
  };
  const getValue = (name, _default = null) => {
    if (!name) return null;
    return usersQuery[name] || _default;
  };

  const isAll = (item) => {
    if (!item) return false;
    if (item?.includes("all")) return true;
    return false;
  };

  const getAudienceList = (audience_type) => {
    switch (audience_type) {
      case SUPER_ADMIN:
        return allUsers?.filter((u) => u.is_super_admin) || [];
      case COMMUNITY_CONTACTS:
        return props.communities;
          
      case COMMUNITY_ADMIN:
        // eslint-disable-next-line no-case-declarations
        const allCadmin = [];
        if (selectedCommunities?.length) {
          return allCadmin?.filter((obj1) => obj1?.communities?.some((name1) => selectedCommunities?.some((obj2) => obj2?.name === name1)));
        }
        return allCadmin;
      default:
        if (selectedCommunities?.length) {
          return allUsers?.filter((obj1) => obj1?.communities?.some((name1) => selectedCommunities?.some((obj2) => obj2?.name === name1)));
        }
        return allUsers?.filter((u) => !u?.is_super_admin || !u?.is_community_admin) || [];
    }
  };


  const audienceDisplayName = (item) => {
    if (currentFilter === COMMUNITY_CONTACTS) {
      return `${item?.name}: ${item?.owner_name} (${item?.owner_email})`;
    }
    return `${item?.full_name}(${item?.email})`;
  };

  const dataValidated = (data) => {
    if (!data?.audience) return false;
    if (!data?.message) return false;
    if (!data?.subject) return false;
    return true;
  };

  const onFormSubmit = (data = usersQuery) => {
    const msgs = props?.messages || [];
    data = {
      ...data,
      audience: isAll(audience) ? audience : audience?.map((a) => a.id),
      community_ids: selectedCommunities?.length ? selectedCommunities?.map((a) => a.id) : null,
      audience_type: currentFilter,
      sub_audience_type,
    };
    if (UrlParams?.id) {
      data.id = UrlParams.id;
    }
    if (!dataValidated(data)) {
      props?.toggleToast({
        open: true,
        message: "Please ensure audience, message and subject are provided",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    setOpen(false);
    apiCall("/messages.send", data).then((res) => {
      setLoading(false);
      if (res?.success) {
        if (!UrlParams?.id) {
          props.putScheduledMessagesToRedux([res?.data, ...msgs]);
          props.updateTableMeta({
            ...meta,
            scheduledMessages: {
              ...meta.scheduledMessages,
              count: meta.scheduledMessages.count + 1,
            },
          });
        } else {
          const filtered = msgs.filter((m) => m.id?.toString() !== UrlParams.id?.toString());
          props.putScheduledMessagesToRedux([res?.data, ...filtered]);
        }
        props.history.push(
          data?.schedule
            ? "/admin/scheduled/messages"
            : "/admin/read/community-admin-messages"
        );
      } else {
        console.log("MESSAGE_SEND_ERROR", res?.error);
        props?.toggleToast({
          open: true,
          message:
            "An error occurred while sending the message",
          variant: "error",
        });
      }
      setOpen(false);
    });
  };

  const renderSubAudience = () => {
    if ([COMMUNITY_ADMIN, USERS].includes(currentFilter)) {
      return (
        <div>
          <FormLabel component="label">Filter Down the Audience</FormLabel>
          <RadioGroup
            value={sub_audience_type}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => {
              const { value } = ev.target;
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

  const renderFromCommunities = () => (
    <>
      <FormLabel component="label">Communities</FormLabel>
      <LightAutoComplete
        defaultSelected={selectedCommunities || []}
        multiple
        onChange={(selected) => setSelectedCommunities(selected)}
        data={props.communities || []}
        labelExtractor={(item) => item?.name}
        valueExtractor={(item) => item?.id}
        endpoint="/communities.listForCommunityAdmin"
        showSelectAll={false}
        // key={props.communities?.length}
      />
      <div>{renderAudienceForm()}</div>

    </>
  );

  const loadMoreAudienceParams = (audienceType, subOrdienceType = null) => {
    if (!AUDIENCES_CONFIG[audienceType]) {
      throw new Error(`Unsupported audience type: ${audienceType}`);
    }

    const audienceConfig = { ...AUDIENCES_CONFIG[audienceType] };

    if (
      (audienceType === COMMUNITY_ADMIN || audienceType === USERS)
      && subOrdienceType === "FROM_COMMUNITY"
    ) {
      audienceConfig.params.community = selectedCommunities?.map((c) => c.id);
    }

    return audienceConfig;
  };

  const renderAudienceForm = () => {
    let community = selectedCommunities || [];
    if (sub_audience_type === "FROM_COMMUNITY" && community?.length > 0) {
      community = community?.map((c) => c.name);
    }
    const data = getAudienceList(currentFilter) || [];
    const params = loadMoreAudienceParams(currentFilter, sub_audience_type);
    return (
      <>
        <FormLabel component="label">Audience</FormLabel>
        <LightAutoComplete
          defaultSelected={audience || []}
          multiple
          onChange={(selected) => setAudience(selected)}
          data={data}
          labelExtractor={(item) => audienceDisplayName(item)}
          valueExtractor={(item) => item?.id}
          placeholder="Select audience"
          key={data?.length + selectedCommunities?.length}
          showHiddenList={(items, setItems) => toggleFullAudienceListModal(items, setItems)}
          shortenListAfter={5}
          endpoint={params.endpoint}
          params={params.params}
          selectAllV2
        />
      </>
    );
  };

  const renderAudienceList = () => {
    if ([SUPER_ADMIN, COMMUNITY_CONTACTS].includes(currentFilter)) return renderAudienceForm();
    if (sub_audience_type === "SPECIFIC") return renderAudienceForm();
    if (sub_audience_type === "FROM_COMMUNITY") return renderFromCommunities();
  };

  const toggleFullAudienceListModal = (items, setItems) => {
    const { toggleModal } = props;
    toggleModal({
      show: true,
      component: (
        <FullAudienceList
          items={items}
          audienceDisplayName={audienceDisplayName}
          setItems={setItems}
          onCancel={() => toggleModal({ show: false, component: null })}
        />
      ),
      closeAfterConfirmation: true,
      title: "Full Audience List",
      noTitle: false,
      noCancel: false,
      okText: "Save",
      cancelText: "Cancel",
      fullControl: true,
    });
  };


  if (props?.messages === LOADING || loading) return <Loading />;

  return (
    <PapperBlock
      title="Send Message"
      desc="Send a message to all audience or specific audience."
    >
      <Seo name="Send Message" />
      <>
        {auth?.is_super_admin ? (
          <>
            <FormLabel>Audience Type</FormLabel>
            <RadioGroup
              value={currentFilter}
              style={{ display: "flex", flexDirection: "row" }}
              onChange={(ev) => {
                const { value } = ev.target;
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
          </>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              {/* <FormLabel component="label">{"Select Community "}</FormLabel> */}
              <MEDropdown
                onItemSelected={(items) => setSelectedCommunities(items)}
                defaultValue={selectedCommunities || []}
                smartDropdown={false}
                labelExtractor={(item) => item?.name}
                valueExtractor={(item) => item}
                data={props.communities}
                placeholder="Choose the community from which you want this message to originate"
                sx={{ height: 56 }}
              />
            </div>
            {renderAudienceForm()}
          </>
        )}

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
          <Typography>Body</Typography>
          <TinyEditor
            id="message"
            value={getValue("message", "")}
            onEditorChange={(content) => {
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
          {!loading && (
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
  messages: state.getIn(["scheduledMessages"]),
  meta: state.getIn(["paginationMetaData"]),
  users: state.getIn(["allUsers"]),
  cachedMessageInfo: state.getIn(["messageInfoCache"]),
});
const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    putScheduledMessagesToRedux: reduxLoadScheduledMessages,
    updateTableMeta: reduxLoadMetaDataAction,
    toggleToast: reduxToggleUniversalToast,
    toggleModal: reduxToggleUniversalModal,
    saveMessageInfoToCache: cacheMessageInfoAction,
  },
  dispatch
);
const SendMessageWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMessage);
export default withStyles(styles)(withRouter(SendMessageWithProps));
