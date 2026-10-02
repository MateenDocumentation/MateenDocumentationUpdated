import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Print School Assignments' }, { name: 'College Assignments' },
  { name: 'University Assignments' }, { name: 'Assignment Typing' },
  { name: 'Assignment Editing' }, { name: 'Assignment Formatting' },
  { name: 'Assignment Printing' }, { name: 'Project Printing' },
  { name: 'PDF Assignment Preparation' }, { name: 'English & Urdu Typing' },
  { name: 'Scanning' }, { name: 'Digital File Conversion' },
  { name: 'Customized Student Requirements' }, { name: 'Online Assignment Orders' },
  { name: 'Bulk Academic Printing' },
];

const related = [
  { label: 'Printing & Photocopy', to: '/services/printing-photocopy' },
  { label: 'Bulk Printing', to: '/services/bulk-printing' },
  { label: 'Design & Branding', to: '/services/design-branding' },
];

export default function StudentAssignment() {
  return (
    <ServicePage
      title="Student & Assignment Services"
      metaTitle="Student & Assignment Services — Mateen Documentation"
      metaDesc="School, college and university assignment printing, typing, editing and formatting services. Submit online or visit Mateen Documentation in H Block, North Nazimabad."
      breadcrumb="Student & Assignment Services"
      heroSubtitle="Fast, reliable assignment and academic printing services for school, college and university students."
      heroImage="https://images.unsplash.com/photo-1468779036391-52341f60b55d?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation makes academic work easy for students at every level. We handle school, college and university assignments — from typing and formatting to printing and binding. Submit your files online via WhatsApp or our order form, or visit us directly. We support English and Urdu documents, PDFs, and bulk academic printing."
      services={services}
      ctaLabel="Send Your Assignment Online"
      ctaWhatsApp="Hi, I need student assignment printing at Mateen Documentation."
      related={related}
    />
  );
}
