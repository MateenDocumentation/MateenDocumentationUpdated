import Layout from './Layout';

export type LegalSection = {
  title: string;
  paragraphs?: React.ReactNode[];
  bullets?: string[];
  afterParagraphs?: React.ReactNode[];
};

interface LegalPageProps {
  title: string;
  description: string;
  introduction: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, description, introduction, sections }: LegalPageProps) {
  return (
    <Layout title={`${title} | Mateen Documentation`} description={description}>
      <section className="relative overflow-hidden bg-[#071A2B] py-16 lg:py-20">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -right-20 -top-32 size-80 rounded-full bg-[#00AEEF]/8 blur-3xl" />
          <div className="absolute bottom-0 left-[12%] flex h-1 w-28 overflow-hidden">
            <span className="flex-1 bg-[#00AEEF]" />
            <span className="flex-1 bg-[#EC008C]" />
            <span className="flex-1 bg-[#FFD400]" />
            <span className="flex-1 bg-[#090B0D]" />
          </div>
        </div>
        <div className="relative max-w-[920px] mx-auto px-6 lg:px-10">
          <p className="text-[#00AEEF] text-xs font-bold tracking-[0.2em] uppercase mb-4">Legal</p>
          <h1 className="text-white font-bold leading-tight text-[clamp(2.4rem,5vw,4.4rem)]">{title}</h1>
          <p className="mt-5 text-white/55 text-sm">Last Updated: October 2026</p>
        </div>
      </section>

      <section className="bg-[#EEF7FF] py-16 lg:py-24">
        <article className="max-w-[820px] mx-auto px-6 lg:px-10 text-[#090B0D]">
          <p className="text-[17px] leading-8 text-[#090B0D]/72 mb-14">{introduction}</p>

          <div className="space-y-12">
            {sections.map(section => (
              <section key={section.title}>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#071A2B] mb-5">{section.title}</h2>
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="text-[16px] leading-8 text-[#090B0D]/70 mt-4 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 space-y-3 pl-5 list-disc marker:text-[#00AEEF]">
                    {section.bullets.map(item => (
                      <li key={item} className="pl-2 text-[16px] leading-7 text-[#090B0D]/70">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.afterParagraphs?.map((paragraph, index) => (
                  <p key={index} className="text-[16px] leading-8 text-[#090B0D]/70 mt-5">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  );
}
