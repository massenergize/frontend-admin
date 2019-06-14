module.exports = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'ios-stats',
  },
  {
    key: 'communities',
    name: 'Communities',
    icon: 'ios-people',
    child: [
      {
        key: 'about-communities',
        name: 'Communities',
        title: true,
      },
      {
        key: 'onboard-community',
        name: 'Add New Community',
        link: '/add/community'
      },
      {
        key: 'all-communities',
        name: 'All Communities',
        link: '/read/communities'
      },
    ]
  },
  {
    key: 'vendors',
    name: 'Vendors',
    icon: 'md-hammer',
    child: []
  },
  {
    key: 'actions',
    name: 'Actions',
    icon: 'ios-bulb',
    child: []
  },
  {
    key: 'events',
    name: 'Events',
    icon: 'md-wifi',
    child: []
  },
  {
    key: 'categories',
    name: 'Categories',
    icon: 'md-reorder',
    child: []
  },
  {
    key: 'teams',
    name: 'Teams',
    icon: 'ios-people',
    child: []
  },
  {
    key: 'goals',
    name: 'Goals',
    icon: 'ios-checkmark-circle',
    child: []
  },
  {
    key: 'stories',
    name: 'Stories',
    icon: 'ios-analytics',
    child: []
  },
  {
    key: 'export',
    name: 'Export',
    icon: 'ios-cloud-download',
    child: []
  },
  {
    key: 'policies',
    name: 'Policies',
    icon: 'ios-alert',
    child: []
  },
  {
    key: 'page-customization',
    name: 'Customize Pages',
    icon: 'ios-apps',
    child: []
  },
  {
    key: 'demo',
    name: 'Demo',
    title: true,
  },
  {
    key: 'pages',
    name: 'Pages',
    icon: 'ios-paper-outline',
    child: [
      {
        key: 'other_page',
        name: 'Welcome Page',
        title: true,
      },
      {
        key: 'blank',
        name: 'Blank Page',
        link: '/app'
      },
      {
        key: 'main_page',
        name: 'Sample Page',
        title: true,
      },
      {
        key: 'dashboard',
        name: 'Dashboard',
        link: '/app/dashboard'
      },
      {
        key: 'form',
        name: 'Form',
        link: '/app/form'
      },
      {
        key: 'table',
        name: 'Table',
        link: '/app/table'
      },
      {
        key: 'maintenance',
        name: 'Maintenance',
        link: '/maintenance'
      },
      {
        key: 'coming_soon',
        name: 'Coming Soon',
        link: '/coming-soon'
      },
    ]
  },
  {
    key: 'auth',
    name: 'Auth Page',
    icon: 'ios-contact-outline',
    child: [
      {
        key: 'login',
        name: 'Login',
        link: '/login'
      },
      {
        key: 'register',
        name: 'Register',
        link: '/register'
      },
      {
        key: 'reset',
        name: 'Reset Password',
        link: '/reset-password'
      },
    ]
  },
  {
    key: 'errors',
    name: 'Errors',
    icon: 'ios-paw-outline',
    child: [
      {
        key: 'not_found_page',
        name: 'Not Found Page',
        link: '/app/pages/not-found'
      },
      {
        key: 'error_page',
        name: 'Error Page',
        link: '/app/pages/error'
      },
    ]
  },
  {
    key: 'menu_levels',
    name: 'Menu Levels',
    multilevel: true,
    icon: 'ios-menu-outline',
    child: [
      {
        key: 'level_1',
        name: 'Level 1',
        link: '/#'
      },
      {
        key: 'level_2',
        keyParent: 'menu_levels',
        name: 'Level 2',
        child: [
          {
            key: 'sub_menu_1',
            name: 'Sub Menu 1',
            link: '/#'
          },
          {
            key: 'sub_menu_2',
            name: 'Sub Menu 2',
            link: '/#'
          },
        ]
      },
    ]
  }
];
