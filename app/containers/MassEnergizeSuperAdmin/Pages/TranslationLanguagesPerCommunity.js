import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, Typography } from "@mui/material";

import { withStyles } from "@mui/styles";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { LANGUAGES } from "../../App/internationalization/language-set";
import ToggleSwitch from "../../../components/Toggle Switch/ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import { reduxLoadOfferedLanguages } from "../../../redux/redux-actions/adminActions";

const EMAIL_OF_MASSENERGIZE_REPRESENTATIVE = "brad@massenergize.org";
function TranslationLanguagesPerCommunity({ classes }) {
  const languages = useSelector((state) => state.getIn(["languageSet"]));
  const offered = useSelector((state) => state.getIn(["offeredLanguages"]));
  const dispatch = useDispatch();

  const putOfferedInRedux = (data) => {
    dispatch(reduxLoadOfferedLanguages(data));
  };

  console.log("OFFERED", offered);

  const toggleLanguage = (lObj, source) => {
    console.log("LOBJ", lObj);
    const found = (source || {})[lObj.value];
    let data;
    if (!found) data = { ...source, [lObj?.value]: lObj?.name };
    else {
      data = { ...source };
      delete data[lObj.value];
    }
    putOfferedInRedux({ ...data });
  };

  const columns = () => {
    return [
      {
        name: "Languages",
        key: "languages",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <b style={{ marginLeft: 10 }}>{value}</b>;
          }
        }
      },
      {
        name: "Language Key",
        key: "language-key",
        options: {
          filter: false
        }
      },
      {
        name: "Toggle On/Off",
        key: "toggle",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return (
              <ToggleSwitch
                isON={(offered || {})[value]}
                onChange={() => {
                  toggleLanguage({ value, name: (languages || {})[value] }, offered);
                }}
              />
            );
          }
        }
      }
    ];
  };

  const renderRequestLanguageButton = () => {
    return (
      <Button
        href={`mailto::${EMAIL_OF_MASSENERGIZE_REPRESENTATIVE}`}
        style={{ padding: "8px 0px", marginTop: 5, textTransform: "capitalize" }}
      >
        <i className="fa fa-envelope" style={{ marginRight: 5 }} />
        Request a Language
      </Button>
    );
  };
  const data = Object.entries(languages || {}).map(([key, name]) => [name, key, key]);
  return (
    <div>
      <MEPaperBlock containerStyle={{ minHeight: 90 }}>
        <Typography>
          Your site can be translated into the following languages. Users will be able to select their preferred
          language through a button at the top of your MassEnergize site.
          {renderRequestLanguageButton()}
        </Typography>
      </MEPaperBlock>

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.TRANSLATION_CONFIGURATION.key}
        tableProps={{
          title: "Available Languages",
          data,
          columns: columns(),
          options: { selectableRows: false }
        }}
      />
      {renderRequestLanguageButton()}
    </div>
  );
}

export default TranslationLanguagesPerCommunity;
