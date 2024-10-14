import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FormLabel, Tooltip, Typography, Button } from "@mui/material";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import Seo from "../../../components/Seo/Seo";
import CustomPageTitle from "../Misc/CustomPageTitle";
import GoBack from "../../Pages/CustomPages/Frags/GoBack";
import useCommunityFromURL from '../../../utils/hooks/useCommunityHook';
import { fetchParamsFromURL } from '../../../utils/common';
import LightAutoComplete from '../Gallery/tools/LightAutoComplete';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import { saveCommunityTestimonialAutoShareSettingsAction } from '../../../redux/redux-actions/adminActions';
import LinearBuffer from '../../../components/Massenergize/LinearBuffer'
import { Paper, Alert } from "@mui/material";
import TextField from '@mui/material/TextField';
import MEDropdown from '../ME  Tools/dropdown/MEDropdown';

const TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY = "testimonial_auto_share_settings";
const COMMUNITIES = "Communities";
const GEO_RANGE = "Geographical Range";

const ENDPOINTS = {
  [TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY]: {
    saveItems: "testimonials.autoshare.settings.update",
    fetchItems: "community.testimonial.autoshare.settings.info",
  },
};

const SHARING_AUDIENCE_TYPE = {
  [COMMUNITIES]: COMMUNITIES,
  [GEO_RANGE]: GEO_RANGE,
}

const AutoShareSettings = () => {
  const community = useCommunityFromURL();
  const { comId } = fetchParamsFromURL(window.location, "comId");
  const [loadPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(null);


  const dispatch = useDispatch();

  const allCategories = useSelector((state) => state.getIn(["allTags"]));
  const testimonialSettings = useSelector((state) => state.getIn(['testimonialAutoShareSettings']));
  const communities = useSelector((state) => state.getIn(['allCommunities']));

  const [form, setForm] = useState({ [TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY]: testimonialSettings });

  const isGeoRange = testimonialSettings?.share_from_communities?.length === 0;
  const [selectedOption, setSelectedOption] = useState(COMMUNITIES);

  useEffect(() => {
    if (!comId || testimonialSettings?.id) return;
    setLoadingPage(true);
    apiCall(ENDPOINTS[TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY].fetchItems, { community_id: comId })
      .then((response) => {
        if (response?.success) {
          const data = response?.data || {};
          setForm((prev) => ({ ...prev, [TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY]: data }));
          dispatch(saveCommunityTestimonialAutoShareSettingsAction(data));
        } else {
          console.error("Error fetching testimonial auto share settings", response);
        }
      })
      .finally(() => setLoadingPage(false));
  }, [comId, testimonialSettings, dispatch]);

  const category = useMemo(() => allCategories?.find((c) => c?.name === "Category"), [allCategories]);
  const tags = useMemo(() => category?.tags || [], [category]);

  const getValue = useCallback((sectionKey) => form[sectionKey], [form]);

  const saveChanges = useCallback((sectionKey) => {
    const _data = getValue(sectionKey);
    const endpoint = ENDPOINTS[sectionKey]?.saveItems;
    const dataToSend = {
      community_id: comId,
      excluded_tags: _data?.excluded_tags?.map((t) => t.id) || [],
      share_from_communities: _data?.share_from_communities?.map((c) => c.id) || [],
    };

    setLoading(sectionKey);
    apiCall(endpoint, dataToSend)
      .then((response) => {
        if (response?.success) {
          dispatch(saveCommunityTestimonialAutoShareSettingsAction(response?.data));
        }
      })
      .finally(() => setLoading(null));
  }, [comId, getValue, dispatch]);

  const setSectionValue = useCallback((sectionKey, key, value) => {
    setForm((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [key]: value },
    }));
  }, []);



  const renderSaveFunction = (sectionKey) =>{
    return <Tooltip placement="top" title="Save changes to the auto share settings for this community.">
      <div style={{ display: "inline" }}>
        <Button
          disabled={false}
          variant="contained"
          color="primary"
          style={{}}
          onClick={() => saveChanges(sectionKey)}
        >
          {(loading===sectionKey) ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
        </Button>
      </div>
    </Tooltip>;
  }

  const AutoShareSettingsForm = ({ sectionKey }) => (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div style={{padding: '15px 25px', border: '1px solid #bfbebe2b', borderRadius: 10 }}>
      <div>
      {/* <MEDropdown
        defaultValue={[selectedOption]}
        data={[{ key: COMMUNITIES, name: COMMUNITIES }, { key: GEO_RANGE, name: "Geographical Range" }]}
        labelExtractor={(it) => it.name}
        valueExtractor={(it) => it.key}
        placeholder="Select the type of sharing"
        onItemSelected={(items) => {
          console.log("Selected", items);
          setSelectedOption(items[0]);
        }}
      /> */}

      {/* {selectedOption === GEO_RANGE ?  (  
         <div>
        <FormLabel component="label">Select ZipCode to receive testimonials from automatically</FormLabel>
        <div style={{ marginTop: 10, marginBottom:15 }}>
          <TextField fullWidth label="Zip Code" id="fullWidth" />
        </div>
      </div>): ( */}
        <div>
          <FormLabel component="label">Select Communities to auto share with</FormLabel>
          <LightAutoComplete
            defaultSelected={getValue(sectionKey)?.share_from_communities || []}
            multiple
            onChange={(selected) => setSectionValue(sectionKey, "share_from_communities", selected)}
            data={[]}
            labelExtractor={(item) => item?.name}
            valueExtractor={(item) => item?.id}
            endpoint="/communities.listForCommunityAdmin"
            showSelectAll={false}
          />
        </div>

      {/* )} */}
      </div>
     
        {/* <div style={{marginTop:10, marginBottom:10}}>
        <FormLabel component="label">Select Categories to auto Share with</FormLabel>
        <LightAutoComplete
          defaultSelected={getValue(sectionKey)?.excluded_tags || []}
          multiple
          onChange={(selected) => setSectionValue(sectionKey, "excluded_tags", selected)}
          data={tags}
          labelExtractor={(item) => item?.name}
          valueExtractor={(item) => item?.id}
          showSelectAll={false}
          label="Select Categories"
        />
        </div> */}
     {renderSaveFunction(sectionKey)}
      </div>
      <div style={{marginTop: 15, padding: '15px 25px', border: '1px solid #bfbebe2b', borderRadius: 10 }}>
        <FormLabel component="label">Select Categories to auto Share with</FormLabel>
        <LightAutoComplete
          defaultSelected={getValue(sectionKey)?.excluded_tags || []}
          multiple
          onChange={(selected) => setSectionValue(sectionKey, "excluded_tags", selected)}
          data={tags}
          labelExtractor={(item) => item?.name}
          valueExtractor={(item) => item?.id}
          showSelectAll={false}
          label="Select Categories"
        />
        {renderSaveFunction(sectionKey)}
      </div>

    </div>
  );

  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;

  return (
    <div>
      <Seo name="Auto Share Settings" />
      <CustomPageTitle>
        Auto Share Settings for <b>{community?.name || "..."}</b>
      </CustomPageTitle>
      <div style={{ marginBottom: 15 }}><GoBack /></div>
      <MEPaperBlock>
        <Typography variant="h5">Testimonials Auto Share Settings</Typography>
        <Typography style={{ marginTop: 5 }}>
          This settings allows you to automatically share testimonials from other communities or categories with this community. When a
          testimonial is published from any of the communities selected below or from any of the categories selected below, it will be automatically shared with your community.
        </Typography>
        <AutoShareSettingsForm sectionKey={TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY} />
      </MEPaperBlock>
    </div>
  );
};

export default AutoShareSettings;