import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
// import DataAvailableTable from './DataAvailableTable';

class AllExportableData extends React.Component {
  render() {
    const title = brand.name + ' - Export Data';
    const description = brand.desc;
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
        <PapperBlock title="Export Data" desc="Download data for communities here">
          {/* <DataAvailableTable /> */}
          <h2>No Data Available Yet</h2>
        </PapperBlock>
      </div>
    );
  }
}

export default AllExportableData;
