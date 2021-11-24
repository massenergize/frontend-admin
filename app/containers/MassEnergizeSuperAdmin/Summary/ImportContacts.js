import React from 'react';
import { apiCall } from '../../../utils/messenger';
import {CSVReader} from 'react-papaparse';
import Button from '@material-ui/core/Button';
import { PapperBlock } from 'dan-components';

class ImportContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv: null, 
            error: "",
            message: "", 
            headerFileRow: null,
            formFields: ['First Name', 'Last Name', 'Email'],
            dataRows: null, 
            teamsList: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        if (this.props.location.communityId) {
            const body = {
                community_id: this.props.location.communityId
            };

            // only list teams in the community
            apiCall("teams.list", body)
            .then((json) => {
                if (json.success) {
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
        } else {
            console.log("no communities were found for this user");
        }
        
    }

    arrayColumn(arr, n) {
        return arr.map(x=> x[n]);
    }
      
    handleFileLoad(data) {
        if (data.length>1) {
            const dataRows = data.slice(1).map((row) => {
                return row.data;
            });
            this.setState({
                headerFileRow: data[0].data,
                dataRows: dataRows,
            });
         }
    }

    handleChange(e) {
        this.setState({
            csv: e.target.files[0]
            });
    }

    handleSubmission = (e) => {
        e.preventDefault();
        // no file provided by user
        if (this.state.dataRows == null) {
            this.setState({
                error: "Must select a csv file to upload."
            });
        }
        else {
            let firstNamePicker = document.getElementById(this.state.formFields[0]);
            const firstNameCol = this.state.headerFileRow.indexOf(firstNamePicker.value);
            const firstNames = this.arrayColumn(this.state.dataRows, firstNameCol);

            let lastNamePicker = document.getElementById(this.state.formFields[1]);
            const lastNameCol = this.state.headerFileRow.indexOf(lastNamePicker.value);
            const lastNames = this.arrayColumn(this.state.dataRows, lastNameCol);

            let emailPicker = document.getElementById(this.state.formFields[2]);
            const emailCol = this.state.headerFileRow.indexOf(emailPicker.value);
            const emails = this.arrayColumn(this.state.dataRows, emailCol);

            let mess = document.getElementById("message");
            let teamPicker = document.getElementById("teamPicker");
            const body = {
                first_names: firstNames,
                last_names: lastNames,
                emails: emails,
                message: mess.value,
                team_name: teamPicker.value, 
                community_id: this.props.location.communityId
            };

            apiCall("users.import", body)
            .then((json) => {
                if (json.success) {
                    this.setState({
                        message: "CSV file uploaded successfully."
                    });
                    if (json.data.invalidEmails.length > 0) {
                        let lines = "Invalid email address on lines:\r\n";
                        for (let i = 0; i < json.data.invalidEmails.length; i++) {
                            let row = json.data.invalidEmails[i];
                            lines += row.line + ": " + row.email + ", ";
                        }
                        this.setState({
                            message: "CSV file uploaded successfully. " + lines
                        });
                    }
                }
                else {
                    this.setState({
                        error: "Error encountered: " + json.error
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
	};

    render() {
        return(
            <PapperBlock title="Invite Users through CSV upload" desc="">
                <h6>Step 1: Prepare your CSV file.</h6>
                    <ul
                        style={{
                        listStyleType: "circle",
                        paddingLeft: "30px",
                        fontSize: 14,
                        marginBottom: "20px"
                        }}
                        >
                        <li>Verify that the first row of your spreadsheet is the header row.</li>
                        <li>Your file should contain at least three columns: first name, last name, and email."</li>
                        <li>Include only one email address per user.</li>
                        <li>Save your file as .csv (.xls or .xlsx extensions will not work).</li>
                    </ul>
                <h6>Step 2: Match your file’s columns with the required fields.</h6>
                    <ul
                        style={{
                        listStyleType: "circle",
                        paddingLeft: "30px",
                        fontSize: 14,
                        marginBottom: "20px"
                        }}
                        >
                        <li>Click the dotted area below and select the file you would like to use.</li>
                    </ul>
                <form onSubmit={this.handleSubmission}>                    
                    <CSVReader
                        onFileLoad={this.handleFileLoad}
                    >
                        <span>Drop CSV file here or click to upload.</span>
                    </CSVReader>
                    {(this.state.headerFileRow && this.state.headerFileRow.length > 0) ?
                    <form>
                        {this.state.formFields.map((item) => {
                            return (<div>
                                    <label style={{fontSize: "14px"}} for={item}>Select the column that contains: <span style={{fontWeight: "bold"}}>{item}</span></label>
                                    <select style={{fontSize: "14px"}} name={item} id={item}>
                                    {this.state.headerFileRow.map((x) => {
                                        return <option value={x}>{x}</option>;
                                    })}
                                    </select>
                                </div>);
                            })}
                    </form> :
                    <p style={{fontSize: "14px"}}>If nothing is displayed inside the dotted area, please verify that the first row of your spreadsheet is the header. Then select the file again.</p>
                    }

                    <p style={{fontSize: "14px"}}>Optional: Write a short welcome message for the new community members. This text will be included in the email invitation.</p>
                    <input 
                        id="message"
                        type="text"
                        name="message"
                        style={{ width:"100%"}}
                        />
                    {this.state.teamsList ? 
                    <div>
                        <br/>
                        <p style={{fontSize: "14px"}}>Optional: Assign the new community members to a team.</p>
                        <select id="teamPicker">
                            <option value="none">No team selected</option>
                            {this.state.teamsList.map((team) => {
                                return <option value={team.name}>{team.name}</option>;
                            })}
                        </select>
                    </div> :
                        <></>}
                    {this.state.error ? (
                        <p style={{color:'red'}} >{this.state.error}</p>
                    ):(
                        <p style={{color:'green'}} >{this.state.message}</p>
                    )}

                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            </PapperBlock>
        );
    }
};

export default ImportContacts; 