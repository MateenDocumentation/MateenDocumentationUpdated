import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Office Stationery', desc: 'Pens, files, folders, registers and standard office supplies.' },
  { name: 'School Stationery', desc: 'Notebooks, copies, pencils and general school supplies.' },
  { name: 'Business Stationery', desc: 'Branded and unbranded stationery for business use.' },
  { name: 'Customized Stationery', desc: 'Personalized stationery items as per your specifications.' },
];

const related = [
  { label: 'Business Documentation', to: '/services/business-documentation' },
  { label: 'Design & Branding', to: '/services/design-branding' },
  { label: 'Printing & Photocopy', to: '/services/printing-photocopy' },
];

export default function Stationery() {
  return (
    <ServicePage
      title="Office & School Stationery"
      metaTitle="Office & School Stationery — Mateen Documentation"
      metaDesc="Office, school, business and customized stationery at Mateen Documentation, H Block, North Nazimabad."
      breadcrumb="Stationery"
      heroSubtitle="Office, school, business and customized stationery — all available at one location."
      heroImage="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=600&fit=crop&auto=format"
      intro="Mateen Documentation provides stationery for offices, schools and businesses. Whether you need regular office supplies, school stationery for students, or customized stationery items for your business — we make it convenient by keeping it all at one location. Contact us to discuss your specific stationery requirements."
      services={services}
      ctaLabel="Enquire About Stationery"
      ctaWhatsApp="Hi, I need stationery items at Mateen Documentation."
      related={related}
    />
  );
}
