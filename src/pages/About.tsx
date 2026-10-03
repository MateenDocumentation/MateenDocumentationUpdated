import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCmsSection, str, arr } from '../cms/useCmsPage';
import { useCms } from '../cms/CmsContext';

/* ── Motion variants ──────────────────────────────── */
const inView = { once: true, margin: '-80px' };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
} as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;
const staggerSlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
} as const;

/* ── SVG Icons ─────────────────────────────────────── */
const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#00AEEF] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const LocationPinIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const TargetIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const GlobeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.5 3-4 5.7-4 9s1.5 6 4 9M12 3c2.5 3 4 5.7 4 9s-1.5 6-4 9" />
  </svg>
);

const SlidersIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

const BookIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PeopleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const BuildingIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const BriefcaseIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const OrgIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
);

const WaIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Flow Lines SVG ────────────────────────────────── */
function FlowLines({ className = '', color = 'rgba(0,174,239,0.16)' }: { className?: string; color?: string }) {
  return (
    <svg className={`absolute pointer-events-none overflow-visible ${className}`} viewBox="0 0 600 400" fill="none">
      <motion.path
        d="M-50 300 C 100 250, 200 350, 300 280 S 500 200, 650 260"
        stroke={color} strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M-30 200 C 80 160, 220 200, 340 150 S 520 80, 660 120"
        stroke={color} strokeWidth="1" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView}
        transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
      />
      <motion.path
        d="M0 350 C 150 320, 280 380, 400 320 S 580 280, 700 310"
        stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="8 6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView}
        transition={{ duration: 2.6, ease: 'easeInOut', delay: 0.6 }}
      />
    </svg>
  );
}

/* ── Services data ─────────────────────────────────── */
const servicesPanels = [
  {
    title: 'Printing & Photocopy',
    eyebrow: 'PRINT & COPY',
    desc: 'Color & B&W printing, photocopy, scanning, photo printing, lamination, passport photos and more.',
    image: 'https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=700&h=500&fit=crop&auto=format',
    to: '/services/printing-photocopy',
  },
  {
    title: 'Student Services',
    eyebrow: 'ACADEMIC',
    desc: 'Assignment printing, typing, thesis binding, project work and academic document support.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&h=500&fit=crop&auto=format',
    to: '/services/student-assignment-services',
  },
  {
    title: 'Customized Printing',
    eyebrow: 'CUSTOM',
    desc: 'Mugs, cards, stickers, frames, labels, personalized gifts and branded merchandise.',
    image: 'https://images.unsplash.com/photo-1682339374155-6fdc4869a75b?w=700&h=500&fit=crop&auto=format',
    to: '/services/customized-printing',
  },
  {
    title: 'Biometric & NADRA',
    eyebrow: 'FACILITATION',
    desc: 'NADRA e-Sahulat, biometric facilitation, CNIC, birth/death certificates and government applications.',
    image: 'https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=700&h=500&fit=crop&auto=format',
    to: '/services/nadra-biometric-public-facilitation',
  },
  {
    title: 'Legal Documentation',
    eyebrow: 'LEGAL',
    desc: 'Affidavits, agreements, power of attorney, attestation and official document preparation.',
    image: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=700&h=500&fit=crop&auto=format',
    to: '/services/legal-documentation',
  },
  {
    title: 'Business Services',
    eyebrow: 'BUSINESS',
    desc: 'Letterheads, salary certificates, business letters, bulk printing and office stationery.',
    image: 'https://images.unsplash.com/photo-1775163024488-e88e4a71179f?w=700&h=500&fit=crop&auto=format',
    to: '/services/business-documentation',
  },
];

/* ── Audience cards data ───────────────────────────── */
const audiences = [
  {
    icon: <BookIcon className="w-6 h-6" />,
    label: 'Students',
    desc: 'School, college and university students for assignment printing, thesis, projects and academic submissions.',
  },
  {
    icon: <PeopleIcon className="w-6 h-6" />,
    label: 'Individuals & Families',
    desc: 'Personal documentation, photographs, ID facilitation, frames and everyday printing needs.',
  },
  {
    icon: <BuildingIcon className="w-6 h-6" />,
    label: 'Schools & Colleges',
    desc: 'Bulk institutional printing, stationery, forms, and documentation support for educational institutions.',
  },
  {
    icon: <BriefcaseIcon className="w-6 h-6" />,
    label: 'Businesses & Offices',
    desc: 'Business documents, letterheads, visiting cards, rubber stamps and corporate printing.',
  },
  {
    icon: <GlobeIcon className="w-6 h-6" />,
    label: 'General Public',
    desc: 'NADRA facilitation, biometric assistance, legal documents and everyday service needs.',
  },
  {
    icon: <OrgIcon className="w-6 h-6" />,
    label: 'Organizations',
    desc: 'Large-volume printing, customized branded materials and official documentation.',
  },
];

/* ── Approach principles ───────────────────────────── */
const principles = [
  {
    icon: <TargetIcon className="w-7 h-7" />,
    title: 'Convenience',
    desc: 'All services at one location. No running between providers — printing, documentation, biometric and customized products together.',
  },
  {
    icon: <GlobeIcon className="w-7 h-7" />,
    title: 'Accessibility',
    desc: 'Online ordering means you can send your files from home, university or office. Walk in or order ahead.',
  },
  {
    icon: <SlidersIcon className="w-7 h-7" />,
    title: 'Customized Solutions',
    desc: 'Every customer has unique requirements. We accommodate specific sizes, quantities, materials and formats.',
  },
];

/* ── Service tag chips ─────────────────────────────── */
const serviceTags = ['Printing', 'Documentation', 'Biometric', 'Customized', 'Student Services', 'Business'];

/* ═══════════════════════════════════════════════════ */
/*  ABOUT PAGE                                         */
/* ═══════════════════════════════════════════════════ */
export default function About() {
  const aboutHero = useCmsSection('/about', 'hero');
  const whoSection = useCmsSection('/about', 'who_we_are');
  const servicesSection = useCmsSection('/about', 'services_grid');
  const audiencesSection = useCmsSection('/about', 'audiences');
  const principlesSection = useCmsSection('/about', 'principles');
  const locationSection = useCmsSection('/about', 'location');
  const { siteSettings, headerSettings } = useCms();

  const heroTitle1 = str(aboutHero, 'title_line1', 'Multiple Services.');
  const heroTitle2 = str(aboutHero, 'title_line2', 'One Convenient Place.');
  const heroSubtitle = str(aboutHero, 'subtitle', 'A multi-service printing, documentation, biometric and public facilitation centre in H Block, North Nazimabad — all your needs handled under one roof.');

  const whoHeading = str(whoSection, 'heading', 'Your Neighbourhood Documentation & Print Centre');
  const whoBody1 = str(whoSection, 'body1', 'Mateen Documentation is a multi-service centre providing printing, photocopying, scanning, documentation, biometric facilitation, customized printing, student assignment services and business documentation — all in one convenient location in H Block, North Nazimabad.');
  const whoBody2 = str(whoSection, 'body2', "Whether you're a student needing your assignment printed and bound, a professional requiring legal documents, a family visiting for NADRA facilitation, or a business ordering bulk letterheads — we serve everyone under one roof.");
  const whoTagsArr = arr<string>(whoSection, 'tags');
  const resolvedTags = whoTagsArr.length ? whoTagsArr : serviceTags;

  type ServicePanelItem = { title: string; eyebrow: string; desc: string; image: string; to: string };
  const cmsPanels = arr<ServicePanelItem>(servicesSection, 'items');
  const resolvedPanels = cmsPanels.length ? cmsPanels : servicesPanels;

  type AudienceItem = { label: string; desc: string };
  const cmsAudienceItems = arr<AudienceItem>(audiencesSection, 'items');
  const resolvedAudiences = cmsAudienceItems.length
    ? audiences.map((a, i) => ({ ...a, ...(cmsAudienceItems[i] ?? {}) }))
    : audiences;

  type PrincipleItem = { title: string; desc: string };
  const cmsPrincipleItems = arr<PrincipleItem>(principlesSection, 'items');
  const resolvedPrinciples = cmsPrincipleItems.length
    ? principles.map((p, i) => ({ ...p, ...(cmsPrincipleItems[i] ?? {}) }))
    : principles;

  // Hero eyebrow
  const heroEyebrow = str(aboutHero, 'eyebrow', 'ABOUT MATEEN DOCUMENTATION');

  // Section eyebrows and headings
  const whoEyebrow = str(whoSection, 'eyebrow', 'WHO WE ARE');
  const whoRightImage = str(whoSection, 'image', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&h=860&fit=crop&auto=format');
  const whoRightImageAlt = str(whoSection, 'image_alt', 'Mateen Documentation Centre — H Block, North Nazimabad');
  const servicesEyebrow = str(servicesSection, 'eyebrow', 'OUR SERVICES');
  const servicesHeading = str(servicesSection, 'heading', 'What We Do');
  const audiencesEyebrow = str(audiencesSection, 'eyebrow', 'WHO WE SERVE');
  const audiencesHeading = str(audiencesSection, 'heading', 'For Everyone in the Community');
  const principlesEyebrow = str(principlesSection, 'eyebrow', 'OUR APPROACH');
  const principlesHeading = str(principlesSection, 'heading', 'How We Work');

  // Location section
  const locationEyebrow = str(locationSection, 'eyebrow', 'FIND US');
  const locationHeading = str(locationSection, 'heading', 'Visit Our Centre');
  const locationHours = str(locationSection, 'hours', 'Open daily — visit us for all your printing and documentation needs.');
  const locationAddress = str(locationSection, 'address', siteSettings?.address ?? 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi');
  const locationMapsUrl = str(locationSection, 'maps_url', siteSettings?.maps_url ?? 'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6');
  const rawWa = headerSettings?.whatsapp ?? siteSettings?.whatsapp ?? '923312478337';
  const rawPhone = headerSettings?.phone ?? siteSettings?.phone ?? '+923312478337';
  const locationWaHref = `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`;
  const locationPhoneHref = `tel:${rawPhone.replace(/\s/g, '')}`;
  const locationBadgeText = str(locationSection, 'badge_text', siteSettings?.address?.split(',').slice(1, 3).join(',').trim() ?? 'H Block, North Nazimabad');

  return (
    <Layout
      title="About Mateen Documentation — H Block, North Nazimabad"
      description="Mateen Documentation is a multi-service printing, documentation, biometric and public facilitation centre at Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi."
    >

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[480px] flex items-end overflow-hidden" style={{ background: '#071A2B' }}>
        {/* BG image */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          width={1600}
          height={700}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.25 }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(7,26,43,0.98) 0%, rgba(7,26,43,0.75) 55%, rgba(7,26,43,0.35) 100%)' }}
        />

        {/* Animated SVG flow line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1200 200" fill="none" preserveAspectRatio="none">
            <motion.path
              d="M0 150 C 200 80, 400 180, 600 120 S 900 40, 1200 100"
              stroke="rgba(0,174,239,0.22)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
            <motion.path
              d="M0 180 C 300 120, 500 160, 700 100 S 1000 60, 1200 140"
              stroke="rgba(0,174,239,0.12)" strokeWidth="1" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.4 }}
            />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 pt-20">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 mb-6 text-sm font-medium"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link to="/" className="text-[#00AEEF] hover:text-white transition-colors">Home</Link>
            <ChevronIcon />
            <span className="text-[#00AEEF]">About</span>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Manrope']"
            >
              {heroEyebrow}
            </motion.p>

            {/* Hero title */}
            <motion.h1
              variants={fadeUp}
              className="font-['Sora'] font-bold text-white leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(42px, 6vw, 76px)' }}
            >
              {heroTitle1}<br />
              <span className="text-[#00AEEF]">{heroTitle2}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-white/70 font-['Manrope'] text-lg leading-relaxed max-w-xl"
            >
              {heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. WHO WE ARE — Editorial 2-col
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: editorial text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              {/* Blue accent line */}
              <motion.div
                variants={fadeUp}
                className="w-10 h-0.5 mb-6"
                style={{ background: '#00AEEF' }}
              />
              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Manrope']"
              >
                {whoEyebrow}
              </motion.p>
              {/* Heading */}
              <motion.h2
                variants={fadeUp}
                className="font-['Sora'] font-bold text-[#090B0D] leading-[1.15] mb-6"
                style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
              >
                {whoHeading}
              </motion.h2>
              {/* Body paragraphs */}
              <motion.p
                variants={fadeUp}
                className="text-[#090B0D]/70 font-['Manrope'] text-base leading-relaxed mb-5"
              >
                {whoBody1}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-[#090B0D]/70 font-['Manrope'] text-base leading-relaxed mb-8"
              >
                {whoBody2}
              </motion.p>
              {/* Service tag chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {resolvedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold font-['Manrope'] tracking-wide px-3.5 py-1.5 rounded-full border border-[#071A2B]/20 text-[#071A2B] bg-[#EEF7FF]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: editorial image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.14)] aspect-[4/5] max-h-[520px]">
                <img
                  src={whoRightImage}
                  alt={whoRightImageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <a
                href={locationMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Mateen Documentation location in Google Maps"
                className="absolute -bottom-4 -left-4 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold font-['Manrope'] shadow-xl backdrop-blur-md hover:opacity-90 transition-opacity"
                style={{ background: 'rgba(10,15,30,0.82)', border: '1px solid rgba(0,174,239,0.3)' }}
              >
                <LocationPinIcon className="w-4 h-4 text-[#00AEEF]" />
                {locationBadgeText}
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. SERVICES OVERVIEW — pale bg
      ══════════════════════════════════════════════ */}
      <section className="py-24 overflow-hidden" style={{ background: '#EEF7FF' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div
            className="text-center mb-14"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-3 font-['Manrope']"
            >
              {servicesEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-['Sora'] font-bold text-[#090B0D] leading-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
            >
              {servicesHeading}
            </motion.h2>
          </motion.div>

          {/* 3-col grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {resolvedPanels.map((panel) => (
              <motion.div key={panel.title} variants={fadeUp}>
                <Link to={panel.to} className="block">
                  <motion.div
                    className="rounded-3xl overflow-hidden relative group cursor-pointer h-[280px]"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Background image */}
                    <img
                      src={panel.image}
                      alt={panel.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(0deg, rgba(7,26,43,0.92) 0%, rgba(7,26,43,0.45) 55%, rgba(7,26,43,0.1) 100%)' }}
                    />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-[#00AEEF] text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5 font-['Manrope']">
                        {panel.eyebrow}
                      </p>
                      <h3 className="font-['Sora'] font-bold text-white text-lg leading-tight mb-2">
                        {panel.title}
                      </h3>
                      <p className="text-white/70 text-sm font-['Manrope'] leading-snug">
                        {panel.desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. WHO WE SERVE
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div
            className="text-center mb-14"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-3 font-['Manrope']"
            >
              {audiencesEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-['Sora'] font-bold text-[#090B0D] leading-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
            >
              {audiencesHeading}
            </motion.h2>
          </motion.div>

          {/* Audience cards grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {resolvedAudiences.map((audience) => (
              <motion.div
                key={audience.label}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl bg-white border border-[#e8edf8] p-6 shadow-sm"
              >
                {/* Icon in blue circle */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)' }}
                >
                  {audience.icon}
                </div>
                <h3 className="font-['Sora'] font-bold text-[#090B0D] text-base mb-2">{audience.label}</h3>
                <p className="font-['Manrope'] text-[#090B0D]/65 text-sm leading-relaxed">{audience.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. OUR APPROACH — dark bg
      ══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#071A2B' }}>
        {/* Flowing SVG lines behind */}
        <FlowLines className="w-full h-full top-0 left-0 opacity-60" color="rgba(0,174,239,0.14)" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-3 font-['Manrope']"
            >
              {principlesEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-['Sora'] font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
            >
              {principlesHeading}
            </motion.h2>
          </motion.div>

          {/* 3 principles */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {resolvedPrinciples.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="text-center flex flex-col items-center"
              >
                {/* Large icon in blue circle */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[#EEF7FF] border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.06)', boxShadow: '0 12px 35px rgba(0,0,0,0.2)' }}
                >
                  {p.icon}
                </div>
                <h3 className="font-['Sora'] font-bold text-white text-xl mb-3">{p.title}</h3>
                <p className="font-['Manrope'] text-white/60 text-sm leading-relaxed max-w-xs">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. LOCATION
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: info */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <motion.p
                variants={fadeUp}
                className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-['Manrope']"
              >
                {locationEyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-['Sora'] font-bold text-[#090B0D] leading-tight mb-6"
                style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
              >
                {locationHeading}
              </motion.h2>
              <motion.div variants={fadeUp} className="flex items-start gap-3 mb-4">
                <a href={locationMapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Mateen Documentation location in Google Maps" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                  <LocationPinIcon className="w-5 h-5 text-[#00AEEF] flex-shrink-0 mt-0.5" />
                  <p className="font-['Manrope'] text-[#090B0D]/75 text-base leading-relaxed">
                    {locationAddress}
                  </p>
                </a>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="font-['Manrope'] text-[#090B0D]/60 text-sm mb-8 leading-relaxed"
              >
                {locationHours}
              </motion.p>

              {/* 3 buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <a
                  href={locationMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#071A2B] text-[#071A2B] font-semibold font-['Manrope'] text-sm hover:bg-[#071A2B] hover:text-white transition-all duration-200"
                >
                  <LocationPinIcon className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={locationWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold font-['Manrope'] text-sm text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  <WaIcon />
                  WhatsApp Us
                </a>
                <a
                  href={locationPhoneHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold font-['Manrope'] text-sm text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Now
                </a>
              </motion.div>
            </motion.div>

            {/* Right: map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              <a
                href={locationMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl overflow-hidden h-[300px] relative group"
                style={{ background: '#071A2B' }}
              >
                {/* Background grid pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300" fill="none">
                  {Array.from({ length: 8 }, (_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#00AEEF" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 11 }, (_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#00AEEF" strokeWidth="0.5" />
                  ))}
                </svg>
                {/* Location pin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)', boxShadow: '0 8px_32px rgba(0,174,239,0.5)' }}
                  >
                    <LocationPinIcon className="w-7 h-7" />
                  </div>
                  <div className="text-center px-4">
                    <p className="font-['Sora'] font-bold text-white text-sm mb-1">Mateen Documentation</p>
                    <p className="font-['Manrope'] text-white/60 text-xs leading-snug">
                      {locationAddress}
                    </p>
                  </div>
                  <span className="text-[#00AEEF] text-xs font-semibold font-['Manrope'] tracking-wide uppercase mt-1">
                    Open in Google Maps
                  </span>
                </div>
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. CTA — dark bg
      ══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#071A2B' }}>

        {/* Floating animated document shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-12 right-16 opacity-10"
            animate={{ y: [-8, 8, -8], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
              <rect x="4" y="4" width="72" height="92" rx="6" stroke="#00AEEF" strokeWidth="2" />
              <line x1="16" y1="30" x2="64" y2="30" stroke="#00AEEF" strokeWidth="1.5" />
              <line x1="16" y1="44" x2="64" y2="44" stroke="#00AEEF" strokeWidth="1.5" />
              <line x1="16" y1="58" x2="48" y2="58" stroke="#00AEEF" strokeWidth="1.5" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-12 opacity-[0.07]"
            animate={{ y: [8, -8, 8], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <svg width="60" height="75" viewBox="0 0 60 75" fill="none">
              <rect x="3" y="3" width="54" height="69" rx="5" stroke="#00AEEF" strokeWidth="2" />
              <line x1="12" y1="22" x2="48" y2="22" stroke="#00AEEF" strokeWidth="1.2" />
              <line x1="12" y1="33" x2="48" y2="33" stroke="#00AEEF" strokeWidth="1.2" />
              <line x1="12" y1="44" x2="36" y2="44" stroke="#00AEEF" strokeWidth="1.2" />
            </svg>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">

          {/* Eyebrow with flanking lines */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="h-px w-12 bg-[#00AEEF]/40" />
            <span className="text-[#00AEEF] text-xs font-semibold tracking-[0.22em] uppercase font-['Manrope']">
              READY WHEN YOU ARE
            </span>
            <div className="h-px w-12 bg-[#00AEEF]/40" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="font-['Sora'] font-bold text-white leading-[1.1] mb-10"
            style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            Come Visit Us{' '}
            <span style={{ color: '#00AEEF' }}>Today.</span>
          </motion.h2>

          {/* 3 buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            {/* WhatsApp — green + glow */}
            <a
              href="https://wa.me/923312478337"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold font-['Manrope'] text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
              style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}
            >
              <WaIcon />
              WhatsApp Us
            </a>
            {/* Order Online — blue gradient */}
            <Link
              to="/order-online"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold font-['Manrope'] text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)', boxShadow: '0 8px 32px rgba(0,174,239,0.4)' }}
            >
              Order Online
            </Link>
            {/* Call Now — frosted */}
            <a
              href={locationPhoneHref}
              aria-label="Call Mateen Documentation"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold font-['Manrope'] text-sm text-white transition-all duration-200 hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call Now
            </a>
          </motion.div>

        </div>
      </section>

    </Layout>
  );
}
