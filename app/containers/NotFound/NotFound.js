import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorWrap } from 'dan-components';
import Seo from '../../components/Seo/Seo';

const NotFound = () => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = 404; // eslint-disable-line
      }
      return (
        <div>
          <Seo name={"Page Not Found"} />
          <ErrorWrap title="404" desc="Oops, Page Not Found:(" />
        </div>
      );
    }}
  />
);

export default NotFound;
