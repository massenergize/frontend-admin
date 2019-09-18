import avatarApi from '../images/avatars';
import { fetchData } from '../../utils/messenger';

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

fetchData('v2/user/3573eef7-b000-4d2e-8dd3-5495cc13df6f').then(p => {
  dummyContents.profile = p.data;
});

export default dummyContents;
