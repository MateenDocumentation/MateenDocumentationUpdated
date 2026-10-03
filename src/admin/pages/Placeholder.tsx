interface Props {
  title: string;
  description: string;
  phase?: string;
}

export default function Placeholder({ title, description, phase = 'Phase 3' }: Props) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div className="max-w-lg bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF7FF] flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#071A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        <span className="inline-block text-xs font-bold text-[#071A2B] bg-[#EEF7FF] px-3 py-1.5 rounded-full">
          Coming in {phase}
        </span>
      </div>
    </div>
  );
}
