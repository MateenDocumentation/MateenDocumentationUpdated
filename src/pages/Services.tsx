import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { resolveCmsMedia, useCms } from '../cms/CmsContext';
import { useCmsSection, str, arr } from '../cms/useCmsPage';

const inView = { once: true, margin: '-80px' };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const services = [
  {
    title: 'Printing & Photocopy',
    tag: 'Core Service',
    desc: 'Color & B&W printing, photocopy, scanning, photo printing, lamination, passport photos and more.',
    img: 'https://images.unsplash.com/photo-1650094980833-7373de26feb6?w=700&h=500&fit=crop&auto=format',
    to: '/services/printing-photocopy',
    featured: true,
  },
  {
    title: 'Student & Assignment Services',
    tag: 'Academic',
    desc: 'Assignment printing, typing, formatting, thesis binding, project work and academic submissions.',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&h=500&fit=crop&auto=format',
    to: '/services/assignment-printing-binding',
    featured: true,
  },
  {
    title: 'Customized Printing',
    tag: 'Gifts & Branding',
    desc: 'Mugs, personalized cards, stickers, frames, labels, PVC cards and branded merchandise.',
    img: 'https://images.unsplash.com/photo-1682339374155-6fdc4869a75b?w=700&h=500&fit=crop&auto=format',
    to: '/services/customized-printing',
    featured: false,
  },
  {
    title: 'Cards & Photo Frames',
    tag: 'Photo & Frames',
    desc: 'Glossy & luster cards, PVC ID cards, photo frames and customized card printing.',
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&h=500&fit=crop&auto=format',
    to: '/services/cards-photo-frames',
    featured: false,
  },
  {
    title: 'Design & Branding',
    tag: 'Creative',
    desc: 'Visiting cards, letterheads, brochures, flyers, posters, certificates and business branding.',
    img: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=700&h=500&fit=crop&auto=format',
    to: '/services/design-branding',
    featured: false,
  },
  {
    title: 'Office & School Stationery',
    tag: 'Stationery',
    desc: 'Office stationery, school stationery, registers, files, envelopes and customized stationery items.',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&h=500&fit=crop&auto=format',
    to: '/services/stationery',
    featured: false,
  },
  {
    title: 'Legal Documentation',
    tag: 'Documents',
    desc: 'Affidavits, agreements, power of attorney, attestation and official legal document preparation.',
    img: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=700&h=500&fit=crop&auto=format',
    to: '/services/legal-documentation',
    featured: false,
  },
  {
    title: 'NADRA / Biometric / Public Facilitation',
    tag: 'Facilitation',
    desc: 'NADRA e-Sahulat, biometric assistance, CNIC renewal, birth/death certificates and applications.',
    img: 'https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=700&h=500&fit=crop&auto=format',
    to: '/services/nadra-biometric-public-facilitation',
    featured: false,
  },
  {
    title: 'Vehicle Documentation',
    tag: 'Vehicles',
    desc: 'Vehicle transfer documents, ownership papers and vehicle-related documentation support.',
    img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&h=500&fit=crop&auto=format',
    to: '/services/vehicle-documentation',
    featured: false,
  },
  {
    title: 'Business Documentation',
    tag: 'Business',
    desc: 'Letterheads, salary certificates, experience letters, business forms and office document services.',
    img: 'https://images.unsplash.com/photo-1775163024488-e88e4a71179f?w=700&h=500&fit=crop&auto=format',
    to: '/services/business-documentation',
    featured: false,
  },
  {
    title: 'Insurance Facilitation',
    tag: 'Insurance',
    desc: 'Motor insurance documentation, insurance forms and supporting document facilitation.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&h=500&fit=crop&auto=format',
    to: '/services/insurance-facilitation',
    featured: false,
  },
  {
    title: 'Bulk Printing',
    tag: 'Commercial',
    desc: 'Large-volume printing for events, offices, schools and businesses. Competitive bulk rates.',
    img: 'https://images.unsplash.com/photo-1715059382493-213b706e95f3?w=700&h=500&fit=crop&auto=format',
    to: '/services/bulk-printing',
    featured: false,
  },
];

const miniPreviewServices = [
  services[0],
  services[1],
  services[2],
  services[7],
];

const featuredServices = services.filter((s) => s.featured);
const standardServices = services.filter((s) => !s.featured);

export default function Services() {
  const sharedLabelsSection = useCmsSection('/shared', 'shared_labels');
  type SharedLabel = { key: string; value: string };
  const sharedLabels = arr<SharedLabel>(sharedLabelsSection, 'items');
  const sharedLabelMap = Object.fromEntries(sharedLabels.map(item => [item.key, item.value]));
  const pageLabel = (key: string, fallback: string) => sharedLabelMap[key] || fallback;
  const { cmsServices, mediaAssets, siteSettings, headerSettings } = useCms();
  const heroSection = useCmsSection('/services', 'hero');
  const finalCtaSection = useCmsSection('/services', 'final_cta');
  const helpSection = useCmsSection('/services', 'help_cta');

  const heroEyebrow = str(heroSection, 'eyebrow', 'All Services');
  const heroHeadingLine1 = str(heroSection, 'heading_line1', 'Everything We Can');
  const heroHeadingLine2 = str(heroSection, 'heading_line2', 'Help You With.');
  const heroDescription = str(heroSection, 'description', '12 service categories. One convenient location. Printing, documentation, customized products and public facilitation — all in H Block, North Nazimabad.');
  const heroPill1 = str(heroSection, 'pill_1', '12 Service Categories');
  const heroPill2 = str(heroSection, 'pill_2', 'H Block, North Nazimabad');

  const finalEyebrow = str(finalCtaSection, 'eyebrow', 'Ready to Start?');
  const finalHeadingLine1 = str(finalCtaSection, 'heading_line1', 'Get It Done.');
  const finalHeadingLine2 = str(finalCtaSection, 'heading_line2', 'Today.');
  const finalDescription = str(finalCtaSection, 'description', "Walk in or reach us online. We're here to help at every step.");
  const finalPrimaryLabel = str(finalCtaSection, 'primary_label', 'Order Online');
  const finalPrimaryUrl = str(finalCtaSection, 'primary_url', '/order-online');
  const finalSecondaryLabel = str(finalCtaSection, 'secondary_label', 'WhatsApp Us');
  const helpHeading = str(helpSection, 'heading', "Can't Find What You Need?");
  const helpDescription = str(helpSection, 'description', "Send us your specific requirement — we'll let you know if we can help.");
  const helpPrimaryLabel = str(helpSection, 'primary_label', 'Send Your Requirement');
  const helpPrimaryUrl = str(helpSection, 'primary_url', '/order-online');
  const helpSecondaryLabel = str(helpSection, 'secondary_label', 'WhatsApp Us');
  const helpWaMessage = str(helpSection, 'wa_message', '');
  const rawWa = headerSettings?.whatsapp ?? siteSettings?.whatsapp ?? '923312478337';
  const helpWaHref = `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}${helpWaMessage ? `?text=${encodeURIComponent(helpWaMessage)}` : ''}`;
  const media = (url: string) => resolveCmsMedia(mediaAssets, url);
  const resolvedServices = services.map(item => {
    const slug = item.to.replace(/^\/services\//, '');
    const cms = cmsServices.find(service => service.slug === slug);
    return {
      ...item,
      title: cms?.title || item.title,
      tag: cms?.tag || item.tag,
      desc: cms?.description || item.desc,
      img: cms?.image_url?.trim() || media(item.img),
      featured: cms?.is_featured ?? item.featured,
    };
  });
  const resolvedMiniPreviewServices = [resolvedServices[0], resolvedServices[1], resolvedServices[2], resolvedServices[7]];
  const resolvedFeaturedServices = resolvedServices.filter(s => s.featured);
  const resolvedStandardServices = resolvedServices.filter(s => !s.featured);

  return (
    <Layout
      title="All Services — Mateen Documentation"
      description="Explore all 12 service categories at Mateen Documentation — printing, photocopy, customized products, legal documentation, NADRA facilitation and more in H Block, North Nazimabad."
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white py-20 overflow-hidden">
        {/* Dot pattern background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #00AEEF 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            opacity: 0.04,
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* Left — text */}
            <motion.div
              className="flex-1 min-w-0"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Breadcrumb */}
              <motion.nav variants={fadeUp} className="flex items-center gap-2 mb-6 text-sm text-gray-400">
                <Link to="/" className="hover:text-[#00AEEF] transition-colors">{pageLabel('breadcrumb_home', 'Home')}</Link>
                <span>/</span>
                <span className="text-[#090B0D] font-medium">{pageLabel('breadcrumb_services', 'Services')}</span>
              </motion.nav>

              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                className="text-[#00AEEF] text-[11px] font-black tracking-[0.22em] uppercase mb-4"
              >
                {heroEyebrow}
              </motion.p>

              {/* H1 */}
              <motion.h1
                variants={fadeUp}
                className="font-bold text-[#090B0D] leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(40px, 5.5vw, 68px)' }}
              >
                {heroHeadingLine1}<br className="hidden sm:block" /> {heroHeadingLine2}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-gray-500 text-lg leading-relaxed max-w-xl mb-8"
              >
                {heroDescription}
              </motion.p>

              {/* Pills */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-[#EEF7FF] border border-[#dce6ff] text-[#071A2B] text-sm font-semibold px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#00AEEF] inline-block" />
                  {heroPill1}
                </span>
                <span className="inline-flex items-center gap-2 bg-[#EEF7FF] border border-[#dce6ff] text-[#071A2B] text-sm font-semibold px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#00AEEF] inline-block" />
                  {heroPill2}
                </span>
              </motion.div>
            </motion.div>

            {/* Right — 2×2 mini preview grid */}
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-3 w-[380px] flex-shrink-0"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {resolvedMiniPreviewServices.map((s) => (
                <motion.div
                  key={s.to}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="relative rounded-2xl overflow-hidden h-[160px] cursor-pointer group"
                >
                  <Link to={s.to} className="absolute inset-0 z-10" aria-label={s.title} />
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/80 via-[#071A2B]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-white font-bold text-xs leading-tight">{s.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.h2 className="sr-only">{pageLabel('services_categories_accessible', 'Service categories')}</motion.h2>

          {/* Featured row — 2 big cards */}
          <motion.div
            className="flex flex-col lg:flex-row gap-5 mb-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {resolvedFeaturedServices.map((s) => (
              <motion.div
                key={s.to}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.28 } }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer flex-1 h-[380px]"
              >
                <Link to={s.to} className="absolute inset-0 z-10" aria-label={s.title} />
                <img
                  src={s.img}
                  alt={s.title}
                  width={700}
                  height={500}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/90 via-[#071A2B]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-7 pr-10">
                  <p className="text-[#8fa8f0] text-[10px] font-black tracking-widest uppercase mb-2">
                    {s.tag}
                  </p>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-snug">{s.title}</h3>
                  <p className="text-white/55 text-xs mb-4 leading-relaxed max-w-sm">{s.desc}</p>
                  <span className="text-white/70 group-hover:text-white text-xs font-bold transition-colors">
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Standard grid — remaining 10 */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {resolvedStandardServices.map((s) => (
              <motion.div
                key={s.to}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.28 } }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer h-[260px]"
              >
                <Link to={s.to} className="absolute inset-0 z-10" aria-label={s.title} />
                <img
                  src={s.img}
                  alt={s.title}
                  width={700}
                  height={500}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050c28]/90 via-[#071A2B]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 pr-6">
                  <p className="text-[#8fa8f0] text-[10px] font-black tracking-widest uppercase mb-1.5">
                    {s.tag}
                  </p>
                  <h3 className="text-white font-bold text-xl mb-3 leading-snug">{s.title}</h3>
                  <span className="text-white/70 group-hover:text-white text-xs font-bold transition-colors">
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FIND WHAT YOU NEED CTA ────────────────────────────────────── */}
      <div className="mx-6 lg:mx-10 mb-16">
        <motion.div
          className="bg-[#071A2B] rounded-3xl py-16 px-8 lg:px-16 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <motion.h2
            variants={fadeUp}
            className="text-white font-bold text-3xl lg:text-4xl mb-4"
          >
            {helpHeading}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/55 text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            {helpDescription}
          </motion.p>
          <motion.div
            variants={stagger}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
              <Link
                to={helpPrimaryUrl}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AEEF] to-[#071A2B] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-[#00AEEF]/30 transition-shadow"
              >
                {helpPrimaryLabel}
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
              <a
                href={helpWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-[#25D366]/30 transition-shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {helpSecondaryLabel}
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#071A2B] py-20 overflow-hidden">
        {/* Fine grid SVG */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,174,239,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,174,239,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating doc outline shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-[8%] w-16 h-20 border border-[#00AEEF]/15 rounded-lg rotate-[-12deg]" />
          <div className="absolute top-24 left-[12%] w-10 h-14 border border-[#00AEEF]/10 rounded rotate-[8deg]" />
          <div className="absolute bottom-16 left-[6%] w-12 h-16 border border-[#00AEEF]/12 rounded-lg rotate-[15deg]" />
          <div className="absolute top-8 right-[7%] w-14 h-18 border border-[#00AEEF]/15 rounded-lg rotate-[10deg]" />
          <div className="absolute top-28 right-[13%] w-8 h-12 border border-[#00AEEF]/10 rounded rotate-[-8deg]" />
          <div className="absolute bottom-10 right-[8%] w-16 h-20 border border-[#00AEEF]/12 rounded-lg rotate-[-14deg]" />
          <div className="absolute bottom-20 right-[18%] w-10 h-14 border border-[#00AEEF]/08 rounded rotate-[6deg]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          {/* Eyebrow with flanking lines */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="h-px w-16 bg-[#00AEEF]/40" />
            <span className="text-[#00AEEF] text-[11px] font-black tracking-[0.22em] uppercase">
              {finalEyebrow}
            </span>
            <span className="h-px w-16 bg-[#00AEEF]/40" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="font-bold leading-[1.06] mb-6"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)' }}
          >
            <span className="text-white">{finalHeadingLine1} </span>
            <span className="text-[#00AEEF]">{finalHeadingLine2}</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="text-white/45 text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          >
            {finalDescription}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
              <a
                href="https://wa.me/923312478337"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-[#25D366]/30 transition-shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </motion.div>

            <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
              <Link
                to={finalPrimaryUrl}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AEEF] to-[#071A2B] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-[#00AEEF]/30 transition-shadow"
              >
                {finalPrimaryLabel}
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
              <a
                href="tel:+923312478337"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Call Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
