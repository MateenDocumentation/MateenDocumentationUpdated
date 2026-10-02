import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Company Letterheads' }, { name: 'Experience Certificates' },
  { name: 'Salary Certificates' }, { name: 'Salary Slips' },
  { name: 'Business Letters' }, { name: 'Business Applications' },
  { name: 'Employment Documentation' }, { name: 'Office Documentation' },
  { name: 'Customized Business Documents' }, { name: 'Professional Document Drafting' },
  { name: 'Document Formatting' }, { name: 'Company Documents' },
  { name: 'Official Certificates' }, { name: 'Customized Business Forms' },
];

const related = [
  { label: 'Legal Documentation', to: '/services/legal-documentation' },
  { label: 'Design & Branding', to: '/services/design-branding' },
  { label: 'Printing & Photocopy', to: '/services/printing-photocopy' },
];

export default function BusinessDocumentation() {
  return (
    <ServicePage
      title="Business Documentation"
      metaTitle="Business Documentation Services — Mateen Documentation"
      metaDesc="Company letterheads, experience certificates, salary certificates, business letters and professional document drafting at Mateen Documentation, North Nazimabad."
      breadcrumb="Business Documentation"
      heroSubtitle="Professional business document drafting, formatting and preparation for offices and companies."
      heroImage="https://images.unsplash.com/photo-1631540700410-dd61be60e395?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation assists offices, businesses and organizations with a wide range of business documents. We prepare company letterheads, experience and salary certificates, salary slips, business letters, employment documents, and customized business forms — professionally drafted and formatted to your requirements."
      services={services}
      ctaLabel="Get Business Documentation Assistance"
      ctaWhatsApp="Hi, I need business documentation at Mateen Documentation."
      related={related}
    />
  );
}
