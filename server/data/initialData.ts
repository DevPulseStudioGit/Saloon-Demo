import {
  SalonSettings,
  Branch,
  Staff,
  ServiceCategory,
  Service,
  Appointment,
  PackageDeal,
  RetailProduct,
  GiftCard,
  CustomerRecord,
  Review,
  FaqItem,
  AuditLogItem,
  UserSession
} from '../types';

export const INITIAL_SETTINGS: SalonSettings = {
  salonName: 'Luma Atelier',
  tagline: 'Haute Coiffure, Bespoke Aesthetics & Editorial Bridal Studio',
  description: "Karachi's premiere artisanal beauty destination. Dedicated to quiet luxury, precision hair craft, dermatological skin therapies, and editorial glamour.",
  heroHeading: 'Your Style. Your Moment.',
  heroSubheading: 'Thoughtful beauty services, expert care, and a personalised salon experience designed around you in Karachi.',
  phone: '+92 21 3583 4900',
  whatsapp: '+92 300 829 4900',
  email: 'concierge@lumaatelier.com',
  address: 'Plot 4-C, 7th Commercial Lane, Zamzama Blvd, Phase 5, DHA & E-Street Clifton, Karachi',
  googleMapsUrl: 'https://maps.google.com/?q=Zamzama+Commercial+DHA+Karachi',
  openingHoursSummary: 'Tuesday – Sunday: 10:30 AM – 8:00 PM (Monday Closed for Atelier Masterclasses)',
  timeZone: 'Asia/Karachi',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  socials: {
    instagram: 'https://instagram.com/lumaatelier.pk',
    facebook: 'https://facebook.com/lumaatelier.pk',
    tiktok: 'https://tiktok.com/@lumaatelier.pk'
  },
  bookingRules: {
    advanceBookingDays: 45,
    minNoticeHours: 2,
    defaultSlotInterval: 30,
    autoConfirm: true,
    allowGuestBooking: true,
    allowStylistSelection: true,
    bufferTimeBetweenServices: 15
  },
  cancellationPolicy: 'Complimentary cancellation or rescheduling is permitted up to 24 hours prior to appointment time. Bridal suites and master balayage appointments require a 20% deposit, which is non-refundable if cancelled within 24 hours.',
  depositPolicy: {
    enabled: true,
    percentage: 20,
    fixedAmountForBridal: 8000,
    requireForTotalOver: 15000
  },
  features: {
    packages: true,
    giftCards: true,
    retailProducts: true,
    branchSelection: true,
    onlineDeposits: true,
    reviews: true
  },
  brandColors: {
    primaryCharcoal: '#26231E',
    warmIvory: '#F7F4EF',
    mutedMauve: '#A77A7E',
    champagneGold: '#C8A96A',
    softBlush: '#E9DADA',
    border: '#E7E0D8'
  }
};

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'clifton',
    name: 'Clifton Atelier Flagship',
    slug: 'clifton-flagship',
    address: 'Plot 8-B, Block 4, E-Street, Clifton, Karachi',
    area: 'Clifton',
    city: 'Karachi',
    phone: '+92 21 3587 1122',
    whatsapp: '+92 300 829 4900',
    hours: '10:30 AM – 8:00 PM',
    googleMapsUrl: 'https://maps.google.com/?q=E-Street+Clifton+Karachi',
    image: '/assets/images/luma_hero_salon_1792040701867.jpg',
    active: true
  },
  {
    id: 'dha',
    name: 'DHA Sanctuary Studio',
    slug: 'dha-sanctuary',
    address: '12-C, 9th Commercial Street, Bukhari Commercial, Phase 6, DHA, Karachi',
    area: 'DHA Phase 6',
    city: 'Karachi',
    phone: '+92 21 3584 9911',
    whatsapp: '+92 300 829 4901',
    hours: '11:00 AM – 8:00 PM',
    googleMapsUrl: 'https://maps.google.com/?q=Bukhari+Commercial+DHA+Karachi',
    image: '/assets/images/service_hair_styling_1792040701711.jpg',
    active: true
  }
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'hair-craft',
    name: 'Hair Craft & Colour',
    slug: 'hair-craft-colour',
    description: 'Precision couture haircuts, tailored dimensional balayage, and restorative bond-building glosses.',
    displayOrder: 1,
    active: true
  },
  {
    id: 'skin-aesthetics',
    name: 'Skincare & Facials',
    slug: 'skincare-facials',
    description: 'Clinical-grade aesthetic facials, lymphatic drainage, and transformative barrier repair therapies.',
    displayOrder: 2,
    active: true
  },
  {
    id: 'bridal-editorial',
    name: 'Bridal & Glamour',
    slug: 'bridal-glamour',
    description: 'Bespoke bridal couture artistry, reception glam, and photographic editorial hair and makeup.',
    displayOrder: 3,
    active: true
  },
  {
    id: 'nails-hands',
    name: 'Nails & Rituals',
    slug: 'nails-rituals',
    description: 'BIAB strengthening overlays, champagne chrome French tips, and therapeutic spa pedicures.',
    displayOrder: 4,
    active: true
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'staff-ayla',
    name: 'Ayla Merchant',
    slug: 'ayla-merchant',
    role: 'Creative Director & Lead Hair Artist',
    bio: 'Specialising in architectural haircuts and organic dimensional balayage. Trained in London and Paris, Ayla designs custom color harmonies that enhance natural hair texture.',
    photo: '/assets/images/service_hair_styling_1792040701711.jpg',
    specialties: ['French Balayage', 'Precision Bobs', 'Keratin Smoothing', 'Gloss Alchemy'],
    servicesSupported: ['hair-cut-signature', 'hair-balayage-gloss', 'hair-keratin-infusion', 'hair-blowout-couture'],
    branches: ['clifton', 'dha'],
    weeklySchedule: {
      0: { isWorking: true, start: '11:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      1: { isWorking: false, start: '10:30', end: '20:00', breaks: [] }, // Monday off
      2: { isWorking: true, start: '10:30', end: '19:30', breaks: [{ start: '13:30', end: '14:30' }] },
      3: { isWorking: true, start: '10:30', end: '19:30', breaks: [{ start: '13:30', end: '14:30' }] },
      4: { isWorking: true, start: '10:30', end: '19:30', breaks: [{ start: '13:30', end: '14:30' }] },
      5: { isWorking: true, start: '11:00', end: '20:00', breaks: [{ start: '14:00', end: '15:00' }] },
      6: { isWorking: true, start: '10:30', end: '20:00', breaks: [{ start: '14:00', end: '15:00' }] }
    },
    timeOff: [],
    maxDailyAppointments: 6,
    active: true,
    displayOrder: 1
  },
  {
    id: 'staff-zara',
    name: 'Zara Siddiqui',
    slug: 'zara-siddiqui',
    role: 'Master Aesthetician & Skin Therapist',
    bio: 'Certified clinical skin specialist with deep expertise in non-invasive skin rejuvenation, lymphatic contouring, and holistic barrier recovery.',
    photo: '/assets/images/service_facial_treatment_1792040702413.jpg',
    specialties: ['Hydra-Radiance', 'Rose Quartz Sculpting', 'Microneedling', 'Chemical Peels'],
    servicesSupported: ['skin-hydra-radiance', 'skin-rose-quartz-facial', 'skin-deep-detox'],
    branches: ['clifton'],
    weeklySchedule: {
      0: { isWorking: true, start: '11:00', end: '18:00', breaks: [{ start: '13:30', end: '14:30' }] },
      1: { isWorking: false, start: '10:30', end: '20:00', breaks: [] },
      2: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      3: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      4: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      5: { isWorking: true, start: '11:00', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] },
      6: { isWorking: true, start: '10:30', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] }
    },
    timeOff: [],
    maxDailyAppointments: 5,
    active: true,
    displayOrder: 2
  },
  {
    id: 'staff-maya',
    name: 'Maya Qureshi',
    slug: 'maya-qureshi',
    role: 'Senior Bridal & Editorial Artist',
    bio: 'Celebrated for modern, luminous bridal artistry and timeless editorial beauty. Maya crafts signature dewy complexions and seamless dupatta draping.',
    photo: '/assets/images/service_bridal_makeup_1792040703146.jpg',
    specialties: ['Barat & Walima Couture', 'Dewy Complexion', 'Soft Smokey Eyes', 'Editorial Hair Updos'],
    servicesSupported: ['bridal-signature-suite', 'bridal-reception-glam', 'makeup-editorial-party'],
    branches: ['clifton', 'dha'],
    weeklySchedule: {
      0: { isWorking: true, start: '11:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      1: { isWorking: false, start: '10:30', end: '20:00', breaks: [] },
      2: { isWorking: true, start: '11:00', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] },
      3: { isWorking: true, start: '11:00', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] },
      4: { isWorking: true, start: '11:00', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] },
      5: { isWorking: true, start: '11:00', end: '20:00', breaks: [{ start: '14:00', end: '15:00' }] },
      6: { isWorking: true, start: '10:30', end: '20:00', breaks: [{ start: '14:00', end: '15:00' }] }
    },
    timeOff: [],
    maxDailyAppointments: 4,
    active: true,
    displayOrder: 3
  },
  {
    id: 'staff-natasha',
    name: 'Natasha Khan',
    slug: 'natasha-khan',
    role: 'Senior Nail Sculptor & Nail Artist',
    bio: 'Dedicated to hygienic, high-precision Russian manicures, BIAB structure, and minimalist metallic chrome designs.',
    photo: '/assets/images/service_nail_artistry_1792040703002.jpg',
    specialties: ['Russian Dry Manicure', 'BIAB Builder Gel', 'Champagne Chrome Art', 'Paraffin Spa Therapy'],
    servicesSupported: ['nails-champagne-chrome', 'nails-biab-overlay', 'nails-spa-pedicure'],
    branches: ['clifton', 'dha'],
    weeklySchedule: {
      0: { isWorking: true, start: '11:00', end: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
      1: { isWorking: false, start: '10:30', end: '20:00', breaks: [] },
      2: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      3: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      4: { isWorking: true, start: '10:30', end: '19:00', breaks: [{ start: '13:30', end: '14:30' }] },
      5: { isWorking: true, start: '11:00', end: '19:30', breaks: [{ start: '14:00', end: '15:00' }] },
      6: { isWorking: true, start: '10:30', end: '20:00', breaks: [{ start: '14:00', end: '15:00' }] }
    },
    timeOff: [],
    maxDailyAppointments: 7,
    active: true,
    displayOrder: 4
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'hair-balayage-gloss',
    name: 'Bespoke Balayage & French Gloss',
    slug: 'bespoke-balayage-french-gloss',
    categoryId: 'hair-craft',
    description: 'Hand-painted dimensional balayage tailored to skin tone and bone structure, followed by an acidic gloss glaze for high-wattage shine and silk softness.',
    durationMinutes: 150,
    preparationMinutes: 10,
    bufferMinutes: 15,
    basePrice: 26000,
    isStartingPrice: true,
    image: '/assets/images/service_hair_styling_1792040701711.jpg',
    assignedStaffIds: ['staff-ayla'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: true,
    depositAmount: 5000,
    prepInstructions: 'Arrive with dry hair washed 24 hours prior. Avoid heavy oils or dry shampoos on morning of service.',
    cancellationRule: 'Deposit holds your color station; 24-hour notice required for rescheduling.',
    includedItems: [
      'Comprehensive tone & contour consultation',
      'Bond-protecting lightening system',
      'Root melt and custom gloss toner',
      'Restorative scalp massage & blowout'
    ],
    addons: [
      { id: 'addon-olaplex-treatment', name: 'Olaplex No. 1 & No. 2 Bond Multiplier', price: 4500, durationMinutes: 20, description: 'Deep molecular repair during lightening' },
      { id: 'addon-scalp-scrub', name: 'Detoxifying Sea Salt Scalp Scrub', price: 2500, durationMinutes: 15, description: 'Exfoliates buildup and stimulates follicular microcirculation' }
    ]
  },
  {
    id: 'hair-cut-signature',
    name: 'Atelier Signature Haircut & Blowout',
    slug: 'atelier-signature-haircut-blowout',
    categoryId: 'hair-craft',
    description: 'Precision scissor and dry-carving cut customized to face architecture, followed by a botanical wash, scalp massage, and editorial runway blowout.',
    durationMinutes: 60,
    preparationMinutes: 5,
    bufferMinutes: 10,
    basePrice: 7500,
    isStartingPrice: false,
    image: '/assets/images/service_hair_styling_1792040701711.jpg',
    assignedStaffIds: ['staff-ayla'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: false,
    depositAmount: 0,
    includedItems: [
      'Face shape & texture analysis',
      'Purifying botanical shampoo & conditioning',
      'Couture scissor haircut',
      'Volumising or sleek brush finish'
    ],
    addons: [
      { id: 'addon-split-end-repair', name: 'Thermo-Active Split End Seal', price: 3000, durationMinutes: 15 }
    ]
  },
  {
    id: 'hair-keratin-infusion',
    name: 'Liquid Silk Keratin Infusion',
    slug: 'liquid-silk-keratin-infusion',
    categoryId: 'hair-craft',
    description: 'Formaldehyde-free smoothing therapy designed specifically for humid Karachi weather. Eliminates 95% frizz while maintaining natural body.',
    durationMinutes: 180,
    preparationMinutes: 15,
    bufferMinutes: 15,
    basePrice: 32000,
    isStartingPrice: true,
    image: '/assets/images/service_hair_styling_1792040701711.jpg',
    assignedStaffIds: ['staff-ayla'],
    branchIds: ['clifton'],
    active: true,
    isOnlineBookable: true,
    depositRequired: true,
    depositAmount: 6000,
    addons: []
  },
  {
    id: 'skin-hydra-radiance',
    name: 'Hydra-Radiance Clinical Facial',
    slug: 'hydra-radiance-clinical-facial',
    categoryId: 'skin-aesthetics',
    description: 'Multi-step skin rejuvenation combining vortex water infusion, ultrasonic pore extractions, pure hyaluronic plumping, and LED photo-biomodulation.',
    durationMinutes: 75,
    preparationMinutes: 10,
    bufferMinutes: 15,
    basePrice: 15500,
    isStartingPrice: false,
    image: '/assets/images/service_facial_treatment_1792040702413.jpg',
    assignedStaffIds: ['staff-zara'],
    branchIds: ['clifton'],
    active: true,
    isOnlineBookable: true,
    depositRequired: false,
    depositAmount: 0,
    prepInstructions: 'Discontinue retinol and exfoliating AHAs/BHAs 48 hours prior to your facial.',
    includedItems: [
      'Digital skin hydration assessment',
      'Gentle enzymatic pore purge',
      'Ultrasonic painless extractions',
      'Targeted cold-laser LED healing dome',
      'Barrier locking oxygen mist'
    ],
    addons: [
      { id: 'addon-eye-lift', name: 'Cryo Peptide Eye Contour Lift', price: 3500, durationMinutes: 15, description: 'De-puffs dark circles and firms orbital contours' },
      { id: 'addon-neck-decollete', name: 'Neck & Décolleté Firming Peel', price: 4000, durationMinutes: 20 }
    ]
  },
  {
    id: 'skin-rose-quartz-facial',
    name: 'Rose Quartz Gua Sha Holistic Facial',
    slug: 'rose-quartz-gua-sha-holistic-facial',
    categoryId: 'skin-aesthetics',
    description: 'Deep therapeutic lymphatic drainage with heated rose quartz stones and botanical damask rose stem cell oils. Releases jaw tension and sculpts cheekbones.',
    durationMinutes: 60,
    preparationMinutes: 5,
    bufferMinutes: 10,
    basePrice: 12000,
    isStartingPrice: false,
    image: '/assets/images/service_facial_treatment_1792040702413.jpg',
    assignedStaffIds: ['staff-zara'],
    branchIds: ['clifton'],
    active: true,
    isOnlineBookable: true,
    depositRequired: false,
    depositAmount: 0,
    addons: []
  },
  {
    id: 'bridal-signature-suite',
    name: 'The Atelier Bridal Couture Suite',
    slug: 'the-atelier-bridal-couture-suite',
    categoryId: 'bridal-editorial',
    description: 'Karachi’s gold standard in bridal beauty. Includes skin preparation, custom airbrush/HD complexion, couture jewel and dupatta setting, and editorial hair sculpting.',
    durationMinutes: 180,
    preparationMinutes: 20,
    bufferMinutes: 30,
    basePrice: 65000,
    isStartingPrice: false,
    image: '/assets/images/service_bridal_makeup_1792040703146.jpg',
    assignedStaffIds: ['staff-maya'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: true,
    depositAmount: 15000,
    prepInstructions: 'Please arrive in an open-front button shirt with clean, moisturized skin. Bring your dupatta, bridal jewelry, and hair accessories.',
    includedItems: [
      'Pre-wedding makeup consultation',
      'Hydrating pre-makeup ampoule treatment',
      'Sweat-proof HD bridal complexion',
      'Custom luxury mink or faux-silk lashes',
      'Precision dupatta pinning and jewelry placement',
      'Bridal touch-up kit with matching lip blend'
    ],
    addons: [
      { id: 'addon-bridal-touchup-crew', name: 'On-Location Evening Touch-Up Assistant', price: 25000, durationMinutes: 0 }
    ]
  },
  {
    id: 'bridal-reception-glam',
    name: 'Walima & Reception Editorial Glam',
    slug: 'walima-reception-editorial-glam',
    categoryId: 'bridal-editorial',
    description: 'Understated, luminous reception makeup with velvet lids, sculpted bronzed cheeks, and sleek contemporary hair styling.',
    durationMinutes: 120,
    preparationMinutes: 10,
    bufferMinutes: 15,
    basePrice: 38000,
    isStartingPrice: false,
    image: '/assets/images/service_bridal_makeup_1792040703146.jpg',
    assignedStaffIds: ['staff-maya'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: true,
    depositAmount: 8000,
    addons: []
  },
  {
    id: 'nails-champagne-chrome',
    name: 'Champagne Chrome Manicure & Gel',
    slug: 'champagne-chrome-manicure-gel',
    categoryId: 'nails-hands',
    description: 'Detailed Russian cuticular cleanup followed by Japanese soft gel overlay, finished with micro-milled champagne mirror chrome glaze.',
    durationMinutes: 75,
    preparationMinutes: 5,
    bufferMinutes: 10,
    basePrice: 5500,
    isStartingPrice: false,
    image: '/assets/images/service_nail_artistry_1792040703002.jpg',
    assignedStaffIds: ['staff-natasha'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: false,
    depositAmount: 0,
    includedItems: [
      'Dry cuticle precision sculpting',
      'Nail plate balancing & shaping',
      'Long-wear gel base coat',
      'Pure champagne chrome pigment buff',
      'Rosehip cuticle oil nourishment'
    ],
    addons: [
      { id: 'addon-gel-removal', name: 'Safe Previous Gel Removal', price: 1200, durationMinutes: 20 },
      { id: 'addon-paraffin-dip', name: 'Warm Botanical Paraffin Hand Bath', price: 2000, durationMinutes: 15 }
    ]
  },
  {
    id: 'nails-spa-pedicure',
    name: 'Travertine Mineral Spa Pedicure',
    slug: 'travertine-mineral-spa-pedicure',
    categoryId: 'nails-hands',
    description: 'An elevated foot sanctuary ritual featuring Himalayan salts, volcanic pumice smoothing, hot basalt stone foot massage, and non-toxic polish.',
    durationMinutes: 60,
    preparationMinutes: 5,
    bufferMinutes: 10,
    basePrice: 4800,
    isStartingPrice: false,
    image: '/assets/images/service_nail_artistry_1792040703002.jpg',
    assignedStaffIds: ['staff-natasha'],
    branchIds: ['clifton', 'dha'],
    active: true,
    isOnlineBookable: true,
    depositRequired: false,
    depositAmount: 0,
    addons: []
  }
];

export const INITIAL_PACKAGES: PackageDeal[] = [
  {
    id: 'pkg-bridal-trilogy',
    title: 'The Haute Bridal Trilogy',
    slug: 'haute-bridal-trilogy',
    subtitle: 'Pre-wedding skin, Barat main event, and Walima glamour',
    description: 'Our complete bridal journey. Includes one Hydra-Radiance facial 5 days before, Barat Couture Suite, and Walima Editorial Glam, with private dressing suite.',
    price: 98000,
    originalPrice: 118500,
    durationMinutes: 375,
    includedServices: ['skin-hydra-radiance', 'bridal-signature-suite', 'bridal-reception-glam'],
    image: '/assets/images/service_bridal_makeup_1792040703146.jpg',
    active: true,
    badge: 'Atelier Signature'
  },
  {
    id: 'pkg-glow-and-hair',
    title: 'The Weekend Rejuvenation Duo',
    slug: 'weekend-rejuvenation-duo',
    subtitle: 'Signature cut, scalp treatment & clinical hydration facial',
    description: 'The ultimate restorative afternoon. Combines our clinical Hydra-Radiance facial with an Atelier signature haircut, scalp scrub, and blowdry finish.',
    price: 21500,
    originalPrice: 25500,
    durationMinutes: 135,
    includedServices: ['hair-cut-signature', 'skin-hydra-radiance'],
    image: '/assets/images/service_facial_treatment_1792040702413.jpg',
    active: true
  }
];

export const INITIAL_PRODUCTS: RetailProduct[] = [
  {
    id: 'prod-hair-silk-elixir',
    name: 'Botanical Liquid Silk Elixir',
    brand: 'Luma Apothecary',
    category: 'Hair Care',
    price: 6800,
    stock: 24,
    description: 'Infused with cold-pressed camellia seed and argan kernel oil to tame frizz, protect against thermal styling up to 230°C, and impart mirror shine.',
    image: '/assets/images/service_hair_styling_1792040701711.jpg',
    size: '100 ml',
    inStock: true
  },
  {
    id: 'prod-rose-glow-serum',
    name: 'Damask Rose & Peptide Glow Serum',
    brand: 'Luma Apothecary',
    category: 'Skincare',
    price: 5400,
    stock: 18,
    description: 'A multi-weight hyaluronic acid serum charged with 5% niacinamide and Pakistani organic damask rose hydrosol for intense dewy skin plumpness.',
    image: '/assets/images/service_facial_treatment_1792040702413.jpg',
    size: '50 ml',
    inStock: true
  },
  {
    id: 'prod-cuticle-peptide',
    name: 'Cellular Peptide Cuticle Recovery Pen',
    brand: 'Luma Atelier Studio',
    category: 'Nail Care',
    price: 2800,
    stock: 35,
    description: 'Portable brush applicator containing squalane, marula oil, and bioactive keratin peptides to repair ragged cuticles and nourish dry nail matrices.',
    image: '/assets/images/service_nail_artistry_1792040703002.jpg',
    size: '15 ml',
    inStock: true
  }
];

export const INITIAL_GIFT_CARDS: GiftCard[] = [
  {
    id: 'gc-demo-1',
    code: 'LUMA-GLOW-10K',
    initialValue: 10000,
    balance: 10000,
    recipientName: 'Fatima Al-Hassan',
    recipientEmail: 'fatima@example.com',
    senderName: 'Amna Merchant',
    senderEmail: 'amna@example.com',
    message: 'Wishing you a radiant wedding preparation!',
    expiryDate: '2027-12-31',
    active: true,
    createdAt: '2026-09-01T10:00:00Z'
  }
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Sobia Tariq',
    phone: '+92 321 445 8891',
    email: 'sobia.tariq@gmail.com',
    totalVisits: 4,
    totalSpend: 78500,
    lastVisit: '2026-10-10',
    preferences: 'Prefers cool ash blonde balayage tones. Sensitive to eucalyptus.',
    allergiesOrSensitivities: 'Eucalyptus oil allergy',
    createdAt: '2026-04-12T08:00:00Z'
  },
  {
    id: 'cust-2',
    name: 'Maham Zubair',
    phone: '+92 333 891 0022',
    email: 'maham.z@outlook.com',
    totalVisits: 2,
    totalSpend: 42000,
    lastVisit: '2026-10-12',
    preferences: 'Enjoys chamomile herbal tea during nail appointments.',
    createdAt: '2026-06-20T11:00:00Z'
  },
  {
    id: 'cust-3',
    name: 'Dr. Rabia Kamran',
    phone: '+92 300 234 5678',
    email: 'dr.rabia@kmu.edu.pk',
    totalVisits: 6,
    totalSpend: 112000,
    lastVisit: '2026-10-08',
    preferences: 'Always books Zara Siddiqui for monthly Hydra-Radiance facial.',
    createdAt: '2026-01-15T09:30:00Z'
  }
];

// Helper to get formatted date string for today and future days
const getRelativeDate = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-101',
    reference: 'LMA-8821',
    branchId: 'clifton',
    serviceIds: ['hair-balayage-gloss'],
    serviceAddons: { 'hair-balayage-gloss': ['addon-olaplex-treatment'] },
    stylistId: 'staff-ayla',
    date: getRelativeDate(0), // Today
    startTime: '11:00',
    endTime: '13:50',
    totalDurationMinutes: 170,
    customer: {
      name: 'Sobia Tariq',
      phone: '+92 321 445 8891',
      email: 'sobia.tariq@gmail.com',
      notes: 'Touchup balayage before family wedding this weekend.'
    },
    pricing: {
      basePrice: 26000,
      addonsTotal: 4500,
      subtotal: 30500,
      discount: 0,
      tax: 0,
      total: 30500,
      depositRequired: 5000,
      depositPaid: 5000,
      remainingDue: 25500,
      currency: 'PKR'
    },
    payment: {
      method: 'deposit_online',
      status: 'deposit_paid',
      transactionId: 'TXN-JAZZ-891024',
      paidAt: '2026-10-12T15:20:00Z',
      amountPaid: 5000
    },
    status: 'confirmed',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-12T15:20:00Z', note: 'Booking received online with deposit', changedBy: 'System' },
      { status: 'confirmed', timestamp: '2026-10-12T15:22:00Z', note: 'Deposit verified and calendar slot confirmed', changedBy: 'System Auto-Confirm' }
    ],
    createdAt: '2026-10-12T15:20:00Z',
    updatedAt: '2026-10-12T15:22:00Z'
  },
  {
    id: 'appt-102',
    reference: 'LMA-8822',
    branchId: 'clifton',
    serviceIds: ['skin-hydra-radiance'],
    serviceAddons: {},
    stylistId: 'staff-zara',
    date: getRelativeDate(0), // Today
    startTime: '15:00',
    endTime: '16:15',
    totalDurationMinutes: 75,
    customer: {
      name: 'Dr. Rabia Kamran',
      phone: '+92 300 234 5678',
      email: 'dr.rabia@kmu.edu.pk',
      notes: 'Monthly maintenance facial.'
    },
    pricing: {
      basePrice: 15500,
      addonsTotal: 0,
      subtotal: 15500,
      discount: 0,
      tax: 0,
      total: 15500,
      depositRequired: 0,
      depositPaid: 0,
      remainingDue: 15500,
      currency: 'PKR'
    },
    payment: {
      method: 'salon',
      status: 'unpaid'
    },
    status: 'confirmed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-10-11T09:00:00Z', note: 'Appointment booked online', changedBy: 'System' }
    ],
    createdAt: '2026-10-11T09:00:00Z',
    updatedAt: '2026-10-11T09:00:00Z'
  },
  {
    id: 'appt-103',
    reference: 'LMA-8823',
    branchId: 'dha',
    serviceIds: ['nails-champagne-chrome'],
    serviceAddons: { 'nails-champagne-chrome': ['addon-paraffin-dip'] },
    stylistId: 'staff-natasha',
    date: getRelativeDate(1), // Tomorrow
    startTime: '14:00',
    endTime: '15:30',
    totalDurationMinutes: 90,
    customer: {
      name: 'Maham Zubair',
      phone: '+92 333 891 0022',
      email: 'maham.z@outlook.com'
    },
    pricing: {
      basePrice: 5500,
      addonsTotal: 2000,
      subtotal: 7500,
      discount: 0,
      tax: 0,
      total: 7500,
      depositRequired: 0,
      depositPaid: 0,
      remainingDue: 7500,
      currency: 'PKR'
    },
    payment: {
      method: 'salon',
      status: 'unpaid'
    },
    status: 'confirmed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-10-13T11:00:00Z', note: 'Booked via customer portal', changedBy: 'System' }
    ],
    createdAt: '2026-10-13T11:00:00Z',
    updatedAt: '2026-10-13T11:00:00Z'
  },
  {
    id: 'appt-104',
    reference: 'LMA-8824',
    branchId: 'clifton',
    serviceIds: ['bridal-signature-suite'],
    serviceAddons: {},
    stylistId: 'staff-maya',
    date: getRelativeDate(3),
    startTime: '13:00',
    endTime: '16:00',
    totalDurationMinutes: 180,
    customer: {
      name: 'Anum Jahangir',
      phone: '+92 301 556 7788',
      email: 'anum.j@hotmail.com',
      notes: 'Barat event. Crimson & gold lehenga. Requires dupatta pinning.'
    },
    pricing: {
      basePrice: 65000,
      addonsTotal: 0,
      subtotal: 65000,
      discount: 0,
      tax: 0,
      total: 65000,
      depositRequired: 15000,
      depositPaid: 15000,
      remainingDue: 50000,
      currency: 'PKR'
    },
    payment: {
      method: 'deposit_online',
      status: 'deposit_paid',
      transactionId: 'TXN-EP-994101',
      paidAt: '2026-10-10T14:30:00Z',
      amountPaid: 15000
    },
    status: 'confirmed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-10-10T14:30:00Z', note: 'Bridal deposit verified', changedBy: 'System' }
    ],
    createdAt: '2026-10-10T14:30:00Z',
    updatedAt: '2026-10-10T14:30:00Z'
  },
  {
    id: 'appt-105',
    reference: 'LMA-8825',
    branchId: 'clifton',
    serviceIds: ['hair-cut-signature'],
    serviceAddons: {},
    stylistId: 'staff-ayla',
    date: getRelativeDate(-2), // 2 days ago (completed)
    startTime: '16:00',
    endTime: '17:00',
    totalDurationMinutes: 60,
    customer: {
      name: 'Nida Farooq',
      phone: '+92 322 998 1234',
      email: 'nida.f@gmail.com'
    },
    pricing: {
      basePrice: 7500,
      addonsTotal: 0,
      subtotal: 7500,
      discount: 0,
      tax: 0,
      total: 7500,
      depositRequired: 0,
      depositPaid: 0,
      remainingDue: 0,
      currency: 'PKR'
    },
    payment: {
      method: 'card',
      status: 'fully_paid',
      transactionId: 'POS-CLIF-4412',
      paidAt: '2026-10-12T17:05:00Z',
      amountPaid: 7500
    },
    status: 'completed',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-10-09T10:00:00Z', note: 'Booked', changedBy: 'System' },
      { status: 'in_service', timestamp: '2026-10-12T16:05:00Z', note: 'Client checked in', changedBy: 'Reception' },
      { status: 'completed', timestamp: '2026-10-12T17:05:00Z', note: 'Service finished, full payment settled', changedBy: 'Ayla Merchant' }
    ],
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-12T17:05:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Sobia Tariq',
    serviceName: 'Bespoke Balayage & French Gloss',
    rating: 5,
    comment: 'Ayla understood exactly what my undertones needed. The transition is seamless, with zero brassiness even weeks after. Luma Atelier is in a league of its own in Karachi.',
    date: '2026-09-28',
    approved: true
  },
  {
    id: 'rev-2',
    customerName: 'Dr. Rabia Kamran',
    serviceName: 'Hydra-Radiance Clinical Facial',
    rating: 5,
    comment: 'Zara is meticulous and truly understands dermatological barrier health. My skin was deeply hydrated with no redness or sensitivity.',
    date: '2026-10-02',
    approved: true
  },
  {
    id: 'rev-3',
    customerName: 'Mahnoor Shah',
    serviceName: 'The Atelier Bridal Couture Suite',
    rating: 5,
    comment: 'Maya made my wedding morning so serene and joyful. My makeup stayed intact from 2 PM until 3 AM despite the humidity. Cannot recommend highly enough.',
    date: '2026-09-15',
    approved: true
  }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Booking & Policies',
    question: 'How do I book an appointment at Luma Atelier?',
    answer: 'Appointments can be booked directly through our online booking engine on this website, or by contacting our concierge on WhatsApp (+92 300 829 4900). You will receive instant confirmation and a unique reference code.'
  },
  {
    id: 'faq-2',
    category: 'Booking & Policies',
    question: 'What is your cancellation and rescheduling policy?',
    answer: 'We require a minimum of 24 hours notice for complimentary cancellation or rescheduling. For bridal couture suites and major color services requiring advance deposits, deposits become non-refundable if cancelled within 24 hours of the reserved slot.'
  },
  {
    id: 'faq-3',
    category: 'Hair Services',
    question: 'How should I prepare my hair for balayage or color treatments?',
    answer: 'Please arrive with clean, dry hair washed 24 hours prior. We recommend avoiding heavy root oils or dry shampoos on the morning of your color service to ensure optimal lightening penetration.'
  },
  {
    id: 'faq-4',
    category: 'Bridal Suites',
    question: 'How early should I reserve my bridal suite?',
    answer: 'We recommend reserving your bridal date 3 to 6 months in advance, especially during Karachi peak wedding season (November through February). An advance booking deposit reserves your dedicated private suite and lead artist.'
  },
  {
    id: 'faq-5',
    category: 'Skincare & Facials',
    question: 'Are extractions included in the Hydra-Radiance facial?',
    answer: 'Yes, our Hydra-Radiance treatment incorporates gentle ultrasonic and vortex extractions that purify pores without pinching or causing capillary trauma.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-14T10:00:00Z',
    user: 'Amna Merchant (Owner)',
    role: 'owner',
    action: 'SETTINGS_UPDATE',
    details: 'Updated Karachi bridal suite deposit policy'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-13T16:30:00Z',
    user: 'Ayla Merchant',
    role: 'stylist',
    action: 'APPOINTMENT_COMPLETED',
    details: 'Completed appointment LMA-8825 for Nida Farooq'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-12T15:22:00Z',
    user: 'System',
    role: 'system',
    action: 'BOOKING_CONFIRMED',
    details: 'Confirmed appointment LMA-8821 with deposit TXN-JAZZ-891024'
  }
];

export const DEMO_USERS: UserSession[] = [
  {
    id: 'user-owner',
    name: 'Amna Merchant',
    email: 'admin@lumaatelier.com',
    role: 'owner',
    avatar: '/assets/images/service_hair_styling_1792040701711.jpg'
  },
  {
    id: 'user-reception',
    name: 'Sana Rizvi',
    email: 'reception@lumaatelier.com',
    role: 'receptionist',
    branchId: 'clifton'
  },
  {
    id: 'user-stylist-ayla',
    name: 'Ayla Merchant',
    email: 'ayla@lumaatelier.com',
    role: 'stylist',
    stylistId: 'staff-ayla',
    avatar: '/assets/images/service_hair_styling_1792040701711.jpg'
  },
  {
    id: 'user-stylist-zara',
    name: 'Zara Siddiqui',
    email: 'zara@lumaatelier.com',
    role: 'stylist',
    stylistId: 'staff-zara',
    avatar: '/assets/images/service_facial_treatment_1792040702413.jpg'
  }
];
