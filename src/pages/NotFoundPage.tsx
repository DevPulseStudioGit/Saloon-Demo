import React from 'react';

interface NotFoundPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigateTo }) => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
    <p className="text-xs uppercase tracking-[0.25em] text-[#A77A7E]">404</p>
    <h1 className="text-4xl font-serif-title font-semibold text-[#26231E]">Page not found</h1>
    <p className="text-sm text-[#77716C]">The page you requested is not part of the Luma Atelier experience.</p>
    <button onClick={() => navigateTo('home')} className="px-5 py-2.5 rounded bg-[#26231E] text-white text-xs font-semibold">
      Return Home
    </button>
  </div>
);
