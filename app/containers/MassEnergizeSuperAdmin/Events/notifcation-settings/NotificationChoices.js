import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import { OPTIONS } from './EventNotificationSettings';
import MEDropdown from '../../ME  Tools/dropdown/MEDropdown';
import MEDropdownPro from '../../ME  Tools/dropdown/MEDropdownPro';
import LightAutoComplete from '../../Gallery/tools/LightAutoComplete';
import { useSelector } from 'react-redux';
import { log } from '../../../../utils/common';

const NotificationChoices = ({
  state,
  handleChange,
  setCommunities,
  targetCommunities
}) => {

  const communities = useSelector(state => state.getIn(['communities']));


  const getValue = (name) => {
    const data = state || {};
    return data[name] || false;
  };


  return (<div style={{
    padding: '10px'
  }}>
    {/* <p>Notification settings for <b>"{name}"</b></p> */}
    <LightAutoComplete
      selectAllV2
      allowClearAndSelectAll
      multiple
      data={communities}
      onChange={(t) => {
        setCommunities(t);
      }}
      defaultSelected={targetCommunities}
      valueExtractor={(t) => t?.id}
      labelExtractor={(t) => t?.name}
      placeholder="Select the communities that these settings apply to..."/>

    {OPTIONS.map((t) => {
      return <>
        {/* <input type="checkbox" checked={getValue(t.key)} onChange={handleChange} name={t.key}/> */}
        <FormControlLabel
          key={t.key}
          control={<Checkbox checked={getValue(t.key)} onChange={handleChange} name={t.key}/>}
          label={t.name}
          value={t.key}
        />
        <br/>
      </>;
    })}


  </div>);
};

export default NotificationChoices;
