import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Typography } from "@mui/material";

import { withStyles } from "@mui/styles";
import METable from "../ME  Tools/table /METable";

function TranslationLanguagesPerCommunity() {
  return (
    <div>
      <MEPaperBlock containerStyle={{ minHeight: 90 }}>
        <Typography>
          Your site can be translated into the following languages. Users will be able to select their preferred
          language through a button at the top of your MassEnergize site.
        </Typography>
      </MEPaperBlock>

        {/* <METable
        
        
        /> */}
    
    </div>
  );
}

export default withStyles(TranslationLanguagesPerCommunity);
