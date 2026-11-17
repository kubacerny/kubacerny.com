import { useEffect, useRef, useState } from 'react';

type NavItem = { href: string; label: string; children?: NavItem[] };

const SERVICES: NavItem[] = [
  { href: '/sluzby/kubernetes', label: 'Kubernetes & cloud' },
  { href: '/sluzby/elasticsearch-rag', label: 'Elasticsearch & RAG' },
  { href: '/sluzby/spark-data-engineering', label: 'Spark & data engineering' },
  { href: '/sluzby/vyvoj-na-miru', label: 'Vývoj na míru' },
];

const NAV: NavItem[] = [
  { href: '/', label: 'Úvod' },
  { href: '/sluzby', label: 'Služby', children: SERVICES },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/cenik', label: 'Ceník' },
  { href: '/kontakt', label: 'Kontakt' },
];

interface Props {
  currentPath: string;
}

export default function Header({ currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? 'bg-brand-50/95 backdrop-blur shadow-sm'
          : 'bg-brand-50/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-semibold text-brand-800 hover:text-brand-600 transition-colors"
          >
            <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-accent-500" />
            Jakub Černý
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.href} ref={servicesRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-brand-700 bg-brand-100'
                        : 'text-brand-800 hover:text-brand-600 hover:bg-brand-100/60'
                    }`}
                  >
                    {item.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {servicesOpen && (
                    <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-brand-100 bg-white shadow-lg py-2">
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
                      >
                        Všechny služby
                      </a>
                      <div className="my-1 border-t border-brand-100" />
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 text-sm ${
                            isActive(child.href)
                              ? 'text-brand-700 bg-brand-100 font-medium'
                              : 'text-brand-800 hover:bg-brand-50'
                          }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-700 bg-brand-100'
                      : 'text-brand-800 hover:text-brand-600 hover:bg-brand-100/60'
                  }`}
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-brand-800 hover:bg-brand-100"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-200 bg-brand-50">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <div key={item.href}>
                <a
                  href={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-brand-700 bg-brand-100'
                      : 'text-brand-800 hover:bg-brand-100'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="ml-3 border-l border-brand-200 pl-2 flex flex-col">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className={`px-3 py-2 rounded-md text-sm ${
                          isActive(child.href)
                            ? 'text-brand-700 bg-brand-100 font-medium'
                            : 'text-brand-700 hover:bg-brand-100'
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
