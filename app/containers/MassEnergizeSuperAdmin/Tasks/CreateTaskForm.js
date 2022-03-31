import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import { TASK_INTERVALS } from "./taskConstants";
import { withRouter } from "react-router-dom";

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
      toEdit:{}
    };
  }

  static getDerivedStateFromProps(props, state) {
    let { taskFunctions, tasks } = props;
    let  taskID  = props.match.params.id;
    let toEditTask = (tasks||[]).find((task) => task.id.toString() === taskID);

    taskFunctions = (taskFunctions || []).map((c) => ({
      id: c,
      displayName: c,
    }));
    const formJson = createFormJson({
      taskFunctions,
      toEdit: toEditTask,
    });
    const jobsDoneDontRunWhatsBelowEverAgain =
      !(taskFunctions && taskFunctions.length) || state.mounted;
    if (jobsDoneDontRunWhatsBelowEverAgain) return null;
    return {
      formJson,
      taskFunctions,
      mounted: true,
      toEdit: toEditTask,
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
    tasks: state.getIn(["tasks"]),
  };
};

const NewTaskMapped = withRouter(connect(mapStateToProps)(CreateTaskForm));
export default withStyles(styles, { withTheme: true })(NewTaskMapped);

const createFormJson = ({ taskFunctions, toEdit }) => {
  const createTaskIntervalList = () => {
    let intervals = [];
    Object.entries(TASK_INTERVALS).forEach(([key, value]) => {
      let x = { id: key, displayName: value };
      intervals.push(x);
    });
    return intervals;
  };


  const getDateFromEditData = toEdit=>{
    if(!toEdit.id) return
    let {actual} = JSON.parse(toEdit.recurring_details);
    return actual;
    
  }


  const preflightFxn = (values) => {
    let details = values && values.recurring_details;
    const d = new Date(details);

    let recurring_details = JSON.stringify({
      day_of_month: d.getMonth(),
      day_of_week: d.getDay(),
      month_of_year: d.getMonth(),
      minute: d.getMinutes(),
      hour: d.getHours(),
      year: d.getFullYear(),
      actual: values.recurring_details,
    });

    if(toEdit.id){
      values.id =  toEdit.id
    }

    values.recurring_details = recurring_details;
    values.status = "PENDING";
    return values;
  };

  const formJson = {
    title: `${toEdit.id ? "Update" : "Create New"}  Task`,
    subTitle: "",
    method: toEdit.id ? "/tasks.update" : "/tasks.create",
    successRedirectPage: "/admin/read/tasks",
    preflightFxn: preflightFxn,
    fields: [
      {
        name: "name",
        label: "Name of the Task",
        placeholder: "eg. Send monthly  newsletter",
        fieldType: "TextField",
        contentType: "text",
        isRequired: true,
        defaultValue: toEdit && toEdit.id ? toEdit.name : "",
        dbName: "name",
        readOnly: false,
      },
      {
        name: "job_name",
        label: "Function Name",
        placeholder: "",
        fieldType: "Dropdown",
        defaultValue: toEdit && toEdit.id ? toEdit.job_name : "",
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
        defaultValue: toEdit && toEdit.id ? toEdit.recurring_interval : "",
        data: [{ displayName: "--", id: "" }, ...createTaskIntervalList()],
      },
      {
        name: "recurring_details",
        label: "Recurring Details",
        placeholder: "",
        fieldType: "DateTime",
        defaultValue: toEdit && toEdit.id ? getDateFromEditData(toEdit) : "",
        dbName: "recurring_details",
      },
    ],
  };
  return formJson;
};
