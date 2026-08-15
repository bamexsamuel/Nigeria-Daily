import { NewsSource, Story, SystemSettings } from '../types';

const imgCbn = '/src/assets/images/nigeria_economy_cbn_1786796895498.jpg';
const imgLagosAi = '/src/assets/images/lagos_ai_tech_hub_1786796913963.jpg';
const imgSuperEagles = '/src/assets/images/super_eagles_stadium_1786796928633.jpg';
const imgRailway = '/src/assets/images/nigeria_railway_train_1786796940823.jpg';



export const TOP_FIVE_NIGERIAN_SOURCES: NewsSource[] = [
  {
    id: 'src-channels-tv',
    name: 'Channels Television',
    type: 'rss',
    rssUrl: 'https://www.channelstv.com/feed/',
    websiteUrl: 'https://www.channelstv.com',
    category: 'Politics',
    priority: 'high',
    trustScore: 98,
    active: true,
    lastCheckedAt: new Date(Date.now() - 4 * 60000).toISOString(),
    logoUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    description: 'Nigeria’s multi-award winning broadcast television station covering breaking national news, politics, and state affairs.',
    isTopFive: true,
    totalArticlesCount: 1420
  },
  {
    id: 'src-punch-ng',
    name: 'The Punch',
    type: 'rss',
    rssUrl: 'https://punchng.com/feed/',
    websiteUrl: 'https://punchng.com',
    category: 'Politics',
    priority: 'high',
    trustScore: 96,
    active: true,
    lastCheckedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    description: 'One of Nigeria’s most widely read daily newspapers covering politics, metro news, governance, and business.',
    isTopFive: true,
    totalArticlesCount: 1890
  },
  {
    id: 'src-premium-times',
    name: 'Premium Times',
    type: 'rss',
    rssUrl: 'https://www.premiumtimesng.com/feed',
    websiteUrl: 'https://www.premiumtimesng.com',
    category: 'Politics',
    priority: 'high',
    trustScore: 97,
    active: true,
    lastCheckedAt: new Date(Date.now() - 11 * 60000).toISOString(),
    logoUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100&auto=format&fit=crop&q=80',
    description: 'Foremost Nigerian investigative journalism portal emphasizing accountability, anti-corruption, and governance.',
    isTopFive: true,
    totalArticlesCount: 1120
  },
  {
    id: 'src-vanguard-ngr',
    name: 'Vanguard News',
    type: 'rss',
    rssUrl: 'https://www.vanguardngr.com/feed/',
    websiteUrl: 'https://www.vanguardngr.com',
    category: 'General',
    priority: 'high',
    trustScore: 94,
    active: true,
    lastCheckedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    logoUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&auto=format&fit=crop&q=80',
    description: 'Leading national daily providing swift coverage of general news, sports, politics, and Niger Delta development.',
    isTopFive: true,
    totalArticlesCount: 1650
  },
  {
    id: 'src-guardian-ng',
    name: 'The Guardian Nigeria',
    type: 'rss',
    rssUrl: 'https://guardian.ng/feed/',
    websiteUrl: 'https://guardian.ng',
    category: 'Business',
    priority: 'high',
    trustScore: 95,
    active: true,
    lastCheckedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    logoUrl: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=100&auto=format&fit=crop&q=80',
    description: 'The flagship of Nigerian journalism delivering high-level economic policy analysis, editorials, and national reporting.',
    isTopFive: true,
    totalArticlesCount: 980
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  websiteName: 'Nigerian AI News Hub',
  siteDescription: 'Real-time AI-powered news aggregation, verification, and editorial synthesis from Nigeria’s Top 5 press institutions.',
  geminiModel: 'gemini-3.7-flash',
  autoPublishEnabled: true,
  minConfidenceThreshold: 85,
  sensitiveReviewThreshold: 90,
  pollingFrequencyMinutes: 5,
  watTimezone: 'Africa/Lagos (WAT, UTC+1)',
  editorialStyle: 'Objective, authoritative Nigerian journalistic English with strict attribution'
};

export const SEED_STORIES: Story[] = [
  {
    id: 'story-cbn-fx-reforms-2026',
    clusterId: 'cluster_20260815_cbn_fx',
    headline: 'CBN Unveils Enhanced FX Liquidity Framework to Stabilize Naira and Boost Diaspora Inflows',
    summary: 'The Central Bank of Nigeria has rolled out new operational guidelines granting authorized commercial banks increased flexibility to tap offshore liquidity corridors, aiming to narrow foreign exchange spreads.',
    keyPoints: [
      'Central Bank expands autonomous FX trading windows for non-oil exporters and licensed bureau de change operators.',
      'Diaspora remittance channels received direct clearing concessions to curb unofficial remittance diversions.',
      'Governor Yemi Cardoso reaffirmed monetary policy target of steadying headline inflation through market-driven price discovery.',
      'Commercial lenders mandated to publish verifiable real-time bid-ask quotes on electronic trading portals.'
    ],
    whatHappened: 'The Central Bank of Nigeria (CBN) in Abuja issued a comprehensive policy circular detailing revised operational parameters for the Nigerian Foreign Exchange Market (NFEM). The intervention seeks to eliminate bottlenecks restricting diaspora remittance flows and incentivize export proceeds repatriation.',
    mainStory: 'In a circular signed by the Director of Financial Markets, the apex monetary regulator directed that all eligible international money transfer operators (IMTOs) interface directly through unified interbank payment gateways at prevailing market-clearing rates.\n\nThe policy adjustments are structured to stimulate liquidity across spot and forward transactions. Market analysts note that previous rigidities in pricing had caused temporary volatility in parallel markets, which the new framework explicitly remedies by automating commercial bank auction matching.\n\nFinancial sector executives in Lagos and Abuja have responded favorably to the directives, emphasizing that greater transparency will enhance investor confidence and reduce arbitrage windows that previously distorted the foreign currency market.',
    background: 'Nigeria’s monetary authority has spent recent quarters consolidating currency reforms initiated in mid-2023. By transitioning from pegged regimes to a transparent willing-buyer-willing-seller model, the CBN seeks to attract sustainable foreign portfolio investments (FPI) and strengthen gross external reserves.',
    whatHappensNext: 'The Monetary Policy Committee (MPC) is scheduled to review initial liquidity impact metrics during its upcoming quarterly deliberation in Abuja, with commercial banks given 14 working days to fully integrate the automated remittance reporting systems.',
    article: '', // Structured sections are formatted in UI
    category: 'Business',
    tags: ['CBN', 'Naira', 'Economy', 'Forex', 'Diaspora Remittances', 'Yemi Cardoso'],
    slug: 'cbn-unveils-enhanced-fx-liquidity-framework-naira',
    image: imgCbn,
    imageCaption: 'Central Bank of Nigeria Headquarters in Abuja.',
    imageCredit: 'Channels Television Photo Desk',

    publishedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    confidenceScore: 97,
    status: 'published',
    isBreaking: true,
    isTrending: true,
    views: 14280,
    shares: 890,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Channels Television',
    primarySourceUrl: 'https://www.channelstv.com/2026/08/15/cbn-fx-liquidity-framework-naira-stabilization/',
    sources: [
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/2026/08/15/cbn-fx-liquidity-framework-naira-stabilization/',
        publishedAt: new Date(Date.now() - 30 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/cbn-rolls-out-new-fx-guidelines-banks-imtos/',
        publishedAt: new Date(Date.now() - 20 * 60000).toISOString(),
        relationship: 'secondary'
      },
      {
        sourceId: 'src-guardian-ng',
        sourceName: 'The Guardian Nigeria',
        sourceUrl: 'https://guardian.ng/business-services/apex-bank-strengthens-naira-through-liquidity-mandate/',
        publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'CBN Unveils Enhanced FX Liquidity Framework to Stabilize Naira | Nigerian AI News Hub',
    metaDescription: 'Read the AI-synthesized report on the Central Bank of Nigeria’s new FX guidelines boosting diaspora remittances and market liquidity.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/business/cbn-unveils-enhanced-fx-liquidity-framework-naira',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1120
  },
  {
    id: 'story-fec-infrastructure-rail-2026',
    clusterId: 'cluster_20260815_fec_rail',
    headline: 'Federal Executive Council Approves ₦1.8 Trillion Infrastructure Package for Eastern Rail Corridor & Coastal Highway Phase 2',
    summary: 'The Federal Executive Council (FEC), presided over by President Bola Ahmed Tinubu at the State House in Abuja, has sanctioned major budgetary disbursements targeting key arterial transport corridors.',
    keyPoints: [
      '₦1.8 trillion total funding cleared for immediate engineering execution across rail and inter-state highway projects.',
      'Eastern Narrow-to-Standard Gauge rail modernization connects Port Harcourt, Enugu, Makurdi, and Maiduguri.',
      'Lagos-Calabar Coastal Highway Section II receives formal procurement sign-off to accelerate regional trade.',
      'Minister of Works affirms strict adherence to quality benchmarks and milestone-based contractor payments.'
    ],
    whatHappened: 'During a marathon Federal Executive Council session at the Presidential Villa in Abuja, cabinet ministers approved critical financing authorizations for nationwide transport networks, prioritizing maritime transit integration and freight rail corridors.',
    mainStory: 'Briefing State House correspondents after the council meeting, the Minister of Information and National Orientation, alongside the Ministers of Works and Transportation, outlined the scope of the sanctioned capital allocations.\n\nThe Eastern Railway corridor revival is targeted at drastically reducing the cost of freight logistics between southern deep-sea ports and northern agricultural hubs. Under the contract specifications, modern signaling apparatus and passenger terminal enhancements will be concurrently installed.\n\nThe administration highlighted that infrastructure modernization remains the bedrock for unlocking double-digit domestic productivity and job creation across the federation.',
    background: 'Nigeria’s national integrated infrastructure master plan emphasizes multimodal transport systems. The continuous funding approvals align with the government’s 2026 strategic economic recovery roadmap.',
    whatHappensNext: 'Contract agreements with engineering consortia will be ratified at the Federal Ministry of Justice next week, with ground-breaking ceremonies slated across selected bridge crossings in Rivers and Cross River states.',
    article: '',
    category: 'Politics',
    tags: ['FEC', 'Tinubu', 'Infrastructure', 'Railways', 'Lagos-Calabar Highway', 'Abuja'],
    slug: 'fec-approves-1-8-trillion-infrastructure-eastern-rail-coastal-highway',
    image: imgRailway,
    imageCaption: 'Modernized Eastern Railway and arterial transport infrastructure in Nigeria.',
    imageCredit: 'Premium Times Reporting Bureau',
    publishedAt: new Date(Date.now() - 65 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    confidenceScore: 98,
    status: 'published',
    isBreaking: false,
    isTrending: true,
    views: 11520,
    shares: 640,
    readingTimeMinutes: 4,
    requiresReview: false,
    primarySourceName: 'Premium Times',
    primarySourceUrl: 'https://www.premiumtimesng.com/news/top-news/fec-approves-trillion-infrastructure-fund-rail-highway/',
    sources: [
      {
        sourceId: 'src-premium-times',
        sourceName: 'Premium Times',
        sourceUrl: 'https://www.premiumtimesng.com/news/top-news/fec-approves-trillion-infrastructure-fund-rail-highway/',
        publishedAt: new Date(Date.now() - 70 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/fec-okays-n1-8tn-for-coastal-road-rail-revival/',
        publishedAt: new Date(Date.now() - 55 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'FEC Approves ₦1.8 Trillion Infrastructure for Eastern Rail | Nigerian AI News Hub',
    metaDescription: 'FEC approves ₦1.8 trillion for Eastern Rail modern corridor and Lagos-Calabar Highway Phase 2. Read full verified details.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/fec-approves-1-8-trillion-infrastructure-eastern-rail-coastal-highway',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1340
  },
  {
    id: 'story-tech-lagos-ai-data-center-2026',
    clusterId: 'cluster_20260815_tech_datacenter',
    headline: 'Nigerian Tech Ecosystem Secures $250M Sovereign-Backed Investment for Tier-IV AI Data Center in Epe',
    summary: 'A consortium of local venture syndicates and international cloud infrastructure operators has broken ground on West Africa’s largest dedicated AI and hyperscale compute facility in Lagos State.',
    keyPoints: [
      '$250 million private-public syndicate financing secured with backing from Nigeria’s Ministry of Communications, Innovation & Digital Economy.',
      'Facility situated in Epe technology cluster with 45-megawatt clean gas-to-power independent energy generation.',
      'Designed to host indigenous Large Language Models (LLMs) tuned on major Nigerian languages including Yoruba, Hausa, Igbo, and Nigerian Pidgin.',
      'Projected to generate 3,200 specialized high-tech jobs and eliminate cloud data sovereignty compliance bottlenecks.'
    ],
    whatHappened: 'Government representatives and tech enterprise leaders convened in Lagos for the foundation-laying ceremony of the "NaijaCompute Cloud Hub", a sovereign Tier-IV data center optimized for machine learning clusters and edge computing.',
    mainStory: 'Addressing tech founders and institutional investors at the launch, Minister of Communications, Innovation and Digital Economy Dr. Bosun Tijani emphasized Nigeria’s strategic trajectory to become Africa’s artificial intelligence research powerhouse.\n\nThe facility addresses one of the biggest hurdles facing Nigerian startups: reliance on offshore cloud data storage billed in foreign currencies. By keeping sovereign computational workloads within Nigerian borders, local startups will benefit from reduced latency and localized billing in Naira.\n\nInternational technology partners committed to deploying energy-efficient liquid cooling arrays to maintain sustainable operations while operating entirely on dedicated off-grid clean energy infrastructure.',
    background: 'Nigeria’s National Artificial Intelligence Strategy (NAIS) has steadily fostered collaborations between indigenous tech hubs in Yaba, Abuja, and international research consortiums.',
    whatHappensNext: 'Phase one construction is scheduled for commissioning within 18 months, with local developer beta programs commencing in Q1 2027.',
    article: '',
    category: 'Technology',
    tags: ['Tech', 'Data Center', 'Artificial Intelligence', 'Bosun Tijani', 'Lagos', 'Startups'],
    slug: 'nigerian-tech-secures-250m-tier-iv-ai-data-center-epe',
    image: imgLagosAi,
    imageCaption: 'The state-of-the-art AI and hyperscale innovation compute center in Lagos.',
    imageCredit: 'The Guardian Nigeria Technology Desk',
    publishedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    confidenceScore: 96,
    status: 'published',
    isBreaking: false,
    isTrending: true,
    views: 8930,
    shares: 512,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'The Guardian Nigeria',
    primarySourceUrl: 'https://guardian.ng/technology/lagos-unveils-250m-sovereign-ai-hyperscale-center/',
    sources: [
      {
        sourceId: 'src-guardian-ng',
        sourceName: 'The Guardian Nigeria',
        sourceUrl: 'https://guardian.ng/technology/lagos-unveils-250m-sovereign-ai-hyperscale-center/',
        publishedAt: new Date(Date.now() - 120 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/tech-investors-sink-250m-into-lagos-ai-cloud-infrastructure/',
        publishedAt: new Date(Date.now() - 95 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Nigeria Secures $250M for Sovereign AI Tier-IV Data Center | Nigerian AI News Hub',
    metaDescription: 'West Africa’s largest AI data center breaks ground in Lagos with $250M funding and 45MW clean power. Read verified report.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/technology/nigerian-tech-secures-250m-tier-iv-ai-data-center-epe',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1190
  },
  {
    id: 'story-sports-super-eagles-qualifiers-2026',
    clusterId: 'cluster_20260815_super_eagles',
    headline: 'Super Eagles Camp Opens in Uyo as Victor Osimhen and Ademola Lookman Lead 25-Man Squad for Decisive Qualifiers',
    summary: 'The Nigerian national football team has commenced rigorous training sessions at the Godswill Akpabio International Stadium in Uyo ahead of their crucial continental qualifying clash.',
    keyPoints: [
      'Head coach welcomes 22 overseas-based players and 3 domestic NPFL standouts to the Uyo training camp.',
      'Reigning African Footballer of the Year contenders Victor Osimhen and Ademola Lookman reported fit and sharp.',
      'NFF President Ibrahim Gusau reassures team of total logistical and financial support for qualification bonus structures.',
      'Over 30,000 tickets released for passionate home supporters in Akwa Ibom State.'
    ],
    whatHappened: 'The Super Eagles of Nigeria intensified their tactical buildup in Uyo, Akwa Ibom State, conducting morning fitness routines and closed-door set-piece drills under floodlights.',
    mainStory: 'Arriving at the team camp at the Ibom Hotel and Golf Resort, top stars expressed unshakeable determination to seal maximum points in their upcoming fixture.\n\nHead Coach Eric Chelle commended the early arrival of key European regulars, noting that team cohesion has reached optimal levels following intensive tactical video reviews. Team captain William Troost-Ekong stated that the squad is fully aware of national expectations and will approach the match with unmatched intensity.\n\nThe Nigeria Football Federation (NFF) verified that match officials designated by CAF have safely landed in Nigeria and inspected the pitch facilities, which were certified in pristine condition.',
    background: 'Nigeria continues its quest for continental dominance following strong podium finishes in recent tournament campaigns, with attacking duos currently ranked among Europe’s top domestic scorers.',
    whatHappensNext: 'The final tactical dress rehearsal takes place tomorrow evening, followed by the official pre-match press conference with international media.',
    article: '',
    category: 'Sports',
    tags: ['Super Eagles', 'Osimhen', 'Ademola Lookman', 'NFF', 'Uyo', 'AFCON'],
    slug: 'super-eagles-camp-opens-in-uyo-victor-osimhen-lookman',
    image: imgSuperEagles,
    imageCaption: 'Godswill Akpabio International Stadium in Uyo ahead of the Super Eagles fixture.',
    imageCredit: 'Vanguard Sports Bureau',
    publishedAt: new Date(Date.now() - 150 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 130 * 60000).toISOString(),
    confidenceScore: 99,
    status: 'published',
    isBreaking: false,
    isTrending: false,
    views: 7420,
    shares: 430,
    readingTimeMinutes: 2,
    requiresReview: false,
    primarySourceName: 'Vanguard News',
    primarySourceUrl: 'https://www.vanguardngr.com/sports/super-eagles-camp-buzzes-in-uyo-osimhen-lookman-ready/',
    sources: [
      {
        sourceId: 'src-vanguard-ngr',
        sourceName: 'Vanguard News',
        sourceUrl: 'https://www.vanguardngr.com/sports/super-eagles-camp-buzzes-in-uyo-osimhen-lookman-ready/',
        publishedAt: new Date(Date.now() - 160 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/sports/super-eagles-intensify-preparations-in-uyo/',
        publishedAt: new Date(Date.now() - 145 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Super Eagles Camp Opens in Uyo: Osimhen & Lookman Ready | Nigerian AI News Hub',
    metaDescription: 'Super Eagles open camp in Uyo with Victor Osimhen and Ademola Lookman leading 25-man squad for decisive qualifying match.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/sports/super-eagles-camp-opens-in-uyo-victor-osimhen-lookman',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 980
  },
  {
    id: 'story-security-police-patrol-highway-2026',
    clusterId: 'cluster_20260815_police_patrol',
    headline: 'Inspector-General of Police Deploys Specialized Drone Surveillance and Special Tactical Squads Along Abuja-Kaduna Highway',
    summary: 'The Nigeria Police Force has operationalized next-generation aerial drone monitoring and motorized rapid response units along critical transit routes connecting the Federal Capital Territory.',
    keyPoints: [
      'IGP inaugurates 24-hour command and control center equipped with thermal-imaging aerial drones.',
      'Deployment covers strategic blackspots along Abuja-Kaduna, Abuja-Lokoja, and Lagos-Ibadan express corridors.',
      'Community intelligence fusion unit established with local vigilante networks and traditional rulers.',
      'Commuters report smooth traffic flow and visible deterrent presence along major toll gates.'
    ],
    whatHappened: 'The Inspector-General of Police personally flagged off the enhanced highway security architecture at the Zuba interchange, warning criminal elements that security forces maintain full tactical superiority.',
    mainStory: 'Force Public Relations Officer ACP Olumuyiwa Adejobi stated that the technological deployment integrates aerial surveillance with motorized ground interceptors able to respond to distress beacons in under four minutes.\n\nThe initiative forms part of the Safe Corridors Project aimed at guaranteeing 24-hour commercial hauling and uninterrupted passenger transit across the North-Central and North-Western geopolitical zones.\n\nTransport unions, including the National Union of Road Transport Workers (NURTW), have commended the aggressive security visibility, noting an immediate uptick in nocturnal interstate bus operations.',
    background: 'Interstate highway safety has remained a priority agenda for the National Security Adviser (NSA) and federal security agencies seeking to insulate vital economic transport arteries.',
    whatHappensNext: 'The Force Headquarters will conduct a joint 30-day operational review with the military and Federal Road Safety Corps (FRSC) to evaluate response times.',
    article: '',
    category: 'Crime & Security',
    tags: ['Police', 'Security', 'Abuja-Kaduna', 'Drone Surveillance', 'IGP', 'Highway'],
    slug: 'igp-deploys-drone-surveillance-tactical-squads-abuja-kaduna-highway',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Nigeria Police tactical units on specialized highway patrol demonstration.',
    imageCredit: 'Channels Television Police Beat',
    publishedAt: new Date(Date.now() - 210 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 190 * 60000).toISOString(),
    confidenceScore: 94,
    status: 'published',
    isBreaking: false,
    isTrending: false,
    views: 6100,
    shares: 310,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Channels Television',
    primarySourceUrl: 'https://www.channelstv.com/2026/08/15/police-deploy-drones-tactical-units-abuja-kaduna-highway/',
    sources: [
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/2026/08/15/police-deploy-drones-tactical-units-abuja-kaduna-highway/',
        publishedAt: new Date(Date.now() - 220 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/igp-flags-off-drone-surveillance-on-abuja-kaduna-expressway/',
        publishedAt: new Date(Date.now() - 200 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Police Deploy Drones & Tactical Squads on Abuja-Kaduna Highway | Nigerian AI News Hub',
    metaDescription: 'IGP deploys 24-hour drone surveillance and special tactical squads along Abuja-Kaduna highway corridors.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/crime-security/igp-deploys-drone-surveillance-tactical-squads-abuja-kaduna-highway',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1050
  },
  {
    id: 'story-education-unilag-research-grant-2026',
    clusterId: 'cluster_20260815_unilag_grant',
    headline: 'University of Lagos Clinches $12M International Climate Resilience & Clean Energy Research Endowment',
    summary: 'The University of Lagos (UNILAG), Akoka, has been awarded a landmark multi-year grant to establish the West African Center for Urban Climate Adaptation and Renewable Grid Solutions.',
    keyPoints: [
      '$12 million competitive endowment backed by multilateral green transition funds and academic partners in Europe.',
      'Center to develop low-cost solar mini-grid storage solutions tailored to tropical coastal communities in Lagos and Delta states.',
      'Vice-Chancellor Prof. Folasade Ogunsola praises faculty researchers for rigorous interdisciplinary proposal.',
      'Provides full PhD and post-doctoral research fellowships to 60 Nigerian scholars over 4 years.'
    ],
    whatHappened: 'At an academic ceremony on the Akoka campus, the University of Lagos administration officially announced the funding award, which represents one of the largest competitive research grants awarded to a Nigerian federal university.',
    mainStory: 'Addressing deans, faculty members, and student researchers, UNILAG Vice-Chancellor Professor Folasade Ogunsola celebrated the achievement as clear proof of Nigerian academia’s global scientific relevance.\n\nThe newly created innovation institute will construct experimental flood modeling laboratories and pilot decentralized solar-battery storage installations in surrounding coastal settlements.\n\nTETFund and the Federal Ministry of Education issued statements congratulating the university, reiterating the government’s commitment to matching research commercialization grants across tertiary institutions.',
    background: 'Nigerian universities have increasingly focused on applied research partnerships to solve localized climate, energy, and urban infrastructure challenges.',
    whatHappensNext: 'Fellowship applications for Nigerian postgraduate engineers and environmental scientists will open online on September 1.',
    article: '',
    category: 'Education',
    tags: ['Education', 'UNILAG', 'TETFund', 'Climate', 'Research', 'Solar Energy'],
    slug: 'unilag-clinches-12m-climate-clean-energy-research-grant',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'University of Lagos Senate Building at the Akoka main campus.',
    imageCredit: 'Premium Times Education Desk',
    publishedAt: new Date(Date.now() - 320 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 300 * 60000).toISOString(),
    confidenceScore: 98,
    status: 'published',
    isBreaking: false,
    isTrending: false,
    views: 4500,
    shares: 280,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Premium Times',
    primarySourceUrl: 'https://www.premiumtimesng.com/news/education/unilag-wins-12m-clean-energy-climate-research-grant/',
    sources: [
      {
        sourceId: 'src-premium-times',
        sourceName: 'Premium Times',
        sourceUrl: 'https://www.premiumtimesng.com/news/education/unilag-wins-12m-clean-energy-climate-research-grant/',
        publishedAt: new Date(Date.now() - 330 * 60000).toISOString(),
        relationship: 'primary'
      }
    ],
    seoTitle: 'UNILAG Wins $12M Climate & Renewable Energy Research Grant | Nigerian AI News Hub',
    metaDescription: 'University of Lagos awarded $12 million research endowment for clean energy solutions in coastal communities.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/education/unilag-clinches-12m-climate-clean-energy-research-grant',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 890
  }
];
