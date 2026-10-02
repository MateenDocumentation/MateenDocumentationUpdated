import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Layout from './Layout';

interface ServiceItem {
  name: string;
  desc?: string;
}

interface RelatedService {
  label: string;
  to: string;
}

interface Props {
  title: string;
  metaTitle: string;
  metaDesc: string;
  breadcrumb: string;
  heroSubtitle: string;
  heroImage: string;
  intro: string;
  services: ServiceItem[];
  note?: string;
  ctaLabel?: string;
  ctaWhatsApp?: string;
  related: RelatedService[];
  children?: React.ReactNode;
}

// ── SVG Icons ──────────────────────────────────────────────────────────────

const WaIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#00AEEF]/50" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const WrenchIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

// ── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
} as const;

const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: 'easeOut' as const } },
} as const;

// ── How We Help Steps ───────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    icon: <UploadIcon />,
    title: 'Send Your File',
    desc: 'Upload or WhatsApp your document — we accept photos, scans, or digital files.',
  },
  {
    num: '02',
    icon: <ClipboardIcon />,
    title: 'Tell Us Your Needs',
    desc: 'Specify size, quantity, color, material, and any special instructions.',
  },
  {
    num: '03',
    icon: <WrenchIcon />,
    title: 'We Prepare It',
    desc: 'Our experienced team handles your order with precision and care.',
  },
  {
    num: '04',
    icon: <TruckIcon />,
    title: 'Collect or Get Delivered',
    desc: 'Pick up from our H-Block office or arrange convenient delivery.',
  },
] as const;

// ── Hero Animated Line ──────────────────────────────────────────────────────

const HeroFlowLine = () => (
  <motion.svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1400 500"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
  >
    <motion.path
      d="M-100 380 C200 200, 400 450, 700 250 S1100 100, 1500 280"
      stroke="url(#heroLineGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.4, ease: 'easeOut', delay: 0.4 }}
    />
    <motion.path
      d="M-100 420 C300 300, 500 480, 800 320 S1200 160, 1500 340"
      stroke="url(#heroLineGrad)"
      strokeWidth="0.7"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.4 }}
      transition={{ duration: 2.8, ease: 'easeOut', delay: 0.7 }}
    />
    <defs>
      <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00AEEF" stopOpacity="0" />
        <stop offset="40%" stopColor="#00AEEF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#00AEEF" stopOpacity="0" />
      </linearGradient>
    </defs>
  </motion.svg>
);

// ── CTA Grid SVG Background ─────────────────────────────────────────────────

const GridBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
    aria-hidden="true"
  >
    <defs>
      <pattern id="ctaGrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00AEEF" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ctaGrid)" />
  </svg>
);

// ── Floating Document Shapes ────────────────────────────────────────────────

const FloatingDocShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[
      { top: '10%', left: '5%', size: 80, rotate: -15, delay: 0 },
      { top: '60%', right: '4%', size: 60, rotate: 20, delay: 0.3 },
      { bottom: '12%', left: '15%', size: 50, rotate: -8, delay: 0.6 },
      { top: '25%', right: '10%', size: 70, rotate: 12, delay: 0.15 },
    ].map((s, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{ top: s.top, left: (s as any).left, right: (s as any).right, bottom: (s as any).bottom }}
        initial={{ opacity: 0, rotate: s.rotate - 10 }}
        animate={{ opacity: 0.06, rotate: s.rotate }}
        transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }}
      >
        <svg
          width={s.size}
          height={s.size * 1.25}
          viewBox="0 0 80 100"
          fill="none"
          stroke="#00AEEF"
          strokeWidth="1.5"
        >
          <path d="M10 10h40l20 20v60H10z" />
          <path d="M50 10v20h20" />
          <path d="M20 50h40M20 62h30M20 74h20" />
        </svg>
      </motion.div>
    ))}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────

export default function ServicePage({
  title,
  metaTitle,
  metaDesc,
  breadcrumb,
  heroSubtitle,
  heroImage,
  intro,
  services,
  note,
  ctaLabel,
  ctaWhatsApp,
  related,
  children,
}: Props) {
  const waMsg = encodeURIComponent(ctaWhatsApp ?? `Hi, I need help with ${title}`);
  const waHref = `https://wa.me/923312478337?text=${waMsg}`;
  const phoneHref = 'tel:+923312478337';
  const orderLink = `/order-online?service=${encodeURIComponent(title)}`;
  const heroUrl = new URL(heroImage, 'https://mateendocumentation.com');
  const heroWidth = Number(heroUrl.searchParams.get('w')) || undefined;
  const heroHeight = Number(heroUrl.searchParams.get('h')) || undefined;
  const isPrintService = /print|photo|card|stationery|design|assignment|business/i.test(title);
  const printStyle = /bulk/i.test(title)
    ? 'bulk'
    : /student|assignment/i.test(title)
      ? 'academic'
      : /custom|card|photo/i.test(title)
        ? 'product'
        : /business|design|branding/i.test(title)
          ? 'business'
          : 'production';

  return (
    <Layout title={metaTitle} description={metaDesc}>

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[500px] flex items-end pb-14 pt-[80px] overflow-hidden bg-[#071A2B]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            width={heroWidth}
            height={heroHeight}
            className="w-full h-full object-cover"
            style={{ opacity: 0.25 }}
            fetchPriority="high"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(7,26,43,0.97) 0%, rgba(7,26,43,0.70) 60%, rgba(7,26,43,0.30) 100%)',
            }}
          />
        </div>

        {/* Animated flowing line */}
        <HeroFlowLine />
        {isPrintService && (
          <div
            className={`absolute top-0 h-1.5 flex z-20 ${printStyle === 'production' ? 'inset-x-0' : 'right-8 w-40'}`}
            aria-hidden="true"
          >
            <span className="flex-1 bg-[#00AEEF]" />
            <span className="flex-1 bg-[#EC008C]" />
            <span className="flex-1 bg-[#FFD400]" />
            <span className="flex-1 bg-[#090B0D]" />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 mb-6 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            aria-label="Breadcrumb"
          >
            {[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/services' },
              { label: breadcrumb, to: null },
            ].map((crumb, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="text-[#00AEEF]/60 text-sm font-medium hover:text-[#00AEEF] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#00AEEF]/90 text-sm font-medium bg-[#00AEEF]/10 px-3 py-0.5 rounded-full border border-[#00AEEF]/20">
                    {crumb.label}
                  </span>
                )}
                {i < arr.length - 1 && <ChevronIcon />}
              </span>
            ))}
          </motion.nav>

          {/* Eyebrow */}
          <motion.p
            className="text-[#00AEEF] text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            Service
          </motion.p>

          {/* Title */}
          <motion.h1
            className="font-bold text-white mb-4 leading-tight"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg max-w-2xl mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.44, ease: 'easeOut' }}
          >
            {/* WhatsApp */}
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg"
              style={{ background: '#25D366', fontFamily: 'Manrope, sans-serif' }}
              whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(37,211,102,0.35)' }}
              whileTap={{ scale: 0.97 }}
            >
              <WaIcon />
              WhatsApp Us
            </motion.a>

            {/* Send Requirement Online */}
            <motion.a
              href={orderLink}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)',
                fontFamily: 'Manrope, sans-serif',
              }}
              whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(0,174,239,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <EnvelopeIcon />
              Send Requirement Online
            </motion.a>

            {/* Call Now */}
            <motion.a
              href={phoneHref}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{
                color: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'Manrope, sans-serif',
              }}
              whileHover={{ y: -3, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
            >
              <PhoneIcon />
              Call Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. INTRO SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT — Intro text */}
            <motion.div
              className="lg:col-span-7"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {/* Accent line */}
              <motion.div
                variants={itemFade}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-10 h-0.5 bg-[#071A2B] rounded-full" />
                <span
                  className="text-xs font-semibold text-[#071A2B] tracking-[0.16em] uppercase"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  About This Service
                </span>
              </motion.div>

              <motion.p
                variants={itemFade}
                className="text-[17px] leading-relaxed text-[#374151]"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                {intro}
              </motion.p>

              {/* Optional note / disclaimer */}
              {note && (
                <motion.div
                  variants={itemFade}
                  className="mt-6 pl-5 py-4 pr-4 rounded-xl border-l-4 border-[#071A2B] bg-[#EEF7FF]"
                >
                  <p className="text-sm text-[#374151] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {note}
                  </p>
                </motion.div>
              )}

              {/* children slot */}
              {children && (
                <motion.div variants={itemFade} className="mt-8">
                  {children}
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT — Hero image */}
            <motion.div
              className="lg:col-span-5"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.14)]">
                <img
                  src={heroImage}
                  alt={title}
                  width={heroWidth}
                  height={heroHeight}
                  className="w-full h-72 lg:h-[420px] object-cover"
                  loading="lazy"
                />

                {isPrintService && printStyle === 'production' && (
                  <div className="absolute inset-5 pointer-events-none" aria-hidden="true">
                    <span className="absolute left-0 top-0 w-8 h-px bg-[#00AEEF]" />
                    <span className="absolute left-0 top-0 h-8 w-px bg-[#00AEEF]" />
                    <span className="absolute right-0 bottom-0 w-8 h-px bg-[#EC008C]" />
                    <span className="absolute right-0 bottom-0 h-8 w-px bg-[#EC008C]" />
                    <span className="absolute right-0 top-0 size-9 rounded-full border border-white/70">
                      <span className="absolute inset-2 rounded-full border border-[#FFD400]" />
                    </span>
                  </div>
                )}

                {isPrintService && printStyle === 'academic' && (
                  <div className="absolute inset-y-0 right-0 flex w-3" aria-hidden="true">
                    <span className="flex-1 bg-[#00AEEF]/85" />
                    <span className="flex-1 bg-[#EC008C]/85" />
                    <span className="flex-1 bg-[#FFD400]/85" />
                  </div>
                )}

                {isPrintService && printStyle === 'product' && (
                  <div className="absolute top-5 right-5 flex -space-x-3 mix-blend-multiply" aria-hidden="true">
                    <span className="size-10 rounded-full bg-[#00AEEF]/75" />
                    <span className="size-10 rounded-full bg-[#EC008C]/70" />
                    <span className="size-10 rounded-full bg-[#FFD400]/75" />
                  </div>
                )}

                {isPrintService && printStyle === 'business' && (
                  <div className="absolute top-5 right-5 grid grid-cols-4 gap-1 bg-[#EEF7FF]/90 p-2 shadow-lg" aria-hidden="true">
                    <span className="size-3 bg-[#00AEEF]" />
                    <span className="size-3 bg-[#EC008C]" />
                    <span className="size-3 bg-[#FFD400]" />
                    <span className="size-3 bg-[#090B0D]" />
                  </div>
                )}

                {isPrintService && printStyle === 'bulk' && (
                  <div
                    className="absolute inset-y-0 right-0 w-24 opacity-45"
                    style={{ backgroundImage: 'radial-gradient(#EEF7FF 1.5px, transparent 1.5px)', backgroundSize: '9px 9px' }}
                    aria-hidden="true"
                  />
                )}

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. SERVICES SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#EEF7FF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Heading */}
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p
              className="text-xs font-semibold text-[#071A2B] tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Available Services
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold text-[#090B0D]"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              What We Offer
            </h2>
          </motion.div>

          {/* Services grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {services.map((svc, i) => (
              <motion.div
                key={i}
                variants={itemFade}
                className="flex items-start gap-3.5 bg-white rounded-2xl p-5 shadow-sm border border-[#e8edf8]"
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(7,26,43,0.08)' }}
              >
                {/* Check circle */}
                <div className="w-6 h-6 rounded-full bg-[#071A2B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#071A2B]">
                    <CheckIcon />
                  </span>
                </div>
                <div>
                  <p
                    className="text-[15px] text-[#1a2744] font-medium leading-snug"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {svc.name}
                  </p>
                  {svc.desc && (
                    <p
                      className="text-[13px] text-[#6b7280] mt-1 leading-relaxed"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {svc.desc}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. HOW WE HELP
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* Heading */}
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p
              className="text-xs font-semibold text-[#071A2B] tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Simple Process
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold text-[#090B0D]"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              How We Help You
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting dashed line — desktop only */}
            <div
              className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-px"
              style={{
                background: 'repeating-linear-gradient(90deg, #071A2B 0px, #071A2B 12px, transparent 12px, transparent 24px)',
                opacity: 0.18,
              }}
              aria-hidden="true"
            />

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {HOW_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  variants={itemFade}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Watermark number */}
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 font-black select-none pointer-events-none leading-none"
                    style={{
                      fontSize: 80,
                      color: 'rgba(7,26,43,0.07)',
                      fontFamily: 'Sora, sans-serif',
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>

                  {/* Icon circle */}
                  <div className="relative w-14 h-14 rounded-2xl bg-[#EEF7FF] border border-[#e8edf8] flex items-center justify-center text-[#071A2B] shadow-sm mb-4 z-10">
                    {step.icon}
                    {/* Small numbered pill */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#071A2B] flex items-center justify-center">
                      <span className="text-white font-bold" style={{ fontSize: 9, fontFamily: 'Manrope, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  <h3
                    className="text-[15px] font-bold text-[#090B0D] mb-2"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[13px] text-[#6b7280] leading-relaxed max-w-[180px]"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. RELATED SERVICES
      ══════════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-16 bg-[#EEF7FF]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

            {/* Label */}
            <motion.div
              className="text-center mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <p
                className="text-xs font-semibold text-[#071A2B] tracking-[0.2em] uppercase mb-3"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Explore More
              </p>
              <h2
                className="text-2xl lg:text-3xl font-bold text-[#090B0D]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                You Might Also Need
              </h2>
            </motion.div>

            {/* Cards */}
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {related.slice(0, 3).map((rel, i) => (
                <motion.div
                  key={i}
                  variants={itemFade}
                  whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(7,26,43,0.1)' }}
                  className="group"
                >
                  <Link
                    to={rel.to}
                    className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-[#e8edf8] p-7 no-underline"
                  >
                    {/* Blue accent line */}
                    <div className="w-8 h-1 rounded-full bg-[#071A2B] mb-5" />

                    <h3
                      className="text-[16px] font-bold text-[#090B0D] mb-4 flex-1 leading-snug"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {rel.label}
                    </h3>

                    <div className="flex items-center gap-2 text-[#071A2B] font-semibold text-sm group-hover:gap-3 transition-all" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Explore
                      <ArrowRightIcon />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          6. FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-[#071A2B] overflow-hidden">
        {/* Grid background */}
        <GridBackground />

        {/* Floating document shapes */}
        <FloatingDocShapes />

        {/* Glow blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.08) 0%, transparent 70%)' }} aria-hidden="true" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">

          {/* Eyebrow with flanking lines */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="w-12 h-px bg-[#00AEEF]/30" />
            <span
              className="text-xs font-semibold text-[#00AEEF] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Get Started Today
            </span>
            <div className="w-12 h-px bg-[#00AEEF]/30" />
          </motion.div>

          <motion.h2
            className="font-bold text-white mb-4"
            style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            className="text-[17px] max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            Visit us in H Block North Nazimabad, send your file online, or WhatsApp us now.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* WhatsApp — green + glow */}
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#25D366', fontFamily: 'Manrope, sans-serif' }}
              variants={itemFade}
              whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(37,211,102,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <WaIcon />
              WhatsApp Us Now
            </motion.a>

            {/* Order Online — blue gradient */}
            <motion.a
              href={orderLink}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #071A2B 0%, #00AEEF 100%)',
                fontFamily: 'Manrope, sans-serif',
              }}
              variants={itemFade}
              whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(0,174,239,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <EnvelopeIcon />
              {ctaLabel ?? 'Order Online'}
            </motion.a>

            {/* Call Now — frosted border */}
            <motion.a
              href={phoneHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm"
              style={{
                color: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'Manrope, sans-serif',
              }}
              variants={itemFade}
              whileHover={{ y: -3, background: 'rgba(255,255,255,0.10)' }}
              whileTap={{ scale: 0.97 }}
            >
              <PhoneIcon />
              Call Now
            </motion.a>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
