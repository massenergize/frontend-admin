import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CreateNewTeamForm from './CreateNewTeamForm';
class Onboarding extends React.Component {
  render() {
    const title = brand.name + ' - Onboard New Community';
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
        <PapperBlock title="Create New Team" desc="Some text description">
          <CreateNewTeamForm />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
