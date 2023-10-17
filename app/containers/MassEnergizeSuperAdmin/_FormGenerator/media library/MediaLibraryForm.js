import {
  Chip,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import MEDropDown from "./MEDropDown";
import MEDropdownPro from "../../ME  Tools/dropdown/MEDropdownPro";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
import LightAutoComplete from "../../Gallery/tools/LightAutoComplete";
import AsyncDropDown from "../AsyncCheckBoxDropDown";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  COPYRIGHT_OPTIONS,
  PUB_MODES,
} from "../../ME  Tools/media library/shared/utils/values";
// import { Link } from "react-router-dom";

const MediaLibraryForm = ({
  auth,
  communities,
  onChange,
  imageForEdit,
  toggleSidePane,
  otherCommunities,
}) => {
  const [copyright, setCopyright] = useState(COPYRIGHT_OPTIONS.NO.key);
  const [underAge, setUnderAge] = useState("No");
  const [copyrightAtt, setCopyrightAtt] = useState("");
  const [guardianInfo, setGuardianInfo] = useState("");
  const [tags, setTags] = useState("");
  const [chosenComms, setCommunities] = useState([]);
  const [publicity, setPublicityChoice] = useState(PUB_MODES.OPEN_TO);
  const isInEditMode = imageForEdit;

  const fetchPermissionValue = (key) => {
    return COPYRIGHT_OPTIONS[key] || COPYRIGHT_OPTIONS.NO;
  };
  useEffect(() => {
    // idea here is that we want to export all the changes that happen in form data when they happen

    const permission = fetchPermissionValue(copyright);
    const formData = {
      permission_key: permission?.key,
      permission_notes: permission?.notes,
      copyright: permission?.value || false,
      underAge: underAge === "Yes" ? true : false,
      copyright_att: copyrightAtt,
      guardian_info: guardianInfo,
      community_ids: chosenComms,
      publicity,
      tags,
    };
    onChange && onChange(formData);
  }, [
    copyright,
    underAge,
    copyrightAtt,
    guardianInfo,
    tags,
    chosenComms,
    publicity,
  ]);

  useEffect(() => {
    if (!imageForEdit) return;
    const info = imageForEdit?.information?.info || {};
    const _tags = imageForEdit?.tags || [];
    const comms = imageForEdit?.information?.communities;
    const {
      guardian_info,
      copyright_att,
      has_children,
      has_copyright_permission,
      permission_key,
    } = info;

    setCopyrightAtt(copyright_att);
    // setCopyright(has_copyright_permission ? "Yes" : "No");
    setCopyright(permission_key);

    setGuardianInfo(guardian_info);
    setUnderAge(has_children ? "Yes" : "No");
    setCommunities(comms?.map((com) => com.id) || []);
    setPublicityChoice(
      imageForEdit?.information?.publicity || PUB_MODES.OPEN_TO
    );

    setTags(_tags?.map((t) => t.name).join(","));
  }, [imageForEdit]);

  useEffect(() => {
    // if user is an admin
    if (auth?.is_community_admin) {
      setCommunities((auth?.admin_at || []).map((c) => c.id));
    }
  }, []);
  // --------------------------------------------------------------------
  const permission = fetchPermissionValue(copyright);
  const doesNotHaveCopyrightPermission = !permission?.value;
  const hasUnderAgeContent = underAge === "Yes";
  const isSuperAdmin = !auth?.is_community_admin && auth?.is_super_admin;
  const isCommunityAdmin = auth?.is_community_admin && !auth?.is_super_admin;

  const chooseCommunity =
    (publicity === PUB_MODES.OPEN_TO && isCommunityAdmin) || isSuperAdmin;

  const isAnAdminCommunity = (com) => {
    let list = auth?.admin_at || [];
    list = list.map((c) => c.id);
    return list.includes(com?.id);
  };

  const getCommunitiesToSelectFrom = () => {
    let list = [];
    if (isCommunityAdmin) {
      list = auth?.admin_at || [];
      const ids = list.map((c) => c.id.toString());
      const without = otherCommunities.filter(
        (c) => !ids.includes(c.id.toString())
      );
      list = [...list, ...without];
    } else if (isSuperAdmin) list = communities || [];
    list.sort((a, b) =>
      b?.name.toLowerCase() > a?.name.toLowerCase() ? -1 : 1
    );
    return list;
  };

  const showChips = () => {
    const items = tags?.split(",").filter(Boolean);
    const empty = !items?.length;
    if (empty) return <></>;

    return items?.map((tag) => (
      <Chip label={tag?.trim()} style={{ margin: "5px 3px" }} />
    ));
  };

  return (
    <div style={{ padding: "25px 50px" }}>
      <Typography variant="h6">Hi {auth?.preferred_name || "..."},</Typography>
      {isInEditMode ? (
        <Typography variant="body2" style={{ marginBottom: 20 }}>
          <span>You are currently editing the details of</span>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              toggleSidePane(true);
            }}
            style={{ marginLeft: 4, cursor: "pointer" }}
          >
            this item!
          </Link>
        </Typography>
      ) : (
        <Typography variant="body2">
          To finish uploading to the media library, please provide the following
          information:
          {/* <ul style={{ margin: "5px 0px" }}>
            <li>
              {" "}
              Please note that the items marked <b>(*)</b> are compulsory.
            </li>
            <li>
              Whenever the <b>"Upload & Insert"</b> button is disabled, hover
              your mouse over it. It will tell you what you are missing!
            </li>
          </ul> */}
          <br />
        </Typography>
      )}
      <div style={{ padding: 0 }}>
        {/* <Typography variant="body2">Name of the uploader</Typography> */}
        <div style={{ width: 5, height: 5, opacity: 0 }}>
          <TextField
            style={{ width: "100%" }}
            label="You are marked as the uploader (autofilled) *"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { padding: "12.5px 14px" } }}
            value={auth?.preferred_name || "..."}
            disabled
          />
        </div>
        {/* ---- TODO: Change to async dropdown if user is a superadmin  */}

        <div style={{ marginTop: 10 }}>
          <Typography variant="body2" style={{ fontSize: "0.875rem" }}>
            Which communities would you like this item to be available to?
          </Typography>
          <div>
            <RadioGroup
              onChange={(e) => setPublicityChoice(e.target.value)}
              value={publicity}
            >
              <FormControlLabel
                name="open"
                value={PUB_MODES.OPEN}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    <Tooltip
                      title="Every community that exists on the platform"
                      placement="auto"
                      style={{ fontWeight: "bold" }}
                    >
                      All Communities
                    </Tooltip>
                  </Typography>
                }
              />
              <FormControlLabel
                open="open-to"
                value={PUB_MODES.OPEN_TO}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    <Tooltip
                      title="Select all or some of the communities you manage"
                      placement="auto"
                      style={{ fontWeight: "bold" }}
                    >
                      Choose from communities you manage
                    </Tooltip>
                  </Typography>
                }
              />
            </RadioGroup>
          </div>
          {chooseCommunity && (
            <MEDropdown
              multiple
              smartDropdown={!isCommunityAdmin}
              onItemSelected={(items) => setCommunities(items)}
              spotlightText="Communities you manage"
              spotlightExtractor={(com) => isAnAdminCommunity(com)}
              defaultValue={chosenComms}
              labelExtractor={(item) => item?.name}
              valueExtractor={(item) => item?.id}
              data={getCommunitiesToSelectFrom()}
              allowClearAndSelectAll
              placeholder="Select communities"
            />
          )}
        </div>

        <div
          style={{
            margin: "10px 0px",
            border: "solid 2px antiquewhite",
            padding: 20,
            background: "#faebd74d",
            borderRadius: 6,
          }}
        >
          <Typography variant="h6">Permissions </Typography>
          <div style={{ marginTop: 10 }}>
            <Typography variant="body2">
              Do you have permission to upload this image?
            </Typography>
            <RadioGroup
              value={copyright}
              name="copyright"
              // style={{ display: "inline" }}
              onChange={(ev) => setCopyright(ev.target.value)}
            >
              <FormControlLabel
                value={COPYRIGHT_OPTIONS.YES.key}
                name="copyright"
                control={<Radio />}
                label={
                  <Typography variant="body2">
                    Yes. I took the photo or made the image, or was given
                    permission by the person who made the image.
                  </Typography>
                }
              />
              <FormControlLabel
                value={COPYRIGHT_OPTIONS.YES_CHECKED.key}
                name="copyright"
                control={<Radio />}
                label={
                  <Typography variant="body2">
                    Yes. I have checked that the image is not copyright
                    protected.
                    <Link
                      href="https://www.pixsy.com/academy/image-user/verify-image-source-copyright-owner/"
                      target="_blank"
                      style={{ marginLeft: 5 }}
                    >
                      How can I check?
                    </Link>
                  </Typography>
                }
              />
              <FormControlLabel
                value={COPYRIGHT_OPTIONS.NO.key}
                name="copyright"
                control={<Radio />}
                label={
                  <Typography variant="body2">
                    No. The image may be protected by copyright, and I don’t
                    have permission.
                  </Typography>
                }
              />
            </RadioGroup>
            {!doesNotHaveCopyrightPermission && (
              <TextField
                style={{ width: "100%", marginTop: 10 }}
                label="If this item needs to be attributed, please type in the name of the owner of the copyright (200 chars)"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(ev) => setCopyrightAtt(ev.target.value)}
                inputProps={{
                  style: { padding: "12.5px 14px" },
                  maxLength: 200,
                }}
                value={copyrightAtt}
              />
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Typography variant="h6">Underage Consent </Typography>
            <Typography variant="body2" style={{ marginTop: 10 }}>
              Do any of the items contain recognizable images or visible
              depictions of children <b>under the age of 13,</b> and if so, do
              you have written consent from their guardians? If you do not have
              written consent, please do not use the image
            </Typography>
            <RadioGroup
              value={underAge}
              name="copyright"
              style={{ display: "inline", marginBottom: 6 }}
              onChange={(ev) => setUnderAge(ev.target.value)}
            >
              <FormControlLabel
                value="Yes"
                name="copyright"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                name="copyright"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
            {hasUnderAgeContent && (
              <TextField
                style={{ width: "100%", marginTop: 10 }}
                label="Add information of guardians (200 chars)"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(ev) => setGuardianInfo(ev.target.value)}
                inputProps={{
                  style: { padding: "12.5px 14px" },
                  maxLength: 200,
                }}
                value={guardianInfo}
              />
            )}
          </div>
        </div>
        <div>
          {/* <MEDropdown
            data={["Action", "Event", "Vendor"]}
            placeholder="What are you uploading this image for? (Event, Action, Vendor, Testimonial etc...)"
          /> */}

          <div style={{ margin: "10px 0px" }}>{showChips()}</div>
          <Typography
            variant="body2"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            Tags: Add words that describe the image subject, to make it more
            searchable in the image library. Separate multiple tags with a
            comma(,). (Example: Heat pump, Solar, Composting)
          </Typography>
          <TextField
            style={{ width: "100%" }}
            label="Add tags to your item"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { padding: "12.5px 14px" } }}
            onChange={(ev) => setTags(ev.target.value)}
            value={tags}
            required={false}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    imageForEdit: state.getIn(["imageBeingEdited"]),
    otherCommunities: state.getIn(["otherCommunities"]),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaLibraryForm);
