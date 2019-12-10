import avatarApi from '../images/avatars';

const dummyContents = {
  user: {
    name: 'Super Admin',
    title: 'Super Admin',
    avatar: avatarApi[6],
    status: 'online'
  },
  text: {
    title: 'Super Admin',
    subtitle: 'MassEnergize',
    sentences: 'Is awesome',
    paragraph: 'Is so cool',
    date: 'Jan 9, 2018'
  }
};

dummyContents.profile = {};

export default dummyContents;
