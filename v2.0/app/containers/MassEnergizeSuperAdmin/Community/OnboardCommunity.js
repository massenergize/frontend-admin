import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CommunityOnboardingForm from './CommunityOnboardingForm';
import { sendJson, cleanFormData, fetchData } from '../../../utils/messenger';
import EditCommunityForm from './EditCommunityForm';

class OnboardCommunity extends React.Component {
  constructor() {
    super();
    this.state = { community: null, id: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      const response = await fetchData('v2/community/1');
      await this.setStateAsync({ community: response.data, id:id });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  organizeCommunityInfo = (values) => {
    const result = values;
    console.log(result);
    if (values.geographic_focus === 'DISPERSED') {
      result.is_geographically_focused = false;
    } else {
      result.is_geographically_focused = true;
    }
    delete result.geographical_focus;
    delete result.is_tech_savvy;
    return result;
  }

  submitForm = (formValues) => {
    const cleanedValues = cleanFormData(formValues);
    const values = this.organizeCommunityInfo(cleanedValues);
    sendJson(values, '/v2/communities', '/admin/read/communities');
  }


  updateCommunitySubmission = (formValues) => {
    const cleanedValues = cleanFormData(formValues);
    const values = this.organizeCommunityInfo(cleanedValues);
    sendJson(values, `/v2/community/${this.state.id}`, `/admin/community/${this.state.id}/edit`);
  }

  render() {
    const title = brand.name + ' - Onboard New Community';
    const description = brand.desc;
    const { community } = this.state;
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
          {community
            && <EditCommunityForm onSubmit={this.updateCommunitySubmission} community={community} />
          }
          {!community
            && <CommunityOnboardingForm onSubmit={this.submitForm} community={community} />
          }
        </PapperBlock>
      </div>
    );
  }
}

export default OnboardCommunity;
