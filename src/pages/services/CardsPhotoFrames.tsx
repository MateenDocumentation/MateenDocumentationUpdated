import ServicePage from '../../components/ServicePage';

const frameServices = [
  { name: 'Custom Photo Frames' }, { name: 'Personalized Photo Frames' },
  { name: 'Family Photo Frames' }, { name: 'Couple Photo Frames' },
  { name: 'Birthday Photo Frames' }, { name: 'Wedding Photo Frames' },
  { name: 'Anniversary Photo Frames' }, { name: 'Event & Occasion Photo Frames' },
  { name: 'Photo Collage Frames' }, { name: 'Promotional Photo Frames' },
  { name: 'Business & Office Photo Frames' }, { name: 'Photo Frame Advertising' },
  { name: 'Bulk Photo Frame Orders' },
];

const cardServices = [
  { name: 'PVC Cards' }, { name: 'Glossy Cards' },
  { name: 'Luster Cards' }, { name: 'ID Cards' },
  { name: 'Customized Cards' }, { name: 'Photo Cards' },
  { name: 'Personalized Cards' }, { name: 'Card Design & Printing' },
];

const related = [
  { label: 'Customized Printing', to: '/services/customized-printing' },
  { label: 'Design & Branding', to: '/services/design-branding' },
  { label: 'Bulk Printing', to: '/services/bulk-printing' },
];

export default function CardsPhotoFrames() {
  return (
    <ServicePage
      title="PVC Cards & Photo Frames"
      metaTitle="PVC Cards & Photo Frames — Mateen Documentation"
      metaDesc="Custom photo frames, PVC cards, glossy cards, luster cards, ID cards and personalized cards at Mateen Documentation, H Block North Nazimabad."
      breadcrumb="Cards & Photo Frames"
      heroSubtitle="Custom photo frames for every occasion and professional PVC card printing."
      heroImage="https://images.unsplash.com/photo-1546696683-f2503ebc62c9?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation provides beautiful custom photo frames for birthdays, weddings, anniversaries, family moments, and business use — alongside professional PVC, glossy, luster and ID card printing. All frames and cards can be customized to your specifications."
      services={[...frameServices, ...cardServices]}
      ctaLabel="Order Cards & Frames"
      ctaWhatsApp="Hi, I need card or photo frame services at Mateen Documentation."
      related={related}
    >
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-[#071A2B] mb-3 text-base flex items-center gap-2"><span>🖼️</span> Photo Frames</p>
          <ul className="space-y-1.5">
            {frameServices.map(s => <li key={s.name} className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#071A2B] inline-block" />{s.name}</li>)}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-[#071A2B] mb-3 text-base flex items-center gap-2"><span>🪪</span> Card Printing</p>
          <ul className="space-y-1.5">
            {cardServices.map(s => <li key={s.name} className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#071A2B] inline-block" />{s.name}</li>)}
          </ul>
        </div>
      </div>
    </ServicePage>
  );
}
