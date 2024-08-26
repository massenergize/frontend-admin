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
import {
  ACTIONS,
  SUPER_ADMIN_AUDIENCE,
  AUDIENCES_CONFIG,
  COMMUNITY_ADMIN,
  COMMUNITY_CONTACTS,
  LOADING,
  // eslint-disable-next-line import/named
  SUPER_ADMIN, USERS, COMMUNITY_ADMIN_AUDIENCE, FROM_COMMUNITY, ALL
} from '../../../utils/constants';
import {
  cacheMessageInfoAction,
  reduxLoadMetaDataAction,
  reduxLoadScheduledMessages,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast
} from '../../../redux/redux-actions/adminActions';
import FullAudienceList from './FullAudienceList';

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;
/**
 *
 * whenever audience type changes reset audience
 */


function SendMessage({
  classes, meta, auth, ...props 
}) {
  const [currentFilter, setCurrentFilter] = useState(!auth?.is_super_admin ? COMMUNITY_ADMIN : SUPER_ADMIN);
  const [usersQuery, setQuery] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedCommunities, setSelectedCommunities] = React.useState([]);
  const [audience, setAudience] = React.useState([]);
  const [sub_audience_type, setSubAudienceType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [message, setMessage] = React.useState({});

  const AUDIENCE = !auth?.is_super_admin ? COMMUNITY_ADMIN_AUDIENCE : SUPER_ADMIN_AUDIENCE;

  const UrlParams = useParams();
  

  useEffect(() => {
    setSelectedCommunities([]);
    setAudience([]);
  }, [currentFilter, sub_audience_type]);


  useEffect(() => {
    const sub = AUDIENCE?.find((a) => a.id === currentFilter)?.subType;
    if (sub) {
      const defaultSubType = sub?.find((a) => a.default)?.id;
      setSubAudienceType(defaultSubType);
    }
  }, [currentFilter]);



  useEffect(() => {
    const { id } = UrlParams;
    const { cachedMessageInfo, saveMessageInfoToCache } = props;
    if (!id) return;
    setLoading(true);
    const cache = cachedMessageInfo[id];

    if (cache) {
      const {
        audience_type, sub_audience_type, audience, community_ids 
      } = cache?.schedule_info?.recipients;

      const _audience = audience !== ALL ? audience : [audience];
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

        const {
          audience_type, sub_audience_type, audience, community_ids 
        } = res?.data?.schedule_info?.recipients;

        const _audience = audience !== ALL ? audience : [audience];
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
    if (item?.includes(ALL)) return true;
    return false;
  };

  const getAudienceList = (audience_type) => {
    switch (audience_type) {
      case SUPER_ADMIN:
        return allUsers?.filter((u) => u.is_super_admin) || [];
      case COMMUNITY_CONTACTS:
        return props.communities;
      case ACTIONS:
        return props.actionsList?.filter((a) => a?.action_users > 0) || [];
      default:
        return [];
    }
  };


  const audienceDisplayName = (item) => {
    if (currentFilter === COMMUNITY_CONTACTS) {
      return `${item?.name}: ${item?.owner_name} (${item?.owner_email})`;
    }
    if (currentFilter === ACTIONS) {
      return `${item?.title} (${item?.community?.name || "N/A"}) - ${item?.action_users} users`;
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
          props.saveMessageInfoToCache({ ...props.cachedMessageInfo, [UrlParams.id]: null });
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
  
  const toggleSelectAll = () => {
    if (currentFilter === ACTIONS) return false;
    return true;
  };

  const renderSubAudience = () => {
    const subType = AUDIENCE.find((a) => a.id === currentFilter)?.subType;
    if (!subType) return renderAudienceForm();

    return (
      <>
        <FormLabel component="label">Specific Audience Category</FormLabel>
        <RadioGroup
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
          value={sub_audience_type}
          onChange={(ev) => {
            const { value } = ev.target;
            setSubAudienceType(value);
          }}
        >
          {subType.map((option) => (
            <div key={option.id} style={{ display: 'block' }}>
              <FormControlLabel
                name={option.id}
                value={option.id}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <Tooltip
                      title={'Filter by ' + option.value}
                      placement="top"
                      style={{ fontWeight: 'bold' }}
                    >
                      {option.value}
                    </Tooltip>
                  </Typography>
                }
              />
            </div>
          ))}
        </RadioGroup>
        {sub_audience_type === FROM_COMMUNITY ? renderFromCommunities() : renderAudienceForm()}
      </>
    );
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
      && subOrdienceType === FROM_COMMUNITY
    ) {
      audienceConfig.params.community = selectedCommunities?.map((c) => c.id);
    }

    return audienceConfig;
  };

  const renderAudienceForm = () => {
    let community = selectedCommunities || [];
    if (sub_audience_type === FROM_COMMUNITY && community?.length > 0) {
      community = community?.map((c) => c.name);
    }
    const data = getAudienceList(currentFilter) || [];
    const params = loadMoreAudienceParams(currentFilter, sub_audience_type);
    const _audience = AUDIENCE.find((a) => a.id === currentFilter);
    return (
      <>
        <FormLabel component="label">{_audience?.audienceLabelText || "Audience"}</FormLabel>
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
          showSelectAll={toggleSelectAll()}
        />
      </>
    );
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
        <FormLabel component="label">Audience Category</FormLabel>
        <RadioGroup
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
          value={currentFilter}
          onChange={(ev) => {
            const { value } = ev.target;
            buildQuery('audience_type', value);
            setCurrentFilter(value);
          }}
        >
          {AUDIENCE.map((option) => (
            <div key={option.key} style={{ display: 'block' }}>
              <FormControlLabel
                name={option.key}
                value={option.id}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <Tooltip
                      title={'Filter by ' + option.value}
                      placement="top"
                      style={{ fontWeight: 'bold' }}
                    >
                      {option.value}
                    </Tooltip>
                  </Typography>
                }
              />
            </div>
          ))}
        </RadioGroup>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          {renderSubAudience() }
        </div>
      </>

      <div style={{ marginTop: 20 }}>
        <FormLabel component="label">Message Subject</FormLabel>
        <TextField
          fullWidth
          label=""
          value={getValue('subject', '')}
          id="fullWidth"
          onChange={(e) => buildQuery('subject', e.target.value)}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <FormLabel component="label">Message Body</FormLabel>
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
  actionsList: state.getIn(["allActions"]),
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
