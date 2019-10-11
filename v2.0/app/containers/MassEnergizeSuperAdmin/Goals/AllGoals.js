import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Edit from '@material-ui/icons/Edit';
import Language from '@material-ui/icons/Language';
import Email from '@material-ui/icons/Email';
import MUIDataTable from 'mui-datatables';

import messageStyles from 'dan-styles/Messages.scss';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';


const tableStyles = theme => ({
  table: {
    '& > div': {
      overflow: 'auto'
    },
    '& table': {
      minWidth: 500,
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 40
        }
      }
    }
  }
});

class AllGoals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { goals: [], columns: this.getColumns(), data: [] };
  }

  async componentDidMount() {
    const allGoalsResponse = await apiCall('/goals.listForSuperAdmin');
    if (allGoalsResponse && allGoalsResponse.success) {
      const data = allGoalsResponse.data.map(d => (
        [
          d.id,
          d.name,
          `${d.attained_number_of_actions}/${d.target_number_of_actions}`,
          `${d.attained_number_of_households}/${d.target_number_of_actions}`,
          `${d.attained_carbon_footprint_reduction}/${d.target_carbon_footprint_reduction}`,
          `${('' + d.description).substring(0, 100)}...`
        ]
      ));
      console.log(data);
      await this.setStateAsync({ goals: allGoalsResponse.data, data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };

  getColumns = () => {
    return [
      {
        name: 'ID',
        options: {
          filter: true
        }
      },
      {
        name: 'Name',
        options: {
          filter: true
        }
      },
      {
        name: '% Actions Achieved',
        options: {
          filter: true,
        }
      },
      {
        name: '% Households Achieved',
        options: {
          filter: true,
        }
      },
      {
        name: '% CarbonFootprintSavings',
        options: {
          filter: true,
        }
      },
      {
        name: '% Carbon Achieved',
        options: {
          filter: false,
          // customBodyRender: (value) => (
          //   <LinearProgress variant="determinate" color="secondary" value={value} />
          // )
        }
      },
      {
        name: 'Description',
        options: {
          filter: true,
          // customBodyRender: (value) => {
          //   if (value === 'active') {
          //     return (<Chip label="Active" color="secondary" />);
          //   }
          //   if (value === 'non-active') {
          //     return (<Chip label="Non Active" color="primary" />);
          //   }
          //   return (<Chip label="Unknown" />);
          // }
        }
      },
      {
        name: 'Options',
        options: {
          filter: true,
          // customBodyRender: (value) => {
          //   const nf = new Intl.NumberFormat('en-US', {
          //     style: 'currency',
          //     currency: 'USD',
          //     minimumFractionDigits: 2,
          //     maximumFractionDigits: 2
          //   });

          //   return nf.format(value);
          // }
        }
      },
    ];
  }


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Goals" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <div>
                      <Typography>{n.name}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    <Chip label={n.attained_number_of_actions * 100 / (n.target_number_of_actions + 1)} className={classNames(classes.chip, this.getStatus(n.status === 'COMPLETE'))} />
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    {n.description}
                  </Typography>
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )


  render() {
    const title = brand.name + ' - All Goals';
    const description = brand.desc;
    const { goals, columns, data } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      page: 1
    };

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
        {this.renderTable(goals, classes)}

        <div className={classes.table}>
          <MUIDataTable
            title="All Goals"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllGoals.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllGoals);
