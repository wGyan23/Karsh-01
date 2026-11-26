import React, { useState } from 'react';
import { ExternalLink, Globe, Library, Search } from 'lucide-react';
import type { AppLanguage, ClassLevel, GroundedSource } from '../types/edugenius';
import { CLASS_LEVELS, OFFICIAL_RESOURCES } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { FormattedText } from '../components/ui/FormattedText';
import { SectionHeader } from '../components/ui/SectionHeader';

interface NcertLibraryViewProps {
  classLevel: ClassLevel;
  language: AppLanguage;
  libraryImageUrl: string;
}

export function NcertLibraryView({
  classLevel,
  language,
  libraryImageUrl,
}: NcertLibraryViewProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [searchClass, setSearchClass] = useState<ClassLevel>(classLevel);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<GroundedSource[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleApprovedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed || isSearching) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Search official NCERT, ePathshala, DIKSHA, or SWAYAM pages for Class ${searchClass}: ${trimmed}. Summarize what official resources exist without reproducing copyrighted textbook text.`,
          classLevel: searchClass,
          subject: 'NCERT Official Resources',
          language,
          mode: 'search',
          useSearch: true,
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        sources?: GroundedSource[];
        error?: string;
      };
      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Search failed.');
      }
      setSearchResult(data.reply);
      setSearchSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : 'Unable to search official portals.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Library Banner */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-3">
          <div className="text-xs font-medium text-indigo-700">
            Authorized Educational Repositories · Copyright-Compliant
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            {language === 'hi'
              ? 'आधिकारिक NCERT एवं ePathshala पुस्तकालय'
              : 'Official NCERT & ePathshala Library'}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            {language === 'hi'
              ? 'EDUGENIUS AI पूर्ण कॉपीराइट पाठ्यपुस्तकों की नकल नहीं करता। नीचे दिए गए भारत सरकार और NCERT के आधिकारिक पोर्टल से सीधे प्रामाणिक पीडीएफ और वीडियो पाठ प्राप्त करें।'
              : 'EDUGENIUS AI respects NCERT copyright and never duplicates complete textbooks. Access official chapter PDFs, Exemplar problems, audio books, and DIKSHA lessons directly from authorized portals.'}
          </p>
        </div>
        <div className="lg:col-span-5 relative min-h-[200px] bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200">
          {!imgFailed ? (
            <img
              src={libraryImageUrl}
              alt="Blue cloth-bound academic volumes in minimalist library"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-700">
              <Library className="w-10 h-10" />
            </div>
          )}
        </div>
      </section>

      {/* Approved NCERT Resource Search */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <SectionHeader
          title="Approved NCERT Resource Search"
          subtitle="Query official NCERT, ePathshala, DIKSHA, and SWAYAM study links using search-grounded AI."
        />

        <form onSubmit={handleApprovedSearch} className="flex flex-col sm:flex-row gap-3">
          <select
            aria-label="Select class for NCERT search"
            value={searchClass}
            onChange={(e) => setSearchClass(Number(e.target.value) as ClassLevel)}
            className="min-h-[42px] px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CLASS_LEVELS.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., Class 10 Science Light chapter NCERT PDF or Exemplar"
            className="flex-1 min-h-[42px] px-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            variant="primary"
            loading={isSearching}
            disabled={!searchQuery.trim() || isSearching}
            leftIcon={<Search className="w-4 h-4" />}
          >
            Search Portals
          </Button>
        </form>

        {searchError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {searchError}
          </div>
        )}

        {searchResult && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <FormattedText text={searchResult} />
            {searchSources.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Grounded Resource Links</span>
                </div>
                <ul className="space-y-1">
                  {searchSources.map((src) => (
                    <li key={src.uri}>
                      <a
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:underline break-all"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span>{src.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Official Portals Grid */}
      <section className="space-y-4">
        <SectionHeader
          title="Verified Government & NCERT Portals"
          subtitle="Direct links to official repositories for textbooks, exemplars, and interactive lessons."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_RESOURCES.map((res) => (
            <article
              key={res.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-indigo-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-indigo-700">{res.provider}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.stages}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {language === 'hi' ? res.titleHi : res.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'hi' ? res.descriptionHi : res.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 truncate max-w-[220px]">
                  {res.url.replace('https://', '')}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 whitespace-nowrap"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
