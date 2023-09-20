import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import { Typography } from "@mui/material";
import METable from "../../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../../ME  Tools/MEConstants";

export const GalleryManagement = (props) => {
  const getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
      },
    },
    {
      name: "Image",
      key: "image",
      options: {
        sort: false,
        filter: false,
        download: false,
        //     customBodyRender: (d) => (
        //       <div>
        //         {d.image && (
        //           <Avatar
        //             alt={d.initials}
        //             src={d.image.url}
        //             style={{ margin: 10 }}
        //           />
        //         )}
        //         {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
        //       </div>
        //     ),
      },
    },
    {
      name: "Used By",
      key: "used-by",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Usage Summary",
      key: "key_contact",
      options: {
        filter: false,
      },
    },
    {
      name: "# duplicates",
      key: "communities",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "Actions",
      key: "actions",
      options: {
        filter: false,
        download: false,
        sort: false,
        // customBodyRender: (id) => (
        //   <div>
        //     <Link to={`/admin/edit/${id}/vendor`}>
        //       <EditIcon size="small" variant="outlined" color="secondary" />
        //     </Link>
        //     &nbsp;&nbsp;
        //     <Link
        //       onClick={async () => {
        //         const copiedVendorResponse = await apiCall("/vendors.copy", {
        //           vendor_id: id,
        //         });
        //         if (copiedVendorResponse && copiedVendorResponse.success) {
        //           const newVendor =
        //             copiedVendorResponse && copiedVendorResponse.data;
        //           this.props.history.push(`/admin/edit/${newVendor.id}/vendor`);
        //         }
        //       }}
        //       to="/admin/read/vendors"
        //     >
        //       <FileCopy size="small" variant="outlined" color="secondary" />
        //     </Link>
        //   </div>
        // ),
      },
    },
  ];

  const fashionData = () => {
    const arrays = [
      [
        3,
        "image-url-1",
        52,
        "actions(45), events(3), teams(12), homepages(11)",
        "23,43,54...",
        12,
      ],
      [
        5,
        "image-url-2",
        37,
        "actions(20), events(8), teams(7), homepages(2)",
        "17,31,49...",
        9,
      ],
      [
        2,
        "image-url-3",
        64,
        "actions(55), events(10), teams(21), homepages(13)",
        "37,58,67...",
        15,
      ],
      [
        1,
        "image-url-4",
        48,
        "actions(33), events(5), teams(16), homepages(9)",
        "28,47,51...",
        11,
      ],
      [
        4,
        "image-url-5",
        56,
        "actions(38), events(6), teams(18), homepages(14)",
        "22,41,53...",
        13,
      ],
      [
        6,
        "image-url-6",
        42,
        "actions(29), events(4), teams(8), homepages(5)",
        "19,36,44...",
        8,
      ],
      [
        8,
        "image-url-7",
        39,
        "actions(27), events(7), teams(15), homepages(10)",
        "26,40,55...",
        10,
      ],
      [
        7,
        "image-url-8",
        61,
        "actions(50), events(12), teams(26), homepages(17)",
        "35,59,68...",
        16,
      ],
      [
        9,
        "image-url-9",
        33,
        "actions(22), events(9), teams(11), homepages(7)",
        "21,32,46...",
        14,
      ],
      [
        10,
        "image-url-10",
        47,
        "actions(32), events(5), teams(17), homepages(8)",
        "24,42,57...",
        12,
      ],
      [
        11,
        "image-url-11",
        55,
        "actions(41), events(11), teams(20), homepages(12)",
        "31,50,63...",
        15,
      ],
      [
        12,
        "image-url-12",
        36,
        "actions(25), events(3), teams(10), homepages(6)",
        "18,38,49...",
        9,
      ],
      [
        13,
        "image-url-13",
        59,
        "actions(48), events(7), teams(25), homepages(15)",
        "34,54,65...",
        16,
      ],
      [
        14,
        "image-url-14",
        41,
        "actions(30), events(6), teams(9), homepages(4)",
        "20,35,48...",
        10,
      ],
      [
        15,
        "image-url-15",
        44,
        "actions(31), events(8), teams(13), homepages(9)",
        "25,45,52...",
        11,
      ],
    ];
    return arrays;
  };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: 25,

    rowsPerPageOptions: [10, 25, 100],
  };
  return (
    <div>
      <MEPaperBlock>
        <Typography>
          The table below is a summary of all duplicate images that exist on the
          platform. Images that are the exact copy of the other are grouped and
          represented as one row. On each raw, relevant information on where the
          images are being used on the platform, as well as links for previews
          are provided. Click on<b> "View More"</b> for a thorough breakdown.
        </Typography>
      </MEPaperBlock>

      <METable
        page={PAGE_PROPERTIES.DUPLICATE_MEDIA_MANAGEMENT}
        tableProps={{
          title: "All Duplicate Images",
          data: fashionData(),
          columns: getColumns(),
          options,
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryManagement);
