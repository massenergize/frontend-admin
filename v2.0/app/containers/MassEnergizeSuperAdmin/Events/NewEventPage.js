import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import CreateNewEventForm from './CreateNewEventForm';
class CreateNewEvent extends React.Component {
  render() {
    const title = brand.name + ' - Create New Event';
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
        <PapperBlock title="New Event Page" desc="Add Event Form">
          <CreateNewEventForm />
        </PapperBlock>
      </div>
    );
  }
}

export default CreateNewEvent;
