import {
  Chip,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
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
// import { Link } from "react-router-dom";

const MediaLibraryForm = ({
  auth,
  communities,
  onChange,
  imageForEdit,
  toggleSidePane,
}) => {
  const [copyright, setCopyright] = useState("No");
  const [underAge, setUnderAge] = useState("No");
  const [copyrightAtt, setCopyrightAtt] = useState("");
  const [guardianInfo, setGuardianInfo] = useState("");
  const [tags, setTags] = useState("");
  const [chosenComms, setCommunities] = useState([]);
  const isInEditMode = imageForEdit;

  useEffect(() => {
    // idea here is that we want to export all the changes that happen in form data when they happen
    const formData = {
      copyright: copyright === "Yes" ? true : false,
      underAge: underAge === "Yes" ? true : false,
      copyright_att: copyrightAtt,
      guardian_info: guardianInfo,
      community_ids: chosenComms,
      tags,
    };
    onChange && onChange(formData);
  }, [copyright, underAge, copyrightAtt, guardianInfo, tags, chosenComms]);

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
    } = info;

    setCopyrightAtt(copyright_att);
    setCopyright(has_copyright_permission ? "Yes" : "No");

    setGuardianInfo(guardian_info);
    setUnderAge(has_children ? "Yes" : "No");
    setCommunities(comms?.map((com) => com.id) || []);

    setTags(_tags?.map((t) => t.name).join(","));
  }, [imageForEdit]);

  // --------------------------------------------------------------------
  const doesNotHaveCopyrightPermission = !copyright || copyright === "No";
  const hasUnderAgeContent = underAge === "Yes";
  const isSuperAdmin = !auth?.is_community_admin && auth?.is_super_admin;
  const isCommunityAdmin = auth?.is_community_admin && !auth?.is_super_admin;

  const getCommunitiesToSelectFrom = () => {
    if (isCommunityAdmin) return auth?.admin_at;
    return communities || [];
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
        <Typography variant="body2" style={{marginBottom:20}}>
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
          Before you upload, there a few details you need to provide.
          <ul style={{ margin: "5px 0px" }}>
            <li>
              {" "}
              Please note that the items marked <b>(*)</b> are compulsory.
            </li>
            <li>
              Whenever the <b>"Upload & Insert"</b> button is disabled, hover
              your mouse over it. It will tell you what you are missing!
            </li>
          </ul>
          <br />
        </Typography>
      )}
      <div style={{ padding: 0 }}>
        {/* <Typography variant="body2">Name of the uploader</Typography> */}
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
        {/* ---- TODO: Change to async dropdown if user is a superadmin  */}
        <MEDropdown
          multiple
          onItemSelected={(items) => setCommunities(items)}
          defaultValue={chosenComms}
          labelExtractor={(item) => item?.name}
          valueExtractor={(item) => item?.id}
          data={getCommunitiesToSelectFrom()}
          placeholder="Which communities would you like this item to be available to? *"
        />

        <div
          style={{
            margin: "10px 0px",
            border: "solid 2px antiquewhite",
            padding: 20,
            background: "#faebd74d",
            borderRadius: 6,
          }}
        >
          <Typography variant="h6">Copyright </Typography>
          <div style={{ marginTop: 10 }}>
            <Typography variant="body2">
              Do you have permission to use the selected items? As per the
              <Link
                href="/admin/view/policy/mou"
                target="_blank"
                style={{ marginLeft: 4 }}
              >
                <b>MassEnergize MOU</b>
              </Link>
              , you are required to have permission before uploading other
              people's content. If No, please provide information about the
              owner of this item's copyright in the box that will be provided.
            </Typography>
            <RadioGroup
              value={copyright}
              name="copyright"
              style={{ display: "inline" }}
              onChange={(ev) => setCopyright(ev.target.value)}
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
            {doesNotHaveCopyrightPermission && (
              <TextField
                style={{ width: "100%", marginTop: 10 }}
                label="Who should this item be attributed to? (40 chars) *"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(ev) => setCopyrightAtt(ev.target.value)}
                inputProps={{
                  style: { padding: "12.5px 14px" },
                  maxLength: 40,
                }}
                value={copyrightAtt}
              />
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Typography variant="h6">Underage Consent </Typography>
            <Typography variant="body2" style={{ marginTop: 10 }}>
              Do any of the items contain recognizable images or visible
              depictions of children <b>under the age of 13</b>? If yes, please
              provide consent information in the box shown below
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
                label="Add information of guardians (40 chars)"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(ev) => setGuardianInfo(ev.target.value)}
                inputProps={{
                  style: { padding: "12.5px 14px" },
                  maxLength: 40,
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
            Tags: Add words that describe what this item is about. Separate each
            with a comma(,) (E.g. climate,solar,green etc)
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
  return { imageForEdit: state.getIn(["imageBeingEdited"]) };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaLibraryForm);
