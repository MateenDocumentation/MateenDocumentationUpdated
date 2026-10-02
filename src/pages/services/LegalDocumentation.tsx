import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Affidavits & Declarations' }, { name: 'Applications' },
  { name: 'Official Letters' }, { name: 'Agreements' },
  { name: 'Sale Agreements' }, { name: 'Purchase / Transfer Documentation' },
  { name: 'Rent / Tenancy Agreements' }, { name: 'Partnership Agreements' },
  { name: 'Power of Attorney Documentation' }, { name: 'Will Deeds' },
  { name: 'Indemnity Bonds' }, { name: 'Undertakings' },
  { name: 'General Legal Documentation' }, { name: 'Personal Documentation' },
  { name: 'Legal Document Drafting' }, { name: 'Official Document Preparation' },
  { name: 'Company Letters' }, { name: 'Official Documents' },
];

const related = [
  { label: 'Business Documentation', to: '/services/business-documentation' },
  { label: 'Vehicle Documentation', to: '/services/vehicle-documentation' },
  { label: 'NADRA / Biometric', to: '/services/nadra-biometric-public-facilitation' },
];

export default function LegalDocumentation() {
  return (
    <ServicePage
      title="Legal Documentation"
      metaTitle="Legal Documentation Services — Mateen Documentation"
      metaDesc="Affidavits, agreements, rent agreements, power of attorney, will deeds and official document preparation at Mateen Documentation, North Nazimabad."
      breadcrumb="Legal Documentation"
      heroSubtitle="Professional documentation assistance and drafting for individuals, families and businesses."
      heroImage="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&auto=format"
      intro="Mateen Documentation provides documentation preparation, drafting and facilitation assistance for a wide range of legal and official documents. We assist with affidavits, agreements, rent agreements, power of attorney, will deeds, and more. Please note: Mateen Documentation provides documentation assistance and drafting services — we are not a law firm. For legal advice, consult a qualified legal professional."
      note="Mateen Documentation provides documentation assistance, drafting and facilitation. We are not a law firm. This service does not constitute legal advice."
      services={services}
      ctaLabel="Discuss Your Documentation Requirement"
      ctaWhatsApp="Hi, I need legal documentation assistance at Mateen Documentation."
      related={related}
    />
  );
}
