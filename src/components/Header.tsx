import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.webp';
import { useCms } from '../cms/CmsContext';
import { useCmsSection, arr } from '../cms/useCmsPage';

const DEFAULT_SERVICE_LINKS = [
  { label: 'Printing & Photocopy',              to: '/services/printing-photocopy' },
  { label: 'Student & Assignment Services',      to: '/services/assignment-printing-binding' },
  { label: 'Customized Printing',               to: '/services/customized-printing' },
  { label: 'PVC Cards & Photo Frames',          to: '/services/cards-photo-frames' },
  { label: 'Design & Branding',                 to: '/services/design-branding' },
  { label: 'Office & School Stationery',        to: '/services/stationery' },
  { label: 'Legal Documentation',              to: '/services/legal-documentation' },
  { label: 'NADRA / Biometric / Public Facilitation', to: '/services/nadra-biometric-public-facilitation' },
  { label: 'Vehicle Documentation',             to: '/services/vehicle-documentation' },
  { label: 'Business Documentation',            to: '/services/business-documentation' },
  { label: 'Insurance Facilitation',            to: '/services/insurance-facilitation' },
  { label: 'Bulk Printing',                     to: '/services/bulk-printing' },
];

const DEFAULT_NAV = [
  { label: 'Home', url: '/', has_dropdown: false },
  { label: 'About', url: '/about', has_dropdown: false },
  { label: 'Services', url: '/services', has_dropdown: true },
  { label: 'Order Online', url: '/order-online', has_dropdown: false },
  { label: 'Contact', url: '/contact', has_dropdown: false },
];

const WaIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Header() {
  const { headerSettings, siteSettings, navigationItems } = useCms();
  const sharedLabelsSection = useCmsSection('/shared', 'shared_labels');
  type SharedLabel = { key: string; value: string };
  const sharedLabels = arr<SharedLabel>(sharedLabelsSection, 'items');
  const sharedLabel = (key: string, fallback: string) => sharedLabels.find(item => item.key === key)?.value?.trim() || fallback;
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isServicesActive = location.pathname.startsWith('/services');

  // CMS-driven contact info with hardcoded fallbacks
  const rawPhone = headerSettings?.phone ?? siteSettings?.phone ?? '+923312478337';
  const rawWhatsapp = headerSettings?.whatsapp ?? siteSettings?.whatsapp ?? '923312478337';
  const telHref = `tel:${rawPhone.replace(/\s/g, '')}`;
  const waHref = `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;
  const ctaLabel = headerSettings?.cta_label ?? 'WhatsApp Us';

  // Logo: prefer CMS URL, fall back to local asset
  const logoSrc = headerSettings?.logo_url ?? siteSettings?.logo_url ?? logo;

  // Navigation items from CMS, falling back to DEFAULT_NAV
  const enabledNavItems = navigationItems.filter(n => n.is_enabled && !n.parent_id);
  const topNavItems = enabledNavItems.length > 0
    ? enabledNavItems.sort((a, b) => a.order_index - b.order_index)
    : DEFAULT_NAV.map((n, i) => ({ id: String(i), label: n.label, url: n.url, order_index: i, is_enabled: true, has_dropdown: n.has_dropdown, parent_id: null }));

  // Service dropdown: CMS child nav items under the Services parent, or default list
  const servicesNavItem = topNavItems.find(n => n.has_dropdown || n.url === '/services');
  const cmsServiceChildren = navigationItems.filter(n => n.is_enabled && n.parent_id && n.parent_id === servicesNavItem?.id).sort((a, b) => a.order_index - b.order_index);
  const serviceLinks = cmsServiceChildren.length > 0
    ? cmsServiceChildren.map(n => ({ label: n.label, to: n.url }))
    : DEFAULT_SERVICE_LINKS;

  // "View all" label from CMS footer service_links count or default
  const viewAllLabel = sharedLabel('header_view_all_services', `View All ${serviceLinks.length} Services`);
  const callLabel = sharedLabel('header_call', 'Call');

  useEffect(() => { setMenuOpen(false); setMegaOpen(false); setMobileServicesOpen(false); }, [location]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const transparent = isHome && !scrolled;

  // Hover handlers with short delay to prevent flicker when moving cursor from button to dropdown
  const openMega = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    hoverTimerRef.current = setTimeout(() => setMegaOpen(false), 120);
  };

  // Active underline indicator component used inside NavLink children
  const ActiveBar = ({ active, transparent: t }: { active: boolean; transparent: boolean }) => (
    <span
      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
      style={{
        background: t ? 'rgba(255,255,255,0.9)' : '#071A2B',
        opacity: active ? 1 : 0,
        transform: active ? 'scaleX(1)' : 'scaleX(0)',
      }}
    />
  );

  const navItemBase = 'relative text-[13px] tracking-wide transition-colors duration-200 pb-0.5';

  const activeTextClass = (isActive: boolean) =>
    isActive
      ? (transparent ? 'text-white font-bold' : 'text-[#071A2B] font-bold')
      : (transparent ? 'text-white/85 hover:text-white font-semibold' : 'text-[#090B0D]/60 hover:text-[#071A2B] font-semibold');

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'py-3 bg-transparent'
            : 'py-2.5 bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100/60'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full grid items-center" style={{ gridTemplateColumns: 'auto 1fr auto', gap: '24px' }}>

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0" aria-label="Mateen Documentation home">
            <img
              src={logoSrc}
              alt="Mateen Documentation"
              width={320}
              height={227}
              className={`w-auto object-contain transition-all duration-300 ${transparent ? 'h-[66px] brightness-0 invert' : 'h-[52px]'}`}
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-8 justify-center">

            {topNavItems.filter(n => !n.has_dropdown && n.url !== '/services').slice(0, 2).map(navItem => (
              <NavLink key={navItem.id} to={navItem.url} end={navItem.url === '/'} className={({ isActive }) => `${navItemBase} ${activeTextClass(isActive)}`}>
                {({ isActive }) => (<>{navItem.label}<ActiveBar active={isActive} transparent={transparent} /></>)}
              </NavLink>
            ))}

            {/* Services — opens on hover, closes with delay */}
            <div
              className="relative pb-0.5"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                onClick={() => setMegaOpen(p => !p)}
                className={`${navItemBase} flex items-center gap-1 ${activeTextClass(isServicesActive)}`}
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                {servicesNavItem?.label ?? 'Services'}
                <motion.svg
                  animate={{ rotate: megaOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3.5 h-3.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </motion.svg>
                <ActiveBar active={isServicesActive} transparent={transparent} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {serviceLinks.map(s => {
                        const isActiveSvc = location.pathname === s.to;
                        return (
                          <Link
                            key={s.to}
                            to={s.to}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] transition-colors group ${
                              isActiveSvc
                                ? 'bg-[#EEF7FF] text-[#071A2B] font-semibold'
                                : 'text-gray-600 hover:bg-[#EEF7FF] hover:text-[#071A2B]'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full bg-[#071A2B] flex-shrink-0 transition-opacity ${
                              isActiveSvc ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`} />
                            {s.label}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <Link
                        to="/services"
                        className={`inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline ${
                          location.pathname === '/services' ? 'text-[#071A2B] underline' : 'text-[#071A2B]'
                        }`}
                      >
                        {viewAllLabel}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {topNavItems.filter(n => !n.has_dropdown && n.url !== '/services' && n.url !== '/' && n.url !== '/about').map(navItem => (
              <NavLink key={navItem.id} to={navItem.url} className={({ isActive }) => `${navItemBase} ${activeTextClass(isActive)}`}>
                {({ isActive }) => (<>{navItem.label}<ActiveBar active={isActive} transparent={transparent} /></>)}
              </NavLink>
            ))}
          </nav>

          {/* ── col 3: CTAs (desktop) + Burger (mobile) ── */}
          <div className="flex items-center gap-3 justify-end">
            <a
              href={telHref}
              aria-label="Call Mateen Documentation"
              className={`hidden lg:flex text-[13px] font-semibold items-center gap-1.5 transition-colors duration-200 ${
                transparent ? 'text-white/75 hover:text-white' : 'text-gray-500 hover:text-[#071A2B]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {callLabel}
            </a>
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex bg-[#25D366] hover:bg-[#1ebc5a] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl items-center gap-2 transition-colors shadow-[0_2px_10px_rgba(37,211,102,0.35)]"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <WaIcon /> {ctaLabel}
            </motion.a>
            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-[#071A2B] hover:bg-[#EEEAE1]'
              }`}
            >
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-5 py-4 space-y-1 max-h-[75vh] overflow-y-auto">
                {topNavItems.map(navItem => {
                  if (navItem.has_dropdown || navItem.url === '/services') {
                    return (
                      <div key={navItem.id}>
                        <button
                          onClick={() => setMobileServicesOpen(p => !p)}
                          className={`w-full flex justify-between items-center py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                            isServicesActive ? 'bg-[#EEF7FF] text-[#071A2B]' : 'text-gray-700 hover:bg-[#EEF7FF] hover:text-[#071A2B]'
                          }`}
                        >
                          {navItem.label}
                          <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {mobileServicesOpen && (
                          <div className="ml-4 border-l-2 border-[#EEEAE1] pl-4 space-y-1">
                            {serviceLinks.map(s => {
                              const isActiveSvc = location.pathname === s.to;
                              return (
                                <Link key={s.to} to={s.to} className={`block py-2 text-sm font-medium transition-colors ${isActiveSvc ? 'text-[#071A2B] font-semibold' : 'text-gray-600 hover:text-[#071A2B]'}`}>
                                  {isActiveSvc && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#071A2B] mr-2 align-middle" />}
                                  {s.label}
                                </Link>
                              );
                            })}
                            <Link to="/services" className={`block py-2 text-sm font-bold transition-colors ${location.pathname === '/services' ? 'text-[#071A2B] underline' : 'text-[#071A2B]'}`}>
                              {viewAllLabel} →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  }
                  const isOrderOnline = navItem.url === '/order-online';
                  return (
                    <NavLink key={navItem.id} to={navItem.url} end={navItem.url === '/'} className={({ isActive }) =>
                      `block py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                        isOrderOnline
                          ? 'text-white bg-[#071A2B]'
                          : isActive ? 'bg-[#EEF7FF] text-[#071A2B]' : 'text-gray-700 hover:bg-[#EEF7FF] hover:text-[#071A2B]'
                      }`
                    }>{navItem.label}</NavLink>
                  );
                })}

                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <a href={telHref} className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {callLabel}
                  </a>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] text-white rounded-xl text-sm font-bold"
                  >
                    <WaIcon /> {sharedLabel('header_whatsapp', 'WhatsApp')}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-3">
          <a href={telHref} aria-label="Call Mateen Documentation" className="flex flex-col items-center py-3.5 gap-1 text-gray-600 active:bg-gray-50">
            <svg className="w-5 h-5 text-[#071A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider text-[#071A2B]">{sharedLabel('header_call_mobile', 'CALL')}</span>
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center py-3.5 gap-1 bg-[#25D366] text-white"
          >
            <WaIcon />
            <span className="text-[10px] font-bold tracking-wider">{sharedLabel('header_whatsapp_mobile', 'WHATSAPP')}</span>
          </a>
          <Link to="/order-online" className="flex flex-col items-center py-3.5 gap-1 bg-[#071A2B] text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider">{sharedLabel('header_send_file', 'SEND FILE')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
