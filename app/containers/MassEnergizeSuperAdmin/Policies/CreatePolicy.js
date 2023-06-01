import React from 'react';
import CreatePolicyForm from './CreatePolicyForm';
import EditPolicyForm from './EditPolicyForm';
import Seo from '../../../components/Seo/Seo';
class Onboarding extends React.Component {

  render() {
    const isEditForm = this.props.location.pathname.includes('edit');
    return (
      <div>
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
