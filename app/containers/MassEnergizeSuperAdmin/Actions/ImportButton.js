import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { apiCall } from '../../../utils/messenger';

export default function ImportButton(props) {
  const [openPicker, data, authResponse] = useDrivePicker();
  
  const handleOnClick = () => {
    openPicker({
      clientId: "941856327176-691hf1ndva0423cch73k9ok0a6do0gs8.apps.googleusercontent.com", // web client credentials
      developerKey: DOCS_API_KEY, // Import/Export Docs API Key
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
          ultiselect: true,
      supportsAllDrives: true,
      setIncludeFolders: true,
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          clientId: "380900231684-tlj3p0j9polj7n0jni9rqu87o0c18at1.apps.googleusercontent.com", // web app client id
          console.log('User clicked cancel/close button');
          return;
        }

        if (data.action === 'picked') {
          await apiCall("/actions.import", {documentID: data['docs'][0]['id']}).then(json => {
            if (json.success) props.onGetDocData(json.data);
            else {
              console.log(json.error);
              return false; }
          });
        }
      }
    });            
  }

  return <button onClick={handleOnClick}>Import {props.type}</button>
}


