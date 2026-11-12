import { useEffect, useState } from 'react';

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState(0);
  const total = images.length;

  useEffect(() => {
    setActive(0);
  }, [title]);

  if (total === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-background-200 bg-background-200">
        <i className="ri-image-line text-5xl text-foreground-300" aria-hidden="true" />
      </div>
    );
  }

  const go = (direction: number) => {
    setActive((current) => (current + direction + total) % total);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-background-200 bg-background-200">
        <img
          src={images[active]}
          alt={`${title} — foto ${active + 1} de ${total}`}
          title={`${title} · foto ${active + 1}`}
          className="h-full w-full object-cover object-center"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background-50/90 text-foreground-900 shadow-soft transition hover:bg-background-50"
            >
              <i className="ri-arrow-left-s-line text-xl" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background-50/90 text-foreground-900 shadow-soft transition hover:bg-background-50"
            >
              <i className="ri-arrow-right-s-line text-xl" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-foreground-950/75 px-3 py-1 text-xs font-semibold text-background-50 backdrop-blur">
              {active + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                index === active ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1} de ${title}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}