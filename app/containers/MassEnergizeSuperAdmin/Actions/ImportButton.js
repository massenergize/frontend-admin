import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { apiCall } from '../../../utils/messenger';

export default function ImportButton(props) {
  const [openPicker, data, authResponse] = useDrivePicker();
  const DOC_API_KEY ="AIzaSyC0tJevezDFawBFirRHRs7AfFyzrFYt1sc"|| process.env.REACT_APP_DOC_API_KEY

  const handleOnClick = () => {
    openPicker({
      clientId: "117359409582-ed9ergkmfu10rg6mkq35a1fcrkiua8n8.apps.googleusercontent.com", // web client credentials
      developerKey: DOC_API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      supportsAllDrives: true,
      setIncludeFolders: true,
      callbackFunction: async (data) => {
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

  return <button type="button" onClick={() => handleOnClick()}>Import {props.type}</button>
}


