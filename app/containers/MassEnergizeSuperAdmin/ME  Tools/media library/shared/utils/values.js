import _spinner from "../images/loading-gif.gif";
import _blank from "../images/blank_canvas.png";
import _libraryImage from "../images/lib.png";
export const spinner = _spinner;
export const blank = _blank;
export const libraryImage = _libraryImage;
export const dummyImages = [
  { url: "https://i.pravatar.cc/300?img=3", id: 1 },
  { url: "https://i.pravatar.cc/300?img=5", id: 12 },
  { url: "https://i.pravatar.cc/300?img=9", id: 14 },
  { url: "https://i.pravatar.cc/300?img=1", id: 15 },
  { url: "https://i.pravatar.cc/300?img=6", id: 16 },
  { url: "https://i.pravatar.cc/300?img=31", id: 18 },
  { url: "https://i.pravatar.cc/300?img=17", id: 19 },
  { url: "https://i.pravatar.cc/300?img=30", id: 11 },
  { url: "https://i.pravatar.cc/300?img=8", id: 32 }
];

export const TABS = {
  UPLOAD_TAB: "upload",
  LIBRARY_TAB: "library",
  CROPPING_TAB: "crop"
  // UPLOAD_FORM: "upload-form",
};

export const IMAGE_QUALITY = {
  LOW: { key: "LOW", value: 0.2 },
  MEDIUM: { key: "MEDIUM", value: 0.5 },
  HIGH: { key: "HIGH", value: 0.75 }
};

export const DEFAULT_FILE_LIMIT = 10; // There is no significant reason for 10 as the default number. We can change it to anything later...

export const DEFFAULT_MAX_SIZE = 1500000; // like 1.5MB

export const PUB_MODES = { OPEN: "OPEN", OPEN_TO: "OPEN_TO" };
export const COPYRIGHT_OPTIONS = {
  YES: {
    value: true,
    key: "YES",
    notes: "Took the photo or made the image, or was given permission by the person who made the image"
  },
  YES_CHECKED: {
    value: true,
    key: "YES_CHECKED",
    notes: "Checked that the image is not copyright protected"
  },
  NO: {
    value: false,
    key: "NO",
    notes: "Image may be protected by copyright, and I don't have permission"
  }
};

const EG_MENU_ITEMS = [
  {
    is_published: true,
    id: 5,
    name: "Home",
    link: "https://example.com/item/5",
    is_link_external: false,
    parent: "category-b",
    order: 0,
    children: [
      {
        is_published: true,
        id: 6,
        name: "Introduction",
        link: "https://external-site.com/item/6",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 7,
        name: "Overview",
        link: "https://example.com/item/7",
        is_link_external: false,
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_published: true,
    id: 1,
    name: "Actions",
    link: "https://example.com/item/1",
    is_link_external: false,
    parent: "category-a",
    order: 1
  },
  {
    is_published: false,
    id: 2,
    name: "Teams",
    link: "https://example.com/item/2",
    is_link_external: false,
    parent: "category-b",
    order: 2,
    children: [
      {
        is_published: true,
        id: 10,
        name: "Team A",
        link: "https://external-site.com/item/10",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 11,
        name: "Team B",
        link: "https://example.com/item/11",
        is_link_external: false,
        parent: "category-b",
        children: [
          {
            is_published: true,
            id: 12,
            name: "Team B1",
            link: "https://example.com/item/12",
            is_link_external: false,
            parent: "category-b",
            order: 5
          },
          {
            is_published: true,
            id: 13,
            name: "Team B2",
            link: "https://external-site.com/item/13",
            is_link_external: true,
            parent: "category-b",
            order: 6
          }
        ],
        order: 6
      }
    ]
  },
  {
    is_published: true,
    id: 3,
    name: "Events",
    link: "https://example.com/item/3",
    is_link_external: false,
    parent: "category-a",
    order: 3,
    children: [
      {
        is_published: true,
        id: 8,
        name: "Upcoming Events",
        link: "https://external-site.com/item/8",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 9,
        name: "Past Events",
        link: "https://example.com/item/9",
        is_link_external: false,
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_published: false,
    id: 4,
    name: "About Us",
    link: "https://example.com/item/4",
    is_link_external: false,
    parent: "category-c",
    order: 7,
    children: [
      {
        is_published: true,
        id: 14,
        name: "Our Story",
        link: "https://example.com/item/14",
        is_link_external: false,
        parent: "category-b",
        order: 5,
        children: [
          {
            is_published: true,
            id: 16,
            name: "Founding",
            link: "https://external-site.com/item/16",
            is_link_external: true,
            parent: "category-b",
            order: 5
          },
          {
            is_published: true,
            id: 17,
            name: "Milestones",
            link: "https://example.com/item/17",
            is_link_external: false,
            parent: "category-b",
            order: 6
          }
        ]
      },
      {
        is_published: true,
        id: 15,
        name: "Mission & Vision",
        link: "https://external-site.com/item/15",
        is_link_external: true,
        parent: "category-b",
        order: 6
      }
    ]
  }
];

export const EXAMPLE_MENU_STRUCTURE = {
  data: {
    title: "Energize Wayland - Navbar Menu",
    community: 3,
    is_deleted: false,
    is_published: true,
    is_footer_menu: false,
    more_info: null,
    community_logo_link: "",
    id: "f45f9224-5cf2-4f74-aba9-c94f24d887ba",
    menu_items: [
      {
        name: "Home",
        link: null,
        order: 0,
        is_published: true,
        id: "d29f0a5d-757b-451d-b1cc-2076ddb3d92c",
        children: [
          {
            name: "Home",
            link: "/",
            order: 0,
            is_published: true,
            id: "1dfd4ac9-b8ea-4e96-8a44-6a36afabe32e"
          },
          {
            name: "Take the tour",
            link: "/?tour=true",
            order: 1,
            is_published: true,
            id: "c44cedb2-6c57-46f6-8773-e903ef8dab69"
          }
        ]
      },
      {
        name: "Actions",
        link: null,
        order: 1,
        is_published: true,
        id: "68027556-aeff-4494-9f41-94e60fa2db7c",
        children: [
          {
            name: "All Actions",
            link: "/actions",
            order: 0,
            is_published: true,
            id: "32fddbe2-13e1-48b0-aa9d-15b7753b914f"
          },
          {
            name: "Service Providers",
            link: "/services",
            order: 1,
            is_published: true,
            id: "ca2763dc-1037-400a-9188-57062ded6edb"
          },
          {
            name: "Testimonials",
            link: "/testimonials",
            order: 2,
            is_published: true,
            id: "3b85f1ca-c35f-4995-90d3-01d12b152864"
          }
        ]
      },
      {
        name: "Teams",
        link: "/teams",
        order: 2,
        is_published: true,
        id: "7e50da2a-f464-4165-82a4-32de671df33c",
        children: []
      },
      {
        name: "Events",
        link: "/events",
        order: 3,
        is_published: true,
        id: "d68854b0-f31a-43af-9b9d-7bc29580e7ff",
        children: []
      },
      {
        name: "About Us",
        link: null,
        order: 4,
        is_published: true,
        id: "2960013b-b2a1-4435-b26e-aff5ad98c711",
        children: [
          {
            name: "Impact",
            link: "/impact",
            order: 0,
            is_published: true,
            id: "d33147c7-ba72-4690-8761-7cd1b190908f"
          },
          {
            name: "Our Story",
            link: "/aboutus",
            order: 1,
            is_published: true,
            id: "eaf13e74-dcfd-4355-8c32-5011c3bc2127"
          },
          {
            name: "Donate",
            link: "/donate",
            order: 2,
            is_published: true,
            id: "0f3a2def-2e37-41d8-88d8-e9878a043a97"
          },
          {
            name: "Contact Us",
            link: "/contactus",
            order: 3,
            is_published: true,
            id: "3f35547e-cf42-44e1-a6b5-a6e3243aded6"
          }
        ]
      }
    ]
  },
  error: null,
  success: true,
  cursor: {}
};
