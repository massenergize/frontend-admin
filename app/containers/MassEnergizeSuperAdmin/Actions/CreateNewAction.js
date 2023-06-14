import React from 'react';
import { PapperBlock } from 'dan-components';
import CreateNewActionForm from './CreateNewActionForm';
import Seo from '../../../components/Seo/Seo';

class CreateNewAction extends React.Component {
  render() {
    return (
      <div>
        <Seo name={`Create New Action`} />
        <PapperBlock title="Add New Action" desc="">
          <CreateNewActionForm />
        </PapperBlock>
      </div>
    );
  }
}

export default CreateNewAction;
