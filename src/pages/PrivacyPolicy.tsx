import LegalPage, { type LegalSection } from '../components/LegalPage';

const sections: LegalSection[] = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'We may collect information including:',
    ],
    bullets: [
      'Full name',
      'Phone number',
      'WhatsApp number',
      'Email address',
      'Service requirements',
      'Messages and enquiries',
      'Documents, images, PDFs or other files voluntarily uploaded through our website',
      'Order-related information submitted through our online forms',
    ],
    afterParagraphs: [
      'We only collect information that is necessary to respond to your enquiry, process your service request, communicate with you, or provide the requested service.',
    ],
  },
  {
    title: 'Uploaded Files and Documents',
    paragraphs: [
      'Files uploaded through our website may contain personal or confidential information. These files are used only for the purpose of reviewing, preparing, printing, processing or completing the service requested by the customer.',
      'Customers should only upload documents they are authorised to share.',
    ],
  },
  {
    title: 'How We Use Your Information',
    paragraphs: ['Information submitted to Mateen Documentation may be used to:'],
    bullets: [
      'Respond to enquiries',
      'Process service and printing requests',
      'Prepare quotations',
      'Contact customers regarding their orders',
      'Provide customer support',
      'Complete requested documentation or printing services',
      'Improve our website and services',
    ],
    afterParagraphs: ['We do not sell or rent customer personal information to third parties.'],
  },
  {
    title: 'Third-Party Services',
    paragraphs: ['Our website may use third-party services such as:'],
    bullets: [
      'Email delivery providers',
      'Website hosting providers',
      'Google Maps',
      'WhatsApp',
      'Analytics or website performance services',
    ],
    afterParagraphs: [
      'These services may process limited information according to their own privacy policies.',
    ],
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We take reasonable precautions to protect information submitted through our website. However, no internet-based system can guarantee absolute security.',
    ],
  },
  {
    title: 'External Links',
    paragraphs: [
      'Our website may contain links to external websites or services. Mateen Documentation is not responsible for the privacy practices or content of third-party websites.',
    ],
  },
  {
    title: 'Your Information',
    paragraphs: [
      'You may contact us if you would like to ask about personal information submitted through our website or request correction or deletion where reasonably applicable.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      <>
        For privacy-related enquiries:
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

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Privacy Policy for Mateen Documentation website enquiries, uploaded files and online orders."
      introduction="Mateen Documentation respects your privacy and is committed to protecting the personal information you provide when using our website, submitting an enquiry, placing an online order, contacting us through WhatsApp, or using our services."
      sections={sections}
    />
  );
}
