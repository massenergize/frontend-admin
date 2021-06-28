import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import FloatingPanel from 'dan-components/Panel/FloatingPanel';
import AddContactForm from './AddContactForm';
import styles from './contact-jss';
import { AddShoppingCartOutlined, PortraitSharp } from '@material-ui/icons';
import { apiCall } from '../../../utils/messenger';
import { isAsyncValidating } from 'redux-form';
import {readString, CSVReader} from 'react-papaparse';


class ImportContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv: null, 
            error: "", 
            headerFileRow: null,
            formFields: ['First_Name', 'Last_Name', 'Email'], 
            teamsList: null
        };
        //const myRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

        apiCall("users.adminCommunity")
        .then((json) => {
            if (json.success) {
                var communityId = json.data.id; 
                if (communityId) {
                    const body = {
                        community_id: communityId
                    }
                    apiCall("users.listTeamsForCommunityAdmin", body)
                    .then((json) => {
                        console.log("api call made");
                        if (json.success) {
                            console.log("successful response");
                            this.setState({
                                teamsList: json.data
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
                else {
                    console.log("no communities were found for this user");
                }
            }
            else {
                console.log(json.error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
        
    }

    

    handleFileLoad(data) {
        console.log("file loaded");
        console.log(data);
        this.setState({
            headerFileRow: data[0].data
        });
        console.log(this.state.headerFileRow);
        
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
            let firstNamePicker = document.getElementById(this.state.formFields[0]);
            let lastNamePicker = document.getElementById(this.state.formFields[1]);
            let emailPicker = document.getElementById(this.state.formFields[2]);
            let mess = document.getElementById("message");
            let teamPicker = document.getElementById("teamPicker");
            const body = {
                csv: this.state.csv, 
                first_name_field: firstNamePicker.value,
                last_name_field: lastNamePicker.value,
                email_field: emailPicker.value,
                message: mess.value,
                team_name: teamPicker.value
            };
            console.log('this is the body of the request');
            console.log(body);
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
                    this.setState({
                        error: json.error
                    });
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
                <p>Import new contact here by attaching a CSV file.</p>
                <form onSubmit={this.handleSubmission}>                    
                    <p>First, make sure to drag and drop a file to the dotted area. </p>
                    <CSVReader
                        onFileLoad={this.handleFileLoad}>
                    </CSVReader>
                    {(this.state.headerFileRow && this.state.headerFileRow.length > 0) ?
                    <form>
                        {this.state.formFields.map((item) => {
                            return (<div>
                                    <label for={item}>Select the column from your spreadsheet that corresponds to the required field {item}:</label>
                                    <select name={item} id={item}>
                                    {this.state.headerFileRow.map((x) => {
                                        return <option value={x}>{x}</option>;
                                    })}
                                    </select>
                                </div>);
                            })}
                    </form> :
                    <div>  
                        <p>Nothing to see here! Did you import the right CSV file? Make sure the first row of the CSV is the header row.</p>
                    </div>}
                    <input
                        id="file"
                        type="file"
                        name="file"
                        icon='file text outline'
                        iconPosition='left'
                        label='Upload CSV'
                        labelPosition='right'
                        placeholder='UploadCSV...'
                        onChange={this.handleChange}
                        />
                    <p>Optional: Personalize the email invitation that team members receive by adding your own text.</p>
                    <input 
                        id="message"
                        type="text"
                        name="message"
                        />
                    {this.state.teamsList ? 
                    <div>
                        <p>Optional: Assign the new community members to a team.</p>
                        <select id="teamPicker">
                            {this.state.teamsList.map((team) => {
                                return <option value={team}>{team}</option>;
                            })}
                            <option value="none">No team selected</option>
                        </select>
                    </div> :
                        <></>}
                    <p style={{color:'red'}} >{this.state.error}</p>
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