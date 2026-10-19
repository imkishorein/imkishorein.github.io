/*
  SITE CONTENT: everything you will edit lives here or in src/content/notes.
  Items marked `placeholder: true` or PLACEHOLDER are not real yet.
*/

export const site = {
  name: 'Kishore Vidyasagar',
  handle: 'imkishore.in',
  url: 'https://imkishore.in',
  role: 'Designer + Builder',
  employer: 'Salesforce',
  location: 'Bengaluru, India',
  // From the LinkedIn About section.
  positioning: 'I design for the people who run the systems that run the world.',
  // Hero envelope: the viewer is the addressee. One ruled line.
  addressee: 'You, kindly reading',
  focus: 'I design and build enterprise B2B SaaS and AI tools.',
  yearsLabel: '8+ years',
  // PLACEHOLDER: replace the short bio when ready.
  bio: 'Senior UX Designer working at the intersection of Enterprise SaaS, AI and Platform Engineering. I lead the Friends of Figma Bangalore community and write short notes here about what I build and learn.',
  // PLACEHOLDER: swap for a real public address.
  email: 'hello@imkishore.in',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/imkishorein/' },
    // PLACEHOLDER links: replace or delete.
    { label: 'GitHub', href: '#', placeholder: true },
    { label: 'Instagram', href: '#', placeholder: true },
    { label: 'Figma Community', href: '#', placeholder: true },
  ],
};

/* Nav. `jp` is the small Japanese sublabel shown on hover and on the current page. */
export const nav = [
  { label: 'Work', href: '/work/', jp: '仕事', live: false, blurb: 'Selected case studies.' },
  { label: 'Notes', href: '/notes/', jp: 'メモ', live: true, blurb: 'Short notes on things I tried or learned.' },
  { label: 'Community', href: '/community/', jp: '仲間', live: false, blurb: 'Friends of Figma Bangalore: events, people, lessons.' },
  { label: 'Photography', href: '/photography/', jp: '写真', live: false, blurb: 'Travel, street and landscape frames.' },
  { label: 'Stuff', href: '/stuff/', jp: '道具', live: true, blurb: 'Gear and tools I use.' },
  { label: 'About', href: '/about/', jp: '私', live: true, blurb: 'Where I started, where I am, how I work.' },
];

/* About: timeline from the LinkedIn profile. Newest first. */
export const timeline = [
  { when: '2025 to now', role: 'Senior UX Designer, Platforms & AI', org: 'Salesforce', body: 'Agentforce for Setup: a conversational, agentic interface where admins configure their orgs in natural language. Agentforce Vibes: pro-code experiences that let developers build apps with natural language.' },
  { when: '2022 to 2025', role: 'UX Designer II to Principal UX Designer', org: 'Zeta', body: 'Identity and access flows for banking tools, then monitoring, observability and continuous deployment products (Olympus Watch, Weave), the Galaxy design system, and a conversational AI experience for SREs.' },
  { when: '2018 to 2021', role: 'UI Developer, then Product Designer', org: 'Kovai.co', body: 'Product design for BizTalk360, Document360 and Serverless360, from wireframes and journeys to marketing assets and some UI development.' },
  { when: '2018', role: 'UI Developer', org: 'Hackowls Software', body: 'Websites and mobile apps for small and medium businesses going digital.' },
  { when: '2016 to 2018', role: 'Co-founder, Head of Product', org: 'Spotknack', body: 'Co-founded in the pre-final year of engineering and bootstrapped it into a revenue-generating company. Moved from services to a product-led skill-based hiring platform, placed in the Top 10 startups at EDII-TN and raised seed funding.' },
];

export const community = [
  { when: '2023 to now', role: 'Community Lead, Bangalore Chapter', org: 'Friends of Figma' },
  { when: '2020 to 2023', role: 'Community Advocate, Coimbatore Chapter', org: 'Friends of Figma' },
];

/* About: "How I work", paraphrased from the LinkedIn About. Edit freely. */
export const howIWork = [
  'Systems thinking first: I turn messy, technical, multi-stakeholder problems into intuitive workflows and patterns teams can build on.',
  'Close to product, engineering and leadership, so design shapes strategy and not just screens.',
  'Design systems and interaction patterns for complex tools, backed by research so usability holds as complexity grows.',
];

/* Stuff. Camera gear is real; everything else is a placeholder to confirm. */
export const stuff = [
  { group: 'Photography', items: [
    { name: 'Sony A6700', note: 'Main camera' },
    { name: 'Tamron 17-70mm f/2.8', note: 'Everyday zoom' },
    { name: 'Sigma 56mm f/1.4', note: 'Portraits and low light' },
  ]},
  { group: 'Design', items: [
    { name: 'Figma', note: 'Design and prototyping', placeholder: true },
  ]},
  { group: 'AI and building', items: [
    { name: 'Claude Code', note: 'Vibe coding side projects', placeholder: true },
  ]},
  { group: 'Hardware', items: [
    { name: 'Laptop', note: 'To fill in', placeholder: true },
    { name: 'Phone', note: 'To fill in', placeholder: true },
    { name: 'Desk setup', note: 'To fill in', placeholder: true },
  ]},
];
