import { useRef } from 'react';

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

const MAX_SIZE_MB = 5;

export default function PhotoUploader({ files, onChange, max = 6 }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const valid = selected
      .filter((file) => file.type.startsWith('image/'))
      .filter((file) => file.size <= MAX_SIZE_MB * 1024 * 1024);
    onChange([...files, ...valid].slice(0, max));
    event.target.value = '';
  };

  const removeAt = (index: number) => {
    onChange(files.filter((_, position) => position !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="group relative h-24 w-32 overflow-hidden rounded-xl border border-background-300 bg-background-200"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Foto ${index + 1} del vehículo`}
              className="h-full w-full object-cover object-center"
            />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-foreground-950/80 px-2 py-0.5 text-[10px] font-bold text-background-50">
                Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Quitar foto"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground-950/80 text-background-50 transition hover:bg-primary-600"
            >
              <i className="ri-close-line text-xs" aria-hidden="true" />
            </button>
          </div>
        ))}

        {files.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-background-300 bg-background-50 text-foreground-500 transition hover:border-primary-500 hover:text-primary-700"
          >
            <i className="ri-image-add-line text-xl" aria-hidden="true" />
            <span className="text-[11px] font-semibold">Agregar foto</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
        aria-label="Seleccionar fotos del vehículo"
      />

      <p className="mt-2 text-[11px] leading-relaxed text-foreground-400">
        Hasta {max} fotos en JPG o PNG, máximo {MAX_SIZE_MB} MB cada una. La primera foto será la portada del
        anuncio.
      </p>
    </div>
  );
}