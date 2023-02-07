import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import { PapperBlock } from "dan-components";
import imgApi from "dan-api/images/photos";
import classNames from "classnames";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

import MUIDataTable from "mui-datatables";
import CallMadeIcon from "@mui/icons-material/CallMade";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import Loading from "dan-components/Loading";
import {
  loadAllTags,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import { connect } from "react-redux";
import { getAdminApiEndpoint, getLimit, onTableStateChange } from "../../../utils/helpers";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { Paper } from "@material-ui/core";
import METable from "../ME  Tools/table /METable";
class AllTagCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  componentDidMount() {
    apiCall("/tag_collections.listForCommunityAdmin", {limit:getLimit(PAGE_PROPERTIES.ALL_TAG_COLLECTS.key)}).then(
      (tagCollectionsResponse) => {
        if (tagCollectionsResponse && tagCollectionsResponse.success) {
          this.props.putTagsInRedux(tagCollectionsResponse.data, tagCollectionsResponse.meta);
        }
      }
    );

    // if (tagCollectionsResponse && tagCollectionsResponse.success) {
    //   const data = tagCollectionsResponse.data.map((d) => [
    //     // d.id,
    //     `${d.name}...`.substring(0, 30), // limit to first 30 chars
    //     d.rank,
    //     d.tags,
    //     d.id,
    //   ]);

    // }
  }

  // setStateAsync(state) {
  //   return new Promise((resolve) => {
  //     this.setState(state, resolve);
  //   });
  // }

  getColumns = () => {
    const { classes } = this.props;

    const cols = [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
        },
      },
      {
        name: "Rank",
        key: "rank",
        options: {
          filter: false,
        },
      },
      {
        name: "Tags",
        key: "tags",
        options: {
          filter: false,
          customBodyRender: (tags) => (
            <div className={classes.taskStatus}>
              <Icon className={classes.taskIcon}>blur_on</Icon>
              {tags.map((t) => (
                <Typography key={t.id} variant="caption">
                  {t.name}
                  ,&nbsp;&nbsp;
                </Typography>
              ))}
            </div>
          ),
        },
      },

      {
        name: "Edit?",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/tag-collection`}>
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
              &nbsp;&nbsp;
            </div>
          ),
        },
      },
    ];

    return cols;
  };

  fashionData(data) {
    return (data || []).map((d) => [
      d.id,
      `${d.name}...`.substring(0, 30), // limit to first 30 chars
      d.rank,
      d.tags,
      d.id,
    ]);
  }

  nowDelete({ idsToDelete, data }) {
    const { tags, putTagsInRedux } = this.props;
    const itemsInRedux = tags.items || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/tag_collections.delete", {
        tag_collection_id: found,
      }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: `Tag(s) successfully deleted`,
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the tag(s)",
            variant: "error",
          });
        }
      });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putTagsInRedux(rem,tags.meta);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " tag collection? " : "tag collections ? "}
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Tag Collections";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes, tags, putTagsInRedux } = this.props;
    const data = this.fashionData(tags && tags.items);
    const metaData = tags && tags.meta;

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      count: metaData && metaData.count,
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
        return false;

        // const idsToDelete = rowsDeleted.data;
        // idsToDelete.forEach((d) => {
        //   const tagCollectionId = data[d.dataIndex][0];
        //   apiCall("/tag_collections.delete", {
        //     tag_collection_id: tagCollectionId,
        //   });
        // });
      },
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putTagsInRedux,
          reduxItems: tags,
          apiUrl: "/tag_collections.listForCommunityAdmin",
          pageProp: PAGE_PROPERTIES.ALL_TAG_COLLECTS,
        }),
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url="/tag_collections.listForCommunityAdmin"
          reduxItems={tags}
          updateReduxFunction={putTagsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_TAG_COLLECTS}
        />
      ),
      // Not needed for now.
      // customFilterDialogFooter: (currentFilterList) => {
      //   return (
      //     <ApplyFilterButton
      //       url="/tag_collections.listForCommunityAdmin"
      //       reduxItems={tags}
      //       updateReduxFunction={putTagsInRedux}
      //       columns={columns}
      //       filters={currentFilterList}
      //     />
      //   );
      // },
    };
    if (!data || !data.length) {
      return <Loading />;
    }
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>

        <Paper style={{ marginBottom: 10 }}>
          <METable
            classes={classes}
            page={PAGE_PROPERTIES.ALL_TAG_COLLECTS}
            tableProps={{
              title: "All Tag Collections",
              data: data,
              columns: columns,
              options: options,
            }}
          />
        </Paper>
      </div>
    );
  }
}

AllTagCollections.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { tags: state.getIn(["allTags"]) };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putTagsInRedux: loadAllTags,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast:reduxToggleUniversalToast
    },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTagCollections);
export default withStyles(styles)(Mapped);
