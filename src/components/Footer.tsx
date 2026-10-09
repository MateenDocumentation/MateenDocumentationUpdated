import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.webp';
import { useCms } from '../cms/CmsContext';
import { useCmsSection, arr } from '../cms/useCmsPage';

const WaIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Static fallbacks ──────────────────────────────────────────────────────
const DEFAULT_SERVICE_LINKS = [
  { label: 'Printing & Photocopy', url: '/services/printing-photocopy' },
  { label: 'Student Assignments', url: '/services/assignment-printing-binding' },
  { label: 'Customized Printing', url: '/services/customized-printing' },
  { label: 'Biometric & NADRA', url: '/services/nadra-biometric-public-facilitation' },
  { label: 'Legal Documentation', url: '/services/legal-documentation' },
  { label: 'Business Documentation', url: '/services/business-documentation' },
];

const DEFAULT_QUICK_LINKS = [
  { label: 'Home', url: '/' },
  { label: 'About Us', url: '/about' },
  { label: 'All Services', url: '/services' },
  { label: 'Order Online', url: '/order-online' },
  { label: 'Contact', url: '/contact' },
];

const inView = { once: true, margin: '-60px' };
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Footer() {
  const { footerSettings, siteSettings } = useCms();
  const sharedLabelsSection = useCmsSection('/shared', 'shared_labels');
  type SharedLabel = { key: string; value: string };
  const sharedLabels = arr<SharedLabel>(sharedLabelsSection, 'items');
  const sharedLabel = (key: string, fallback: string) => sharedLabels.find(item => item.key === key)?.value?.trim() || fallback;

  // Merge CMS data with fallbacks
  const tagline = footerSettings?.tagline ?? 'Where Printing Meets Documentation';
  const description = footerSettings?.description ?? 'A multi-service printing, documentation, biometric and public facilitation centre in North Nazimabad, Karachi.';
  const trustedSince = footerSettings?.trusted_since ?? '2005';
  const phone = footerSettings?.phone ?? siteSettings?.phone ?? '+92 331 2478337';
  const whatsapp = footerSettings?.whatsapp ?? siteSettings?.whatsapp ?? '+92 331 2478337';
  const email = footerSettings?.email ?? siteSettings?.email ?? 'mateendocumentation@gmail.com';
  const address = footerSettings?.address ?? siteSettings?.address ?? 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi';
  const mapsUrl = footerSettings?.maps_url ?? siteSettings?.maps_url ?? 'https://maps.app.goo.gl/SCs4s2xzNkkBoR5e6';
  const copyrightText = footerSettings?.copyright_text ?? `© ${new Date().getFullYear()} Mateen Documentation. All Rights Reserved.`;
  const developerCredit = footerSettings?.developer_credit ?? 'BrandBugs';
  const developerUrl = footerSettings?.developer_url ?? 'https://www.brandbugs.net';
  const trustedSinceLabel = sharedLabel('footer_trusted_since', 'Trusted since');
  const servicesHeading = sharedLabel('footer_services_heading', 'Services');
  const allServicesLabel = sharedLabel('footer_all_services', 'All 12 Services →');
  const quickLinksHeading = sharedLabel('footer_quick_links_heading', 'Quick Links');
  const contactHeading = sharedLabel('footer_contact_heading', 'Contact');
  const privacyLabel = sharedLabel('footer_privacy', 'Privacy Policy');
  const termsLabel = sharedLabel('footer_terms', 'Terms & Conditions');
  const developedByLabel = sharedLabel('footer_developed_by', 'Designed and Developed by');
  const summaryLine = sharedLabel('footer_summary', 'Printing · Documentation · Biometric · Public Facilitation · Customized Printing · Cards · Stationery · Business Services');

  // CMS links (filter enabled, fallback to defaults)
  const rawServiceLinks = footerSettings?.service_links?.filter(l => l.enabled !== false) ?? [];
  const serviceLinks = rawServiceLinks.length ? rawServiceLinks : DEFAULT_SERVICE_LINKS;
  const rawQuickLinks = footerSettings?.quick_links?.filter(l => l.enabled !== false) ?? [];
  const quickLinks = rawQuickLinks.length ? rawQuickLinks : DEFAULT_QUICK_LINKS;

  const telHref = `tel:${phone.replace(/\s/g, '')}`;
  const waHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <footer style={{ background: '#071A2B' }} className="text-white relative overflow-hidden">

      {/* ── Decorative background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[600px] h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(7,26,43,0.22) 0%, transparent 70%)' }} />
        <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.04]">
          <defs>
            <pattern id="ftDots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ftDots)" />
        </svg>
        <div className="absolute top-16 left-1/3 w-px h-48 opacity-[0.06]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,174,239,0.8), transparent)' }} />
        <div className="absolute top-16 left-1/3 translate-x-12 w-px h-32 opacity-[0.04]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,174,239,0.6), transparent)' }} />
      </div>

      {/* ═══ FOOTER MAIN ════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-14 pb-8">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-12"
          variants={stagger} initial="hidden" whileInView="show" viewport={inView}>

          {/* ── Brand column ── */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <img src={logo} alt="Mateen Documentation" width={320} height={227} loading="lazy" className="h-[120px] w-auto mb-6" style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="font-bold text-sm mb-2" style={{ color: '#00AEEF' }}>{tagline}</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {description}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40 mb-6">{trustedSinceLabel} {trustedSince}</p>
            <div className="flex gap-2">
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#25D366', e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.12)', e.currentTarget.style.color = '#25D366')}>
                <WaIcon />
              </a>
              <a href={telHref}
                aria-label="Call Mateen Documentation"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(0,174,239,0.12)', color: '#00AEEF' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#071A2B', e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,174,239,0.12)', e.currentTarget.style.color = '#00AEEF')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </a>
            </div>
          </motion.div>

          {/* ── Services column ── */}
          <motion.div variants={fadeUp}>
            <p className="font-semibold text-xs uppercase tracking-[0.18em] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{servicesHeading}</p>
            <ul className="space-y-3">
              {serviceLinks.map(s => (
                <li key={s.url}>
                  <Link to={s.url} className="text-sm transition-colors hover:text-white flex items-center gap-2 group" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="w-1 h-1 rounded-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-sm font-semibold transition-colors hover:text-white" style={{ color: '#00AEEF' }}>
                  {allServicesLabel}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* ── Quick Links column ── */}
          <motion.div variants={fadeUp}>
            <p className="font-semibold text-xs uppercase tracking-[0.18em] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{quickLinksHeading}</p>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.url}>
                  <Link to={l.url} className="text-sm transition-colors hover:text-white flex items-center gap-2 group" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="w-1 h-1 rounded-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Contact column ── */}
          <motion.div variants={fadeUp}>
            <p className="font-semibold text-xs uppercase tracking-[0.18em] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{contactHeading}</p>
            <address className="not-italic space-y-4">
              <div className="flex gap-3">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Mateen Documentation location in Google Maps" className="flex gap-3 items-start hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(0,174,239,0.12)' }}>
                    <svg className="w-4 h-4" style={{ color: '#00AEEF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="text-sm leading-relaxed hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {address}
                  </span>
                </a>
              </div>
              <a href={telHref} aria-label="Call Mateen Documentation" className="flex gap-3 items-center hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,174,239,0.12)' }}>
                  <svg className="w-4 h-4" style={{ color: '#00AEEF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <span className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>{phone}</span>
              </a>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.10)' }}>
                  <svg className="w-4 h-4" style={{ color: '#25D366' }} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>{whatsapp}</a>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,174,239,0.12)' }}>
                  <svg className="w-4 h-4" style={{ color: '#00AEEF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <a href={`mailto:${email}`} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>{email}</a>
              </div>
            </address>
          </motion.div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>
              {copyrightText}
            </p>
            <div className="flex items-center gap-5">
              <Link to="/privacy-policy" className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.42)' }}>{privacyLabel}</Link>
              <Link to="/terms-and-conditions" className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.42)' }}>{termsLabel}</Link>
            </div>
          </div>
          <p className="text-center text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {developedByLabel}{' '}
            <a
              href={developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-opacity hover:opacity-100 hover:underline"
              style={{ color: 'rgba(255,255,255,0.58)' }}
            >
              {developerCredit}
            </a>
          </p>
          <p className="text-center text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.15)' }}>
            {summaryLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
