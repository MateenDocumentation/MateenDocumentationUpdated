import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SeoHead from './SeoHead';

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  heroPage?: boolean;
}

export default function Layout({
  children,
  title = 'Mateen Documentation — Where Printing Meets Documentation',
  description = 'Where Printing Meets Documentation — Printing, Documentation, Biometric, Customized Printing & More in H Block, North Nazimabad.',
  heroPage,
}: Props) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF7FF]">
      <SeoHead fallbackTitle={title} fallbackDescription={description} />
      <Header />
      {/* Home hero is full-bleed (header is transparent overlay), inner pages need header offset */}
      <main className={`flex-1 ${isHome || heroPage ? '' : 'pt-[72px]'} pb-16 lg:pb-0`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
