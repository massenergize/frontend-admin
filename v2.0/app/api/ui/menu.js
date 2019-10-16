module.exports = [
  // {
  //   key: 'dashboard',
  //   name: 'Dashboard',
  //   icon: 'ios-stats',
  //   link: '/admin/dashboard'
  // },
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
        link: '/admin/add/community'
      },
      {
        key: 'all-communities',
        name: 'All Communities',
        link: '/admin/read/communities'
      },
    ]
  },
  {
    key: 'actions',
    name: 'Actions',
    icon: 'ios-bulb',
    child: [
      {
        key: 'about-actions',
        name: 'Actions',
        title: true
      },
      {
        key: 'add-action',
        name: 'Add New Action',
        link: '/admin/add/action'
      },
      {
        key: 'all-actions',
        name: 'All Actions',
        link: '/admin/read/actions'
      },
    ]
  },
  {
    key: 'events',
    name: 'Events',
    icon: 'md-wifi',
    child: [
      {
        key: 'about-events',
        name: 'Events',
        title: true
      },
      {
        key: 'add-event',
        name: 'Add Event',
        link: '/admin/add/event'
      },
      {
        key: 'all-events',
        name: 'All Events',
        link: '/admin/read/events'
      },
    ]
  },
  {
    key: 'tags-collections',
    name: 'Tag Collections',
    icon: 'md-reorder',
    child: [
      {
        key: 'about-categories',
        name: 'Tags & Tag Collections',
        title: true
      },
      {
        key: 'add-vendor',
        name: 'Add New Category',
        link: '/admin/add/category'
      },
      {
        key: 'all-collections',
        name: 'All Tag Collections',
        link: '/admin/read/tag-collections'
      },
    ]
  },
  {
    key: 'teams',
    name: 'Teams',
    icon: 'ios-people',
    child: [
      {
        key: 'about-teams',
        name: 'Teams',
        title: true
      },
      {
        key: 'add-team',
        name: 'Add New Team',
        link: '/admin/add/team'
      },
      {
        key: 'all-teams',
        name: 'All Teams',
        link: '/admin/read/teams'
      },
    ]
  },
  {
    key: 'goals',
    name: 'Goals',
    icon: 'ios-checkmark-circle',
    child: [
      {
        key: 'about-goals',
        name: 'Goals',
        title: true
      },
      {
        key: 'add-goal',
        name: 'Add New Goal',
        link: '/admin/add/goal'
      },
      {
        key: 'all-goals',
        name: 'All Goals',
        link: '/admin/read/goals'
      },
    ]
  },
  {
    key: 'testimonials',
    name: 'Testimonials',
    icon: 'ios-analytics',
    child: [
      {
        key: 'about-testimonials',
        name: 'testimonials',
        title: true
      },
      {
        key: 'add-testimonial',
        name: 'Add New Testimonial',
        link: '/admin/add/testimonial'
      },
      {
        key: 'all-testimonials',
        name: 'All Testimonials',
        link: '/admin/read/testimonials'
      },
    ]
  },
  {
    key: 'vendors',
    name: 'Vendors',
    icon: 'md-hammer',
    child: [
      {
        key: 'about-vendors',
        name: 'Contractors/Vendors',
        title: true
      },
      {
        key: 'add-vendor',
        name: 'Add New Vendor',
        link: '/admin/add/vendor'
      },
      {
        key: 'all-vendors',
        name: 'All Vendors',
        link: '/admin/read/vendors'
      },
    ]
  },
  {
    key: 'export',
    name: 'Export',
    icon: 'ios-cloud-download',
    link: '/admin/export'
  },
  {
    key: 'policies',
    name: 'Policies',
    icon: 'ios-alert',
    child: [
      {
        key: 'about-policies',
        name: 'policies',
        title: true
      },
      {
        key: 'add-policy',
        name: 'Add New Policy',
        link: '/admin/add/policy'
      },
      {
        key: 'all-policies',
        name: 'All Policies',
        link: '/admin/read/policies'
      },
    ]
  },
  {
    key: 'page-customization',
    name: 'Pages',
    icon: 'ios-apps',
    child: [
      {
        key: 'about-pages',
        name: 'Website Pages',
        title: true
      },
      {
        key: 'home',
        name: 'Home',
        link: '/admin/add/home'
      },
      {
        key: 'all-actions',
        name: 'All Actions',
        link: '/admin/read/all-actions'
      },
      {
        key: 'donate',
        name: 'Donate',
        link: '/admin/add/donate'
      },
      {
        key: 'contact',
        name: 'Contact Us',
        link: '/admin/read/contact-us'
      },
      {
        key: 'about-us',
        name: 'About Us',
        link: '/admin/read/about-us'
      },
    ]
  },
  // {
  //   key: 'demo',
  //   name: 'Demo',
  //   title: true,
  // },
  // {
  //   key: 'pages',
  //   name: 'Pages',
  //   icon: 'ios-paper-outline',
  //   child: [
  //     {
  //       key: 'other_page',
  //       name: 'Welcome Page',
  //       title: true,
  //     },
  //     {
  //       key: 'blank',
  //       name: 'Blank Page',
  //       link: '/app'
  //     },
  //     {
  //       key: 'main_page',
  //       name: 'Sample Page',
  //       title: true,
  //     },
  //     {
  //       key: 'dashboard',
  //       name: 'Dashboard',
  //       link: '/admin/dashboard'
  //     },
  //     {
  //       key: 'form',
  //       name: 'Form',
  //       link: '/admin/form'
  //     },
  //     {
  //       key: 'table',
  //       name: 'Table',
  //       link: '/admin/table'
  //     },
  //     {
  //       key: 'maintenance',
  //       name: 'Maintenance',
  //       link: '/maintenance'
  //     },
  //     {
  //       key: 'coming_soon',
  //       name: 'Coming Soon',
  //       link: '/coming-soon'
  //     },
  //   ]
  // },
  // {
  //   key: 'auth',
  //   name: 'Auth Page',
  //   icon: 'ios-contact-outline',
  //   child: [
  //     {
  //       key: 'login',
  //       name: 'Login',
  //       link: '/login'
  //     },
  //     {
  //       key: 'register',
  //       name: 'Register',
  //       link: '/register'
  //     },
  //     {
  //       key: 'reset',
  //       name: 'Reset Password',
  //       link: '/reset-password'
  //     },
  //   ]
  // },
  // {
  //   key: 'errors',
  //   name: 'Errors',
  //   icon: 'ios-paw-outline',
  //   child: [
  //     {
  //       key: 'not_found_page',
  //       name: 'Not Found Page',
  //       link: '/admin/pages/not-found'
  //     },
  //     {
  //       key: 'error_page',
  //       name: 'Error Page',
  //       link: '/admin/pages/error'
  //     },
  //   ]
  // },
  // {
  //   key: 'menu_levels',
  //   name: 'Menu Levels',
  //   multilevel: true,
  //   icon: 'ios-menu-outline',
  //   child: [
  //     {
  //       key: 'level_1',
  //       name: 'Level 1',
  //       link: '/#'
  //     },
  //     {
  //       key: 'level_2',
  //       keyParent: 'menu_levels',
  //       name: 'Level 2',
  //       child: [
  //         {
  //           key: 'sub_menu_1',
  //           name: 'Sub Menu 1',
  //           link: '/#'
  //         },
  //         {
  //           key: 'sub_menu_2',
  //           name: 'Sub Menu 2',
  //           link: '/#'
  //         },
  //       ]
  //     },
  //   ]
  // }
];
