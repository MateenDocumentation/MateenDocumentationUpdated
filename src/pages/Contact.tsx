import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { submitInquiry } from '../lib/submitInquiry';
import { resolveCmsMedia, useCms } from '../cms/CmsContext';
import { useCmsSection, str } from '../cms/useCmsPage';

const inView = { once: true, margin: '-80px' };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
} as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

export default function Contact() {
  const { siteSettings, mediaAssets } = useCms();
  const media = (url: string) => resolveCmsMedia(mediaAssets, url);
  const contactHero = useCmsSection('/contact', 'hero');

  const heroTitle1 = str(contactHero, 'title_line1', 'Visit, Call, WhatsApp');
  const heroTitle2 = str(contactHero, 'title_line2', 'or Send Your File.');
  const heroIntro = str(contactHero, 'intro', "We're here to help. Come to our shop in H Block, North Nazimabad — or reach us online.");
  const heroEyebrow = str(contactHero, 'eyebrow', 'GET IN TOUCH');
  const locationPill = str(contactHero, 'location_pill', siteSettings?.address?.split(',').slice(1, 3).join(',').trim() ?? 'H Block, North Nazimabad');

  const contactInfoSection = useCmsSection('/contact', 'contact_info');
  const reachUsHeading = str(contactInfoSection, 'reach_us_heading', 'Reach Us');
  const hoursLabel = str(contactInfoSection, 'hours_label', 'Opening Hours');
  const hoursText = str(contactInfoSection, 'hours_text', 'Open daily — visit us during business hours.');

  const phone = siteSettings?.phone ?? '+923312478337';
  const wa = siteSettings?.whatsapp ?? '923312478337';
  const email = siteSettings?.email ?? 'mateendocumentation@gmail.com';
  const address = siteSettings?.address ?? 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi';
  const mapsUrl = siteSettings?.maps_url ?? 'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6';
  const telHref = `tel:${phone.replace(/\s/g, '')}`;
  const waHref = `https://wa.me/${wa.replace(/[^0-9]/g, '')}`;

  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSubmitError('');
    try {
      await submitInquiry({
        type: 'contact',
        fields: {
          'Full Name': form.name,
          Phone: form.phone,
          Email: form.email,
          'Selected Service': form.service,
          Message: form.message,
        },
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout title="Contact Us | Mateen Documentation" description="Contact Mateen Documentation — visit us at Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi, or reach us on WhatsApp.">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[480px] flex items-end overflow-hidden"
        style={{ background: '#071A2B' }}
      >
        {/* Background image */}
        <img
          src={media('https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1600&h=700&fit=crop&auto=format')}
          alt=""
          aria-hidden="true"
          width={1600}
          height={700}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.2 }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(7,26,43,0.98) 0%, rgba(7,26,43,0.80) 60%, rgba(7,26,43,0.40) 100%)',
          }}
        />
        {/* Animated SVG line */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1400 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.path
            d="M0 360 C200 280, 400 400, 700 300 S1100 200, 1400 320"
            stroke="#00AEEF"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' as const, delay: 0.3 }}
          />
          <motion.path
            d="M0 420 C300 360, 600 440, 900 380 S1250 300, 1400 400"
            stroke="#00AEEF"
            strokeWidth="0.8"
            strokeOpacity="0.18"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: 'easeOut' as const, delay: 0.6 }}
          />
        </svg>

        {/* Hero content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 pt-32 w-full">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <Link
              to="/"
              className="text-[13px] font-medium text-[#00AEEF] bg-[#00AEEF]/10 px-3 py-1 rounded-full hover:bg-[#00AEEF]/20 transition-colors"
            >
              Home
            </Link>
            <svg className="w-3 h-3 text-[#00AEEF]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[13px] font-medium text-white/60 bg-white/8 px-3 py-1 rounded-full">Contact</span>
          </motion.nav>

          <motion.p
            className="text-[11px] font-bold tracking-[0.2em] text-[#00AEEF] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {heroEyebrow}
          </motion.p>

          <motion.h1
            className="font-bold leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(38px,5.5vw,68px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' as const }}
          >
            <span className="block text-white">{heroTitle1}</span>
            <span className="block text-[#00AEEF]">{heroTitle2}</span>
          </motion.h1>

          <motion.p
            className="text-white/60 text-[17px] max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {heroIntro}
          </motion.p>

          {/* Quick pills */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <a
              href={telHref}
              aria-label="Call Mateen Documentation"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/16 border border-white/15 text-white text-[13px] font-medium px-4 py-2 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-4 h-4 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white text-[13px] font-medium px-4 py-2 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Mateen Documentation location in Google Maps" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/16 border border-white/15 text-white/80 text-[13px] font-medium px-4 py-2 rounded-full transition-all">
              <svg className="w-4 h-4 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationPill}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            {/* LEFT — Contact Info */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="relative"
            >
              {/* Decorative dot grid */}
              <div
                className="absolute -left-4 -top-4 w-40 h-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #00AEEF 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  opacity: 0.12,
                }}
              />
              {/* Decorative blue vertical line */}
              <div className="absolute -right-8 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[#00AEEF]/20 to-transparent hidden lg:block" />

              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-[#090B0D] mb-8 relative z-10">
                {reachUsHeading}
              </motion.h2>

              <div className="space-y-5 relative z-10">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: 'Address',
                    value: address,
                    href: mapsUrl,
                    color: 'text-[#00AEEF]',
                    bg: 'bg-[#00AEEF]/10',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: 'Phone',
                    value: phone,
                    href: telHref,
                    color: 'text-[#00AEEF]',
                    bg: 'bg-[#00AEEF]/10',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                    label: 'WhatsApp',
                    value: phone,
                    href: waHref,
                    color: 'text-[#25D366]',
                    bg: 'bg-[#25D366]/10',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: 'Email',
                    value: email,
                    href: `mailto:${email}`,
                    color: 'text-[#00AEEF]',
                    bg: 'bg-[#00AEEF]/10',
                  },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-4">
                    <div className={`${item.bg} ${item.color} p-3 rounded-xl flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#090B0D]/40 uppercase tracking-wide mb-0.5">{item.label}</p>
                      <a
                        href={item.href}
                        {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        aria-label={item.label === 'Address' ? 'Open Mateen Documentation location in Google Maps' : undefined}
                        className="text-[15px] text-[#090B0D] font-medium leading-snug hover:text-[#071A2B] transition-colors"
                      >{item.value}</a>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp} className="my-8 border-t border-[#e8edf8]" />

              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[12px] font-bold text-[#090B0D]/40 uppercase tracking-wide mb-1">{hoursLabel}</p>
                <p className="text-[15px] text-[#090B0D]/70">{hoursText}</p>
              </motion.div>

              <motion.div variants={stagger} className="flex flex-col gap-3">
                <motion.a
                  variants={fadeUp}
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#071A2B] text-[#071A2B] font-semibold text-[15px] px-6 py-3 rounded-xl hover:bg-[#071A2B] hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </motion.a>
                <motion.a
                  variants={fadeUp}
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-[15px] px-6 py-3 rounded-xl hover:bg-[#1eb857] transition-all w-full"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </motion.a>
                <motion.a
                  variants={fadeUp}
                  href={telHref}
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#090B0D] text-[#090B0D] font-semibold text-[15px] px-6 py-3 rounded-xl hover:bg-[#090B0D] hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </motion.a>
              </motion.div>
            </motion.div>

            {/* RIGHT — Premium Form Panel */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <div className="bg-[#071A2B] rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.15)]">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center mb-5">
                      <svg className="w-8 h-8 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-white/60 text-[15px] mb-8 leading-relaxed max-w-xs">
                      Thank you! Your message has been submitted successfully. We’ll contact you shortly.
                    </p>
                    <motion.a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[15px] px-6 py-3 rounded-xl hover:bg-[#1eb857] transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Continue on WhatsApp
                    </motion.a>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium text-white/60 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="border border-[#dde3f0]/30 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 w-full bg-white/95 text-[#090B0D] placeholder:text-[#090B0D]/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-white/60 mb-1.5">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="03xx-xxxxxxx"
                            className="border border-[#dde3f0]/30 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 w-full bg-white/95 text-[#090B0D] placeholder:text-[#090B0D]/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-white/60 mb-1.5">Email <span className="text-white/30">(optional)</span></label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className="border border-[#dde3f0]/30 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 w-full bg-white/95 text-[#090B0D] placeholder:text-[#090B0D]/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-white/60 mb-1.5">Service</label>
                        <select
                          value={form.service}
                          onChange={e => setForm({ ...form, service: e.target.value })}
                          className="border border-[#dde3f0]/30 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 w-full bg-white/95 text-[#090B0D]"
                        >
                          <option value="">Select a service...</option>
                          <option>Printing &amp; Photocopy</option>
                          <option>Student Services</option>
                          <option>Customized Printing</option>
                          <option>NADRA / Biometric</option>
                          <option>Legal Documentation</option>
                          <option>Business Documentation</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-white/60 mb-1.5">Message</label>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          placeholder="How can we help you?"
                          className="border border-[#dde3f0]/30 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 w-full bg-white/95 text-[#090B0D] placeholder:text-[#090B0D]/30 resize-none"
                        />
                      </div>
                      {submitError && <p role="alert" className="text-sm text-[#FFD4E8] bg-[#EC008C]/15 border border-[#EC008C]/30 rounded-xl p-3">{submitError}</p>}
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ y: -3 }}
                        className="w-full bg-gradient-to-r from-[#071A2B] to-[#00AEEF] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl hover:from-[#0b263d] hover:to-[#00AEEF] transition-all"
                      >
                        {sending ? 'Sending…' : 'Send Message →'}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LOCATION SECTION ── */}
      <section className="bg-[#EEF7FF] py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={inView}>
              <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.2em] text-[#00AEEF] uppercase mb-3">
                FIND US
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#090B0D] mb-6">
                Visit Our Centre
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-3 text-[15px] text-[#090B0D]/70 leading-relaxed">
                <p className="font-semibold text-[#090B0D]">Mateen Documentation</p>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Mateen Documentation location in Google Maps" className="hover:text-[#071A2B] transition-colors">
                  {address}
                </a>
              </motion.div>
            </motion.div>

            {/* Right — Map placeholder */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-[#071A2B] rounded-3xl h-[300px] flex flex-col items-center justify-center gap-4 hover:shadow-[0_20px_60px_rgba(7,26,43,0.2)] transition-all group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-[#00AEEF]/15 flex items-center justify-center group-hover:bg-[#00AEEF]/25 transition-colors">
                    <svg className="w-8 h-8 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-[15px]">H Block, North Nazimabad</p>
                    <p className="text-white/40 text-[13px] mt-1">Tap to open in Google Maps</p>
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[#00AEEF]/40 text-[#00AEEF] text-[13px] font-medium px-4 py-2 rounded-full group-hover:border-[#00AEEF] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Maps
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative bg-[#071A2B] py-20 overflow-hidden">
        {/* Floating doc outline shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute top-8 left-[8%] opacity-[0.04]" width="60" height="80" viewBox="0 0 60 80" fill="none">
            <rect x="1" y="1" width="58" height="78" rx="5" stroke="white" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="48" y2="22" stroke="white" strokeWidth="1" />
            <line x1="12" y1="34" x2="48" y2="34" stroke="white" strokeWidth="1" />
            <line x1="12" y1="46" x2="36" y2="46" stroke="white" strokeWidth="1" />
          </svg>
          <svg className="absolute bottom-8 right-[10%] opacity-[0.04]" width="60" height="80" viewBox="0 0 60 80" fill="none">
            <rect x="1" y="1" width="58" height="78" rx="5" stroke="white" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="48" y2="22" stroke="white" strokeWidth="1" />
            <line x1="12" y1="34" x2="48" y2="34" stroke="white" strokeWidth="1" />
            <line x1="12" y1="46" x2="36" y2="46" stroke="white" strokeWidth="1" />
          </svg>
          <svg className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-[0.025]" width="120" height="160" viewBox="0 0 60 80" fill="none">
            <rect x="1" y="1" width="58" height="78" rx="5" stroke="white" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="48" y2="22" stroke="white" strokeWidth="1" />
            <line x1="12" y1="34" x2="48" y2="34" stroke="white" strokeWidth="1" />
            <line x1="12" y1="46" x2="36" y2="46" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <motion.h2
            className="font-bold leading-tight mb-10"
            style={{ fontSize: 'clamp(36px,5vw,62px)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="text-white">Get It Done. </span>
            <span className="text-[#00AEEF]">Today.</span>
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.a
              variants={fadeUp}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#1eb857] transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </motion.a>
            <motion.div variants={fadeUp}>
              <Link to="/order-online">
                <motion.span
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center gap-2 border-2 border-[#00AEEF] text-[#00AEEF] font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#00AEEF] hover:text-white transition-all"
                >
                  Order Online
                </motion.span>
              </Link>
            </motion.div>
            <motion.a
              variants={fadeUp}
              href={telHref}
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white/80 font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:border-white hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
