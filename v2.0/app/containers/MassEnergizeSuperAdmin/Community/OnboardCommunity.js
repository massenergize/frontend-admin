import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CommunityOnboardingForm from './CommunityOnboardingForm';
class Onboarding extends React.Component {
  render() {
    const title = brand.name + ' - Onboard New Community';
    const description = brand.desc;
    // fetch('http://localhost:8000/super-admin/create/action', {
    //   credentials: 'include',
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'X-CSRFToken': csrftoken,
    //   },
    //   body: {
    //     a: 3,
    //     b: 3,
    //   }
    // }).catch(error => {
    //   console.log(error);
    // });
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
        <PapperBlock title="Onboard New Community" desc="Some text description">
          <CommunityOnboardingForm />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
