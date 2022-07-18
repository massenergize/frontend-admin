import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import FileCopy from "@material-ui/icons/FileCopy";

export default function ExportButton(props) {
    const [openPicker, data, authResponse] = useDrivePicker();
    const action_id = props.id;

    const handleOnClick = (action_id) => {
        openPicker({
            clientId: "941856327176-691hf1ndva0423cch73k9ok0a6do0gs8.apps.googleusercontent.com", // web client credentials
            developerKey: DOCS_DEV_KEY, // Import/Export Docs API Key
            viewId: "FOLDERS",
            supportDrives: true,
            supportsAllDrives: true,
            setIncludeFolders: true,
            setSelectFolderEnabled: true,
            setParentFolder: "root",
            callbackFunction: async (data) => {
            if (data.action === "picked") {
                props.onSelectFolder(data['docs'][0]['id'], action_id);
            }
            }
        })
    }

    return <i className="fab fa-google material-ui" color="secondary" onClick={() => handleOnClick(action_id)} /> 
    // return <FileCopy color="secondary" onClick={() => handleOnClick(action_id)}>Ion-logo-google</FileCopy>
}