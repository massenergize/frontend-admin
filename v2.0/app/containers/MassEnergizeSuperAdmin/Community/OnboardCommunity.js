import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CommunityOnboardingForm from './CommunityOnboardingForm';
import { sendJson, cleanFormData } from '../../../utils/messenger';

class Onboarding extends React.Component {
  organizeCommunityInfo = (values) => {
    const result = values;
    if (values.geographic_focus === 'DISPERSED') {
      result.is_geographically_focused = false;
    } else {
      result.is_geographically_focused = true;
    }
    delete result.geographical_focus;
    delete result.is_tech_savvy;
    console.log(result);
    return result;
  }

  submitForm = (formValues) => {
    const cleanedValues = cleanFormData(formValues);
    const values = this.organizeCommunityInfo(cleanedValues);
    sendJson(values, '/v2/communities', '/admin/read/communities');
  }

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
        <PapperBlock title="Onboard New Community" desc="Some text description">
          <CommunityOnboardingForm onSubmit={this.submitForm} />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
