import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import MUIDataTable from "mui-datatables";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import classNames from "classnames";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import messageStyles from "dan-styles/Messages.scss";
import SnackbarContent from "@mui/material/SnackbarContent";

import styles from "../../../components/Widget/widget-jss";
import { apiCall } from "../../../utils/messenger";
import { Paper } from "@mui/material";
import Seo from "../../../components/Seo/Seo";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class EventRSVPs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      event: null,
      columns: this.getColumns(),
      value: 0,
      error: null,
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const eventResponse = await apiCall("/events.info", { event_id: id });
    if (eventResponse && eventResponse.data) {
      const event = eventResponse.data;
      await this.setStateAsync({ event });
    }

    const allRSVPsResponse = await apiCall("/events.rsvp.list", {
      event_id: id,
    });
    if (allRSVPsResponse && allRSVPsResponse.success) {
      await this.setStateAsync({
        loading: false,
        allRSVPs: allRSVPsResponse.data,
        data: this.fashionData(allRSVPsResponse.data),
      });
    }

    await this.setStateAsync({ loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      d.id,
      d.user && d.user.full_name,
      d.user && d.user.email,
      d.status,
      d.id,
    ]);
    return fashioned;
  };

  getColumns = () => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "User Name",
      key: "user",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "User Email",
      key: "user",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Status",
      key: "status",
      options: {
        filter: true,
      },
    },
  ];

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const title = brand.name + " - All Events";
    const description = brand.desc;
    const { columns, data, event, value } = this.state;
    const { classes } = this.props;
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach((d) => {
          const rsvp = data[d.dataIndex][0];
          apiCall("/events.rsvp.remove", {
            rsvp_id: rsvp.id,
            event_id: event.id,
          });
        });
      },
    };
    return (
      <div>
        <Seo name={`Event RSVPs - ${event?.name}`}/>
        <div style={{ padding: 20 }}>
          <Paper
            style={{
              padding: 20,
              marginBottom: 15,
              boxShadow: "var(--elevate-float)",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: 5 }}>
              {event && event.name}
            </Typography>
            <Typography
              // variant="small"
              style={{
                paddingBottom: 5,
                display: "block",
              }}
            >
              {event && event.community && event.community.name}
            </Typography>

            <Link to="/admin/read/events" style={{ color: "var(--app-cyan)" }}>
              Go Back to All Events
            </Link>
          </Paper>

          <MUIDataTable
            title="Event RSVPs"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

EventRSVPs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventRSVPs);
