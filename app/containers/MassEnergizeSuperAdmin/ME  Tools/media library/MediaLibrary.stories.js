import React from 'react';
import MediaLibrary from './MediaLibrary';
import { dummyImages } from './shared/utils/values';

export default {
  title: 'Components/MediaLibrary',
  component: MediaLibrary,
};

const Template = (args) => <MediaLibrary {...args} />;

export const Default = Template.bind({});
Default.args = {
  images: dummyImages,
  uploadMultiple: true,
  multiple: false,
  // selected: [
  //   { url: "https://i.pravatar.cc/300?img=3", id: 18 },
  //   { url: "https://i.pravatar.cc/300?img=31", id: 19 },
  // ],

  onInsert: (content, reset) => console.log('I have been seelcted', content),
};
