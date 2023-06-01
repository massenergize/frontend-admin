import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CreateNewTeamForm from './CreateNewTeamForm';
import Seo from '../../../components/Seo/Seo';
class Onboarding extends React.Component {
  render() {
    const title = brand.name + ' - Create New Team';
    const description = brand.desc;
    return (
      <div>
        <Seo name={"Create New Team"} />
        <PapperBlock title="Create New Team" desc="">
          <CreateNewTeamForm />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
