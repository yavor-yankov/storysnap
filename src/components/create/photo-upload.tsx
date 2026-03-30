"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  file: File;
  preview: string;
  url?: string; // returned from server after upload
  uploading: boolean;
  error?: string;
}

interface PhotoUploadProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, maxPhotos = 2 }: PhotoUploadProps) {
  const canAddMore = photos.length < maxPhotos;

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Upload failed");
    }
    const data = await res.json();
    return data.url as string;
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!canAddMore) return;
      const toAdd = acceptedFiles.slice(0, maxPhotos - photos.length);

      const newPhotos: UploadedPhoto[] = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
      }));

      onChange([...photos, ...newPhotos]);

      // Upload each in parallel
      const uploaded = await Promise.all(
        newPhotos.map(async (p) => {
          try {
            const url = await uploadFile(p.file);
            return { ...p, url, uploading: false };
          } catch (err) {
            return {
              ...p,
              uploading: false,
              error: err instanceof Error ? err.message : "Грешка при качване",
            };
          }
        })
      );

      onChange([...photos, ...uploaded]);
    },
    [photos, maxPhotos, canAddMore, onChange, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 5 * 1024 * 1024,
    disabled: !canAddMore,
    multiple: true,
  });

  const removePhoto = (idx: number) => {
    const updated = [...photos];
    URL.revokeObjectURL(updated[idx].preview);
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative group">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-brand-gold/30 bg-brand-beige-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.preview}
                  alt={`Снимка ${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Uploading overlay */}
                {photo.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                  </div>
                )}

                {/* Success indicator */}
                {!photo.uploading && !photo.error && photo.url && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1 shadow">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                )}

                {/* Error indicator */}
                {photo.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-white shadow-md transition-transform hover:scale-110"
                aria-label="Премахни снимката"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {idx === 0 && (
                <p className="mt-1 text-center text-xs font-semibold text-brand-orange">
                  Основна снимка
                </p>
              )}
              {photo.error && (
                <p className="mt-1 text-center text-xs text-red-500">{photo.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {canAddMore && (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
            isDragActive
              ? "border-brand-orange bg-brand-orange/5"
              : "border-brand-gold/50 bg-white hover:border-brand-orange hover:bg-brand-orange/3"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10">
            <Upload className="h-6 w-6 text-brand-orange" />
          </div>
          {isDragActive ? (
            <p className="font-semibold text-brand-orange">Пуснете снимката тук</p>
          ) : (
            <>
              <div>
                <p className="font-bold text-brand-brown">
                  {photos.length === 0 ? "Качете снимка" : "Добавете още снимка"}
                </p>
                <p className="mt-1 text-sm text-brand-brown-body">
                  Плъзнете и пуснете или кликнете за избор
                </p>
              </div>
              <p className="text-xs text-brand-brown-body">
                JPEG, PNG или WebP · Максимум 5MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Photo guidelines */}
      <div className="rounded-xl bg-brand-yellow-light p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-brown-sub">
          Съвети за по-добър резултат
        </p>
        <ul className="space-y-1">
          {[
            "Едно лице на снимката (само детето)",
            "Снимка от близо — лицето да е добре видимо",
            "Добра осветеност (без сенки)",
            "Без слънчеви очила или шапки",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-brand-brown-body">
              <span className="mt-0.5 text-brand-orange">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
