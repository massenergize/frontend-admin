import React from 'react';
import { AdvTable } from 'massenergize-components';

let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return {
    id: counter,
    name,
    calories,
    fat,
    carbs,
    protein
  };
}

class DataAvailableTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    columnData: [
      {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Dessert (100g serving)'
      }, {
        id: 'calories',
        numeric: true,
        disablePadding: false,
        label: 'Calories'
      }, {
        id: 'fat',
        numeric: true,
        disablePadding: false,
        label: 'Fat (g)'
      }, {
        id: 'carbs',
        numeric: true,
        disablePadding: false,
        label: 'Carbs (g)'
      }, {
        id: 'protein',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)'
      },
    ],
    data: [
      createData('users', 305, 3.7, 67, 4.3),
      createData('actions', 452, 25.0, 51, 4.9),
    ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
    page: 0,
    rowsPerPage: 5,
    defaultPerPage: 5,
    filterText: '',
  };

  render() {
    const {
      order,
      orderBy,
      selected,
      data,
      page,
      rowsPerPage,
      defaultPerPage,
      filterText,
      columnData
    } = this.state;

    return (
      <AdvTable
        order={order}
        orderBy={orderBy}
        selected={selected}
        data={data}
        page={page}
        rowsPerPage={rowsPerPage}
        defaultPerPage={defaultPerPage}
        filterText={filterText}
        columnData={columnData}
      />
    );
  }
}


export default DataAvailableTable;
