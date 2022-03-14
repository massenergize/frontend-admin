import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import { PapperBlock } from "dan-components";
import imgApi from "dan-api/images/photos";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

import MUIDataTable from "mui-datatables";
import CallMadeIcon from "@material-ui/icons/CallMade";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import Loading from "dan-components/Loading";
import {
  loadAllTags,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import { connect } from "react-redux";
class AllTagCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  componentDidMount() {
    apiCall("/tag_collections.listForCommunityAdmin").then(
      (tagCollectionsResponse) => {
        if (tagCollectionsResponse && tagCollectionsResponse.success) {
          this.props.putTagsInRedux(tagCollectionsResponse.data);
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
      // {
      //   name: 'id',
      //   key: 'id',
      //   options: {
      //     filter: false
      //   }
      // },
      {
        name: "Name",
        key: "name",
        options: {
          filter: true,
        },
      },
      {
        name: "Rank",
        key: "rank",
        options: {
          filter: true,
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
      // d.id,
      `${d.name}...`.substring(0, 30), // limit to first 30 chars
      d.rank,
      d.tags,
      d.id,
    ]);
  }

  nowDelete({ idsToDelete, data }) {
    const { tags, putTagsInRedux } = this.props;
    const itemsInRedux = tags;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      ids.push(found);
      apiCall("/tag_collections.delete", { tag_collection_id: found });
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
    const { classes, tags } = this.props;
    const data = this.fashionData(tags);

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 100,
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
        <div className={classes.table}>
          <MUIDataTable
            title="All Tag Collections"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
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
    },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTagCollections);
export default withStyles(styles)(Mapped);
