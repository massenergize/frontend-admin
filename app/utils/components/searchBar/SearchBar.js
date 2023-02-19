import { Button, Input } from "@mui/material";
import { Cancel } from '@mui/icons-material';
import React, {useState} from 'react'
import { getFilterData, getLimit } from '../../helpers';
import { apiCall } from '../../messenger';

export default function SearchBar({url, reduxItems, updateReduxFunction, handleSearch, hideSearch,pageProp, name, updateMetaData, meta, args}) {
  
  const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
  
  const getSearchText = () => {
    var tableProp = localStorage.getItem(pageProp.key + TABLE_PROPERTIES);
    tableProp = JSON.parse(tableProp || null) || {};
    return tableProp && tableProp.search || "";
  };
  const [text, setText] = useState(getSearchText());
  
    const handleBackendSearch = (reset=false) => {
      apiCall(url, {
        limit: getLimit(pageProp.key),
        params: JSON.stringify({
          search_text: reset? "": text,
        }),
        ...(args || {})
      }).then((res) => {
        if (res && res.success) {
          updateReduxFunction(res.data);
          updateMetaData({ ...meta, [name]: res.cursor });
          handleSearch(reset ? "" : text);
        }
      });
    };


  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
        }}
      >
        <Input
          fullWidth
          autoFocus={true}
          placeholder="Enter text to search "
          onInput={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "20%",
            right: 10,
            cursor: "pointer",
          }}
        >
          <Cancel
            onClick={() => {
              hideSearch();
              handleBackendSearch(true);
            }}
            color="grey"
          />
        </div>
      </div>

      <div style={{ marginLeft: 10 }}>
        <Button variant="contained" onClick={() => handleBackendSearch()}>
          Search
        </Button>
      </div>
    </div>
  );
}
