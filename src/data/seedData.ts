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
    id: 'story-punch-nat-assembly-electoral-2026',
    clusterId: 'cluster_20260815_punch_electoral_reforms',
    headline: 'National Assembly Passes Landmark Local Government Financial Autonomy & Electoral Act Modernization Bill',
    summary: 'The Senate and the House of Representatives have concurred on landmark legislative amendments granting complete fiscal autonomy to the 774 Local Government Areas and mandating electronic real-time transmission of polling results.',
    keyPoints: [
      'National Assembly ratifies direct FAAC statutory disbursements into designated Local Government joint accounts without state executive interference.',
      'Mandatory electronic accreditation and instant polling unit results transmission codified into electoral legislation.',
      'Senate President Godswill Akpabio and Speaker Abbas Tajudeen commend bi-partisan cooperation on sub-national governance reforms.',
      'State Houses of Assembly expected to convene for constitutionally required ratification sessions within 30 days.'
    ],
    whatHappened: 'In a harmonized plenary session in Abuja, the National Assembly formally passed the Constitution Alteration and Electoral Modernization Bill. The legislation fundamentally restructures fiscal relations between state governors and local council secretariats while bolstering transparent ballot tallying.',
    mainStory: 'The passage follows extensive national townhall consultations and public hearings conducted by the Senate and House Joint Committees on Constitution Review.\n\nUnder the newly enacted provisions, commercial banks and the Office of the Accountant-General of the Federation (OAGF) are legally barred from honoring deductions from local government allocations by state joint accounts.\n\nPolitical analysts across Nigeria have heralded the legislative milestone as the most significant decentralization reform since 1999, directly empowering grassroots communities to execute grassroots infrastructure, primary healthcare, and rural educational projects without bureaucratic delays in state capitals.',
    background: 'Local council financial independence has been a contentious subject in Nigerian constitutional politics. The Supreme Court ruling in 2024 set the legal foundation which lawmakers have now enshrined into binding statute.',
    whatHappensNext: 'The bill has been transmitted to the 36 State Houses of Assembly where two-thirds majority concurrence (24 states) is required prior to Presidential assent.',
    article: '',
    category: 'Politics',
    tags: ['National Assembly', 'Senate', 'The Punch', 'Electoral Act', 'Local Government', 'Abuja', 'Politics'],
    slug: 'national-assembly-passes-local-gov-autonomy-electoral-bill',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'The National Assembly complex in the Three Arms Zone, Abuja.',
    imageCredit: 'The Punch Political Bureau / Abuja Photo Desk',
    publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    confidenceScore: 99,
    status: 'published',
    isBreaking: true,
    isTrending: true,
    views: 18920,
    shares: 1420,
    readingTimeMinutes: 4,
    requiresReview: false,
    primarySourceName: 'The Punch',
    primarySourceUrl: 'https://punchng.com/topics/politics/national-assembly-passes-electoral-act-lg-autonomy-bill/',
    sources: [
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/topics/politics/national-assembly-passes-electoral-act-lg-autonomy-bill/',
        publishedAt: new Date(Date.now() - 20 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/category/politics/nass-passes-local-government-electoral-amendment/',
        publishedAt: new Date(Date.now() - 18 * 60000).toISOString(),
        relationship: 'secondary'
      },
      {
        sourceId: 'src-premium-times',
        sourceName: 'Premium Times',
        sourceUrl: 'https://www.premiumtimesng.com/news/top-news/national-assembly-votes-full-autonomy-774-lga/',
        publishedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'National Assembly Passes LG Autonomy & Electoral Bill | The Punch',
    metaDescription: 'National Assembly approves direct FAAC allocations for 774 LGAs and real-time electronic results transmission.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/national-assembly-passes-local-gov-autonomy-electoral-bill',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 980
  },
  {
    id: 'story-channels-presidency-security-2026',
    clusterId: 'cluster_20260815_channels_presidency_fec',
    headline: 'Presidency Presides Over Federal Security Summit; Mandates Integrated Sub-National Joint Operations',
    summary: 'President Bola Ahmed Tinubu convened a high-level National Security Council briefing at the State House in Abuja, issuing executive directives to accelerate inter-agency intelligence coordination across all geopolitical zones.',
    keyPoints: [
      'President directs Chief of Defence Staff and Service Chiefs to deploy automated satellite and surveillance hardware along transit corridors.',
      'National Security Adviser Malam Nuhu Ribadu confirms significant reduction in interstate highway incidents.',
      'Specialized agricultural security taskforce deployed across food belt states to protect farming clusters ahead of harvest seasons.',
      'State Governors Forum pledges logistical support and local intelligence sharing mechanisms.'
    ],
    whatHappened: 'The National Security Council assembled at the Presidential Villa in Abuja for a comprehensive operational appraisal of federal defense deployments and sub-national security joint taskforces.',
    mainStory: 'Addressing service chiefs, heads of intelligence directorates, and cabinet ministers, the Commander-in-Chief reaffirmed the administration’s non-negotiable resolve to secure every square kilometer of Nigerian territory.\n\nThe Presidency emphasized that economic revitalization is inextricably tied to agricultural security and safe commerce. The National Security Adviser presented empirical progress reports demonstrating improved response times across federal highways.\n\nState governors who joined the interactive security deliberation noted that closer harmonization between military tactical commands and state-level vigilante outfits will prevent security vacuums in remote border communities.',
    background: 'Sub-national security collaboration has gained momentum following renewed inter-agency joint operations instituted by the Defence Headquarters and the Ministry of Police Affairs.',
    whatHappensNext: 'The joint operational headquarters will roll out zonal monitoring command centers in Kaduna, Ibadan, Makurdi, and Owerri over the next fortnight.',
    article: '',
    category: 'Politics',
    tags: ['Presidency', 'Tinubu', 'Channels TV', 'National Security', 'FEC', 'Abuja', 'Politics'],
    slug: 'presidency-presides-over-security-summit-sub-national-operations',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'The Council Chamber at the Presidential Villa in Aso Rock, Abuja.',
    imageCredit: 'Channels Television State House Bureau',
    publishedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    confidenceScore: 98,
    status: 'published',
    isBreaking: false,
    isTrending: true,
    views: 14750,
    shares: 980,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Channels Television',
    primarySourceUrl: 'https://www.channelstv.com/category/politics/president-tinubu-presides-over-national-security-council-aso-rock/',
    sources: [
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/category/politics/president-tinubu-presides-over-national-security-council-aso-rock/',
        publishedAt: new Date(Date.now() - 40 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-vanguard-ngr',
        sourceName: 'Vanguard News',
        sourceUrl: 'https://www.vanguardngr.com/category/politics/tinubu-orders-service-chiefs-protect-farmers-highways/',
        publishedAt: new Date(Date.now() - 30 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Presidency Orders Sub-National Joint Security Operations | Channels TV',
    metaDescription: 'President Tinubu convenes Security Council in Abuja, directs joint military and state operations to safeguard transit corridors.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/presidency-presides-over-security-summit-sub-national-operations',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1100
  },
  {
    id: 'story-premium-times-inec-voter-reg-2026',
    clusterId: 'cluster_20260815_pt_inec_bvas',
    headline: 'INEC Commences Nationwide Continuous Voter Registration; Deploys Upgraded Cloud BVAS Protocols',
    summary: 'The Independent National Electoral Commission (INEC) has flagged off nationwide Continuous Voter Registration (CVR), unveiling second-generation Bimodal Voter Accreditation Systems equipped with low-latency facial matching.',
    keyPoints: [
      'INEC activates online pre-registration portals alongside in-person physical enrollment centers across all 774 LGAs.',
      'Upgraded BVAS devices feature enhanced battery redundancy and offline multi-biometric cryptographic encryption.',
      'INEC National Commissioner for Voter Education confirms stringent measures to purge underage and duplicate entries.',
      'Civil society monitoring coalitions express satisfaction with preliminary system stress tests in pilot federal constituencies.'
    ],
    whatHappened: 'At a world press conference at INEC Headquarters in Zambezi Street, Maitama, Abuja, the commission announced the timetable and technological infrastructure driving the continuous registration exercise.',
    mainStory: 'The electoral umpire explained that the new registration framework guarantees seamless voter transfers, replacement of defaced permanent voter cards (PVCs), and new registrations for citizens attaining 18 years of age.\n\nTo prevent server bottlenecks experienced during previous cycles, the commission migrated its central voter registry database to a multi-region cloud infrastructure supported by redundant high-speed fiber links.\n\nPolitical parties under the Inter-Party Advisory Council (IPAC) welcomed the early commencement of the exercise, urging eligible Nigerian youths to take advantage of the digital portal before the physical confirmation deadlines.',
    background: 'Continuous voter registration is a statutory obligation mandated by the Electoral Act to ensure an inclusive, accurate, and regularly audited national voter roll.',
    whatHappensNext: 'Physical biometric capture and biometric fingerprint verification centers will commence operations across local government offices starting next Monday.',
    article: '',
    category: 'Politics',
    tags: ['INEC', 'Premium Times', 'Elections', 'BVAS', 'Voter Registration', 'Abuja', 'Politics'],
    slug: 'inec-commences-nationwide-continuous-voter-registration-bvas',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'INEC National Headquarters and election monitoring center in Abuja.',
    imageCredit: 'Premium Times Electoral Desk / Abuja',
    publishedAt: new Date(Date.now() - 50 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    confidenceScore: 97,
    status: 'published',
    isBreaking: false,
    isTrending: true,
    views: 12400,
    shares: 820,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Premium Times',
    primarySourceUrl: 'https://www.premiumtimesng.com/category/news/top-news/inec-unveils-upgraded-bvas-nationwide-cvr-timetable/',
    sources: [
      {
        sourceId: 'src-premium-times',
        sourceName: 'Premium Times',
        sourceUrl: 'https://www.premiumtimesng.com/category/news/top-news/inec-unveils-upgraded-bvas-nationwide-cvr-timetable/',
        publishedAt: new Date(Date.now() - 55 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/topics/politics/inec-opens-portal-for-continuous-voter-registration/',
        publishedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'INEC Begins Continuous Voter Registration with Upgraded BVAS | Premium Times',
    metaDescription: 'INEC commences nationwide Continuous Voter Registration and deploys upgraded cloud-backed BVAS technology.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/inec-commences-nationwide-continuous-voter-registration-bvas',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1040
  },
  {
    id: 'story-vanguard-gov-forum-wage-2026',
    clusterId: 'cluster_20260815_vanguard_ngf_wage',
    headline: 'Nigeria Governors Forum & Federal Ministry of Finance Finalize Sub-National Implementation Framework',
    summary: 'The Nigeria Governors’ Forum (NGF) and the Federal Ministry of Finance have finalized payment modalities and fiscal performance benchmarks to ensure uninterrupted implementation across all 36 state public services.',
    keyPoints: [
      'NGF Chairman confirms all 36 sub-national governments have concluded internal fiscal alignments.',
      'FAAC revenue disbursements augmented by improved non-oil tax collections and digital revenue tracking.',
      'Organized Labour leadership applauds constructive social dialogue and timely state salary disbursements.',
      'Public sector productivity monitoring committees instituted across state civil service commissions.'
    ],
    whatHappened: 'State Governors concluded a closed-door consultative assembly in Abuja with the Minister of Finance and Coordinating Minister of the Economy, harmonizing revenue allocations with sub-national wage bill commitments.',
    mainStory: 'Reading the communiqué following the session, the NGF Secretariat stated that sub-national governments are fully committed to workers’ welfare while preserving capital expenditure allocations for rural healthcare, road paving, and vocational schools.\n\nThe Minister of Finance commended state chief executives for implementing fiscal responsibility measures, noting that transparency in sub-national public expenditures has reinforced Nigeria’s sovereign credit rating.\n\nRepresentatives of the Nigeria Labour Congress (NLC) and Trade Union Congress (TUC) commended the joint implementation framework, calling it a template for stable industrial relations.',
    background: 'Sub-national fiscal sustainability has been strengthened through enhanced federation revenues and automated state internal revenue service digitization.',
    whatHappensNext: 'Joint federal-state technical committees will conduct quarterly performance reviews to assess compliance and capital budget execution.',
    article: '',
    category: 'Politics',
    tags: ['Governors Forum', 'Vanguard News', 'Public Service', 'Finance', 'Abuja', 'Politics'],
    slug: 'governors-forum-finance-ministry-finalize-implementation-framework',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Nigeria Governors Forum (NGF) consultative session in Abuja.',
    imageCredit: 'Vanguard Media Political Desk / Abuja',
    publishedAt: new Date(Date.now() - 75 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60000).toISOString(),
    confidenceScore: 96,
    status: 'published',
    isBreaking: false,
    isTrending: false,
    views: 9800,
    shares: 510,
    readingTimeMinutes: 3,
    requiresReview: false,
    primarySourceName: 'Vanguard News',
    primarySourceUrl: 'https://www.vanguardngr.com/category/politics/ngf-finance-ministry-agree-on-subnational-fiscal-framework/',
    sources: [
      {
        sourceId: 'src-vanguard-ngr',
        sourceName: 'Vanguard News',
        sourceUrl: 'https://www.vanguardngr.com/category/politics/ngf-finance-ministry-agree-on-subnational-fiscal-framework/',
        publishedAt: new Date(Date.now() - 80 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-guardian-ng',
        sourceName: 'The Guardian Nigeria',
        sourceUrl: 'https://guardian.ng/category/politics/governors-assure-on-workers-welfare-and-capital-spend/',
        publishedAt: new Date(Date.now() - 65 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Governors Forum Finalizes Sub-National Fiscal Framework | Vanguard',
    metaDescription: 'Nigeria Governors Forum and Finance Ministry agree on implementation framework for state workers and public services.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/governors-forum-finance-ministry-finalize-implementation-framework',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1020
  },
  {
    id: 'story-guardian-supreme-court-faac-2026',
    clusterId: 'cluster_20260815_guardian_supreme_court',
    headline: 'Supreme Court Enforces Direct FAAC Allocations to 774 Local Government Areas; Dismisses State Objections',
    summary: 'The Supreme Court of Nigeria has issued definitive consequential orders directing the Central Bank of Nigeria and the Federation Account Allocation Committee to pay statutory revenues straight to elected local council administrations.',
    keyPoints: [
      'Apex court reaffirms constitutional supremacy of democratically elected local government councils over caretaker committees.',
      'CBN and Office of the Accountant-General instructed to route monthly allocations directly to local government treasuries.',
      'Chief Justice of Nigeria leads 7-man constitutional panel delivering unanimous judgment in Abuja.',
      'Constitutional lawyers praise judicial intervention as the cornerstone of true fiscal federalism in Nigeria.'
    ],
    whatHappened: 'Delivering a decisive ruling in Abuja, the Supreme Court struck down lingering legal maneuvers aimed at intercepting federation revenues, ruling that unconstitutional state-appointed caretaker committees hold zero legal standing to receive public funds.',
    mainStory: 'In the lead judgment, the apex court emphasized that Section 7 of the 1999 Constitution guarantees the system of local government by democratically elected councils.\n\nThe court emphasized that withholding or diverting statutory funds meant for local governments undermines national stability and rural development. Consequently, all 774 local government areas across Nigeria now possess full, unhindered authority over their recurrent and capital revenue streams.\n\nCivil society organizations and rural development advocates in Lagos, Kano, Enugu, and Port Harcourt have celebrated the judgment as an epochal breakthrough for grassroots democracy.',
    background: 'The Attorney-General of the Federation filed the landmark legal action to permanently dismantle illegal joint state-local government account deductions.',
    whatHappensNext: 'The Federal Ministry of Finance and FAAC will reflect the direct remittance schedule beginning with the current month’s revenue distribution session.',
    article: '',
    category: 'Politics',
    tags: ['Supreme Court', 'The Guardian', 'Judiciary', 'FAAC', 'Local Government', 'Abuja', 'Politics'],
    slug: 'supreme-court-enforces-direct-faac-allocations-774-local-councils',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'The Supreme Court of Nigeria complex in Abuja.',
    imageCredit: 'The Guardian Nigeria Judiciary Desk / Abuja',
    publishedAt: new Date(Date.now() - 95 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 70 * 60000).toISOString(),
    confidenceScore: 99,
    status: 'published',
    isBreaking: false,
    isTrending: true,
    views: 16800,
    shares: 1150,
    readingTimeMinutes: 4,
    requiresReview: false,
    primarySourceName: 'The Guardian Nigeria',
    primarySourceUrl: 'https://guardian.ng/category/politics/supreme-court-enforces-direct-faac-payment-to-774-lgas/',
    sources: [
      {
        sourceId: 'src-guardian-ng',
        sourceName: 'The Guardian Nigeria',
        sourceUrl: 'https://guardian.ng/category/politics/supreme-court-enforces-direct-faac-payment-to-774-lgas/',
        publishedAt: new Date(Date.now() - 100 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-premium-times',
        sourceName: 'Premium Times',
        sourceUrl: 'https://www.premiumtimesng.com/news/top-news/supreme-court-orders-cbn-pay-lgas-directly/',
        publishedAt: new Date(Date.now() - 90 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Supreme Court Enforces Direct FAAC Payments to 774 LGAs | The Guardian',
    metaDescription: 'Supreme Court orders CBN and FAAC to disburse statutory revenues directly to 774 elected local government councils.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/politics/supreme-court-enforces-direct-faac-allocations-774-local-councils',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 1180
  },
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
    article: '',
    category: 'Business',
    tags: ['CBN', 'Naira', 'Economy', 'Forex', 'Diaspora Remittances', 'Yemi Cardoso'],
    slug: 'cbn-unveils-enhanced-fx-liquidity-framework-naira',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Central Bank of Nigeria Headquarters in Abuja.',
    imageCredit: 'Channels Television Photo Desk',
    publishedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 85 * 60000).toISOString(),
    confidenceScore: 97,
    status: 'published',
    isBreaking: false,
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
        publishedAt: new Date(Date.now() - 120 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-punch-ng',
        sourceName: 'The Punch',
        sourceUrl: 'https://punchng.com/cbn-rolls-out-new-fx-guidelines-banks-imtos/',
        publishedAt: new Date(Date.now() - 105 * 60000).toISOString(),
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
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'The state-of-the-art AI and hyperscale innovation compute center in Lagos.',
    imageCredit: 'The Guardian Nigeria Technology Desk',
    publishedAt: new Date(Date.now() - 140 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 110 * 60000).toISOString(),
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
        publishedAt: new Date(Date.now() - 150 * 60000).toISOString(),
        relationship: 'primary'
      }
    ],
    seoTitle: 'Nigeria Secures $250M for Sovereign AI Tier-IV Data Center | The Guardian',
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
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Godswill Akpabio International Stadium in Uyo ahead of the Super Eagles fixture.',
    imageCredit: 'Vanguard Sports Bureau',
    publishedAt: new Date(Date.now() - 170 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 140 * 60000).toISOString(),
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
        publishedAt: new Date(Date.now() - 180 * 60000).toISOString(),
        relationship: 'primary'
      },
      {
        sourceId: 'src-channels-tv',
        sourceName: 'Channels Television',
        sourceUrl: 'https://www.channelstv.com/sports/super-eagles-intensify-preparations-in-uyo/',
        publishedAt: new Date(Date.now() - 165 * 60000).toISOString(),
        relationship: 'secondary'
      }
    ],
    seoTitle: 'Super Eagles Camp Opens in Uyo: Osimhen & Lookman Ready | Vanguard',
    metaDescription: 'Super Eagles open camp in Uyo with Victor Osimhen and Ademola Lookman leading 25-man squad for decisive qualifying match.',
    canonicalUrl: 'https://nigerianainewshub.ng/news/sports/super-eagles-camp-opens-in-uyo-victor-osimhen-lookman',
    aiModelUsed: 'gemini-3.7-flash',
    aiProcessingTimeMs: 980
  }
];
