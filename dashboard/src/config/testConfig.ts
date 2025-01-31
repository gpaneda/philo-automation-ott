import { TestSuite, Device } from '@/types/testTypes';

export const devices: Device[] = [
  { id: '1', name: 'Fire TV Stick 4K', status: 'active', ipAddress: '10.0.0.98' },
  { id: '2', name: 'Fire TV Cube', status: 'active', ipAddress: '10.0.0.55' },
  { id: '3', name: 'Android TV', status: 'active', ipAddress: '10.0.0.130' },
];

export const testSuites: TestSuite[] = [
  {
    id: 'test:landing',
    name: 'Landing Page Tests',
    description: 'Verify landing page functionality',
    testCases: [
      {
        id: 'TC101',
        name: 'Verify Landing Page Loads Successfully',
        description: 'Check if the landing page loads with all elements',
        status: 'idle'
      },
      {
        id: 'TC102',
        name: 'Verify Featured Content Carousel',
        description: 'Check if featured content carousel works correctly',
        status: 'idle'
      },
      {
        id: 'TC103',
        name: 'Verify Navigation Menu Items',
        description: 'Check if navigation menu items are correct',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:navigation',
    name: 'Navigation Tests',
    description: 'Verify navigation and menu functionality',
    testCases: [
      {
        id: 'TC106',
        name: 'Main Menu Navigation',
        description: 'Verify main menu navigation functionality',
        status: 'idle'
      },
      {
        id: 'TC107',
        name: 'Search Functionality',
        description: 'Verify search functionality works correctly',
        status: 'idle'
      },
      {
        id: 'TC108',
        name: 'Category Filtering',
        description: 'Verify category filtering works',
        status: 'idle'
      },
      {
        id: 'TC109',
        name: 'Genre Selection',
        description: 'Verify genre selection functionality',
        status: 'idle'
      },
      {
        id: 'TC110',
        name: 'Profile Switching',
        description: 'Verify profile switching functionality',
        status: 'idle'
      },
      {
        id: 'TC111',
        name: 'Settings Menu',
        description: 'Verify settings menu navigation',
        status: 'idle'
      },
      {
        id: 'TC112',
        name: 'Back Button Navigation',
        description: 'Verify back button functionality',
        status: 'idle'
      },
      {
        id: 'TC113',
        name: 'Home Button Navigation',
        description: 'Verify home button functionality',
        status: 'idle'
      },
      {
        id: 'TC114',
        name: 'Menu Shortcuts',
        description: 'Verify menu shortcuts work correctly',
        status: 'idle'
      },
      {
        id: 'TC115',
        name: 'Content Browsing',
        description: 'Verify content browsing functionality',
        status: 'idle'
      },
      {
        id: 'TC116',
        name: 'Quick Menu Access',
        description: 'Verify quick menu access functionality',
        status: 'idle'
      },
      {
        id: 'TC117',
        name: 'Navigation History',
        description: 'Verify navigation history functionality',
        status: 'idle'
      },
      {
        id: 'TC118',
        name: 'Movie Titles Logging',
        description: 'Verify movie titles logging in Top Free Movies row',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:login',
    name: 'Login Tests',
    description: 'Verify login functionality',
    testCases: [
      {
        id: 'TC103',
        name: 'User Authentication Flow',
        description: 'Verify user authentication flow works correctly',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:series',
    name: 'Series Details Tests',
    description: 'Verify series details page functionality',
    testCases: [
      {
        id: 'TC119',
        name: 'Series Overview Page',
        description: 'Verify series overview page layout',
        status: 'idle'
      },
      {
        id: 'TC120',
        name: 'Episode List Navigation',
        description: 'Verify episode list navigation',
        status: 'idle'
      },
      {
        id: 'TC121',
        name: 'Season Selection',
        description: 'Verify season selection functionality',
        status: 'idle'
      },
      {
        id: 'TC122',
        name: 'Episode Details',
        description: 'Verify episode details display',
        status: 'idle'
      },
      {
        id: 'TC123',
        name: 'Series Information',
        description: 'Verify series information display',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:playback',
    name: 'Playback Tests',
    description: 'Verify video playback functionality',
    testCases: [
      {
        id: 'TC201',
        name: 'Content Playback',
        description: 'Verify content playback functionality',
        status: 'idle'
      },
      {
        id: 'TC202',
        name: 'Series Playback and Pause',
        description: 'Verify series playback and pause functionality',
        status: 'idle'
      },
      {
        id: 'TC203',
        name: 'Forward Playback',
        description: 'Verify forward playback functionality',
        status: 'idle'
      },
      {
        id: 'TC204',
        name: 'Audio Track Selection',
        description: 'Verify audio track selection',
        status: 'idle'
      },
      {
        id: 'TC205',
        name: 'Ad Triggers',
        description: 'Verify ads trigger with multiple right keypresses',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:movies',
    name: 'Movies Details Tests',
    description: 'Verify movies details page functionality',
    testCases: [
      {
        id: 'TC124',
        name: 'Movie Details Page Layout',
        description: 'Verify movie details page layout',
        status: 'idle'
      },
      {
        id: 'TC125',
        name: 'Movie Playback Controls',
        description: 'Verify movie playback controls',
        status: 'idle'
      }
    ]
  },
  {
    id: 'test:search',
    name: 'Search Tests',
    description: 'Test suite for search functionality',
    testCases: [
      {
        id: 'TC501',
        name: 'Search Results for Series',
        description: 'Verify search results for TV series',
        status: 'idle'
      },
      {
        id: 'TC502',
        name: 'Search Results for Movies',
        description: 'Verify search results for movies',
        status: 'idle'
      },
      {
        id: 'TC503',
        name: 'Search Results for Live TV',
        description: 'Verify search results for live TV channels',
        status: 'idle'
      },
      {
        id: 'TC504',
        name: 'Search Results Filtering',
        description: 'Verify search results filtering options',
        status: 'idle'
      }
    ]
  }
]; 