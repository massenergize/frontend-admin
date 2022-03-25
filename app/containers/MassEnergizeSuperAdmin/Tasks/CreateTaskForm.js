import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import { TASK_INTERVALS } from "./taskConstants";


const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    field: {
        width: "100%",
        marginBottom: 20,
    },
    fieldBasic: {
        width: "100%",
        marginBottom: 20,
        marginTop: 10,
    },
    inlineWrap: {
        display: "flex",
        flexDirection: "row",
    },
    buttonInit: {
        margin: theme.spacing.unit * 4,
        textAlign: "center",
    },
});

class CreateTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskFunctions: [],
            formJson: null,

        };
    }

    static getDerivedStateFromProps(props, state) {
        let { taskFunctions } = props;
        taskFunctions = (taskFunctions || []).map((c) => ({
            id: c,
            displayName: c
        }))
        const formJson = createFormJson({ taskFunctions });
        const jobsDoneDontRunWhatsBelowEverAgain =
            !(taskFunctions && taskFunctions.length) || state.mounted;
        if (jobsDoneDontRunWhatsBelowEverAgain) return null;
        return {
            formJson,
            taskFunctions,
            mounted: true,
        };
    }
    render() {
        const { classes } = this.props;
        const { formJson } = this.state;
        if (!formJson) return <Loading />;
        return (
            <div>
                <MassEnergizeForm classes={classes} formJson={formJson} enableCancel />
            </div>
        );
    }
}

CreateTaskForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        taskFunctions: state.getIn(["taskFunctions"]),
    };
};

const NewTeamMapped = connect(mapStateToProps)(CreateTaskForm);
export default withStyles(styles, { withTheme: true })(NewTeamMapped);




const createFormJson = ({ taskFunctions }) => {
    const creatTaskInterval = () => {
        let intervals = []
        Object.entries(TASK_INTERVALS).forEach(([key, value]) => {
            let x = { id: key, displayName: value }
            intervals.push(x)
        });
        return intervals
    }
    const formJson = {
        title: "Create New Team",
        subTitle: "",
        method: "/tasks.create",
        successRedirectPage: "/admin/read/tasks",
        fields: [
            {
                name: "name",
                label: "Name of the Task",
                placeholder: "eg. Send monthly  newsletter",
                fieldType: "TextField",
                contentType: "text",
                isRequired: true,
                defaultValue: "",
                dbName: "name",
                readOnly: false,
            },
            {
                name: "job_name",
                label: "Function Name",
                placeholder: "",
                fieldType: "Dropdown",
                defaultValue: null,
                dbName: "job_name",
                data: [{ displayName: "--", id: "" }, ...taskFunctions],
            },
            {
                name: "recurring_interval",
                label: "Recurring Interval",
                placeholder: "How should this task be run?",
                fieldType: "Dropdown",
                defaultValue: null,
                dbName: "recurring_interval",
                data: [{ displayName: "--", id: "" }, ...creatTaskInterval()],
            },
            {
                name: "recurring_details",
                label: "Recurring Details",
                placeholder: "",
                fieldType: "DateTime",
                defaultValue: null,
                dbName: "recurring_details",
            }


        ],
    };
    return formJson;
};
