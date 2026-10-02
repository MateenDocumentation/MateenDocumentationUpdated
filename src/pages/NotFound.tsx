import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout
      title="Page Not Found | Mateen Documentation"
      description="The requested page could not be found on the Mateen Documentation website."
    >
      <section className="min-h-[62vh] bg-[#EEF7FF] flex items-center">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-20 text-center">
          <p className="text-[#00AEEF] text-xs font-bold tracking-[0.2em] uppercase mb-4">404 Error</p>
          <h1 className="text-[#071A2B] font-bold text-[clamp(2.4rem,6vw,4.8rem)] leading-tight">
            Page Not Found
          </h1>
          <p className="mt-5 text-[#090B0D]/65 text-base leading-relaxed max-w-xl mx-auto">
            The page you requested does not exist or may have moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl bg-[#071A2B] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Return Home
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-xl border border-[#071A2B]/20 px-6 py-3 text-sm font-semibold text-[#071A2B] transition-colors hover:bg-[#071A2B] hover:text-white"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
