import { TableFilterList } from "mui-datatables";
import React from "react";
import Chip from "@mui/material/Chip";
const OurChip = ({ label, onDelete }) => {
  return (
    <Chip
      variant="contained"
      // color="secondary"
      label={label}
      onDelete={onDelete}
    />
  );
};
const EmptyChip = () => <></>;

export const renderInvisibleChips = (invisible) => {
  const CustomFilterList = (props) => {
    return (
      <>
        <TableFilterList
          {...props}
          ItemComponent={invisible ? EmptyChip : OurChip}
        />
      </>
    );
  };
  return CustomFilterList;
};
