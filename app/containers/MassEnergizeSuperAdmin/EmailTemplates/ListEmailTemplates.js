import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { getHumanFriendlyDate } from "../../../utils/common";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { apiCall } from "../../../utils/messenger";
import { LOADING } from "../../../utils/constants";
import Loading from "dan-components/Loading";

export default function ListEmailTemplates({
  classes,
  emailTemplates,
  putTemplateInRedux,
  toggleDeleteConfirmation,
  toggleToast,
  editEmailTemplate
}) {

      if (emailTemplates === LOADING) return <Loading />;
  const columns = () => {
    return [
      {
        name: "Created On",
        key: "created-on",
        options: { filter: false },
      },
      {
        name: "Template Name",
        key: "template-name",
        options: { filter: false },
      },
      {
        name: "Template ID",
        key: "template-id",
        options: { filter: false },
      },
      {
        name: "Update On",
        key: "updated-on",
        options: { filter: false },
      },
      {
        name: "Manage",
        key: "manage",
        options: {
          filter: false,
          customBodyRender: (data) => {
            return (
              <>
                <Link
                  to={`/#void`}
                  onClick={(e) => {
                    e.preventDefault();
                    editEmailTemplate(data.item);
                  }}
                >
                  <EditIcon size="small" variant="outlined" color="secondary" />
                </Link>
              </>
            );
          },
        },
      },
    ];
  };

  const fashionData = (data) => {
    return data?.map(template => {
      return [
        getHumanFriendlyDate(template?.created_at),
        template?.name,
        template?.template_id,
        getHumanFriendlyDate(template?.updated_at),
        { id: template.id, item: template },
      ];
    });
  };
  const dataForTable = fashionData(emailTemplates || []);

  const nowDelete = ({ idsToDelete, data }) => {
    const itemsInRedux = emailTemplates;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][4];
      ids.push(found?.id);
      apiCall("/email.templates.update", { id: found?.id, is_deleted: true })
        .then((response) => {
          if (response.success) {
            toggleToast({
              open: true,
              message: "Email template successfully deleted",
              variant: "success",
            });
          } else {
            toggleToast({
              open: true,
              message: "An error occurred while deleting the email template",
              variant: "error",
            });
          }
        })
        .catch((e) => console.log("TEMPLATE_DELETE_ERROR:", e));
    });
    var rem = (itemsInRedux || []).filter((item) => !ids.includes(item.id)
    );
    putTemplateInRedux(rem);
  };

  const makeDeleteUI = ({ idsToDelete }) => {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " email template." : " email templates."}
        Functionalities linked to this may be deactivated
      </Typography>
    );
  };
  const options = {
    filterType: "dropdown",
    responsive: "standard",
    download: false,
    print: false,
    rowsPerPage: 25,
    rowsPerPageOptions: [50, 100],
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data;
      toggleDeleteConfirmation({
        show: true,
        component: makeDeleteUI({ idsToDelete }),
        onConfirm: () => nowDelete({ idsToDelete, data: dataForTable }),
        closeAfterConfirmation: true,
      });
      return false;
    },
  };
  return (
    <div>
      <METable
        page={PAGE_PROPERTIES.EMAIL_TEMPLATES}
        classes={classes}
        tableProps={{
          title: "All Email Templates",
          data: dataForTable,
          columns: columns(),
          options: options,
        }}
      />
    </div>
  );
}
