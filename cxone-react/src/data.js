export const BRANDS = {
  holland: { name: 'Holland America', tag: 'Excellence at sea', favicon: '/vite.svg' },
  princess: { name: 'Princess Cruises', tag: 'Come back new', favicon: '/vite.svg' },
  seabourn: { name: 'Seabourn', tag: 'Luxury reimagined', favicon: '/vite.svg' },
  cunard: { name: 'Cunard', tag: 'Elegance at sea', favicon: '/vite.svg' },
};

export const SAMPLE_API_RESPONSES = [
  {
    customerId: 'C-0001',
    callerType: 'T',
    travelAdvisor: 'Cosco Travel',
    travelAdvisorImage: '/assets/directGuest.png',
    intent: 'newBooking',
    intentImage: '/assets/icons/intent.png',
    booking: { id: 'B-12345', date: '' },
    voyageType: 'World Cruise',
    voyageTypeImage: '/assets/icons/voyage.png',
    brand: 'holland',
    authenticated: true,
    lang: 'en-US',
    langFlag: '/assets/flags/english.png',
    phoneType: 'Mobile',
    phoneTypeImage: '/assets/phoneTypes/mobile.png',
    transcript: 'Sample transcript for customer C-0001',
    notes: 'Some initial notes',
  },
  {
    customerId: 'C-0002',
    callerType: 'D',
    travelAdvisor: '',
    travelAdvisorImage: '/assets/directGuest.png',
    intent: '',
    booking: null,
    voyageType: '',
    brand: 'cunard',
    authenticated: false,
    lang: 'nl-NL',
    langFlag: '/assets/flags/dutch.png',
    phoneType: 'Landline',
    phoneTypeImage: '/assets/phoneTypes/landline.png',
    transcript: '',
    notes: '',
  },
];

export const SAMPLE_API_RESPONSE = SAMPLE_API_RESPONSES[0];
