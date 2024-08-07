import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";

import CallMadeIcon from "@mui/icons-material/CallMade";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  reduxLoadAllCommunities,
  reduxLoadMetaDataAction,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import { getTimeStamp, isEmpty, smartString } from '../../../utils/common';
import { Typography } from "@mui/material";
import MEChip from "../../../components/MECustom/MEChip";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { getAdminApiEndpoint, getLimit, handleFilterChange, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import Loader from "../../../utils/components/Loader";
import Seo from "../../../components/Seo/Seo";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';

class AllCommunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(props.classes),
      loading: true,
      toastData:{}
    };
  }

  componentDidMount() {
    const { auth, putMetaDataToRedux, meta} = this.props;
    var url = getAdminApiEndpoint(auth, "/communities");
    apiCall(url, {limit:getLimit(PAGE_PROPERTIES.ALL_COMMUNITIES.key)}).then((allCommunitiesResponse) => {
      if (allCommunitiesResponse && allCommunitiesResponse.success) {
        this.props.putCommunitiesInRedux(allCommunitiesResponse.data,);
        putMetaDataToRedux({...meta, communities: allCommunitiesResponse.cursor});
      }
    });
  }

  fashionData(data) {
    return (
      data &&
      data.map((d) => [
        d.id,
        {
          id: d.id,
          image: d.logo,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
        },
        smartString(d.name), // limit to first 30 chars
        smartString(`${d.owner_name} (${d.owner_email})`, 40),
        `${
          // limit to first 20 chars
          d.is_approved ? "Verified" : "Not Verified"
        }`,
        { isLive: d.is_published && d.is_approved, item: d },
        `${
          d.is_geographically_focused
            ? "Geographically Focused"
            : "Geographically Dispersed"
        }`,
        d.id,
      ])
    );
  }
  getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
      },
    },
    {
      name: "Logo",
      key: "logo",
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image && (
              <Link to={`/admin/community/${d.id}/profile`} target="_blank">
                <Avatar
                  alt={d.initials}
                  src={d.image.url}
                  style={{ margin: 10 }}
                />
              </Link>
            )}
            {!d.image && (
              <Link to={`/admin/community/${d.id}/profile`} target="_blank">
                <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
              </Link>
            )}
          </div>
        ),
      },
    },
    {
      name: "Name",
      key: "name",
      options: {
        filter: true,
        filterType: "multiselect",
      },
    },
    {
      name: "Admin Name & Email",
      key: "admin_name_and_email",
      options: {
        filter: false,
        //filterType: "textField",
      },
    },
    {
      name: "Verification",
      key: "verification",
      options: {
        filter: true,
      },
    },
    {
      name: "Is it Live? (Published & Approved)",
      key: "is_published",
      options: {
        filter: false,
        customBodyRender: (d) => {
          return (
            <MEChip
              onClick={() =>
                this.props.toggleLive({
                  show: true,
                  component: this.makeLiveUI({ data: d.item }),
                  onConfirm: () => this.makeLiveOrNot(d.item),
                  closeAfterConfirmation: true,
                })
              }
              label={d.isLive ? "Live" : "Not Live"}
              className={`${
                d.isLive ? classes.yesLabel : classes.noLabel
              } touchable-opacity`}
              style={{ borderRadius: 55 }}
            />
          );
        },
      },
    },
    {
      name: "Geography",
      key: "geography",
      options: {
        filter: true,
      },
    },
    {
      name: "Edit? Profile?",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/community/${id}/edit`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            <Link to={`/admin/community/${id}/profile`}>
              <CallMadeIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
          </div>
        ),
      },
    },
  ];

  makeLiveOrNot(item) {
    const putInRedux = this.props.putCommunitiesInRedux;
    const data = this.props.communities || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putInRedux( [...data]);
    apiCall("/communities.update", {
      community_id: item.id,
      is_published: !status,
    });
  }
  // TODO: make this DRY in future
  makeLiveUI({ data }) {
    const name = data && data.name;
    const isON = data.is_published;
    return (
      <div>
        <Typography>
          <b>{name}</b> is {isON ? "live, " : "not live, "}
          would you like {isON ? " to take it offline" : " to take it live"}?
        </Typography>
      </div>
    );
  }

  nowDelete({ idsToDelete, data }) {
    const { communities, putCommunitiesInRedux, putMetaDataToRedux, meta } = this.props;
    const ids = [];
    /**
     * TODO: We should probably let the backend accept an array of items to remove instead of looping api calls....
     */
    idsToDelete.forEach((d) => {
      const communityId = data[d.dataIndex][0];
      ids.push(communityId);
      apiCall("/communities.delete", { community_id: communityId }).then(response => {
        if(response.success){
                    putMetaDataToRedux({
                      ...meta,
                      ["communities"]: {
                        ...meta["communities"],
                        count: meta["communities"].count - 1,
                      },
                    });
          this.props.toggleToast({
            open: true,
            message:"Community successfully deleted",
            variant:"success",
          })
        }
        else{
           this.props.toggleToast({
             open: true,
             message: "An error occurred while deleting the community",
             variant: "error",
           });
        }
      })
    });
    const rem = (communities || []).filter((com) => !ids.includes(com.id));
    putCommunitiesInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " community? " : " communities? "}
        <Typography style={{ color: "#8f0707" }}>
          <b>
            {" "}
            Please note that you will not be able to delete a community you did
            not create
          </b>
        </Typography>
      </Typography>
    );
  }

  render() {
    const { columns } = this.state;
    const { classes, toggleDeleteConfirmation, communities, putCommunitiesInRedux, auth, meta, putMetaDataToRedux } = this.props;
    const data = this.fashionData(communities || []);
    const metaData = meta && meta.communities;
    
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      count: metaData && metaData.count,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
        return false;
      },
      confirmFilters: true,
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putCommunitiesInRedux,
          reduxItems: communities,
          apiUrl: getAdminApiEndpoint(auth, "/communities"),
          pageProp: PAGE_PROPERTIES.ALL_COMMUNITIES,
          updateMetaData: putMetaDataToRedux,
          name: "communities",
          meta: meta,
        }),
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/communities")}
          reduxItems={communities}
          updateReduxFunction={putCommunitiesInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_COMMUNITIES}
          updateMetaData={putMetaDataToRedux}
          name="communities"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/communities")}
            reduxItems={communities}
            updateReduxFunction={putCommunitiesInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_COMMUNITIES.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="communities"
            meta={meta}
          />
        );
      },
      whenFilterChanges: (
        changedColumn,
        filterList,
        type      ) =>
        handleFilterChange({
          filterList,
          type,
          columns,
          page: PAGE_PROPERTIES.ALL_COMMUNITIES,
          updateReduxFunction: putCommunitiesInRedux,
          reduxItems: communities,
          url: getAdminApiEndpoint(auth, "/communities"),
          updateMetaData: putMetaDataToRedux,
          name: "communities",
          meta: meta,
        }),
        downloadOptions: {
          filename: `All Communities (${getTimeStamp()}).csv`,
          separator: ",",
        },
        onDownload: (buildHead, buildBody, columns, data) => {
          let alteredData = data.map((d) => {
            console.log("d.data", d.data);
            let content = [...d.data];
            content[4] = content[4] === "Verified" ? "yes" : "No";
            content[5] = content[5].isLive ? "yes" : "No";
            return {
              data: content,
              index: d.index,
            };
          });
          let csv = buildHead(columns) + buildBody(alteredData);
          return csv;
      },
    };
   if (isEmpty(metaData)) {
     return <Loader />;
   }

    const { idsToDelete, toastData } = this.state;
    return (
      <div>
        <Seo name={"All Communities"}  />
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_COMMUNITIES}
          tableProps={{
            title: "All Communities",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      </div>
    );
  }
}

AllCommunities.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
    meta: state.getIn(["paginationMetaData"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putCommunitiesInRedux: reduxLoadAllCommunities,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      toggleLive: reduxToggleUniversalModal,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AllCommunities)
);
