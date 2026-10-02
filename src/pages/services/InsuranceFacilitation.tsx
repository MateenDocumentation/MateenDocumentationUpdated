import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Third-Party Motor Insurance Facilitation', desc: 'Facilitation assistance for third-party motor insurance.' },
  { name: 'Motor Insurance Documentation Assistance', desc: 'Help with insurance-related documents and paperwork.' },
  { name: 'Insurance Forms', desc: 'Assistance with filling and preparing insurance forms.' },
  { name: 'Supporting Insurance Documentation', desc: 'Preparation of supporting documents for insurance purposes.' },
  { name: 'Insurance Facilitation Services', desc: 'General insurance facilitation and document support.' },
];

const related = [
  { label: 'Vehicle Documentation', to: '/services/vehicle-documentation' },
  { label: 'Legal Documentation', to: '/services/legal-documentation' },
  { label: 'Business Documentation', to: '/services/business-documentation' },
];

export default function InsuranceFacilitation() {
  return (
    <ServicePage
      title="Insurance Facilitation"
      metaTitle="Insurance Facilitation Services — Mateen Documentation"
      metaDesc="Third-party motor insurance facilitation, insurance forms and supporting documentation at Mateen Documentation, H Block, North Nazimabad."
      breadcrumb="Insurance Facilitation"
      heroSubtitle="Motor insurance facilitation and documentation assistance for individuals and vehicle owners."
      heroImage="https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&auto=format"
      intro="Mateen Documentation provides facilitation and documentation assistance for third-party motor insurance and related requirements. We help with forms, paperwork, and supporting documents. Please note: Mateen Documentation is not an insurance company — we provide facilitation and documentation assistance only."
      note="Mateen Documentation provides insurance facilitation and documentation assistance. We are not an insurance company and do not issue insurance policies."
      services={services}
      ctaLabel="Ask About Insurance Facilitation"
      ctaWhatsApp="Hi, I need insurance facilitation at Mateen Documentation."
      related={related}
    />
  );
}
