import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { fileToAttachment, submitInquiry } from '../lib/submitInquiry';
import { useCmsSection, str } from '../cms/useCmsPage';
import { useCms } from '../cms/CmsContext';

const inView = { once: true, margin: '-80px' };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
} as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

const NON_PRINTING_CATEGORIES = new Set([
  'NADRA / Biometric',
  'Business Documentation',
  'Legal Documentation',
]);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function OrderOnline() {
  const { siteSettings, headerSettings } = useCms();
  const rawPhone = headerSettings?.phone ?? siteSettings?.phone ?? '+923312478337';
  const telHref = `tel:${rawPhone.replace(/\s/g, '')}`;

  const orderHero = useCmsSection('/order-online', 'hero');
  const heroEyebrow = str(orderHero, 'eyebrow', 'SEND YOUR FILE ONLINE');
  const heroTitle1 = str(orderHero, 'title_line1', 'Send Your File.');
  const heroTitle2 = str(orderHero, 'title_line2', "We'll Handle the Rest.");
  const heroIntro = str(orderHero, 'intro', 'Upload your document, assignment, image or design file. Tell us your requirements — we review, prepare, and complete your order.');

  const howSection = useCmsSection('/order-online', 'how_it_works');
  const howEyebrow = str(howSection, 'eyebrow', 'SIMPLE PROCESS');
  const howHeading = str(howSection, 'heading', 'How It Works');
  type HowStep = { title: string; desc: string };
  const cmsHowSteps = (() => {
    const s = howSection?.content?.['steps'];
    return Array.isArray(s) ? (s as HowStep[]) : [];
  })();

  const [form, setForm] = useState({
    name: '', phone: '', whatsapp: '', email: '',
    category: '', quantity: '', printingType: 'not-applicable',
    paper: '', size: '', special: '', message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const showPrintFields = !NON_PRINTING_CATEGORIES.has(form.category);

  const handleCategoryChange = (category: string) => {
    const hidePrintFields = NON_PRINTING_CATEGORIES.has(category);
    setForm(current => ({
      ...current,
      category,
      ...(hidePrintFields
        ? {
            quantity: '',
            printingType: '',
            paper: '',
            size: '',
            special: '',
          }
        : {
            printingType: current.printingType || 'not-applicable',
          }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSubmitError('');
    try {
      if (file && file.size > 20 * 1024 * 1024) throw new Error('Please select a file smaller than 20MB.');
      await submitInquiry({
        type: 'order',
        fields: {
          'Full Name': form.name,
          Phone: form.phone,
          WhatsApp: form.whatsapp,
          Email: form.email,
          'Service Category': form.category,
          ...(showPrintFields
            ? {
                Quantity: form.quantity,
                'Printing Type': form.printingType,
                'Paper / Material': form.paper,
                Size: form.size,
                'Special Requirements': form.special,
              }
            : {}),
          Message: form.message,
        },
        attachment: file ? await fileToAttachment(file) : undefined,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    'border border-[#dde3f0] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#071A2B] focus:ring-2 focus:ring-[#071A2B]/20 w-full bg-white text-[#090B0D] placeholder:text-[#090B0D]/30';

  return (
    <Layout title="Order Online | Mateen Documentation" description="Send your file online to Mateen Documentation — upload your document, assignment, image, or design. We review, prepare, and complete your order.">
      {/* ── HERO ── */}
      <section className="relative min-h-[480px] flex items-end overflow-hidden" style={{ background: '#071A2B' }}>
        {/* Deep radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '700px', height: '380px', background: 'radial-gradient(ellipse, rgba(7,26,43,0.38) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.14) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        {/* Fine grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="heroGrid" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M 52 0 L 0 0 0 52" fill="none" stroke="white" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" opacity="0.04" />
        </svg>

        {/* Animated flowing blue line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <motion.path
            d="M -80 360 C 220 310, 480 420, 740 340 S 1180 260, 1520 310"
            stroke="rgba(0,174,239,0.18)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: 'easeInOut' as const }} />
          <motion.path
            d="M -80 120 C 300 90, 580 160, 860 110 S 1260 60, 1520 90"
            stroke="rgba(0,174,239,0.10)" strokeWidth="1" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: 'easeInOut' as const, delay: 0.4 }} />
        </svg>

        {/* Floating document outlines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div className="absolute rounded-2xl"
            style={{ top: '10%', right: '5%', width: '160px', height: '200px', border: '1px solid rgba(0,174,239,0.12)', background: 'rgba(7,26,43,0.06)', transform: 'rotate(5deg)' }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
            {[0,1,2].map(i => <div key={i} className="absolute left-5 right-5 h-px" style={{ top: `${30 + i * 18}%`, background: 'rgba(0,174,239,0.15)' }} />)}
          </motion.div>
          <motion.div className="absolute rounded-xl"
            style={{ bottom: '12%', left: '3%', width: '120px', height: '90px', border: '1px solid rgba(0,174,239,0.09)', background: 'rgba(7,26,43,0.04)', transform: 'rotate(-3deg)' }}
            animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
          <motion.div className="absolute rounded-2xl"
            style={{ top: '20%', right: '22%', width: '90px', height: '115px', border: '1px solid rgba(0,174,239,0.08)', background: 'rgba(7,26,43,0.04)', transform: 'rotate(-2deg)' }}
            animate={{ y: [0, -7, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} />
        </div>

        {/* Bottom fade to form section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #071A2B)' }} />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 pt-28 w-full">
          {/* Breadcrumb */}
          <motion.nav className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}>
            <Link to="/" className="text-[13px] font-medium text-white/60 bg-white/10 px-3 py-1 rounded-full hover:bg-white/15 transition-colors">Home</Link>
            <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[13px] font-medium text-white/40 bg-white/8 px-3 py-1 rounded-full">Order Online</span>
          </motion.nav>

          <motion.p className="text-[11px] font-bold tracking-[0.22em] text-[#00AEEF] uppercase mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {heroEyebrow}
          </motion.p>

          <motion.h1 className="font-bold leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(38px,5.5vw,68px)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' as const }}>
            <span className="block text-white">{heroTitle1}</span>
            <span className="block" style={{ color: '#00AEEF' }}>{heroTitle2}</span>
          </motion.h1>

          <motion.p className="text-[17px] max-w-2xl mb-8 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.60)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}>
            {heroIntro}
          </motion.p>

          {/* File type chips — translucent on dark */}
          <motion.div className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}>
            {['PDF', 'DOC / DOCX', 'JPG / PNG', 'PPT / PPTX'].map((ext, i) => (
              <span key={i} className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full"
                style={{ background: 'rgba(0,174,239,0.15)', border: '1px solid rgba(0,174,239,0.28)', color: 'rgba(255,255,255,0.80)' }}>
                {ext}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#EEF7FF] py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#00AEEF] uppercase mb-2">{howEyebrow}</p>
            <h2 className="text-2xl font-bold text-[#090B0D]">{howHeading}</h2>
          </motion.div>

          <div className="relative">
            {/* Dashed connector line (desktop) — top-7 = 28px = half of h-14 circle height */}
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-[#00AEEF]/25" aria-hidden="true" />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              {[
                {
                  num: '01',
                  icon: (
                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ),
                  title: cmsHowSteps[0]?.title ?? 'Upload Your File',
                  desc: cmsHowSteps[0]?.desc ?? 'Send your document, assignment, image, or design file through the form.',
                },
                {
                  num: '02',
                  icon: (
                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: cmsHowSteps[1]?.title ?? 'Share Requirements',
                  desc: cmsHowSteps[1]?.desc ?? 'Specify size, quantity, color, paper type, and any special instructions.',
                },
                {
                  num: '03',
                  icon: (
                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: cmsHowSteps[2]?.title ?? 'We Prepare',
                  desc: cmsHowSteps[2]?.desc ?? 'Our team reviews your file, confirms details, and prepares your order.',
                },
                {
                  num: '04',
                  icon: (
                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                  title: cmsHowSteps[3]?.title ?? 'Collect or Deliver',
                  desc: cmsHowSteps[3]?.desc ?? 'Pick up your completed order from our shop, or arrange for delivery.',
                },
              ].map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="relative flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative mb-5">
                    <span className="absolute -top-4 -left-3 text-[56px] font-black text-[#071A2B]/6 leading-none select-none">{step.num}</span>
                    <div className="relative z-10 w-14 h-14 bg-white rounded-2xl shadow-sm border border-[#e8edf8] flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#090B0D] text-[16px] mb-2">{step.title}</h3>
                  <p className="text-[#090B0D]/55 text-[14px] leading-relaxed max-w-[200px]">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN ORDER FORM ── */}
      <section className="py-20" style={{ background: '#EEF7FF' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.8fr] gap-12 items-start">
            {/* LEFT SIDEBAR */}
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Panel 1: Accepted Files */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="bg-[#EEF7FF] rounded-2xl p-6"
              >
                <p className="font-bold text-[#090B0D] text-[15px] mb-4">Accepted Files</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { ext: 'PDF', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                    { ext: 'DOC', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                    { ext: 'JPG', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                    { ext: 'PNG', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                    { ext: 'PPT', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                  ].map((f, i) => (
                    <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${f.color} ${f.bg}`}>{f.ext}</span>
                  ))}
                </div>
                <p className="text-[12px] text-[#090B0D]/50">Other formats accepted — describe in message.</p>
              </motion.div>

              {/* Panel 2: Prefer WhatsApp */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="bg-[#EEF7FF] rounded-2xl p-6 border-l-4 border-[#00AEEF]"
              >
                <p className="font-bold text-[#090B0D] text-[15px] mb-2">Prefer WhatsApp?</p>
                <p className="text-[13px] text-[#090B0D]/55 mb-4 leading-relaxed">
                  Send your file directly on WhatsApp for the fastest response.
                </p>
                <motion.a
                  href="https://wa.me/923312478337"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#1eb857] transition-all"
                >
                  <WhatsAppIcon />
                  Send on WhatsApp
                </motion.a>
              </motion.div>

              {/* Panel 3: You Can Send */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="bg-[#EEF7FF] rounded-2xl p-6"
              >
                <p className="font-bold text-[#090B0D] text-[15px] mb-4">You Can Send:</p>
                <ul className="space-y-2.5">
                  {[
                    'Assignment', 'PDF Document', 'Photograph',
                    'Design File', 'Printing File',
                    'Customized Requirement', 'Bulk Order Requirement',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#00AEEF]/12 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[13px] text-[#090B0D]/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Panel 4: Privacy note */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="flex items-start gap-2.5"
              >
                <svg className="w-4 h-4 text-[#00AEEF]/60 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-[11px] text-[#090B0D]/40 leading-relaxed">
                  Your files are used only to prepare your order and are not shared with third parties.
                </p>
              </motion.div>
            </div>

            {/* RIGHT — Order Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(7,26,43,0.08)] border border-[#e8edf8] p-8">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-14">
                    <div className="w-20 h-20 rounded-full bg-[#00AEEF]/10 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#090B0D] mb-3">Requirement Submitted!</h3>
                    <p className="text-[#090B0D]/55 text-[15px] mb-8 leading-relaxed max-w-sm">
                      We'll contact you to confirm details before processing your order.
                    </p>
                    <motion.a
                      href="https://wa.me/923312478337"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#1eb857] transition-all"
                    >
                      <WhatsAppIcon />
                      Continue on WhatsApp
                    </motion.a>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-[#090B0D] mb-6">Your Order Requirement</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Row 1: Name + Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Your full name"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="03xx-xxxxxxx"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Row 2: WhatsApp + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">WhatsApp <span className="text-[#090B0D]/30">(if different)</span></label>
                          <input
                            type="tel"
                            value={form.whatsapp}
                            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                            placeholder="03xx-xxxxxxx"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Email <span className="text-[#090B0D]/30">(optional)</span></label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Service Category */}
                      <div>
                        <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Service Category *</label>
                        <select
                          required
                          value={form.category}
                          onChange={e => handleCategoryChange(e.target.value)}
                          className={inputClass}
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

                      {/* File Upload */}
                      <div>
                        <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Upload File</label>
                        <label
                          htmlFor="file-input"
                          className="flex flex-col items-center justify-center border-2 border-dashed border-[#c8d6f0] rounded-2xl p-10 text-center hover:border-[#071A2B] hover:bg-[#EEF7FF] transition-all cursor-pointer group"
                        >
                          {file ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="text-left">
                                <p className="text-[14px] font-semibold text-[#071A2B] truncate max-w-[240px]">{file.name}</p>
                                <p className="text-[12px] text-[#090B0D]/40">{(file.size / 1024).toFixed(0)} KB — Click to change</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-12 h-12 text-[#071A2B]/30 mb-4 group-hover:text-[#071A2B]/50 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-[15px] font-medium text-[#090B0D]/60 mb-1">Drop your file here or click to browse</p>
                              <p className="text-[12px] text-[#090B0D]/35 mb-4">Max 20MB</p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {['PDF', 'DOC', 'JPG', 'PNG', 'PPT'].map((ext, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#00AEEF]/8 text-[#071A2B] border border-[#00AEEF]/15"
                                  >
                                    {ext}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                          onChange={e => setFile(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {showPrintFields && (
                          <motion.div
                            key="print-fields"
                            initial={{ height: 0, opacity: 0, y: -6, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, y: 0, marginTop: 20 }}
                            exit={{ height: 0, opacity: 0, y: -6, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="space-y-5 overflow-hidden"
                          >
                            {/* Row: Quantity + Printing Type */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Quantity</label>
                                <input
                                  type="text"
                                  value={form.quantity}
                                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                                  placeholder="e.g. 50 copies"
                                  className={inputClass}
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Printing Type</label>
                                <select
                                  value={form.printingType}
                                  onChange={e => setForm({ ...form, printingType: e.target.value })}
                                  className={inputClass}
                                >
                                  <option value="color">Color</option>
                                  <option value="bw">Black &amp; White</option>
                                  <option value="not-applicable">Not Applicable</option>
                                </select>
                              </div>
                            </div>

                            {/* Row: Paper + Size */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Paper / Material</label>
                                <input
                                  type="text"
                                  value={form.paper}
                                  onChange={e => setForm({ ...form, paper: e.target.value })}
                                  placeholder="e.g. Plain, Glossy, Card Stock"
                                  className={inputClass}
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Size</label>
                                <input
                                  type="text"
                                  value={form.size}
                                  onChange={e => setForm({ ...form, size: e.target.value })}
                                  placeholder="e.g. A4, A3, Custom"
                                  className={inputClass}
                                />
                              </div>
                            </div>

                            {/* Special Requirements */}
                            <div>
                              <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Special Requirements</label>
                              <input
                                type="text"
                                value={form.special}
                                onChange={e => setForm({ ...form, special: e.target.value })}
                                placeholder="Binding, lamination, spiral, etc."
                                className={inputClass}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message */}
                      <div>
                        <label className="block text-[13px] font-medium text-[#090B0D]/55 mb-1.5">Additional Message</label>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          placeholder="Any other details or instructions..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      {/* Privacy note */}
                      <p className="text-[12px] text-[#090B0D]/35 flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#090B0D]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Your files and information are used only to process your order. We don't share them with third parties.
                      </p>

                      {/* Submit */}
                      {submitError && <p role="alert" className="text-sm text-[#8D004F] bg-[#EC008C]/10 border border-[#EC008C]/25 rounded-xl p-3">{submitError}</p>}
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ y: -3 }}
                        className="w-full bg-gradient-to-r from-[#071A2B] to-[#00AEEF] text-white font-semibold text-[16px] px-6 py-4 rounded-xl hover:from-[#0b263d] hover:to-[#00AEEF] transition-all"
                      >
                        {sending ? 'Submitting…' : 'Submit Requirement →'}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative bg-[#071A2B] py-20 overflow-hidden">
        {/* Floating doc shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute top-6 right-[12%] opacity-[0.045]" width="56" height="72" viewBox="0 0 56 72" fill="none">
            <rect x="1" y="1" width="54" height="70" rx="5" stroke="white" strokeWidth="1.5" />
            <line x1="11" y1="20" x2="45" y2="20" stroke="white" strokeWidth="1" />
            <line x1="11" y1="32" x2="45" y2="32" stroke="white" strokeWidth="1" />
            <line x1="11" y1="44" x2="33" y2="44" stroke="white" strokeWidth="1" />
          </svg>
          <svg className="absolute bottom-6 left-[8%] opacity-[0.04]" width="48" height="64" viewBox="0 0 48 64" fill="none">
            <rect x="1" y="1" width="46" height="62" rx="4" stroke="white" strokeWidth="1.5" />
            <line x1="10" y1="18" x2="38" y2="18" stroke="white" strokeWidth="1" />
            <line x1="10" y1="28" x2="38" y2="28" stroke="white" strokeWidth="1" />
            <line x1="10" y1="38" x2="28" y2="38" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <motion.h2
            className="font-bold leading-tight mb-10"
            style={{ fontSize: 'clamp(34px,4.5vw,58px)' }}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="text-white">Ready to Get </span>
            <span className="text-[#00AEEF]">Started?</span>
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
              href="https://wa.me/923312478337"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#1eb857] transition-all"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </motion.a>
            <motion.div variants={fadeUp}>
              <Link to="/contact">
                <motion.span
                  whileHover={{ y: -3 }}
                  className="inline-flex items-center gap-2 border-2 border-[#00AEEF] text-[#00AEEF] font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#00AEEF] hover:text-white transition-all cursor-pointer"
                >
                  Contact Us
                </motion.span>
              </Link>
            </motion.div>
            <motion.a
              variants={fadeUp}
              href={telHref}
              aria-label="Call Mateen Documentation"
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
