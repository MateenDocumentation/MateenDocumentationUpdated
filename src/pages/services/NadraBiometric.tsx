import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'NADRA e-Sahulat Facilitation' }, { name: 'Biometric Facilitation' },
  { name: 'Reference Biometric Facilitation' }, { name: 'CNIC Renewal Facilitation' },
  { name: 'CRC / Child Registration Certificate Facilitation' }, { name: 'Birth Certificate Facilitation' },
  { name: 'Death Certificate Facilitation' }, { name: 'Nikah Nama Facilitation' },
  { name: 'Other Public Facilitation' }, { name: 'Government Application Facilitation' },
  { name: 'Private Application Facilitation' }, { name: 'Online Form Filling' },
  { name: 'Online Application Assistance' }, { name: 'Document Upload Facilitation' },
  { name: 'Document Attestation Preparation & Facilitation' }, { name: 'General Documentation Facilitation' },
];

const related = [
  { label: 'Legal Documentation', to: '/services/legal-documentation' },
  { label: 'Vehicle Documentation', to: '/services/vehicle-documentation' },
  { label: 'Business Documentation', to: '/services/business-documentation' },
];

export default function NadraBiometric() {
  return (
    <ServicePage
      title="NADRA / Biometric / Public Facilitation"
      metaTitle="NADRA, Biometric & Public Facilitation — Mateen Documentation"
      metaDesc="NADRA e-Sahulat, CNIC renewal, birth certificate, death certificate, Nikah Nama and biometric facilitation at Mateen Documentation, North Nazimabad."
      breadcrumb="NADRA / Biometric / Public Facilitation"
      heroSubtitle="NADRA e-Sahulat facilitation, biometric assistance and government application support."
      heroImage="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=600&fit=crop&auto=format"
      intro="Mateen Documentation provides facilitation and assistance for NADRA e-Sahulat services, biometric processes, CNIC renewal, CRC, birth and death certificates, Nikah Nama, and a wide range of government and private applications. We assist you in completing forms, uploading documents, and navigating the process — saving you time and effort."
      note="Mateen Documentation provides facilitation and documentation assistance. We are not a government department unless specifically stated otherwise. We do not guarantee approval outcomes."
      services={services}
      ctaLabel="Ask About Biometric & NADRA Facilitation"
      ctaWhatsApp="Hi, I need NADRA/biometric facilitation at Mateen Documentation."
      related={related}
    />
  );
}
