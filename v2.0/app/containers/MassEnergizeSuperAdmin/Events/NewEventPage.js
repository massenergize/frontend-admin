import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import CreateNewEventForm from './CreateNewEventForm';
import EditEventForm from './EditEventForm';
class CreateNewEvent extends React.Component {
  render() {
    const title = brand.name + ' - Event & Campaigns';
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

        { isEditForm &&
          <EditEventForm {...this.props} />
        }
        { !isEditForm &&
          <CreateNewEventForm {...this.props} />
        }
      </div>
    );
  }
}

export default CreateNewEvent;
