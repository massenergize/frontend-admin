import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { apiCall } from '../../../utils/messenger';

export default function ImportButton(props) {
  const [openPicker, data, authResponse] = useDrivePicker();
  const DOC_API_KEY = process.env.REACT_APP_DOC_API_KEY

  const handleOnClick = () => {
    openPicker({
      clientId: "941856327176-691hf1ndva0423cch73k9ok0a6do0gs8.apps.googleusercontent.com", // web client credentials
      developerKey: DOC_API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
    //   multiselect: true,
      supportsAllDrives: true,
      setIncludeFolders: true,
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          clientId: "380900231684-tlj3p0j9polj7n0jni9rqu87o0c18at1.apps.googleusercontent.com", // web app client id
          console.log('User clicked cancel/close button');
          return;
        }
        if (data.action === 'picked') {
          let comm_ids = []
          for (let i=0; i < props.auth.communities.length; i++){
            comm_ids.push(props.auth.communities[i]['id'])
          }
          comm_ids = comm_ids.join(",")

          await apiCall("/actions.import", {documentID: data['docs'][0]['id'], communities: comm_ids}).then(json => {
            if (json.success) props.onGetDocData(json.data);
            else {
              console.log(json.error);
              return false; }
          });
        }
      }
    });            
  }

  return <button type="button" onClick={handleOnClick}>Import {props.type}</button>
}


