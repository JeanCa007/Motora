import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  imageSrc: string;
  imageAlt: string;
  quote: string;
  quoteAuthor: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  imageSrc,
  imageAlt,
  quote,
  quoteAuthor,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background-100">
      <div className="flex w-full flex-col px-4 py-6 md:px-10 lg:w-[54%] lg:py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex cursor-pointer items-center gap-2.5" aria-label="Motora, inicio">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground-950 text-background-50">
              <i className="ri-steering-2-line text-lg" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground-950">
              Motora<span className="text-primary-500">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-foreground-600 transition hover:text-foreground-950"
          >
            <i className="ri-arrow-left-line" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[440px]">
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-foreground-950">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-foreground-600">{subtitle}</p>
            <div className="mt-7">{children}</div>
            <div className="mt-6 text-sm text-foreground-600">{footer}</div>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-[46%]">
        <img
          src={imageSrc}
          alt={imageAlt}
          title="Motora · compra y venta de autos en Costa Rica"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground-950 via-foreground-950/40 to-foreground-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <div className="rounded-2xl border border-background-50/15 bg-foreground-950/40 p-6 backdrop-blur-md">
            <i className="ri-double-quotes-l text-2xl text-primary-400" aria-hidden="true" />
            <p className="mt-2 text-balance font-heading text-lg font-semibold leading-snug text-background-50">
              {quote}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-background-300">
              {quoteAuthor}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}