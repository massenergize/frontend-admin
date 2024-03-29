import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";

import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import Loading from "dan-components/Loading";
import {
  loadAllTags,
  reduxLoadMetaDataAction,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import { connect } from "react-redux";
import { getLimit, onTableStateChange } from "../../../utils/helpers";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import METable from "../ME  Tools/table /METable";
import { isEmpty } from "../../../utils/common";
import Loader from "../../../utils/components/Loader";
import Seo from "../../../components/Seo/Seo";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';
class AllTagCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  componentDidMount() {
    let {putMetaDataToRedux, meta, putTagsInRedux} = this.props;
    apiCall("/tag_collections.listForCommunityAdmin", {limit:getLimit(PAGE_PROPERTIES.ALL_TAG_COLLECTS.key)}).then(
      (tagCollectionsResponse) => {
        if (tagCollectionsResponse && tagCollectionsResponse.success) {
          putTagsInRedux(tagCollectionsResponse.data);
          putMetaDataToRedux({ ...meta, tagCollections:tagCollectionsResponse.cursor});
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
          sort: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/tag-collection`}>
                <EditIcon
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
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
    const { tags, putTagsInRedux, meta, putMetaDataToRedux } = this.props;
    const itemsInRedux = tags || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/tag_collections.delete", {
        tag_collection_id: found,
      }).then((response) => {
        if (response.success) {
          putMetaDataToRedux({
            ...meta,
            ["tagCollections"]: {
              ...meta["tagCollections"],
              count:
                meta["tagCollections"].count - 1,
            },
          });
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
    putTagsInRedux(rem);
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
    const { classes, tags, putTagsInRedux, meta, putMetaDataToRedux } = this.props;
    const data = this.fashionData(tags);
    const metaData = meta && meta.tagCollections;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      count: metaData && metaData.count,
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
        return false;
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
          updateMetaData: putMetaDataToRedux,
          name: "tagCollections",
          meta: meta,
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
          updateMetaData={putMetaDataToRedux}
          name="tagCollections"
          meta={meta}
        />
      ),
      // Not needed for now.
      //  customFilterDialogFooter: (currentFilterList, applyFilters) => {
      //   return (
      //     <ApplyFilterButton
      //       url="/tag_collections.listForCommunityAdmin"
      //       reduxItems={tags}
      //       updateReduxFunction={putTagsInRedux}
      //       columns={columns}
      //       filters={currentFilterList}
      //       applyFilters={applyFilters}
      //     />
      //   );
      // },
    };
   if (isEmpty(metaData)) {
     return <Loader />;
   }
    return (
      <div>
        <Seo name={"All Tag Collections"} />

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
  return {
    tags: state.getIn(["allTags"]),
    meta: state.getIn(["paginationMetaData"]),
  };
  
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putTagsInRedux: loadAllTags,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTagCollections);
export default withStyles(styles)(Mapped);
