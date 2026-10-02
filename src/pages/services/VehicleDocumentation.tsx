import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Vehicle Sale Agreement / Transfer Documents', desc: 'Preparation and drafting of vehicle sale agreements.' },
  { name: 'Vehicle Ownership & Transfer Facilitation', desc: 'Assistance with ownership transfer documentation.' },
  { name: 'Vehicle File Loss Documentation Facilitation', desc: 'Support for lost vehicle file documentation processes.' },
  { name: 'Duplicate Sale Invoice / Sale Certificate Facilitation', desc: 'Assistance with duplicate sale invoice documentation.' },
  { name: 'Other Vehicle Documentation Facilitation', desc: 'General vehicle-related document assistance.' },
];

const related = [
  { label: 'Legal Documentation', to: '/services/legal-documentation' },
  { label: 'Insurance Facilitation', to: '/services/insurance-facilitation' },
  { label: 'Business Documentation', to: '/services/business-documentation' },
];

export default function VehicleDocumentation() {
  return (
    <ServicePage
      title="Vehicle Documentation"
      metaTitle="Vehicle Documentation Services — Mateen Documentation"
      metaDesc="Vehicle sale agreements, ownership transfer, file loss documentation and duplicate sale certificate facilitation at Mateen Documentation, North Nazimabad."
      breadcrumb="Vehicle Documentation"
      heroSubtitle="Vehicle sale agreements, transfer documentation, file loss facilitation and related services."
      heroImage="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format"
      intro="Mateen Documentation provides facilitation and documentation assistance for vehicle-related requirements. From sale agreements and ownership transfer documents to file loss facilitation and duplicate sale certificates — we help you prepare and manage the required paperwork efficiently."
      services={services}
      ctaLabel="Ask About Vehicle Documentation"
      ctaWhatsApp="Hi, I need vehicle documentation assistance at Mateen Documentation."
      related={related}
    />
  );
}
