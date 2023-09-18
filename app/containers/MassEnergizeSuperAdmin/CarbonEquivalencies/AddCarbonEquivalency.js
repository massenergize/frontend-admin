import React from 'react';
import { PapperBlock } from 'dan-components';
import NewCarbonEquivalencyForm from './NewCarbonEquivalencyForm';
import Seo from '../../../components/Seo/Seo';
class Onboarding extends React.Component {
  render() {
    return (
      <div>
        <Seo name={"Create New Equivalency"} />
        <PapperBlock title="Add New Equivalency" desc="">
          <NewCarbonEquivalencyForm />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
