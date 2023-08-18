import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import NewCategoryForm from './NewCategoryForm';
import Seo from '../../../components/Seo/Seo';
class Onboarding extends React.Component {
  render() {
    const title = brand.name + ' - Add Tag Collection';
    const description = brand.desc;
    return (
      <div>
        <Seo name={"Create New Tag Collection"} />
        <PapperBlock title="Add New Tag Collection" desc="">
          <NewCategoryForm />
        </PapperBlock>
      </div>
    );
  }
}

export default Onboarding;
