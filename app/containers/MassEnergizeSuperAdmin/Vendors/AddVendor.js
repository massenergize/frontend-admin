import React from 'react';
import { PapperBlock } from 'dan-components';
import AddVendorForm from './AddVendorForm';
import Seo from '../../../components/Seo/Seo';

class AddVendor extends React.Component {
  render() {
    return (
      <div>
        <Seo name={"Create New Vendor"} />
        <PapperBlock title="Add New Vendor" desc="">
          <AddVendorForm />
        </PapperBlock>
      </div>
    );
  }
}

export default AddVendor;
