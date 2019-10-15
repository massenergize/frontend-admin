import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import CreatePolicyForm from './CreatePolicyForm';
import EditPolicyForm from './EditPolicyForm';
class Onboarding extends React.Component {

  render() {
    const isEditForm = this.props.location.pathname.includes('edit');
    const title = brand.name + ' - Create Policy';
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
        {!isEditForm
        && <CreatePolicyForm {...this.props} />
        }
        {isEditForm
          && <EditPolicyForm {...this.props} />
        }
      </div>
    );
  }
}

export default Onboarding;
