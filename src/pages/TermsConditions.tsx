import LegalPage, { type LegalSection } from '../components/LegalPage';
import { useCmsSection, str, arr } from '../cms/useCmsPage';
import { useCms } from '../cms/CmsContext';

const sections: LegalSection[] = [
  {
    title: 'Services',
    paragraphs: [
      'Mateen Documentation provides printing, photocopying, customized printing, documentation assistance, student-related printing services, business documentation, public facilitation and other related services.',
      'Availability of individual services may vary depending on requirements, documents provided and other circumstances.',
    ],
  },
  {
    title: 'Customer Information',
    paragraphs: [
      'Customers are responsible for providing accurate information, instructions and files required to complete their requested service.',
      'Mateen Documentation is not responsible for delays or errors caused by incorrect, incomplete or unclear information supplied by the customer.',
    ],
  },
  {
    title: 'Uploaded Documents and Files',
    paragraphs: [
      'Customers confirm that they have the right and authority to submit any documents, photographs, designs or other files uploaded or provided to Mateen Documentation.',
      'We reserve the right to refuse any request involving unlawful, inappropriate or unauthorised material.',
    ],
  },
  {
    title: 'Printing and Customized Orders',
    paragraphs: ['Customers should carefully confirm the following before final production:'],
    bullets: [
      'Quantity',
      'Size',
      'Paper or material',
      'Colour requirements',
      'Design',
      'Content',
      'Finishing requirements',
    ],
    afterParagraphs: [
      'Minor colour differences may occur between digital screens and printed output due to differences in printers, materials, screens and colour reproduction.',
    ],
  },
  {
    title: 'Payments',
    paragraphs: [
      'Pricing may depend on the type, quantity, materials, complexity and requirements of the requested service.',
      'Where applicable, customers may be asked to confirm pricing or make payment before work begins.',
    ],
  },
  {
    title: 'Turnaround Times',
    paragraphs: [
      'Any estimated completion or delivery time is provided in good faith and may vary depending on workload, quantity, availability of materials, technical requirements or third-party processing.',
    ],
  },
  {
    title: 'Documentation & Facilitation Services',
    paragraphs: [
      'Mateen Documentation provides documentation preparation and facilitation assistance.',
      'Unless expressly stated otherwise, Mateen Documentation is not a government department, authority, law firm, insurer or official issuing body.',
      "Government, institutional or third-party approvals are subject to the relevant authority's own procedures and cannot be guaranteed by Mateen Documentation.",
    ],
  },
  {
    title: 'Errors and Corrections',
    paragraphs: [
      'Customers should review information, spelling, names, numbers, layouts and other important details before approving final printing or document preparation whenever an approval opportunity is provided.',
    ],
  },
  {
    title: 'Website Information',
    paragraphs: [
      'We aim to keep information on the website accurate and current. However, service details, availability and content may be changed or updated without prior notice.',
    ],
  },
  {
    title: 'Third-Party Links',
    paragraphs: [
      'Our website may contain links to services such as Google Maps or WhatsApp. Mateen Documentation is not responsible for the operation, availability or policies of third-party platforms.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      'To the extent permitted by applicable law, Mateen Documentation will not be responsible for indirect or consequential losses arising from the use of this website, customer-supplied information, third-party services or circumstances outside our reasonable control.',
    ],
  },
  {
    title: 'Changes to These Terms',
    paragraphs: [
      'These Terms & Conditions may be updated periodically. The latest version published on the website will apply.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      <>
        For questions regarding these terms:
        <br /><br />
        <strong>Mateen Documentation</strong>
        <br />
        Shop# 1, A&amp;Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi
        <br />
        Phone: <a className="text-[#071A2B] font-semibold hover:underline" href="tel:+923312478337">+92 331 2478337</a>
        <br />
        Email: <a className="text-[#071A2B] font-semibold hover:underline" href="mailto:mateendocumentation@gmail.com">mateendocumentation@gmail.com</a>
      </>,
    ],
  },
];

const FALLBACK_INTRO = 'By accessing the Mateen Documentation website or submitting a service request, you agree to the following terms and conditions.';

export default function TermsConditions() {
  const { siteSettings } = useCms();
  const cmsSection = useCmsSection('/terms-and-conditions', 'rich_text');
  const cmsSections = arr<LegalSection>(cmsSection, 'sections');
  const introduction = str(cmsSection, 'introduction', FALLBACK_INTRO);
  const pageTitle = str(cmsSection, 'page_title', 'Terms & Conditions');

  const phone = siteSettings?.phone ?? '+923312478337';
  const email = siteSettings?.email ?? 'mateendocumentation@gmail.com';
  const address = siteSettings?.address ?? 'Shop# 1, A&Z Comforts, Near Saifee College, Block-H, North Nazimabad, Karachi';

  const contactSection: LegalSection = {
    title: 'Contact',
    paragraphs: [
      <>
        For questions regarding these terms:
        <br /><br />
        <strong>Mateen Documentation</strong>
        <br />
        {address}
        <br />
        Phone: <a className="text-[#071A2B] font-semibold hover:underline" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        <br />
        Email: <a className="text-[#071A2B] font-semibold hover:underline" href={`mailto:${email}`}>{email}</a>
      </>,
    ],
  };

  const baseSections = cmsSections.length ? cmsSections : sections;
  const resolvedSections = [
    ...baseSections.filter(s => s.title !== 'Contact'),
    contactSection,
  ];

  return (
    <LegalPage
      title={pageTitle}
      description="Terms and Conditions for using the Mateen Documentation website and requesting services."
      introduction={introduction}
      sections={resolvedSections}
    />
  );
}
