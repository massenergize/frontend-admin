import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { apiCall } from '../../../utils/messenger';
import FileCopy from "@material-ui/icons/FileCopy";

export default function ExportButton(props) {
    const [openPicker, data, authResponse] = useDrivePicker();

    const handleOnClick = (id) => {
        openPicker({
        clientId: "941856327176-691hf1ndva0423cch73k9ok0a6do0gs8.apps.googleusercontent.com", // web client credentials
        developerKey: DOC_DEVELOPER_KEY, // Import/Export Docs API Key
        viewId: "FOLDERS",
        // showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        supportsAllDrives: true,
        setIncludeFolders: true,
        callbackFunction: async (data) => {
          if (data.action === "picked") {
            props.onSelectFolder("TEST", id);
          }
        }
        })
    }

    return <FileCopy color="secondary" onClick={handleOnClick(id)}/>
}