import imgApi from '../images/photos';
import avatarApi from '../images/avatars';
const timelineData = [
  {
    id: '1',
    name: 'John Doe',
    date: 'September, 12 2018',
    time: '08:01',
    icon: 'add_circle',
    avatar: avatarApi[6],
    image: imgApi[19],
    content: 'Hello',
    liked: true,
    comments: [
      {
        id: '1_1',
        from: 'Jane Doe',
        avatar: avatarApi[2],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '1_2',
        from: 'Jim Doe',
        avatar: avatarApi[10],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '1_3',
        from: 'Jihan Doe',
        avatar: avatarApi[4],
        date: 'May, 29 2018',
        message: 'Hello'
      }
    ]
  },
  {
    id: '2',
    name: 'John Doe',
    date: 'September, 10 2018',
    time: '03:20',
    icon: 'date_range',
    avatar: avatarApi[6],
    image: '',
    content: 'Hello',
    liked: true,
    comments: [
      {
        id: '2_1',
        from: 'Jane Doe',
        avatar: avatarApi[2],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '2_2',
        from: 'Jihan Doe',
        avatar: avatarApi[4],
        date: 'May, 29 2018',
        message: 'Hello'
      }
    ]
  },
  {
    id: '3',
    name: 'John Doe',
    date: 'Aug, 17 2018',
    time: '04:10',
    icon: 'description',
    avatar: avatarApi[6],
    image: imgApi[20],
    content: 'Hello',
    liked: false,
    comments: [
      {
        id: '3_1',
        from: 'Jack Doe',
        avatar: avatarApi[8],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '3_2',
        from: 'Jim Doe',
        avatar: avatarApi[9],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '3_3',
        from: 'Jihan Doe',
        avatar: avatarApi[4],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '3_4',
        from: 'Janet Doe',
        avatar: avatarApi[5],
        date: 'May, 29 2018',
        message: 'Hello'
      }
    ]
  },
  {
    id: '4',
    name: 'John Doe',
    date: 'Aug, 10 2018',
    time: '08:05',
    icon: 'favorite',
    avatar: avatarApi[6],
    image: '',
    content: 'Hello',
    liked: true,
    comments: [
      {
        id: '4_1',
        from: 'Jane Doe',
        avatar: avatarApi[2],
        date: 'May, 29 2018',
        message: 'Hello'
      }
    ]
  },
  {
    id: '5',
    name: 'John Doe',
    date: 'Aug, 10 2018',
    time: '02:50',
    icon: 'lock',
    avatar: avatarApi[6],
    image: imgApi[12],
    content: 'Hello',
    liked: false,
    comments: [
      {
        id: '5_1',
        from: 'Jim Doe',
        avatar: avatarApi[9],
        date: 'May, 29 2018',
        message: 'Hello'
      },
      {
        id: '5_2',
        from: 'Jihan Doe',
        avatar: avatarApi[4],
        date: 'May, 29 2018',
        message: 'Hello'
      }
    ]
  }
];

export default timelineData;
