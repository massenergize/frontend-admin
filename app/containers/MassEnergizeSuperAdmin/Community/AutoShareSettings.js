import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FormLabel, Tooltip, Typography, Button } from "@mui/material";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import Seo from "../../../components/Seo/Seo";
import CustomPageTitle from "../Misc/CustomPageTitle";
import GoBack from "../../Pages/CustomPages/Frags/GoBack";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
import { fetchParamsFromURL, isEmpty } from "../../../utils/common";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import { saveCommunityTestimonialAutoShareSettingsAction } from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";

const TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY = "testimonial_auto_share_settings";
const RESET = "reset";

const AutoShareSettings = () => {
  const community = useCommunityFromURL();
  const { comId } = fetchParamsFromURL(window.location, "comId");
  const [loadPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(null);

  const dispatch = useDispatch();

  const allCategories = useSelector((state) => state.getIn(["allTags"]));
  const testimonialSettings = useSelector((state) => state.getIn(["testimonialAutoShareSettings"]));
  const allcommunities = useSelector((state) => state.getIn(["communities"]));

  const [form, setForm] = useState({ [TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY]: testimonialSettings });

  useEffect(() => {
    if (!comId || testimonialSettings?.id) return;
    setLoadingPage(true);
    apiCall("community.testimonial.autoshare.settings.info", { community_id: comId })
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
  }, [comId, dispatch]);

  const category = useMemo(() => allCategories?.find((c) => c?.name === "Category"), [allCategories]);
  const tags = useMemo(() => category?.tags || [], [category]);
  const communities = useMemo(() => allcommunities || [], [allcommunities]);

  const getValue = useCallback((sectionKey) => form[sectionKey], [form]);

  const saveChanges = useCallback(
    (sectionKey, endpoint) => {
      const _data = getValue(sectionKey);

      const dataToSend = {
        community_id: comId,
        excluded_tags: isEmpty(_data?.excluded_tags) ? RESET : _data?.excluded_tags?.map((t) => t.id) || [],
        share_from_communities: isEmpty(_data?.share_from_communities)
          ? RESET
          : _data?.share_from_communities?.map((c) => c.id) || []
      };
      setLoading(sectionKey);
      apiCall(endpoint, dataToSend)
        .then((response) => {
          if (response?.success) {
            dispatch(saveCommunityTestimonialAutoShareSettingsAction(response?.data));
          }
        })
        .finally(() => setLoading(null));
    },
    [comId, getValue, dispatch]
  );

  const setSectionValue = useCallback((sectionKey, key, value) => {
    setForm((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [key]: value }
    }));
  }, []);

  const PAGE_CONFIG = [
    {
      key: TESTIMONIAL_AUTO_SHARE_SETTINGS_KEY,
      title: "Testimonials Auto Share Settings",
      description:
        "This settings allows you to automatically share testimonials from other communities or categories with this community. When a testimonial is published from any of the communities selected below or from any of the categories selected below, it will be automatically shared with your community.",
      updateEndpoint: "testimonials.autoshare.settings.update",
      formFields: [
        {
          key: "share_from_communities",
          label: "Select Communities",
          type: "autocomplete",
          multiple: true,
          valueExtractor: (item) => item?.id,
          labelExtractor: (item) => item?.name,
          data: communities || []
        },
        {
          key: "excluded_tags",
          label: "Select Categories to auto Share with",
          type: "autocomplete",
          multiple: true,
          valueExtractor: (item) => item?.id,
          labelExtractor: (item) => item?.name,
          data: tags || []
        }
      ]
    }
  ];

  const renderSaveFunction = (sectionKey, endpoint) => {
    return (
      <Tooltip placement="top" title="Save changes to the auto share settings for this community.">
        <div style={{ display: "inline" }}>
          <Button
            disabled={false}
            variant="contained"
            color="primary"
            style={{}}
            onClick={() => saveChanges(sectionKey, endpoint)}
          >
            {loading === sectionKey ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
          </Button>
        </div>
      </Tooltip>
    );
  };

  const AutoShareSettingsForm = ({ sectionKey, formFields, endpoint }) => (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      {formFields?.map((field) => {
        const value = getValue(sectionKey)?.[field.key];
        return (
          <div key={field.key} style={{ marginTop: 20 }}>
            <FormLabel>{field.label}</FormLabel>
            {field.type === "autocomplete" && (
              <LightAutoComplete
                defaultSelected={value}
                multiple={field.multiple}
                endpoint={field.endpoint}
                valueExtractor={field.valueExtractor}
                labelExtractor={field.labelExtractor}
                onChange={(value) => setSectionValue(sectionKey, field.key, value)}
                data={field.data}
              />
            )}
          </div>
        );
      })}

      {renderSaveFunction(sectionKey, endpoint)}
    </div>
  );

  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;

  return (
    <div>
      <Seo name="Auto Share Settings" />
      <CustomPageTitle>
        Auto Share Settings for <b>{community?.name || "..."}</b>
      </CustomPageTitle>
      <div style={{ marginBottom: 15 }}>
        <GoBack />
      </div>
      {PAGE_CONFIG.map((page) => (
        <MEPaperBlock key={page.key}>
          <Typography variant="h5">{page.title}</Typography>
          <Typography style={{ marginTop: 5 }}>{page.description}</Typography>
          {AutoShareSettingsForm({ sectionKey: page.key, formFields: page.formFields, endpoint: page.updateEndpoint })}
        </MEPaperBlock>
      ))}
    </div>
  );
};

export default AutoShareSettings;
