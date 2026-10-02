import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Black & White Printing' }, { name: 'Color Printing' },
  { name: 'Black & White Photocopy' }, { name: 'Color Photocopy' },
  { name: 'A4 Printing' }, { name: 'A3 Printing' },
  { name: 'Custom Size Printing' }, { name: 'Single Printing' },
  { name: 'Bulk Printing' }, { name: 'Glossy Printing' },
  { name: 'Photo Printing' }, { name: 'Luster Printing' },
  { name: 'Sticker Printing' }, { name: 'Vinyl Printing' },
  { name: 'Label Printing' }, { name: 'Lamination' },
  { name: 'Scanning' }, { name: 'Typing' },
  { name: 'Composing' }, { name: 'PDF Creation & Editing' },
  { name: 'Document Formatting' }, { name: 'Digital File Conversion' },
  { name: 'Passport Size Photograph Printing' },
];

const related = [
  { label: 'Student Assignments', to: '/services/student-assignment-services' },
  { label: 'Bulk Printing', to: '/services/bulk-printing' },
  { label: 'Design & Branding', to: '/services/design-branding' },
];

export default function PrintingPhotocopy() {
  return (
    <ServicePage
      title="Printing & Photocopy"
      metaTitle="Printing & Photocopy Services — Mateen Documentation"
      metaDesc="Color and B&W printing, photocopying, scanning, photo printing, lamination, typing and document services at Mateen Documentation, H Block North Nazimabad."
      breadcrumb="Printing & Photocopy"
      heroSubtitle="High-quality printing for individuals, students, offices and businesses. Color and B&W — any size, any quantity."
      heroImage="https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation provides comprehensive printing and photocopy services for all needs. Whether you need a single page or a bulk print job, B&W documents or vibrant color prints, passport photographs or large-format stickers — we handle it all with quality and speed. You can visit us in person or send your file online."
      services={services}
      ctaLabel="Send Your Printing Requirement"
      ctaWhatsApp="Hi, I need printing services at Mateen Documentation."
      related={related}
    />
  );
}
