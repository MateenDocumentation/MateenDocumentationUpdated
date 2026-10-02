import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Visiting Card Design & Printing' }, { name: 'Letterhead Design' },
  { name: 'Company Profile' }, { name: 'Business Document Design' },
  { name: 'Flyers' }, { name: 'Brochures' },
  { name: 'Posters' }, { name: 'Promotional Material' },
  { name: 'Stickers' }, { name: 'Labels' },
  { name: 'Certificate Design' }, { name: 'Customized Forms' },
  { name: 'Basic Social Media Creatives' }, { name: 'Customized Business Designs' },
];

const related = [
  { label: 'Business Documentation', to: '/services/business-documentation' },
  { label: 'Printing & Photocopy', to: '/services/printing-photocopy' },
  { label: 'Customized Printing', to: '/services/customized-printing' },
];

export default function DesignBranding() {
  return (
    <ServicePage
      title="Design & Branding"
      metaTitle="Design & Branding Services — Mateen Documentation"
      metaDesc="Visiting card design, letterheads, brochures, flyers, posters, certificates and business design services at Mateen Documentation, North Nazimabad."
      breadcrumb="Design & Branding"
      heroSubtitle="Professional design and print services for businesses, offices and organizations."
      heroImage="https://images.unsplash.com/photo-1642480532034-362360552ccb?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation provides design and printing services for business identity and promotional needs. From visiting cards and company letterheads to brochures, flyers, posters and certificates — we design and print professional materials. Discuss your requirements with us and we'll create designs suited to your business."
      services={services}
      ctaLabel="Discuss Your Design"
      ctaWhatsApp="Hi, I need design and branding services at Mateen Documentation."
      related={related}
    />
  );
}
