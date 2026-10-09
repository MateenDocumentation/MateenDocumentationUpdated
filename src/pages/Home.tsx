import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import Layout from '../components/Layout';
import heroPrinterPoster from '../imports/mateen_hero_printer_poster.webp';
import heroPrinterVideo from '../imports/mateen_hero_printer_preview_16x9.mp4';
import { useCmsSection, str, arr } from '../cms/useCmsPage';
import { resolveCmsMedia, useCms } from '../cms/CmsContext';

/* ── Motion variants ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
} as const;
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const staggerSlow = { show: { transition: { staggerChildren: 0.18 } } };
const inView = { once: true, margin: '-80px' };

/* ── WhatsApp icon ────────────────────────────────── */
const WaIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ── FlowLines SVG ────────────────────────────────── */
function FlowLines({ className = '', color = 'rgba(0,174,239,0.16)' }) {
  return (
    <svg className={`absolute pointer-events-none overflow-visible ${className}`} viewBox="0 0 600 400" fill="none">
      <motion.path d="M-50 300 C 100 250, 200 350, 300 280 S 500 200, 650 260"
        stroke={color} strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView} transition={{ duration: 2, ease: 'easeInOut' }} />
      <motion.path d="M-30 200 C 80 160, 220 200, 340 150 S 520 80, 660 120"
        stroke={color} strokeWidth="1" fill="none"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }} />
      <motion.path d="M0 350 C 150 320, 280 380, 400 320 S 580 280, 700 310"
        stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="8 6"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView} transition={{ duration: 2.6, ease: 'easeInOut', delay: 0.6 }} />
    </svg>
  );
}

/* ── Quick service strip data ─────────────────────── */
const services = [
  {
    label: 'Printing & Copy',
    to: '/services/printing-photocopy',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
      </svg>
    ),
  },
  {
    label: 'Assignments',
    to: '/services/assignment-printing-binding',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    label: 'Customized Print',
    to: '/services/customized-printing',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    label: 'Biometric / NADRA',
    to: '/services/nadra-biometric-public-facilitation',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
      </svg>
    ),
  },
  {
    label: 'Legal Docs',
    to: '/services/legal-documentation',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Business Services',
    to: '/services/business-documentation',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

/* ── Process steps ────────────────────────────────── */
const steps = [
  {
    n: '01', title: 'Choose Your Service', body: 'Select from printing, documentation, NADRA facilitation, customized products and more.',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 17.5h7M17.5 14v7" /></svg>),
  },
  {
    n: '02', title: 'Share Your Requirements', body: 'Walk in or send files via WhatsApp — we handle any format, any size, any deadline.',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>),
  },
  {
    n: '03', title: 'We Prepare It Precisely', body: 'Our team handles formatting, printing, lamination and professional finishing in-house.',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>),
  },
  {
    n: '04', title: 'Collect or Deliver', body: 'Pick up from our shop or arrange delivery for bulk and business orders.',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M5 12h14M12 5l7 7-7 7" /></svg>),
  },
];

/* ── Who We Serve ─────────────────────────────────── */
const audienceCards = [
  { label: 'Students', sub: 'Assignments, thesis, projects', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=640&h=820&fit=crop&auto=format' },
  { label: 'Working Professionals', sub: 'CVs, documents, presentations', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&h=820&fit=crop&auto=format' },
  { label: 'Businesses', sub: 'Letterheads, bulk print, branding', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=640&h=820&fit=crop&auto=format' },
];

/* ── Why MD benefits ──────────────────────────────── */
const benefits = [
  { title: 'All Under One Roof', body: 'Printing, documentation, NADRA facilitation, customized products — one visit, no running around.' },
  { title: 'Fast Turnaround', body: 'Most standard print jobs are ready same-hour. Bulk and complex orders discussed upfront.' },
  { title: 'Student-Friendly', body: 'Dedicated support for assignments, thesis, projects and last-minute requirements.' },
  { title: 'Community Location', body: 'H Block North Nazimabad, near Saifee College — central, accessible, known.' },
];

function BenefitIcon({ name }: { name: string }) {
  const common = { className: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8 };
  switch (name) {
    case 'upload':
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
    case 'student':
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    case 'business':
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0V8.706c0-1.081-.768-2.015-1.837-2.175M3.75 14.15V8.706c0-1.081.768-2.015 1.837-2.175M8.25 6.144V5.25A2.25 2.25 0 0110.5 3h3a2.25 2.25 0 012.25 2.25v.894" /></svg>;
    case 'custom':
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814" /></svg>;
    case 'location':
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    default:
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7 2 2M5 10v10h14V10" /></svg>;
  }
}

export default function Home() {
  // ── CMS hero content (falls back to hardcoded when no CMS data exists) ──
  const heroSection = useCmsSection('/', 'hero');
  const { headerSettings, siteSettings, cmsServices, mediaAssets } = useCms();
  const media = (url: string) => resolveCmsMedia(mediaAssets, url);
  const serviceImage = (slug: string, fallback: string) => cmsServices.find(service => service.slug === slug)?.image_url?.trim() || media(fallback);
  const sharedLabelsSection = useCmsSection('/shared', 'shared_labels');
  type SharedLabel = { key: string; value: string };
  const sharedLabels = arr<SharedLabel>(sharedLabelsSection, 'items');
  const sharedLabelMap = Object.fromEntries(sharedLabels.map(item => [item.key, item.value]));
  const homeLabel = (key: string, fallback: string) => sharedLabelMap[key] || fallback;

  const rawHeading = str(heroSection, 'heading', '');
  const heroParts = rawHeading.split('\n');
  const heroLine1 = heroParts[0] || 'Where Printing';
  const heroLine2 = heroParts[1] ?? 'Meets Documentation.';
  const heroBadge = str(heroSection, 'badge', 'Modern print studio & facilitation centre');
  const heroDescription = str(heroSection, 'description', 'Professional printing and dependable documentation services, thoughtfully handled in one place.');
  const ctaPrimaryText = str(heroSection, 'cta_primary_text', 'Send Your File');
  const ctaPrimaryUrl = str(heroSection, 'cta_primary_url', '/order-online');
  const ctaSecondaryText = str(heroSection, 'cta_secondary_text', 'WhatsApp Us');
  const ctaTertiaryText = str(heroSection, 'cta_tertiary_text', 'View Services');
  const ctaTertiaryUrl = str(heroSection, 'cta_tertiary_url', '/services');

  // CMS-controlled hero media with safe local fallbacks
  const heroVideoSrc = str(heroSection, 'video_url', '') || heroPrinterVideo;
  const heroPosterSrc = str(heroSection, 'video_poster', '') || heroPrinterPoster;
  const heroImageSrc = str(heroSection, 'image_url', '') || heroPosterSrc;
  const heroAltText = str(heroSection, 'alt_text', 'Professional printer producing paper output');
  const heroBackgroundSrc = str(heroSection, 'background_image_url', '') || media('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1800&h=1100&fit=crop&auto=format&q=82');

  // CMS phone/wa with fallbacks
  const rawWa = headerSettings?.whatsapp ?? siteSettings?.whatsapp ?? '923312478337';
  const rawPhone = headerSettings?.phone ?? siteSettings?.phone ?? '+923312478337';
  const waBase = `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`;
  const waHref = str(heroSection, 'cta_secondary_url', '') || waBase;

  // ── Service strip CMS ──
  const serviceStripSection = useCmsSection('/', 'service_strip');
  type StripItem = { label: string; url: string };
  const cmsStripItems = arr<StripItem>(serviceStripSection, 'items');
  const resolvedServices = services.map((s, i) => ({
    ...s,
    label: cmsStripItems[i]?.label ?? s.label,
    to: cmsStripItems[i]?.url ?? s.to,
  }));

  // ── Printing feature CMS ──
  const printingSection = useCmsSection('/', 'printing_feature');
  const printingHeading = str(printingSection, 'heading', 'Printing & Photocopy');
  const printingDesc = str(printingSection, 'description', 'From single-page copies to large-format print runs — color, black & white, sticker paper, transparent sheets, vinyl and photo paper. We handle A4 through A3 with care and precision.');
  const printingItems = arr<string>(printingSection, 'checklist');
  const defaultPrintingItems = ['Color & B/W Printing', 'Lamination & Binding', 'A4, A3 & Custom Sizes', 'Scanning & PDF Conversion', 'Photo & Glossy Paper', 'Bulk Print Discounts'];
  const resolvedPrintingItems = printingItems.length ? printingItems : defaultPrintingItems;
  const printingCtaLabel = str(printingSection, 'cta_label', 'Learn More');
  const printingCtaUrl = str(printingSection, 'cta_url', '/services/printing-photocopy');

  // ── Academic feature CMS ──
  const academicSection = useCmsSection('/', 'academic_feature');
  const academicHeading1 = str(academicSection, 'heading_line1', 'Assignment &');
  const academicHeading2 = str(academicSection, 'heading_line2', 'Academic Support');
  const academicDesc = str(academicSection, 'description', 'School reports, college assignments, university thesis, project files — typed, formatted and printed to standard. Near Saifee College, we know student timelines.');
  const academicItems = arr<string>(academicSection, 'checklist');
  const defaultAcademicItems = ['Typing', 'Assignments & Projects', 'Editing & Formatting', 'Binding', 'Presentations', 'Reports & Research Work'];
  const resolvedAcademicItems = academicItems.length ? academicItems : defaultAcademicItems;
  const academicCtaLabel = str(academicSection, 'cta_label', 'Send Assignment');
  const academicWaMsg = str(academicSection, 'wa_message', '');
  const academicWaHref = academicWaMsg ? `${waBase}?text=${encodeURIComponent(academicWaMsg)}` : waBase;

  // ── How It Works CMS ──
  const howSection = useCmsSection('/', 'how_it_works');
  const howHeading = str(howSection, 'heading', 'How It Works');
  const howSubtitle = str(howSection, 'subtitle', 'Fast, simple, reliable — from your requirement to finished output in four easy steps.');
  type HowStep = { n: string; title: string; body: string };
  const cmsHowSteps = arr<HowStep>(howSection, 'steps');
  const resolvedSteps = steps.map((s, i) => ({
    ...s,
    n: cmsHowSteps[i]?.n ?? s.n,
    title: cmsHowSteps[i]?.title ?? s.title,
    body: cmsHowSteps[i]?.body ?? s.body,
  }));
  const howCtaLabel = str(howSection, 'cta_label', 'Ready to start? WhatsApp us now');
  const howWaMsg = str(howSection, 'wa_message', '');
  const howWaHref = howWaMsg ? `${waBase}?text=${encodeURIComponent(howWaMsg)}` : waBase;

  // ── Customized printing CMS ──
  const customizedSection = useCmsSection('/', 'customized_printing');
  const customHeading1 = str(customizedSection, 'heading_line1', 'Make It');
  const customHeading2 = str(customizedSection, 'heading_line2', 'Personal');
  const customDesc = str(customizedSection, 'description', 'Put your name, photo, or design on anything — mugs, frames, stickers, business cards and more. We handle the design and print everything in-house.');
  const customItems = arr<string>(customizedSection, 'items');
  const defaultCustomItems = ['Photo Mugs & Gifts', 'Custom Stickers & Labels', 'Business Cards & Letterheads', 'PVC ID Cards', 'Photo Frames', 'Branded Merchandise'];
  const resolvedCustomItems = customItems.length ? customItems : defaultCustomItems;
  const customCtaLabel = str(customizedSection, 'cta_label', 'Explore Customized Printing');
  const customCtaUrl = str(customizedSection, 'cta_url', '/services/customized-printing');

  // ── Who We Serve CMS ──
  const whoServeSection = useCmsSection('/', 'who_we_serve');
  const whoServeEyebrow = str(whoServeSection, 'eyebrow', 'Who We Serve');
  const whoServeHeading = str(whoServeSection, 'heading', 'For Everyone In The Community');
  type ServePanel = { title: string; description: string; tags: string[]; image: string; image_alt: string };
  const cmsServePanels = arr<ServePanel>(whoServeSection, 'panels');
  const defaultServePanels: ServePanel[] = [
    { title: 'Students', description: 'From assignments and thesis to final-year projects — typing, formatting, printing and binding handled with care.', tags: ['Assignments', 'Printing', 'Binding', 'Projects'], image: media('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=1160&fit=crop&auto=format'), image_alt: 'Student with laptop studying' },
    { title: 'Families &\nIndividuals', description: 'Public facilitation, NADRA assistance, documentation and custom-printed items for everyday personal needs.', tags: ['Documentation', 'NADRA', 'Public Facilitation', 'Custom Print'], image: media('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=1160&fit=crop&auto=format'), image_alt: 'Family at a documentation centre' },
    { title: 'Businesses &\nOrganizations', description: 'Bulk printing, business documentation, letterheads, rubber stamps and branding for offices and enterprises.', tags: ['Bulk Printing', 'Letterheads', 'Branding', 'Business Docs'], image: media('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=700&h=1160&fit=crop&auto=format'), image_alt: 'Business professionals in meeting' },
  ];
  const resolvedServePanels = cmsServePanels.length ? cmsServePanels : defaultServePanels;

  // ── Services Showcase CMS ──
  const servicesShowcaseSection = useCmsSection('/', 'services_showcase');
  const servicesShowcaseEyebrow = str(servicesShowcaseSection, 'eyebrow', 'All Services');
  const servicesShowcaseHeading = str(servicesShowcaseSection, 'heading', 'Everything In One Place');
  const servicesPopularBadge = str(servicesShowcaseSection, 'popular_badge', 'Most Popular');
  const servicesFeaturedLinkLabel = str(servicesShowcaseSection, 'featured_link_label', 'Explore Service');
  const servicesMediumLinkLabel = str(servicesShowcaseSection, 'medium_link_label', 'Learn more');
  const servicesSmallLinkLabel = str(servicesShowcaseSection, 'small_link_label', 'Details');
  const servicesViewAllLabel = str(servicesShowcaseSection, 'view_all_label', 'View All 12 Services');
  const servicesViewAllUrl = str(servicesShowcaseSection, 'view_all_url', '/services');
  const showcaseSlugs = arr<string>(servicesShowcaseSection, 'service_slugs');
  const resolvedShowcaseSlugs = showcaseSlugs.length ? showcaseSlugs : [
    'printing-photocopy',
    'assignment-printing-binding',
    'customized-printing',
    'nadra-biometric-public-facilitation',
    'legal-documentation',
    'business-documentation',
  ];
  const showcaseService = (slug: string, fallback: { title: string; tag: string; description: string; image: string; to: string }) => {
    const cms = cmsServices.find(service => service.slug === slug);
    return {
      title: cms?.title?.trim() || fallback.title,
      tag: cms?.tag?.trim() || fallback.tag,
      description: cms?.description?.trim() || fallback.description,
      image: cms?.image_url?.trim() || media(fallback.image),
      to: `/services/${slug}`,
    };
  };

  const featuredShowcaseService = showcaseService(resolvedShowcaseSlugs[0] || 'printing-photocopy', { title: 'Printing & Photocopy', tag: 'Core Service', description: 'Color, B&W, photo paper, sticker, vinyl, lamination, binding & more.', image: 'https://images.unsplash.com/photo-1715059382493-213b706e95f3?w=700&h=1100&fit=crop&auto=format', to: '/services/printing-photocopy' });

  // ── Why Us CMS ──
  const whySection = useCmsSection('/', 'why_us');
  const whyEyebrow = str(whySection, 'eyebrow', 'Why Us');
  const whyHeading1 = str(whySection, 'heading_line1', 'Why Choose');
  const whyHeading2 = str(whySection, 'heading_line2', 'Mateen Documentation?');
  const whyDescription = str(whySection, 'description', 'One centre for everything — printing, documentation, facilitation, student services and customized products.');
  type WhyItem = { n: string; title: string; body: string; icon_key: string };
  const defaultWhyItems: WhyItem[] = [
    { n: '01', title: 'All Under One Roof', body: 'Printing, documentation, NADRA facilitation, customized products — one visit, zero running around.', icon_key: 'home' },
    { n: '02', title: 'Online File Submission', body: 'Send your file via WhatsApp or the order form — no need to come in person for standard jobs.', icon_key: 'upload' },
    { n: '03', title: 'Student Friendly', body: 'Dedicated support for assignments, thesis, projects and last-minute submission requirements.', icon_key: 'student' },
    { n: '04', title: 'Business Friendly', body: 'Bulk printing, business documentation, letterheads, stamps and branding — handled professionally.', icon_key: 'business' },
    { n: '05', title: 'Customized Solutions', body: 'Mugs, frames, PVC cards, stickers, banners — personalized items for gifts, events and brands.', icon_key: 'custom' },
    { n: '06', title: 'Central Location', body: 'H Block, North Nazimabad, near Saifee College — accessible, known, and community-embedded.', icon_key: 'location' },
  ];
  const cmsWhyItems = arr<WhyItem>(whySection, 'items');
  const resolvedWhyItems = cmsWhyItems.length ? cmsWhyItems : defaultWhyItems;
  const whyImage = str(whySection, 'image_url', '') || media('https://images.unsplash.com/photo-1685609241440-f14d86cea774?w=500&h=800&fit=crop&auto=format');
  const whyImageAlt = str(whySection, 'image_alt', 'Staff assisting customer with documents');
  const whyImageHeading = str(whySection, 'image_heading', 'Trusted by the community');
  const whyImageSubtext = str(whySection, 'image_subtext', "North Nazimabad's multi-service print centre");
  const whyCtaHeading = str(whySection, 'cta_heading', 'Ready to get started?');
  const whyWaLabel = str(whySection, 'wa_label', 'WhatsApp Us');
  const whyWaMsg = str(whySection, 'wa_message', '');
  const whyWaHref = whyWaMsg ? `${waBase}?text=${encodeURIComponent(whyWaMsg)}` : waBase;
  const whyOrderLabel = str(whySection, 'order_label', 'Order Online');
  const whyOrderUrl = str(whySection, 'order_url', '/order-online');

  // ── FAQ CMS ──
  const faqSection = useCmsSection('/', 'faq');
  type HomeFaqItem = { question: string; answer: string };
  const homeFaqItems = arr<HomeFaqItem>(faqSection, 'items').filter(item => item.question?.trim() && item.answer?.trim());
  const homeFaqEyebrow = str(faqSection, 'eyebrow', 'FAQ');
  const homeFaqHeading = str(faqSection, 'heading', str(faqSection, 'title', 'Frequently Asked Questions'));
  const homeFaqDescription = str(faqSection, 'description', 'Quick answers about our printing, documentation and facilitation services.');

  // ── Final CTA CMS ──
  const finalCtaSection = useCmsSection('/', 'final_cta');
  const finalCtaHeading1 = str(finalCtaSection, 'heading_line1', 'Get It Done.');
  const finalCtaHeading2 = str(finalCtaSection, 'heading_line2', 'Today.');
  const finalCtaSubline = str(finalCtaSection, 'subline', siteSettings?.address ? `${siteSettings.address} — walk in anytime, or send us your file right now.` : 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi — walk in anytime, or send us your file right now.');
  const finalCtaWaLabel = str(finalCtaSection, 'wa_label', 'WhatsApp Us Now');
  const finalCtaWaMsg = str(finalCtaSection, 'wa_message', '');
  const finalCtaWaHref = finalCtaWaMsg ? `${waBase}?text=${encodeURIComponent(finalCtaWaMsg)}` : waBase;
  const finalCtaPhoneHref = `tel:${rawPhone.replace(/\s/g, '')}`;
  const finalCtaPhoneLabel = str(finalCtaSection, 'phone_label', 'Call Now');
  const finalCtaServiceTags = arr<string>(finalCtaSection, 'service_tags');
  const defaultServiceTags = ['Printing', 'Documentation', 'NADRA Facilitation', 'Customized Products', 'Student Services'];
  const resolvedServiceTags = finalCtaServiceTags.length ? finalCtaServiceTags : defaultServiceTags;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const collageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 50, damping: 18 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 50, damping: 18 });
  const backgroundX = useTransform(smoothPointerX, [-1, 1], [5, -5]);
  const backgroundY = useTransform(smoothPointerY, [-1, 1], [4, -4]);

  const handleHeroMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }, [pointerX, pointerY]);

  const handleHeroMouseLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <Layout title="Mateen Documentation — Where Printing Meets Documentation">

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: '88vh', background: '#071A2B' }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* ── Background: blurred photographic print shop bokeh ── */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.img
            className="absolute inset-0 w-full h-full object-cover scale-[1.06]"
            style={{ x: backgroundX, y: backgroundY, filter: 'blur(3px) saturate(1.4)' }}
            alt=""
            width={1800}
            height={1100}
            fetchPriority="high"
            src={heroBackgroundSrc}
          />
          {/* Strong dark navy overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(7,26,43,0.96) 0%, rgba(7,26,43,0.88) 42%, rgba(7,26,43,0.55) 70%, rgba(7,26,43,0.4) 100%)' }} />
          {/* Blue tint overlay for cinematic look */}
          <div className="absolute inset-0" style={{ background: 'rgba(7,26,43,0.15)' }} />
        </div>

        {/* ── Decorative SVG arcs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
            <motion.path d="M 0 600 C 200 520, 500 560, 720 480 S 1100 360, 1440 420"
              stroke="rgba(0,174,239,0.18)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.5 }} />
            <motion.path d="M 0 650 C 220 580, 520 600, 750 520 S 1120 400, 1440 460"
              stroke="rgba(0,174,239,0.1)" strokeWidth="1" fill="none" strokeDasharray="12 8"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.8 }} />
            <motion.path d="M 800 0 C 820 200, 1050 300, 1200 500 S 1380 700, 1440 760"
              stroke="rgba(0,174,239,0.14)" strokeWidth="1.2" fill="none"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut', delay: 1 }} />
          </svg>
        </div>

        {/* ── Main content ── */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full"
        >
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 xl:gap-10 items-center pt-28 pb-10 lg:pt-32 lg:pb-12" style={{ minHeight: '88vh' }}>

            {/* ═══ LEFT: Copy ════════════════════════════════════════════ */}
            <motion.div
              className="order-2 lg:order-1"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
            >
              {/* Eyebrow pill */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 border border-white/15 bg-white/5 text-[#EEF7FF]/70 text-[11px] font-black tracking-[0.22em] uppercase px-4 py-2.5 rounded-full mb-7"
              >
                {heroBadge}
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={fadeUp}
                className="font-bold text-white leading-[1.06] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)' }}
              >
                {heroLine1}
                {heroLine2 && <span className="block text-[#EEF7FF]">{heroLine2}</span>}
              </motion.h1>

              <motion.div variants={fadeUp} className="flex h-1.5 w-36 overflow-hidden mb-7" aria-hidden="true">
                <span className="flex-1 bg-[#00AEEF]" />
                <span className="flex-1 bg-[#EC008C]" />
                <span className="flex-1 bg-[#FFD400]" />
                <span className="flex-1 bg-[#090B0D]" />
              </motion.div>

              {/* Body text */}
              <motion.p
                variants={fadeUp}
                className="text-[16px] leading-relaxed mb-9 max-w-[440px]"
                style={{ color: 'rgba(255,255,255,0.62)' }}
              >
                {heroDescription}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                {/* Primary CTA — blue */}
                <motion.div className="hover-clip rounded-lg" whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(28,100,232,0.45)' }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={ctaPrimaryUrl}
                    className="group inline-flex items-center gap-2.5 text-white font-bold px-7 py-4 rounded-lg transition-colors text-[15px]"
                    style={{ background: '#00AEEF', color: '#071A2B' }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    {ctaPrimaryText}
                  </Link>
                </motion.div>
                {/* Secondary CTA — WhatsApp green */}
                <motion.div className="hover-clip rounded-lg" whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(34,197,94,0.4)' }} whileTap={{ scale: 0.97 }}>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold px-7 py-4 rounded-lg transition-colors text-[15px]"
                  >
                    <WaIcon />
                    {ctaSecondaryText}
                  </a>
                </motion.div>
                {/* Tertiary CTA — dark transparent */}
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={ctaTertiaryUrl}
                    className="group inline-flex items-center gap-2.5 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-semibold px-7 py-4 rounded-lg transition-all text-[15px]"
                  >
                    {ctaTertiaryText}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>


            </motion.div>

            {/* ═══ RIGHT: Focused print-studio composition ═══════════════════ */}
            <motion.div
              className="order-1 lg:order-2 relative hidden md:block"
              style={{ height: '560px', y: collageY }}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-8 lg:inset-4 group rounded-[2rem] overflow-hidden shadow-[0_36px_90px_rgba(0,0,0,0.42)] border border-white/10 bg-[#090B0D]"
                whileHover={{ scale: 1.015, borderColor: 'rgba(255,255,255,0.24)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Static poster remains visible on mobile, reduced-motion devices, and if video cannot load. */}
                <img
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  alt={heroAltText}
                  src={heroImageSrc}
                  width={1280}
                  height={720}
                  fetchPriority="high"
                />
                <video
                  className="absolute inset-0 hidden md:block motion-reduce:hidden w-full h-full object-cover object-center"
                  src={heroVideoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={heroPosterSrc}
                  onCanPlay={(event) => {
                    event.currentTarget.play().catch(() => undefined);
                  }}
                  aria-hidden="true"
                />

                {/* Fixed cinematic treatment */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/75 via-[#071A2B]/10 to-[#071A2B]/30 pointer-events-none" />
                <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(7,26,43,0.48)] pointer-events-none" />

                {/* Restrained print-production graphics */}
                <div
                  className="absolute inset-y-0 right-0 w-[34%] opacity-[0.14] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '9px 9px' }}
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute top-[58%] left-0 w-[28%] h-px bg-gradient-to-r from-transparent via-[#00AEEF] to-[#EC008C] opacity-60 pointer-events-none"
                  animate={{ x: ['-110%', '470%'], opacity: [0, 0.6, 0.6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear', times: [0, 0.12, 0.86, 1] }}
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute left-5 top-5 size-9 rounded-full border border-white/35 pointer-events-none"
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <span className="absolute inset-2 rounded-full border border-[#00AEEF]/80" />
                  <span className="absolute left-1/2 top-[-5px] bottom-[-5px] w-px bg-white/25" />
                  <span className="absolute top-1/2 left-[-5px] right-[-5px] h-px bg-white/25" />
                </motion.div>

                {/* Minimal print status */}
                <div className="absolute left-6 bottom-6 flex items-center gap-3 rounded-full border border-white/15 bg-[#071A2B]/70 px-3.5 py-2 backdrop-blur-md">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00AEEF] opacity-40" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#00AEEF]" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.18em] text-white/75">{homeLabel('home_printing_progress', 'PRINTING IN PROGRESS')}</span>
                  <span className="flex h-1.5 w-16 overflow-hidden rounded-full" aria-hidden="true">
                    <span className="flex-1 bg-[#00AEEF]" />
                    <span className="flex-1 bg-[#EC008C]" />
                    <span className="flex-1 bg-[#FFD400]" />
                    <span className="flex-1 bg-[#090B0D]" />
                  </span>
                </div>
              </motion.div>

              <div className="absolute left-1 bottom-12 size-16 rounded-full border border-white/25 flex items-center justify-center" aria-hidden="true">
                <div className="size-2 rounded-full bg-[#EC008C]" />
                <span className="absolute w-full h-px bg-white/20" />
                <span className="absolute h-full w-px bg-white/20" />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ═══ SERVICE TABS + PRINTING SECTION ════════════════════════════ */}
      <section className="overflow-hidden" style={{ background: 'linear-gradient(180deg,#EEF7FF 0%,#EEF7FF 60%,#EEF7FF 100%)' }}>

        {/* ── Service tabs ── */}
        <div className="pt-16 lg:pt-22 pb-10 lg:pb-14">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <motion.div
              className="grid grid-cols-3 md:grid-cols-6 gap-3 lg:gap-4"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" whileInView="show" viewport={inView}
            >
              {resolvedServices.map((s, i) => (
                <motion.div key={s.to} variants={fadeUp}>
                  <Link to={s.to} className="block group">
                    {i === 0 ? (
                      /* ── Active tab ── */
                      <div
                        className="relative flex flex-col items-center gap-3 py-7 px-4 rounded-2xl text-center overflow-hidden"
                        style={{ background: 'linear-gradient(145deg,#1a3485 0%,#071A2B 40%,#2148c4 100%)', boxShadow: '0 8px 32px rgba(7,26,43,0.38), inset 0 1px 0 rgba(255,255,255,0.12)' }}
                      >
                        {/* Subtle inner highlight */}
                        <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                        <motion.span
                          className="relative text-white"
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        >{s.icon}</motion.span>
                        <span className="relative text-[11px] font-black tracking-[0.15em] uppercase text-white leading-none">{s.label}</span>
                        {/* Active underline indicator */}
                        <div className="relative w-10 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
                      </div>
                    ) : (
                      /* ── Inactive tab ── */
                      <motion.div
                        className="flex flex-col items-center gap-3 py-7 px-4 rounded-2xl text-center bg-white border border-gray-200/80 cursor-pointer"
                        whileHover={{ y: -3, borderColor: 'rgba(7,26,43,0.25)', boxShadow: '0 6px 24px rgba(7,26,43,0.10)', transition: { duration: 0.2 } }}
                      >
                        <motion.span
                          className="text-[#071A2B]/70 group-hover:text-[#071A2B] transition-colors duration-200"
                          whileHover={{ y: -1, scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                        >{s.icon}</motion.span>
                        <span className="text-[11px] font-black tracking-[0.15em] uppercase text-[#071A2B]/75 group-hover:text-[#071A2B] transition-colors duration-200 leading-none">{s.label}</span>
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Printing content ── */}
        <div className="relative pb-24 lg:pb-32 overflow-hidden">

          {/* ── Background decorations ── */}
          {/* Left blob glow */}
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(7,26,43,0.08) 0%, transparent 68%)' }} />
          {/* Right blob glow */}
          <div className="absolute -right-20 bottom-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(7,26,43,0.05) 0%, transparent 65%)' }} />
          {/* Dot grid — upper right */}
          <svg className="absolute right-12 top-8 w-36 h-36 opacity-60 pointer-events-none" viewBox="0 0 144 144">
            <defs>
              <pattern id="pdots2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="rgba(7,26,43,0.25)" />
              </pattern>
            </defs>
            <rect width="144" height="144" fill="url(#pdots2)" />
          </svg>
          {/* Secondary dot grid — lower right */}
          <svg className="absolute right-24 bottom-16 w-24 h-24 opacity-35 pointer-events-none" viewBox="0 0 96 96">
            <rect width="96" height="96" fill="url(#pdots2)" />
          </svg>
          {/* Curved lines — bottom right */}
          <svg className="absolute bottom-8 right-6 w-72 h-36 pointer-events-none" viewBox="0 0 288 144" fill="none">
            <motion.path d="M 8 132 C 68 108, 160 88, 248 44 S 284 16, 280 8"
              stroke="rgba(7,26,43,0.20)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={inView} transition={{ duration: 1.8, ease: 'easeOut', delay: 0.5 }} />
            <motion.path d="M 8 144 C 72 120, 168 100, 256 56 S 284 28, 282 18"
              stroke="rgba(7,26,43,0.11)" strokeWidth="1" fill="none" strokeDasharray="8 6"
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={inView} transition={{ duration: 2.2, ease: 'easeOut', delay: 0.7 }} />
            <motion.circle cx="280" cy="8" r="4.5" fill="#071A2B" fillOpacity="0.28"
              initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={inView} transition={{ duration: 0.5, delay: 2.1 }} />
          </svg>

          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-14 xl:gap-24 items-center">

              {/* ── LEFT: Editorial print showcase ── */}
              <motion.div
                className="relative"
                style={{ height: '580px' }}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              >
                {/* ── 1. Large portrait: printer producing paper (left anchor) ── */}
                <motion.div
                  className="absolute overflow-hidden group cursor-pointer"
                  style={{ top: 0, left: 0, width: '50%', height: '90%', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.14)', zIndex: 10 }}
                  variants={{ hidden: { opacity: 0, x: -24, y: 12 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.86, ease: 'easeOut' } } }}
                  whileHover={{ y: -6, boxShadow: '0 32px 80px rgba(0,0,0,0.19)', transition: { duration: 0.3 } }}
                >
                  <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    alt="Professional printing machine producing paper"
                    src={str(printingSection, 'image_main', '') || media('https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=600&h=1100&fit=crop&auto=format')} />
                  {/* Very light vignette only */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(10,22,64,0.10) 100%)' }} />
                </motion.div>

                {/* ── 2. Tall narrow: overlaps RIGHT edge of large image ── */}
                {/* left:43% so it overlaps the large (50% wide) by 7% */}
                <motion.div
                  className="absolute overflow-hidden group cursor-pointer"
                  style={{ top: -10, left: '43%', width: '33%', height: '60%', borderRadius: 16, boxShadow: '0 18px 52px rgba(0,0,0,0.18)', zIndex: 20 }}
                  variants={{ hidden: { opacity: 0, x: 22, y: -16 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.78, ease: 'easeOut' } } }}
                  whileHover={{ y: -6, boxShadow: '0 26px 64px rgba(0,0,0,0.22)', transition: { duration: 0.3 } }}
                >
                  <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    alt="CMYK color calibration test sheet"
                    src={str(printingSection, 'image_color', '') || media('https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=540&h=900&fit=crop&auto=format&q=85')} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(10,22,64,0.08) 100%)' }} />
                  {/* Frosted white pill tag */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                    <svg className="w-3 h-3 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] font-bold" style={{ color: '#071A2B' }}>{homeLabel('home_scan_copy', 'Scan & Copy')}</span>
                  </div>
                </motion.div>

                {/* ── 3. Landscape lower-right: finished printed photos ── */}
                {/* right:0, width:62% → left edge at 38%, overlaps bottom of large + narrow */}
                <motion.div
                  className="absolute overflow-hidden group cursor-pointer"
                  style={{ bottom: 0, right: 0, width: '62%', height: '36%', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', zIndex: 15 }}
                  variants={{ hidden: { opacity: 0, x: 16, y: 24 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.76, ease: 'easeOut' } } }}
                  whileHover={{ y: 5, boxShadow: '0 10px 36px rgba(0,0,0,0.18)', transition: { duration: 0.3 } }}
                >
                  <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    alt="Printed color swatches and paper samples"
                    src={str(printingSection, 'image_detail', '') || media('https://images.unsplash.com/photo-1581079289196-67865ea83118?w=820&h=440&fit=crop&auto=format&q=85')} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 50%, rgba(10,22,64,0.05) 100%)' }} />
                  {/* Frosted pill top-right inside landscape */}
                  <div className="absolute top-3.5 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                    <svg className="w-3 h-3 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-bold" style={{ color: '#071A2B' }}>{homeLabel('home_photo_gloss', 'Photo & Gloss Prints')}</span>
                  </div>
                </motion.div>

                {/* ── 4. Floating print-spec pill — bridges overlap zone ── */}
                {/* Positioned at the seam between large (ends 50%) and narrow (starts 43%) */}
                <motion.div
                  className="absolute bg-white rounded-2xl flex items-center gap-3"
                  style={{ top: '44%', left: '34%', padding: '11px 18px 11px 12px', boxShadow: '0 10px 32px rgba(7,26,43,0.22), 0 0 0 1px rgba(7,26,43,0.07)', zIndex: 30 }}
                  variants={{ hidden: { opacity: 0, scale: 0.85, y: 8 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut', delay: 0.78 } } }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#071A2B,#2a52d0)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[12.5px] font-black leading-none whitespace-nowrap" style={{ color: '#0a1428' }}>{homeLabel('home_print_formats', 'A4 • A3 • Color • B&W')}</div>
                    <div className="text-[10px] font-medium mt-1 whitespace-nowrap" style={{ color: 'rgba(7,26,43,0.50)' }}>{homeLabel('home_finishing', 'Lamination · Binding · Gloss')}</div>
                  </div>
                </motion.div>

                {/* ── 5. Same-Day indicator: bottom edge of narrow image ── */}
                <motion.div
                  className="absolute bg-white rounded-xl flex items-center gap-2"
                  style={{ bottom: '37%', right: '3%', padding: '7px 12px', boxShadow: '0 4px 14px rgba(0,0,0,0.09)', border: '1px solid rgba(7,26,43,0.08)', zIndex: 22 }}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.94 } } }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
                  <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: '#071A2B' }}>{homeLabel('home_same_day', 'Same-Day Ready')}</span>
                </motion.div>

              </motion.div>

              {/* ── RIGHT: Content ── */}
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                initial="hidden" whileInView="show" viewport={inView}
              >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-[2.5px] bg-[#071A2B] rounded-full" />
                  <span className="text-[#071A2B] text-[10.5px] font-black tracking-[0.26em] uppercase">{homeLabel('home_core_service', 'Core Service')}</span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  variants={fadeUp}
                  className="font-bold leading-[1.04] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.9rem, 4.5vw, 4.4rem)' }}
                >
                  <span style={{ color: '#08122a' }}>{printingHeading.split('\n')[0] ?? printingHeading}</span><br />
                  {printingHeading.includes('\n') && <span style={{ color: '#071A2B' }}>{printingHeading.split('\n')[1]}</span>}
                </motion.h2>

                {/* Description */}
                <motion.p variants={fadeUp} className="leading-relaxed mb-9 text-[15.5px] max-w-[400px]" style={{ color: 'rgba(30,40,80,0.58)' }}>
                  {printingDesc}
                </motion.p>

                {/* 2-column checklist */}
                <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid grid-cols-2 gap-x-6 gap-y-5 mb-11">
                  {resolvedPrintingItems.map(item => (
                    <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 group/item">
                      <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                        style={{ background: '#dce7ff' }}>
                        <svg className="w-3.5 h-3.5 text-[#071A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#1e2850' }}>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(7,26,43,0.38)' }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block hover-clip rounded-2xl"
                  >
                    <Link
                      to={printingCtaUrl}
                      className="group inline-flex items-center gap-3 text-white font-bold px-10 py-4 rounded-2xl text-[15px] transition-all"
                      style={{ background: 'linear-gradient(135deg,#071A2B 0%,#2445bf 100%)', boxShadow: '0 4px 20px rgba(7,26,43,0.30)' }}
                    >
                      {printingCtaLabel}
                      <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ ASSIGNMENT & ACADEMIC SUPPORT ══════════════════════════════ */}
      <section className="overflow-hidden" style={{ background: 'linear-gradient(175deg,#EEF7FF 0%,#EEF7FF 50%,#EEF7FF 100%)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-14 xl:gap-20 items-center">

            {/* ── LEFT: Content ── */}
            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              initial="hidden" whileInView="show" viewport={inView}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[2.5px] rounded-full" style={{ background: '#071A2B' }} />
                <span className="text-[10.5px] font-black tracking-[0.26em] uppercase" style={{ color: '#071A2B' }}>{homeLabel('home_for_students', 'For Students')}</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                variants={fadeUp}
                className="font-bold leading-[1.05] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.6rem, 4vw, 4rem)', color: '#08122a' }}
              >
                {academicHeading1}<br />
                <span style={{ color: '#071A2B' }}>{academicHeading2}</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="leading-relaxed mb-9 text-[15.5px] max-w-[420px]"
                style={{ color: 'rgba(30,40,80,0.55)' }}
              >
                {academicDesc}
              </motion.p>

              {/* 2-column checklist */}
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.09 } } }}
                className="grid grid-cols-2 gap-x-6 gap-y-5 mb-11"
              >
                {resolvedAcademicItems.map(item => (
                  <motion.div key={item} variants={fadeUp} className="flex items-center gap-3">
                    <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#dce7ff' }}>
                      <svg className="w-3.5 h-3.5" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] font-medium" style={{ color: '#1e2850' }}>{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {/* Primary: Send Assignment (WhatsApp) */}
                <motion.a
                  href={academicWaHref}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-2xl text-[14.5px] transition-all"
                  style={{ background: 'linear-gradient(135deg,#071A2B 0%,#2445bf 100%)', boxShadow: '0 4px 20px rgba(7,26,43,0.28)' }}
                  whileHover={{ y: -3, boxShadow: '0 10px 32px rgba(7,26,43,0.40)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <WaIcon />
                  {academicCtaLabel}
                </motion.a>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Academic document board ── */}
            <motion.div
              className="relative"
              style={{ height: '580px' }}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={{ show: { transition: { staggerChildren: 0.14 } } }}
            >
              {/* Stacked paper shadows behind main card — give illusion of depth/pile */}
              <div className="absolute pointer-events-none" style={{ top: '1%', left: '1%', width: '56%', height: '58%', borderRadius: '14px', background: 'rgba(210,220,255,0.55)', transform: 'rotate(5deg)', zIndex: 1 }} />
              <div className="absolute pointer-events-none" style={{ top: '0.5%', left: '0.5%', width: '56%', height: '58%', borderRadius: '14px', background: 'rgba(220,230,255,0.40)', transform: 'rotate(2.5deg)', zIndex: 2 }} />

              {/* ── 1. Main image: large framed document stack (no rotation — anchor) ── */}
              <motion.div
                className="absolute group cursor-pointer"
                style={{ top: 0, left: 0, width: '56%', height: '58%', zIndex: 10 }}
                variants={{ hidden: { opacity: 0, x: -18, y: 10 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.90, ease: 'easeOut' } } }}
                whileHover={{ y: -5, transition: { duration: 0.28 } }}
              >
                <div className="absolute inset-0 bg-white" style={{ borderRadius: '20px', padding: '10px 10px 32px 10px', boxShadow: '0 22px 60px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div className="w-full h-full overflow-hidden" style={{ borderRadius: '12px' }}>
                    <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      alt="Stacked academic project folders and documents"
                      src={str(academicSection, 'image_main', '') || media('https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=640&h=700&fit=crop&auto=format')} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: '32px' }}>
                    <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'rgba(7,26,43,0.52)' }}>{homeLabel('home_project_folders', 'Project Folders & Reports')}</span>
                  </div>
                </div>
                {/* Paper tab tag pinned at top */}
                <div className="absolute -top-3.5 left-6 flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: '#EEF7FF', border: '1px solid rgba(7,26,43,0.20)', boxShadow: '0 3px 10px rgba(7,26,43,0.12)' }}>
                  <svg className="w-3 h-3 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[10px] font-black" style={{ color: '#071A2B' }}>{homeLabel('home_thesis_reports', 'Thesis & Reports')}</span>
                </div>
              </motion.div>

              {/* ── 2. Top-right card: printed papers, tilted +3.5° ── */}
              {/* Overlaps right edge of main (main ends at 56%, this starts at 50%) */}
              <motion.div
                className="absolute group cursor-pointer"
                style={{ top: '4%', right: '0%', width: '44%', height: '45%', zIndex: 8 }}
                variants={{ hidden: { opacity: 0, x: 20, rotate: 7 }, show: { opacity: 1, x: 0, rotate: 3.5, transition: { duration: 0.76, ease: 'easeOut' } } }}
                whileHover={{ rotate: 0, y: -4, boxShadow: '0 18px 48px rgba(0,0,0,0.14)', transition: { duration: 0.25 } }}
              >
                <div className="absolute inset-0 bg-white" style={{ borderRadius: '16px', padding: '8px 8px 26px 8px', boxShadow: '0 14px 44px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)' }}>
                  <div className="w-full h-full overflow-hidden" style={{ borderRadius: '10px' }}>
                    <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      alt="Printed assignment papers stacked"
                      src={str(academicSection, 'image_secondary', '') || media('https://images.unsplash.com/photo-1631557777127-6495c07ba6b9?w=440&h=360&fit=crop&auto=format')} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: '26px' }}>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'rgba(7,26,43,0.48)' }}>{homeLabel('home_assignments_reports', 'Assignments & Reports')}</span>
                  </div>
                </div>
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: '#EEF7FF', border: '1px solid rgba(7,26,43,0.18)' }}>
                  <svg className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[9px] font-black" style={{ color: '#071A2B' }}>{homeLabel('home_assignment_label', 'Assignment')}</span>
                </div>
              </motion.div>

              {/* ── 3. Bottom-right card: open notebook, tilted –3° ── */}
              <motion.div
                className="absolute group cursor-pointer"
                style={{ bottom: '1%', right: '0%', width: '42%', height: '50%', zIndex: 9 }}
                variants={{ hidden: { opacity: 0, x: 16, y: 16, rotate: -6 }, show: { opacity: 1, x: 0, y: 0, rotate: -3, transition: { duration: 0.74, ease: 'easeOut' } } }}
                whileHover={{ rotate: 0, y: -4, transition: { duration: 0.25 } }}
              >
                <div className="absolute inset-0 bg-white" style={{ borderRadius: '16px', padding: '8px 8px 26px 8px', boxShadow: '0 14px 44px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05)' }}>
                  <div className="w-full h-full overflow-hidden" style={{ borderRadius: '10px' }}>
                    <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      alt="Open notebook with pen on desk"
                      src={str(academicSection, 'image_tertiary', '') || media('https://images.unsplash.com/photo-1772396867158-e26d9e6256b2?w=440&h=480&fit=crop&auto=format')} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: '26px' }}>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'rgba(7,26,43,0.48)' }}>{homeLabel('home_editing_formatting', 'Editing & Formatting')}</span>
                  </div>
                </div>
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: '#EEF7FF', border: '1px solid rgba(7,26,43,0.18)' }}>
                  <svg className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-[9px] font-black" style={{ color: '#071A2B' }}>{homeLabel('home_typing_label', 'Typing')}</span>
                </div>
              </motion.div>

              {/* ── 4. Bottom-left: spiral notebook, landscape, tilted +2° ── */}
              {/* Overlaps bottom of main (main: height 58%, this starts from bottom) */}
              <motion.div
                className="absolute group cursor-pointer"
                style={{ bottom: '1%', left: '0%', width: '56%', height: '40%', zIndex: 7 }}
                variants={{ hidden: { opacity: 0, y: 16, rotate: -2 }, show: { opacity: 1, y: 0, rotate: 2, transition: { duration: 0.70, ease: 'easeOut' } } }}
                whileHover={{ rotate: 0, y: 4, transition: { duration: 0.28 } }}
              >
                <div className="absolute inset-0 bg-white" style={{ borderRadius: '16px', padding: '8px 8px 26px 8px', boxShadow: '0 10px 36px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)' }}>
                  <div className="w-full h-full overflow-hidden" style={{ borderRadius: '10px' }}>
                    <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      alt="Spiral bound notebook open"
                      src={str(academicSection, 'image_wide', '') || media('https://images.unsplash.com/photo-1773453219454-9940ac4256cf?w=600&h=320&fit=crop&auto=format')} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: '26px' }}>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'rgba(7,26,43,0.48)' }}>{homeLabel('home_spiral_binding', 'Spiral & Ring Binding')}</span>
                  </div>
                </div>
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: '#EEF7FF', border: '1px solid rgba(7,26,43,0.18)' }}>
                  <svg className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#071A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[9px] font-black" style={{ color: '#071A2B' }}>{homeLabel('home_binding_label', 'Binding')}</span>
                </div>
              </motion.div>

              {/* ── Floating badge: "Print • Bind • Submit" ── */}
              <motion.div
                className="absolute bg-white rounded-2xl"
                style={{ top: '53%', left: '-8px', padding: '11px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.13)', border: '1px solid rgba(7,26,43,0.10)', zIndex: 30 }}
                variants={{ hidden: { opacity: 0, x: -16, scale: 0.88 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.62, ease: 'easeOut' } } }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(22,197,94,0.10)' }}>
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#16c55e' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-black whitespace-nowrap" style={{ color: '#0a1428' }}>{homeLabel('home_print_bind_submit', 'Print • Bind • Submit')}</div>
                    <div className="text-[10px] font-medium whitespace-nowrap mt-0.5" style={{ color: 'rgba(30,40,80,0.46)' }}>{homeLabel('home_ready_submission', 'Ready for Submission')}</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section className="overflow-hidden" style={{ background: 'linear-gradient(180deg,#EEF7FF 0%,#EEF7FF 50%,#EEF7FF 100%)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-36">

          {/* ── Section heading ── */}
          <motion.div className="text-center mb-20 lg:mb-28" variants={staggerSlow} initial="hidden" whileInView="show" viewport={inView}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-5">
              <div className="w-6 h-[2px] rounded-full bg-[#071A2B]" />
              <span className="text-[10.5px] font-black tracking-[0.26em] uppercase text-[#071A2B]">{homeLabel('home_process_label', 'Process')}</span>
              <div className="w-6 h-[2px] rounded-full bg-[#071A2B]" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-bold text-[#08122a] leading-tight"
              style={{ fontSize: 'clamp(2.4rem,4vw,3.8rem)' }}>
              {howHeading}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-[15.5px] max-w-md mx-auto" style={{ color: 'rgba(30,40,80,0.50)' }}>
              {howSubtitle}
            </motion.p>
          </motion.div>

          {/* ── Timeline ── */}
          <div className="relative">

            {/* ── Connecting path (desktop only) ── */}
            <div className="hidden lg:block absolute top-0 left-0 right-0 h-[64px] pointer-events-none">
              {/* Track (grey baseline) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[12.5%] right-[12.5%]">
                <div className="w-full h-[1.5px] rounded-full" style={{ background: 'rgba(7,26,43,0.12)' }} />
              </div>
              {/* Animated blue fill */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[12.5%] right-[12.5%]">
                <div className="w-full overflow-hidden h-[2.5px] rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#071A2B 0%,#3a5fd0 60%,#2a52d0 100%)' }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.6 }}
                  />
                </div>
              </div>
            </div>

            {/* ── Steps grid ── */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-y-0"
              variants={{ show: { transition: { staggerChildren: 0.22 } } }}
              initial="hidden" whileInView="show" viewport={inView}
            >
              {resolvedSteps.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="flex flex-col items-center text-center px-4 lg:px-6 group"
                  variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
                >
                  {/* ── Node ── */}
                  <motion.div
                    className="relative mb-10 flex items-center justify-center"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    {/* Outer pulse ring */}
                    <motion.div
                      className="absolute rounded-full border"
                      style={{ width: 88, height: 88, borderColor: 'rgba(7,26,43,0.15)' }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.22 + 0.4 }}
                    />
                    {/* Main circle */}
                    <motion.div
                      className="relative w-[64px] h-[64px] rounded-full flex items-center justify-center z-10 group-hover:shadow-[0_0_0_6px_rgba(7,26,43,0.10)] transition-shadow duration-300"
                      style={{ background: 'linear-gradient(145deg,#071A2B 0%,#2a52d0 100%)', boxShadow: '0 8px 28px rgba(7,26,43,0.30)' }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.22 + 0.3 }}
                    >
                      <div className="text-white">{step.icon}</div>
                    </motion.div>
                    {/* Step number badge */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center z-20"
                      style={{ borderColor: '#071A2B', fontSize: 9, fontWeight: 900, color: '#071A2B', letterSpacing: '0.02em' }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * 0.22 + 0.55 }}
                    >
                      {step.n}
                    </motion.div>
                  </motion.div>

                  {/* ── Text ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.22 + 0.5 }}
                  >
                    {/* Ghost step number */}
                    <div className="font-black leading-none mb-3 select-none" style={{ fontSize: 60, color: 'rgba(7,26,43,0.045)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: -4 }}>
                      {step.n}
                    </div>
                    <h3 className="text-[17px] font-bold mb-3 leading-snug" style={{ color: '#08122a' }}>
                      {step.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed max-w-[220px] mx-auto" style={{ color: 'rgba(30,40,80,0.52)' }}>
                      {step.body}
                    </p>
                  </motion.div>

                  {/* Mobile step connector (vertical) */}
                  {i < 3 && (
                    <div className="lg:hidden mt-10 w-[1.5px] h-10 rounded-full" style={{ background: 'linear-gradient(180deg,rgba(7,26,43,0.35) 0%,rgba(7,26,43,0.06) 100%)' }} />
                  )}
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* ── Bottom footnote ── */}
          <motion.div
            className="text-center mt-20 lg:mt-24"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            <a
              href={howWaHref}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-[13.5px] font-bold px-7 py-3.5 rounded-2xl border-2 transition-all"
              style={{ borderColor: 'rgba(7,26,43,0.25)', color: '#071A2B' }}
            >
              <WaIcon />
              {howCtaLabel}
              <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ═══ MAKE IT PERSONAL ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#071A2B' }}>

        {/* ── Global background graphics ── */}
        {/* Upper-right electric-blue radial bloom */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(42,82,208,0.22) 0%, transparent 62%)' }} />
        {/* Lower-left faint bloom */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 90%, rgba(7,26,43,0.16) 0%, transparent 60%)' }} />
        {/* Thin horizontal scan line */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '42%', height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(60,100,230,0.18) 30%, rgba(60,100,230,0.18) 70%, transparent 100%)' }} />
        {/* Decorative grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="pgrid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(100,140,255,1)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pgrid)" />
        </svg>
        {/* Animated blue corner accent line */}
        <svg className="absolute top-0 right-0 w-64 h-64 pointer-events-none" viewBox="0 0 256 256" fill="none">
          <motion.path d="M 256 0 L 256 120 Q 256 180 196 200 L 80 256"
            stroke="rgba(60,100,230,0.30)" strokeWidth="1" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={inView} transition={{ duration: 2, ease: 'easeOut', delay: 0.4 }} />
        </svg>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-36 relative z-10">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-12 xl:gap-16 items-center">

            {/* ── LEFT: Copy ── */}
            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              initial="hidden" whileInView="show" viewport={inView}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[2px] rounded-full" style={{ background: 'rgba(60,100,230,0.80)' }} />
                <span className="text-[10.5px] font-black tracking-[0.28em] uppercase" style={{ color: '#5a84f0' }}>{homeLabel('home_customized_label', 'Customized Printing')}</span>
              </motion.div>

              {/* Heading */}
              <motion.h2 variants={fadeUp} className="font-bold leading-[1.04] tracking-tight mb-6" style={{ fontSize: 'clamp(2.8rem,4.5vw,4.4rem)' }}>
                <span className="text-white">{customHeading1}</span><br />
                <span style={{ color: '#5a84f0' }}>{customHeading2}</span>
              </motion.h2>

              {/* Description */}
              <motion.p variants={fadeUp} className="leading-relaxed mb-8 text-[15px] max-w-[380px]" style={{ color: 'rgba(255,255,255,0.48)' }}>
                {customDesc}
              </motion.p>

              {/* Service list */}
              <motion.ul variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-3.5 mb-11">
                {resolvedCustomItems.map(item => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(60,100,230,0.18)', border: '1px solid rgba(60,100,230,0.30)' }}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#5a84f0' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.68)' }}>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA */}
              <motion.div variants={fadeUp}>
                <motion.div whileHover={{ y: -3, boxShadow: '0 10px 36px rgba(60,100,230,0.45)' }} whileTap={{ scale: 0.97 }} className="inline-block hover-clip rounded-2xl">
                  <Link
                    to={customCtaUrl}
                    className="group inline-flex items-center gap-3 text-white font-bold px-9 py-4 rounded-2xl text-[15px] transition-all"
                    style={{ background: 'linear-gradient(135deg,#071A2B 0%,#3a5fd0 100%)', boxShadow: '0 4px 22px rgba(60,100,230,0.32)' }}
                  >
                    {customCtaLabel}
                    <svg className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Editorial product collage ── */}
            <motion.div
              className="relative"
              style={{ height: '600px' }}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={{ show: { transition: { staggerChildren: 0.14 } } }}
            >
              {/* Decorative "Make It Yours" ghost text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
                <span className="font-bold italic whitespace-nowrap" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'rgba(60,100,230,0.06)', letterSpacing: '-0.03em' }}>
                  Make It Yours
                </span>
              </div>

              {/* Subtle glow behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(42,82,208,0.14) 0%, transparent 65%)', zIndex: 1 }} />

              {/* ── Card 1: HERO — custom mug (center-left, large) ── */}
              <motion.div
                className="absolute z-20 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ top: '8%', left: '4%', width: '46%', height: '58%', transform: 'rotate(-1.5deg)', boxShadow: '0 24px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.07)' }}
                variants={{ hidden: { opacity: 0, scale: 0.88, rotate: -4 }, show: { opacity: 1, scale: 1, rotate: -1.5, transition: { duration: 0.85, ease: 'easeOut' } } }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.03, rotate: 0, boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(90,132,240,0.35)', transition: { duration: 0.3 } }}
              >
                <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" alt="Custom printed mug"
                  src={str(customizedSection, 'image_main', '') || media('https://images.unsplash.com/photo-1680337673561-531bca1cf5b7?w=560&h=700&fit=crop&auto=format')} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 50%, rgba(6,12,31,0.60) 100%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-[12px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{homeLabel('home_photo_mugs', 'Photo Mugs & Gifts')}</div>
                </div>
              </motion.div>

              {/* ── Card 2: Business cards (top-right) ── */}
              <motion.div
                className="absolute z-10 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ top: '0%', right: '0%', width: '42%', height: '38%', transform: 'rotate(2.5deg)', boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' }}
                variants={{ hidden: { opacity: 0, x: 30, y: -20 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: 'easeOut' } } }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                whileHover={{ scale: 1.04, rotate: 0, boxShadow: '0 24px 56px rgba(0,0,0,0.70), 0 0 0 1.5px rgba(90,132,240,0.30)', transition: { duration: 0.3 } }}
              >
                <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" alt="Printed business cards"
                  src={str(customizedSection, 'image_2', '') || media('https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=480&h=320&fit=crop&auto=format')} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(6,12,31,0.65) 100%)' }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold text-[11px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{homeLabel('home_business_cards', 'Business Cards & Letterheads')}</div>
                </div>
              </motion.div>

              {/* ── Card 3: Framed photos (mid-right) ── */}
              <motion.div
                className="absolute z-15 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ top: '36%', right: '2%', width: '40%', height: '36%', transform: 'rotate(-2deg)', boxShadow: '0 14px 44px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)', zIndex: 15 }}
                variants={{ hidden: { opacity: 0, x: 24, y: 12 }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: 'easeOut' } } }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                whileHover={{ scale: 1.04, rotate: 0, boxShadow: '0 22px 56px rgba(0,0,0,0.70), 0 0 0 1.5px rgba(90,132,240,0.28)', transition: { duration: 0.3 } }}
              >
                <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" alt="Photo frames and printed photos"
                  src={str(customizedSection, 'image_3', '') || media('https://images.unsplash.com/photo-1572512083030-840a84affc83?w=480&h=320&fit=crop&auto=format')} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(6,12,31,0.60) 100%)' }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold text-[11px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{homeLabel('home_photo_frames', 'Photo Frames & Prints')}</div>
                </div>
              </motion.div>

              {/* ── Card 4: Sticker roll (bottom-left) ── */}
              <motion.div
                className="absolute z-25 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ bottom: '0%', left: '6%', width: '38%', height: '32%', transform: 'rotate(1.5deg)', boxShadow: '0 12px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)', zIndex: 25 }}
                variants={{ hidden: { opacity: 0, y: 24, x: -10 }, show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                whileHover={{ scale: 1.04, rotate: 0, boxShadow: '0 20px 52px rgba(0,0,0,0.70), 0 0 0 1.5px rgba(90,132,240,0.28)', transition: { duration: 0.3 } }}
              >
                <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" alt="Custom sticker labels"
                  src={str(customizedSection, 'image_4', '') || media('https://images.unsplash.com/photo-1780444078356-5ca1e9efe6b8?w=440&h=300&fit=crop&auto=format')} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(6,12,31,0.68) 100%)' }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold text-[11px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{homeLabel('home_custom_stickers', 'Custom Stickers & Labels')}</div>
                </div>
              </motion.div>

              {/* ── Card 5: Branded sticker mug (bottom-right) ── */}
              <motion.div
                className="absolute rounded-2xl overflow-hidden group cursor-pointer"
                style={{ bottom: '2%', right: '4%', width: '34%', height: '28%', transform: 'rotate(-1deg)', boxShadow: '0 10px 36px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.07)', zIndex: 12 }}
                variants={{ hidden: { opacity: 0, y: 20, x: 16 }, show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2.8 }}
                whileHover={{ scale: 1.04, rotate: 0, boxShadow: '0 18px 48px rgba(0,0,0,0.65), 0 0 0 1.5px rgba(90,132,240,0.25)', transition: { duration: 0.3 } }}
              >
                <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" alt="Branded merchandise"
                  src={str(customizedSection, 'image_5', '') || media('https://images.unsplash.com/photo-1617912760717-06f3976cf18c?w=400&h=280&fit=crop&auto=format')} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(6,12,31,0.62) 100%)' }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold text-[11px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{homeLabel('home_branded_merch', 'Branded Merchandise')}</div>
                </div>
              </motion.div>

              {/* ── Floating "Your Idea, Printed" accent badge ── */}
              <motion.div
                className="absolute z-30 rounded-xl"
                style={{ top: '48%', left: '-8px', background: 'rgba(10,20,58,0.92)', border: '1px solid rgba(60,100,230,0.35)', padding: '10px 16px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 28px rgba(0,0,0,0.40)', zIndex: 30 }}
                variants={{ hidden: { opacity: 0, x: -16, scale: 0.88 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } } }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(60,100,230,0.25)' }}>
                    <svg className="w-3.5 h-3.5" style={{ color: '#5a84f0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-bold italic whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.88)' }}>{homeLabel('home_your_idea_printed', 'Your Idea, Printed.')}</span>
                </div>
              </motion.div>

              {/* ── Thin decorative connecting line ── */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.line x1="35" y1="35" x2="58" y2="58"
                  stroke="rgba(60,100,230,0.20)" strokeWidth="0.3" strokeDasharray="2 3"
                  initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={inView} transition={{ duration: 1.4, ease: 'easeOut', delay: 1 }} />
                <motion.line x1="58" y1="32" x2="58" y2="58"
                  stroke="rgba(60,100,230,0.15)" strokeWidth="0.3" strokeDasharray="2 3"
                  initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={inView} transition={{ duration: 1.2, ease: 'easeOut', delay: 1.3 }} />
              </svg>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES UNIVERSE ══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 overflow-hidden relative" style={{ background: '#EEF7FF' }}>
        {/* Large faint watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[clamp(80px,16vw,200px)] font-black tracking-widest leading-none" style={{ color: 'rgba(7,26,43,0.035)', letterSpacing: '0.2em' }}>{homeLabel('home_services_watermark', 'SERVICES')}</span>
        </div>
        {/* Connecting blue path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
          <motion.path d="M 200 120 C 360 80, 480 300, 640 200 S 900 350, 1100 280"
            stroke="rgba(0,174,239,0.12)" strokeWidth="2" fill="none" strokeDasharray="8 6"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={inView} transition={{ duration: 2.4, ease: 'easeInOut' }} />
        </svg>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div className="text-center mb-16" variants={staggerSlow} initial="hidden" whileInView="show" viewport={inView}>
            <motion.p variants={fadeUp} className="text-[#00AEEF] font-bold text-xs tracking-[0.22em] uppercase mb-3">{servicesShowcaseEyebrow}</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-[#090B0D]">{servicesShowcaseHeading}</motion.h2>
          </motion.div>

          {/* Asymmetric service universe: flexbox columns on desktop */}
          <motion.div className="flex flex-col lg:flex-row gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={inView}>

            {/* ── LEFT: Featured Printing card ── */}
            <motion.div variants={fadeUp} className="group relative rounded-3xl overflow-hidden cursor-pointer h-[420px] lg:h-auto w-full lg:w-[42%] flex-shrink-0"
              whileHover={{ y: -4, transition: { duration: 0.28 } }}>
              <img loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                alt={featuredShowcaseService.title} src={featuredShowcaseService.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/90 via-[#071A2B]/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="inline-flex items-center gap-1.5 mb-3 w-fit rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(0,174,239,0.22)', color: '#8fa8f0', border: '1px solid rgba(0,174,239,0.3)' }}>{servicesPopularBadge}</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{featuredShowcaseService.title}</h3>
                <p className="text-white/60 text-sm mb-5 max-w-xs leading-relaxed">{featuredShowcaseService.description}</p>
                <Link to={featuredShowcaseService.to} className="inline-flex items-center gap-2 font-bold text-sm text-white group-hover:text-[#8fa8f0] transition-colors btn-arrow">
                  {servicesFeaturedLinkLabel} <span className="arrow-icon">→</span>
                </Link>
              </div>
            </motion.div>

            {/* ── CENTER: Two stacked medium cards ── */}
            <div className="flex flex-col gap-4 flex-shrink-0 lg:w-[34%]">
              {[
                showcaseService(resolvedShowcaseSlugs[1] || 'assignment-printing-binding', { title: 'Student Assignments', tag: 'Academic', description: 'Typing, formatting, binding and projects.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&h=480&fit=crop&auto=format', to: '/services/assignment-printing-binding' }),
                showcaseService(resolvedShowcaseSlugs[2] || 'customized-printing', { title: 'Customized Printing', tag: 'Gifts & Branding', description: 'Mugs, cards, stickers, frames and more.', image: 'https://images.unsplash.com/photo-1682339374155-6fdc4869a75b?w=700&h=480&fit=crop&auto=format', to: '/services/customized-printing' }),
              ].map(card => (
                <motion.div key={card.title} variants={fadeUp}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer flex-1 h-[200px] lg:h-auto"
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}>
                  <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    alt={card.title} src={card.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/88 via-[#071A2B]/50 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-[#8fa8f0] text-[10px] font-black tracking-widest uppercase mb-1.5">{card.tag}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                    <p className="text-white/55 text-xs mb-3">{card.description}</p>
                    <Link to={card.to} className="text-white/75 hover:text-white font-bold text-xs btn-arrow inline-flex items-center gap-1 transition-colors">
                      {servicesMediumLinkLabel} <span className="arrow-icon">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── RIGHT: Three tall narrow cards ── */}
            <div className="flex flex-col gap-4 flex-shrink-0 lg:w-[24%]">
              {[
                showcaseService(resolvedShowcaseSlugs[3] || 'nadra-biometric-public-facilitation', { title: 'NADRA & Biometric', tag: 'Facilitation', description: 'Public facilitation', image: 'https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=400&h=400&fit=crop&auto=format', to: '/services/nadra-biometric-public-facilitation' }),
                showcaseService(resolvedShowcaseSlugs[4] || 'legal-documentation', { title: 'Legal Documentation', tag: 'Documents', description: 'Affidavits & attestation', image: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=400&h=400&fit=crop&auto=format', to: '/services/legal-documentation' }),
                showcaseService(resolvedShowcaseSlugs[5] || 'business-documentation', { title: 'Business Services', tag: 'Enterprise', description: 'Registration & branding', image: 'https://images.unsplash.com/photo-1775163024488-e88e4a71179f?w=400&h=400&fit=crop&auto=format', to: '/services/business-documentation' }),
              ].map(card => (
                <motion.div key={card.title} variants={fadeUp}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer flex-1 h-[160px] lg:h-auto"
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}>
                  <img loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    alt={card.title} src={card.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/90 to-[#090B0D]/25" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <span className="text-[#8fa8f0] text-[9px] font-black tracking-widest uppercase mb-1">{card.tag}</span>
                    <h3 className="text-sm font-bold text-white mb-0.5 leading-snug">{card.title}</h3>
                    <p className="text-white/45 text-[10px] mb-2">{card.description}</p>
                    <Link to={card.to} className="text-white/65 hover:text-white font-bold text-[10px] btn-arrow inline-flex items-center gap-0.5 transition-colors">
                      {servicesSmallLinkLabel} <span className="arrow-icon">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="text-center mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView}>
            <Link to={servicesViewAllUrl}
              className="inline-flex items-center gap-2 border-2 border-[#071A2B] text-[#071A2B] hover:bg-[#071A2B] hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all btn-arrow">
              {servicesViewAllLabel} <span className="arrow-icon">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY MATEEN — PROOF WALL ════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden relative">
        {/* Subtle background radial */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 70% 50%, rgba(7,26,43,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          {/* Centered heading */}
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" variants={staggerSlow} initial="hidden" whileInView="show" viewport={inView}>
            <motion.p variants={fadeUp} className="text-[#00AEEF] font-bold text-xs tracking-[0.22em] uppercase mb-4">{whyEyebrow}</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#090B0D] mb-5 leading-[1.05] tracking-tight">
              {whyHeading1}<br />{whyHeading2}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed text-lg">
              {whyDescription}
            </motion.p>
          </motion.div>

          {/* Benefits + image strip layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">

            {/* ── BENEFITS GRID: 2×3 ── */}
            <motion.div
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={stagger} initial="hidden" whileInView="show" viewport={inView}
            >
              {resolvedWhyItems.map((b, i) => (
                <motion.div key={b.title} variants={fadeUp}
                  className="group relative p-6 rounded-2xl overflow-hidden isolate border border-gray-100/80 hover:border-[#071A2B]/20 hover:shadow-lg transition-all duration-300 cursor-default"
                  style={{ background: i % 2 === 0 ? '#EEF7FF' : '#EEF7FF' }}
                  whileHover={{ y: -4, transition: { duration: 0.22 } }}
                >
                  {/* Number marker */}
                  <div className="absolute top-4 right-5 text-[11px] font-black tracking-widest" style={{ color: 'rgba(7,26,43,0.10)' }}>{b.n}</div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#071A2B] group-hover:text-white"
                    style={{ background: '#EEF7FF', color: '#071A2B' }}>
                    <BenefitIcon name={b.icon_key} />
                  </div>
                  <div className="font-bold text-[#090B0D] mb-1.5 text-base">{b.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{b.body}</div>
                  {/* Hover blue accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl bg-[#071A2B] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.div>
              ))}
            </motion.div>

            {/* ── IMAGE STRIP ── */}
            <motion.div className="hidden lg:flex flex-col gap-4 w-[300px] flex-shrink-0" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ duration: 0.82 }}>
              {/* Tall image */}
              <div className="relative rounded-3xl overflow-hidden flex-1 shadow-xl">
                <img loading="lazy" className="w-full h-full object-cover"
                  alt={whyImageAlt} src={whyImage} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-white font-bold text-sm mb-1">{whyImageHeading}</div>
                  <div className="text-white/55 text-xs">{whyImageSubtext}</div>
                </div>
              </div>
              {/* CTA card */}
              <div className="bg-[#071A2B] rounded-2xl p-5">
                <div className="text-white font-bold text-sm mb-2">{whyCtaHeading}</div>
                <div className="flex flex-col gap-2">
                  <a href={whyWaHref} target="_blank" rel="noopener noreferrer"
                    className="bg-[#25D366] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[#1ebc5a]">
                    <WaIcon /> {whyWaLabel}
                  </a>
                  <Link to={whyOrderUrl}
                    className="border border-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center transition-colors hover:bg-white/10">
                    {whyOrderLabel}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WHO WE SERVE — PREMIUM AUDIENCE PANELS ════════════════════ */}
      <section className="py-24 lg:py-32 overflow-hidden relative bg-white">
        {/* Faint watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[clamp(64px,12vw,160px)] font-black tracking-[0.3em] leading-none" style={{ color: 'rgba(7,26,43,0.028)' }}>{homeLabel('home_community_watermark', 'COMMUNITY')}</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div className="text-center mb-14" variants={staggerSlow} initial="hidden" whileInView="show" viewport={inView}>
            <motion.p variants={fadeUp} className="text-[#00AEEF] font-bold text-xs tracking-[0.22em] uppercase mb-3">{whoServeEyebrow}</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-[#090B0D]">{whoServeHeading}</motion.h2>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={inView}>
            {resolvedServePanels.map((panel, idx) => (
              <motion.div key={idx} variants={fadeUp}
                className="group relative rounded-[28px] overflow-hidden cursor-default"
                style={{ height: '580px', boxShadow: '0 24px 64px rgba(5,12,40,0.14)' }}
                whileHover={{ y: -8, transition: { duration: 0.32, ease: 'easeOut' } }}
              >
                <img loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.07]"
                  alt={panel.image_alt || panel.title}
                  src={panel.image} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,12,40,0.96) 0%, rgba(8,16,44,0.70) 38%, rgba(0,0,0,0.12) 70%, transparent 100%)' }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(7,26,43,0.18) 0%, transparent 60%)' }} />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[28px] group-hover:opacity-100 opacity-0 transition-opacity duration-400" style={{ background: 'linear-gradient(to bottom, #00AEEF, #071A2B)' }} />
                <div className="absolute top-7 right-7 text-[10px] font-black tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.20)' }}>{String(idx + 1).padStart(2, '0')}</div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-1.5 mb-5 transition-all duration-400" style={{ transform: 'translateY(4px)' }}>
                    {(panel.tags ?? []).map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold text-white transition-colors duration-300"
                        style={{ background: 'rgba(0,174,239,0.28)', border: '1px solid rgba(0,174,239,0.38)', backdropFilter: 'blur(4px)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="w-8 h-[2px] mb-4 rounded-full" style={{ background: '#00AEEF' }} />
                  <h3 className="text-3xl font-bold text-white mb-2.5 leading-tight transition-transform duration-400 group-hover:-translate-y-1">
                    {panel.title.split('\n').map((line, li) => li === 0 ? line : <span key={li}><br />{line}</span>)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                    {panel.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════════════ */}
      {homeFaqItems.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-10">
              <p className="text-xs font-black tracking-[0.22em] uppercase text-[#00AEEF] mb-3">{homeFaqEyebrow}</p>
              <h2 className="font-bold text-[#090B0D] text-3xl lg:text-5xl">{homeFaqHeading}</h2>
              {homeFaqDescription && <p className="text-[#6b7280] mt-4 max-w-2xl mx-auto leading-relaxed">{homeFaqDescription}</p>}
            </div>
            <div className="space-y-3">
              {homeFaqItems.map((item, index) => (
                <details key={index} className="group rounded-2xl border border-[#e8edf8] bg-[#EEF7FF]/45 px-5 py-4">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold text-[#090B0D]">
                    <span>{item.question}</span><span className="text-[#00AEEF] text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="pt-3 pr-8 text-sm leading-relaxed text-[#6b7280]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FINAL CTA — HIGH-CONVERSION CLOSE ═════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#071A2B', paddingTop: '88px', paddingBottom: '88px' }}>

        {/* ── Layer 0: Deep radial glows ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '1000px', height: '500px', background: 'radial-gradient(ellipse, rgba(7,26,43,0.36) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '480px', height: '260px', background: 'radial-gradient(ellipse, rgba(0,174,239,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          {/* Soft side glows */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(7,26,43,0.18) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        {/* ── Layer 1: Fine grid ── */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
          <defs>
            <pattern id="ctaGrid2" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M 52 0 L 0 0 0 52" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaGrid2)" />
        </svg>

        {/* ── Layer 2: Flowing lines ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
          <motion.path d="M -80 480 C 200 420, 420 520, 680 440 S 1080 360, 1520 410"
            stroke="rgba(0,174,239,0.15)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={inView} transition={{ duration: 2.6, ease: 'easeInOut' }} />
          <motion.path d="M -80 160 C 240 130, 500 200, 760 150 S 1200 90, 1520 130"
            stroke="rgba(0,174,239,0.10)" strokeWidth="1" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={inView} transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.3 }} />
          <motion.path d="M 200 580 C 500 560, 700 540, 1000 560 S 1300 580, 1520 570"
            stroke="rgba(0,174,239,0.07)" strokeWidth="1" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={inView} transition={{ duration: 3.0, ease: 'easeInOut', delay: 0.5 }} />
        </svg>

        {/* ── Layer 3: Floating document outlines ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large doc — top left */}
          <motion.div
            className="absolute rounded-2xl"
            style={{ top: '6%', left: '-3%', width: '220px', height: '290px', border: '1px solid rgba(0,174,239,0.14)', background: 'rgba(7,26,43,0.07)' }}
            animate={{ y: [0, -10, 0], rotate: ['-6deg', '-5deg', '-6deg'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {[0,1,2,3,4].map(i => (
              <div key={i} className="absolute left-6 right-6 h-px rounded-full" style={{ top: `${28 + i * 18}%`, background: 'rgba(0,174,239,0.18)' }} />
            ))}
            {/* Stamp circle */}
            <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full" style={{ border: '1.5px solid rgba(0,174,239,0.20)' }} />
          </motion.div>
          {/* Small doc — top right */}
          <motion.div
            className="absolute rounded-xl"
            style={{ top: '8%', right: '-2%', width: '170px', height: '210px', border: '1px solid rgba(0,174,239,0.12)', background: 'rgba(7,26,43,0.06)' }}
            animate={{ y: [0, 12, 0], rotate: ['5deg', '6deg', '5deg'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            {[0,1,2,3].map(i => (
              <div key={i} className="absolute left-5 right-5 h-px rounded-full" style={{ top: `${24 + i * 18}%`, background: 'rgba(0,174,239,0.14)' }} />
            ))}
          </motion.div>
          {/* Mid-left: landscape page */}
          <motion.div
            className="absolute rounded-xl"
            style={{ top: '42%', left: '2%', width: '150px', height: '100px', border: '1px solid rgba(0,174,239,0.09)', background: 'rgba(7,26,43,0.04)', transform: 'rotate(-3deg)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
          >
            {[0,1].map(i => (
              <div key={i} className="absolute left-4 right-4 h-px" style={{ top: `${36 + i * 24}%`, background: 'rgba(0,174,239,0.12)' }} />
            ))}
          </motion.div>
          {/* Mid-right: tall narrow */}
          <motion.div
            className="absolute rounded-xl"
            style={{ top: '35%', right: '3%', width: '110px', height: '160px', border: '1px solid rgba(0,174,239,0.09)', background: 'rgba(7,26,43,0.04)', transform: 'rotate(4deg)' }}
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {[0,1,2].map(i => (
              <div key={i} className="absolute left-3 right-3 h-px" style={{ top: `${28 + i * 20}%`, background: 'rgba(0,174,239,0.11)' }} />
            ))}
          </motion.div>
          {/* Bottom-left horizontal document */}
          <motion.div
            className="absolute rounded-xl"
            style={{ bottom: '8%', left: '6%', width: '180px', height: '130px', border: '1px solid rgba(0,174,239,0.10)', background: 'rgba(7,26,43,0.05)', transform: 'rotate(3deg)' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            {[0,1].map(i => (
              <div key={i} className="absolute left-5 right-5 h-px" style={{ top: `${38 + i * 22}%`, background: 'rgba(0,174,239,0.13)' }} />
            ))}
          </motion.div>
          {/* Bottom-right tiny doc */}
          <motion.div
            className="absolute rounded-lg"
            style={{ bottom: '12%', right: '5%', width: '110px', height: '140px', border: '1px solid rgba(0,174,239,0.09)', background: 'rgba(7,26,43,0.04)', transform: 'rotate(-4deg)' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            {[0,1,2].map(i => (
              <div key={i} className="absolute left-4 right-4 h-px" style={{ top: `${28 + i * 20}%`, background: 'rgba(0,174,239,0.11)' }} />
            ))}
          </motion.div>
        </div>

        {/* ── MAIN CTA CONTENT ── */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div variants={staggerSlow} initial="hidden" whileInView="show" viewport={inView}>

            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 rounded-full" style={{ background: 'rgba(0,174,239,0.40)' }} />
              <p className="font-bold text-xs tracking-[0.28em] uppercase" style={{ color: '#00AEEF' }}>
                {homeLabel('home_final_cta_eyebrow', 'Visit Us · WhatsApp · Order Online')}
              </p>
              <div className="h-px w-12 rounded-full" style={{ background: 'rgba(0,174,239,0.40)' }} />
            </motion.div>

            {/* Heading */}
            <motion.h2 variants={fadeUp}
              className="font-bold leading-[1.04] tracking-tight mb-5"
              style={{ fontSize: 'clamp(48px, 8vw, 88px)', color: 'white' }}>
              {finalCtaHeading1}
            </motion.h2>
            <motion.h2 variants={fadeUp}
              className="font-bold leading-[1.04] tracking-tight mb-8"
              style={{ fontSize: 'clamp(48px, 8vw, 88px)', color: '#00AEEF' }}>
              {finalCtaHeading2}
            </motion.h2>

            {/* Subline */}
            <motion.p variants={fadeUp} className="text-base lg:text-lg mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.46)' }}>
              {finalCtaSubline}
            </motion.p>

            {/* 3 CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
              <motion.a href={finalCtaWaHref} target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-sm text-white transition-all"
                style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.32)' }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(37,211,102,0.42)', transition: { duration: 0.22 } }}
                whileTap={{ scale: 0.97 }}>
                <WaIcon /> {finalCtaWaLabel}
              </motion.a>
              <motion.div className="w-full sm:w-auto" whileHover={{ y: -4, transition: { duration: 0.22 } }}>
                <Link to="/order-online"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-sm text-white transition-all btn-arrow"
                  style={{ background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)', boxShadow: '0 8px 28px rgba(7,26,43,0.42)' }}>
                  Order Online <span className="arrow-icon">→</span>
                </Link>
              </motion.div>
              <motion.a href={finalCtaPhoneHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-sm transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.80)', background: 'rgba(255,255,255,0.04)' }}
                whileHover={{ y: -4, background: 'rgba(255,255,255,0.09)', transition: { duration: 0.22 } }}
                whileTap={{ scale: 0.97 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {finalCtaPhoneLabel}
              </motion.a>
            </motion.div>

            {/* Service ribbon — pill tags */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
              {resolvedServiceTags.map((s, i) => (
                <span key={s} className="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                  style={{
                    background: i % 2 === 0 ? 'rgba(7,26,43,0.28)' : 'rgba(0,174,239,0.14)',
                    border: '1px solid rgba(0,174,239,0.20)',
                    color: 'rgba(255,255,255,0.52)',
                  }}>
                  {s}
                </span>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
