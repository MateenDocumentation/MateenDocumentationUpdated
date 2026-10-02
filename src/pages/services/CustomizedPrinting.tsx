import ServicePage from '../../components/ServicePage';

const services = [
  { name: 'Customized Mugs' }, { name: 'Customized Love Cards' },
  { name: 'Personalized Cards' }, { name: 'Customized Designs' },
  { name: 'Customized Stickers' }, { name: 'Customized Labels' },
  { name: 'Customized Photo Printing' }, { name: 'Personalized Printing' },
  { name: 'Customized Products' }, { name: 'Customized Gifts' },
  { name: 'Event & Occasion Printing' }, { name: 'Bulk Customized Orders' },
];

const related = [
  { label: 'Cards & Photo Frames', to: '/services/cards-photo-frames' },
  { label: 'Design & Branding', to: '/services/design-branding' },
  { label: 'Bulk Printing', to: '/services/bulk-printing' },
];

export default function CustomizedPrinting() {
  return (
    <ServicePage
      title="Customized Printing"
      metaTitle="Customized Printing Services — Mateen Documentation"
      metaDesc="Custom mugs, personalized cards, customized stickers, gifts, event printing and bulk customized orders at Mateen Documentation, North Nazimabad."
      breadcrumb="Customized Printing"
      heroSubtitle="Make it personal — customized mugs, cards, gifts, stickers and more for every occasion."
      heroImage="https://images.unsplash.com/photo-1492051337034-f05bb38b404b?w=1400&h=900&fit=crop&auto=format&q=85"
      intro="Mateen Documentation offers a wide range of customized printing products. From personalized mugs and love cards to custom stickers, labels and gifts — we bring your ideas to life. Perfect for personal use, special occasions, events and bulk customized orders. Send your design file online or discuss your idea with us."
      services={services}
      ctaLabel="Request Customized Printing"
      ctaWhatsApp="Hi, I need customized printing at Mateen Documentation."
      related={related}
    />
  );
}
