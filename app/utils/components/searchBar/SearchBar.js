import { Button, Input } from "@mui/material";
import { Cancel } from '@mui/icons-material';
import React, {useState} from 'react'
import { getFilterData } from '../../helpers';
import { apiCall } from '../../messenger';

export default function SearchBar({url, reduxItems, updateReduxFunction, handleSearch, hideSearch,pageProp}) {
  
  const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
  
  const getSearchText = () => {
    var tableProp = localStorage.getItem(pageProp.key + TABLE_PROPERTIES);
    tableProp = JSON.parse(tableProp || null) || {};
    return tableProp && tableProp.search || "";
  };
  const [text, setText] = useState(getSearchText());
  
    const handleBackendSearch = () => {
      apiCall(url, {
        params: JSON.stringify({
          search_text: text,
        }),
      }).then((res) => {
        if (res && res.success) {
          let filterData = getFilterData(
            res,
            reduxItems && reduxItems.items,
            "id"
          );
          updateReduxFunction(filterData.items, filterData.meta);
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
          placeholder='Enter text to search '
          onInput={(e) => {
            setText(e.target.value);
            handleSearch(e.target.value);
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
          <Cancel onClick={() => hideSearch()} color="grey"/>
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
