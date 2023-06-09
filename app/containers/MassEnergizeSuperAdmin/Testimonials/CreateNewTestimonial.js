import React from 'react';
import { PapperBlock } from 'dan-components';
import CreateNewTestimonialForm from './CreateNewTestimonialForm';
import Seo from '../../../components/Seo/Seo';
class CreateNewTestimonial extends React.Component {
  render() {
    return (
      <div>
        <Seo name={"Create New Testimonial"} />
        <PapperBlock title="Add New Testimonial" desc="">
          <CreateNewTestimonialForm />
        </PapperBlock>
      </div>
    );
  }
}

export default CreateNewTestimonial;
