import { Button, Link, Paper, Typography, withStyles } from "@mui/material";
import React, { useEffect } from "react";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { APP_LINKS, DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from "../../../utils/constants";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { reduxLoadCustomPages, reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import CopyCustomPageModal, { DeleteCustomPageModalConfirmation } from "./CopyCustomPageModal";
import { useApiRequest } from "../../../utils/hooks/useApiRequest";
import Loading from "dan-components/Loading";
import { getHumanFriendlyDate } from "../../../utils/common";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
const DUMMY_DATA = [
  {
    id: Date.now(),
    name: "Resource Guide",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Frimpong",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 1,
    name: "Energy Saving Tips",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Brad",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 2,
    name: "Solar Power 101",
    community: "Wayland",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Tahiru",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 3,
    name: "Electric Cars",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Frimpong",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 4,
    name: "Community Solar",
    community: "Framingham",
    access: "Nowhere,Ablekuma,Agawam",
    creator: "Brad",
    published_at: "2021-10-10"
  }
];
function AdminCustomPagesList({ classes }) {
  const adminCommunities = useSelector((state) => state.getIn(["communities"]));
  const customPagesList = useSelector((state) => state.getIn(["customPagesList"]));

  const dispatch = useDispatch();
  const [customPagesRequestHandler] = useApiRequest([{ key: "customPageList", url: "/community.custom.pages.list" }]);
  const [fetchPages, data, error, loading, setError, setLoading] = customPagesRequestHandler || [];

  const putCustomPagesInRedux = (pages) => dispatch(reduxLoadCustomPages(pages));
  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));

  const makeColumns = () => {
    return [
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
          customBodyRender: (name) => {
            return <b>{name}</b>;
          }
        }
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: false
        }
      },
      {
        name: "Created By",
        key: "created-by",
        options: {
          filter: false
        }
      },
      {
        name: "Access",
        key: "access",
        options: {
          filter: false
        }
      },
      {
        name: "Last Published",
        key: "last-published",
        options: {
          filter: false
        }
      },
      {
        name: "Preview",
        key: "preview",
        options: {
          filter: false
        }
      },

      {
        name: "Actions",
        key: "actions",
        options: {}
      }
    ];
  };
  const fashionData = (data) => {
    return data?.map((d) => {
      const publishedVersion = d?.page?.latest_version;
      return [
        // d.id,
        d?.page?.title,
        d?.community?.name,
        d?.page?.user?.full_name,
        <Link href="#" style={{ fontWeight: "bold" }}>
          {/* {d.access} */}
          ...
        </Link>,
        publishedVersion ? getHumanFriendlyDate(publishedVersion?.created_at) : "Not Published",
        publishedVersion ? (
          <Link href={publishedVersion ? "" : "#"} style={{ fontWeight: "bold" }}>
            {publishedVersion ? "" : "Not Published"}
          </Link>
        ) : (
          "-"
        ),

        <div>
          <Link
            color={"secondary"}
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none" }}
            target="_blank"
            href={`${APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}?pageId=${d?.page?.id}`}
          >
            <i style={{ marginRight: 5 }} className="fa fa-edit" /> Edit
          </Link>
          {/* <Link
            color="secondary"
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none", marginLeft: 10 }}
            target="_blank"
            // href="/admin/community/configure/navigation/custom-pages"
            onClick={(e) => {
              e.preventDefault();
              toggleModal({
                show: true,
                noTitle: true,
                fullControl: true,
                // title: "Copy Custom Page",
                component: <CopyCustomPageModal />,
                data: { page: d }
              });
            }}
          >
            <i style={{ marginRight: 5 }} className="fa fa-copy" /> Copy
          </Link> */}
        </div>
      ];
    });
  };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
    rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
    // count: metaData && metaData.count,
    // confirmFilters: true,
    onRowsDelete: (rowsDeleted) => {
      toggleModal({
        show: true,
        noTitle: true,
        fullControl: true,
        // title: "Copy Custom Page",
        component: <DeleteCustomPageModalConfirmation />
      });
      // const idsToDelete = rowsDeleted.data;
      // idsToDelete.forEach((d) => {
      //   const email = data[d.dataIndex][2];
      //   apiCall("/teams.removeMember", { team_id: team.id, email });
      // });
    }
  };

  useEffect(() => {
    if (customPagesList?.length) return;
    fetchPages({ community_ids: adminCommunities?.map((c) => c.id) }, (response) => {
      if (response?.success) {
        putCustomPagesInRedux(response?.data);
      }
    });
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <Paper style={{ padding: 20 }}>
        <Typography variant="p" style={{ margin: "10px 0px", color: "red" }}>
          {error}
          <p className="touchable-opacity" onClick={() => fetchPages()} style={{ textDecoration: "underline" }}>
            Retry
          </p>
        </Typography>
      </Paper>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{brand.name} | Custom Pages</title>
      </Helmet>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6">Manage your custom pages</Typography>
        <Typography variant="p" style={{ margin: "10px 0px" }}>
          Here you can create pages for resource guides, and other topics on your your community sites. You can also set
          which communities can make copies of your pages.
        </Typography>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
          <Link
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none" }}
            target="_blank"
            href={APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}
          >
            <i style={{ marginRight: 5 }} className="fa fa-plus" /> Create A Custom Page
            {/* {loading && <i className="fa fa-spinner fa-spin" />} */}
          </Link>
          <Link
            className="touchable-opacity"
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none", marginLeft: "auto" }}
            target="_blank"
            // href={APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}
            onClick={() => fetchPages()}
          >
            <i style={{ marginRight: 5 }} className="fa fa-refresh" /> Refresh Table
            {/* {loading && <i className="fa fa-spinner fa-spin" />} */}
          </Link>
        </div>
      </Paper>
      <br />

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.CUSTOM_PAGES}
        tableProps={{
          title: "All Custom Pages",
          data: fashionData(customPagesList),
          columns: makeColumns(),
          options: options
        }}
        //   saveFilters={this.state.saveFilters}
      />
    </div>
  );
}
export default AdminCustomPagesList;
