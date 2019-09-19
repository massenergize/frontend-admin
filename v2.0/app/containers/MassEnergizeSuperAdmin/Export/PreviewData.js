import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
class Onboarding extends React.Component {
  render() {
    const title = brand.name + ' - Data Preview';
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
        <PapperBlock title="Data Priview Page" desc="Some text description">
          content goes here
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
