import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Bulk Black & White Printing' }, { name: 'Bulk Color Printing' },
  { name: 'Bulk Photocopy' }, { name: 'Bulk Assignment Printing' },
  { name: 'Bulk School / College Printing' }, { name: 'Bulk Business Printing' },
  { name: 'Bulk Customized Printing' }, { name: 'Bulk Card Printing' },
  { name: 'Bulk Sticker Printing' }, { name: 'Bulk Label Printing' },
  { name: 'Custom Quantity Orders' }, { name: 'Custom Size Orders' },
  { name: 'Custom Printing Requirements' },
];

const audiences = ['Students', 'Schools', 'Colleges', 'Offices', 'Businesses', 'Organizations'];

const related = [
  { label: 'Printing & Photocopy', to: '/services/printing-photocopy' },
  { label: 'Student Assignment Services', to: '/services/student-assignment-services' },
  { label: 'Customized Printing', to: '/services/customized-printing' },
];

export default function BulkPrinting() {
  return (
    <ServicePage
      title="Bulk Printing"
      metaTitle="Bulk Printing Services — Mateen Documentation"
      metaDesc="Bulk B&W and color printing, bulk photocopy, bulk assignment printing, bulk cards, stickers and labels at Mateen Documentation, North Nazimabad."
      breadcrumb="Bulk Printing"
      heroSubtitle="Large-quantity printing for students, schools, colleges, offices and organizations."
      heroImage="https://images.unsplash.com/photo-1693031630369-bd429a57f115?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation handles bulk printing orders of all kinds — from assignment printing for students to business printing for offices and bulk customized products for organizations. Whether you need 50 copies or 5,000, send your requirement to get a quote. We accommodate custom sizes, quantities and special printing requirements."
      services={services}
      ctaLabel="Request a Bulk Order Quote"
      ctaWhatsApp="Hi, I need bulk printing at Mateen Documentation."
      related={related}
    >
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <p className="font-semibold text-[#071A2B] mb-3 text-sm">We Serve</p>
        <div className="flex flex-wrap gap-2">
          {audiences.map(a => (
            <span key={a} className="bg-[#EEEAE1] text-[#071A2B] text-xs font-medium px-3 py-1.5 rounded-full">{a}</span>
          ))}
        </div>
      </div>
    </ServicePage>
  );
}
