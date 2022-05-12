/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CommunityOnboardingForm from './CommunityOnboardingForm';
import EditCommunityForm from './EditCommunityForm';

class EditCommunityByCommunityAdmin extends React.Component {

  render() {
    const description = brand.desc;
    console.log(this.props)
    auth = this.props.auth;
    const formTitle = "Edit Community Infomation";
    const title = brand.name + ' - ' + formTitle;

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
        <PapperBlock title="Edit Community Information" desc="">
          <EditCommunityForm {...this.props} superAdmin={auth && auth.is_super_admin} />
        </PapperBlock>
      </div>
    );
  }
}

EditCommunityByCommunityAdmin.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export default EditCommunityByCommunityAdmin;
