import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import CreateNewGoalForm from './CreateNewGoalForm';
import EditGoalForm from './EditGoalForm';

class GoalPage extends React.Component {
  render() {
    const title = brand.name + ' - Create New Goal';
    const description = brand.desc;

    const isEditForm = this.props.location.pathname.includes('edit');
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
          && <CreateNewGoalForm {...this.props} />
        }
        {isEditForm
          && <EditGoalForm {...this.props} />
        }
      </div>
    );
  }
}

export default GoalPage;
