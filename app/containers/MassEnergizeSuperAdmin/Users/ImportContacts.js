import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import Add from '@mui/icons-material/Add';
import FloatingPanel from 'dan-components/Panel/FloatingPanel';
import AddContactForm from './AddContactForm';
import styles from './contact-jss';
import { AddShoppingCartOutlined, PortraitSharp } from '@material-ui/icons';
import { apiCall } from '../../../utils/messenger';
import { isAsyncValidating } from 'redux-form';

class ImportContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv: null, 
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmission = this.handleSubmission.bind(this);
    }


    handleChange(e) {
        this.setState({
            csv: e.target.files[0]
          });
    }

    handleSubmission = (e) => {
        e.preventDefault();
        //no file provided by user
        if (this.state.csv == null) {
            this.setState({
                error: "Must select a csv file to upload."
            });
        }
        //file provided by user is not a csv
        else if (!isCSV(this.state.csv.name)) {
            this.setState({
                error: "Your file is not a CSV file. Please select a CSV (Excel, Google Sheets) file to upload."
            });
        }
        //csv file provided by user
        else {
            const body = {
                csv: this.state.csv
            };
            apiCall("users.import", body)
            .then((json) => {
                console.log("api call made");
                if (json.success) {
                    console.log("from the frontend, it looks like the api for contact import pinged successfully!");
                    this.setState({
                        error: "CSV file uploaded successfully."
                    });
                }
                else {
                    console.log(json.error);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        console.log("error: " + this.state.error);
		
	};

    render() {
        return(
            <div>
                <p>Hi friends!</p>
                <form onSubmit={this.handleSubmission}>
                    <p>{this.state.error}</p>
                    <input
                        id="csv"
                        name="csv"
                        type="file"
                        //ref={(input) => { this.filesInput = input }}
                        icon='file text outline'
                        iconPosition='left'
                        label='Upload CSV'
                        labelPosition='right'
                        placeholder='UploadCSV...'
                        onChange={this.handleChange}
                        accept=".csv"
                    />
                    <button>
                        <input type="submit"></input>
                    </button>
                </form>
            </div>
        );
    }
};

//checks if the filename f represents a CSV or not
function isCSV(f) {
    //get extension of file
    let parts = f.split(".");
    if (parts[parts.length-1].toLowerCase() != "csv") {
        return false;
    }
    return true; 
}

export default ImportContacts; 