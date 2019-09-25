/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CommunityOnboardingForm from './CommunityOnboardingForm';
import { sendJson, cleanFormData, fetchData } from '../../../utils/messenger';
import EditCommunityForm from './EditCommunityForm';

class OnboardCommunity extends React.Component {
  constructor() {
    super();
    this.state = { community: null, id: null, submitIsClicked: false };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      const response = await fetchData(`v2/community/${id}`);
      await this.setStateAsync({ community: response.data, id });
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
      console.log(result);
      result.is_geographically_focused = true;
      result.location = {
        address1: result.address1,
        address2: result.address2,
        city: result.city,
        state: result.state,
        zip: result.zip,
        country: result.country
      };
      delete result.address1;
      delete result.address2;
      delete result.city;
      delete result.state;
      delete result.zip;
      delete result.country;
      console.log(result);
    }
    delete result.geographical_focus;
    delete result.is_tech_savvy;
    return result;
  }

  submitForm = async (formValues) => {
    await this.setStateAsync({ submitIsClicked: true });
    const cleanedValues = cleanFormData(formValues);
    const values = this.organizeCommunityInfo(cleanedValues);
    sendJson(values, '/v2/communities', '/admin/read/communities');
  }


  updateCommunitySubmission = async (formValues) => {
    await this.setStateAsync({ submitIsClicked: true });
    const cleanedValues = cleanFormData(formValues);
    const values = this.organizeCommunityInfo(cleanedValues);
    sendJson(values, `/v2/community/${this.state.id}`, `/admin/community/${this.state.id}/edit`);
  }

  render() {
    const title = brand.name + ' - Onboard New Community';
    const description = brand.desc;
    const { community, submitIsClicked } = this.state;

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
            && <EditCommunityForm onSubmit={this.updateCommunitySubmission} community={community} submitIsClicked={submitIsClicked} />
          }
          {!community
            && <CommunityOnboardingForm onSubmit={this.submitForm} community={community} submitIsClicked={submitIsClicked} />
          }
        </PapperBlock>
      </div>
    );
  }
}

OnboardCommunity.propTypes = {
  match: PropTypes.object.isRequired,
};
export default OnboardCommunity;
