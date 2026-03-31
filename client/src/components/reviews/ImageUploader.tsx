import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({
  files,
  onChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFiles = (nextFiles: FileList | null) => {
    if (!nextFiles) return;
    const selected = Array.from(nextFiles).slice(0, maxFiles - files.length);
    onChange([...files, ...selected].slice(0, maxFiles));
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm font-medium text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-accent)] hover:shadow-md"
      >
        <ImagePlus size={18} className="text-[var(--color-accent)]" />
        Upload up to {maxFiles} photos
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => {
          handleFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      {previews.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {previews.map((preview, index) => (
            <div
              key={preview.key}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)]"
            >
              <img
                src={preview.url}
                alt={`Review upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  onChange(files.filter((_, fileIndex) => fileIndex !== index))
                }
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--color-muted)]">
        JPEG, PNG, or WEBP. Max 5MB each.
      </p>
    </div>
  );
}
