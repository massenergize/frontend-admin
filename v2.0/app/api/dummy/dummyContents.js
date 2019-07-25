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

fetchData('v2/user/c43cdb70-29cd-4edf-a38f-e87476cbf77a').then(p => {
  dummyContents.profile = p.data;
});

export default dummyContents;
