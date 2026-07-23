"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDesaProfilAction, type DesaProfilActionState } from "@/lib/actions/desa-profil";
import { desaProfilMock, type DesaProfil } from "@/lib/data/desa-profil";
import { HERO_GAMBAR_MIME_TYPES } from "@/lib/validation/desa-profil";

const initialState: DesaProfilActionState = { error: null };

const WARNA_SLOTS = [
  { key: "warna_primer", label: "Warna Utama", hint: "CTA, link, ring focus, highlight hero, panel Navbar/Footer/Hero" },
  { key: "warna_sekunder", label: "Warna Sekunder", hint: "Label section, badge hijau, aksen statistik" },
  { key: "warna_aksen", label: "Warna Aksen", hint: "Eyebrow dot, avatar, gradient teks brand" },
] as const;

export function DesaProfilForm({ profil }: { profil: DesaProfil }) {
  const [state, formAction, isPending] = useActionState(updateDesaProfilAction, initialState);
  const [warna, setWarna] = useState({
    warna_primer: profil.warna_primer,
    warna_sekunder: profil.warna_sekunder,
    warna_aksen: profil.warna_aksen,
  });
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroHapus, setHeroHapus] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const heroGambarUrl = heroPreview ?? (heroHapus ? null : profil.hero_gambar_url);

  function handleHeroFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroHapus(false);
    setHeroPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleHeroHapus() {
    setHeroHapus(true);
    setHeroPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (heroFileInputRef.current) heroFileInputRef.current.value = "";
  }

  function resetWarna(key: keyof typeof warna) {
    setWarna((prev) => ({ ...prev, [key]: desaProfilMock[key] }));
  }

  function resetSemuaWarna() {
    setWarna({
      warna_primer: desaProfilMock.warna_primer,
      warna_sekunder: desaProfilMock.warna_sekunder,
      warna_aksen: desaProfilMock.warna_aksen,
    });
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-8">
      <input type="hidden" name="id" value={profil.id} />

      <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">Identitas & Lokasi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-muted">Nama Desa</label>
            <Input name="nama_desa" defaultValue={profil.nama_desa} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Kecamatan</label>
            <Input name="kecamatan" defaultValue={profil.kecamatan} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Kabupaten</label>
            <Input name="kabupaten" defaultValue={profil.kabupaten} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Provinsi</label>
            <Input name="provinsi" defaultValue={profil.provinsi} required maxLength={80} />
          </div>
        </div>
        <div>
          <label className="text-xs text-text-muted">Deskripsi Hero</label>
          <Textarea name="hero_deskripsi" defaultValue={profil.hero_deskripsi} required rows={3} maxLength={300} />
        </div>

        <div>
          <label className="text-xs text-text-muted">Foto Latar Hero</label>
          <p className="mt-0.5 text-[0.7rem] text-text-muted">
            Foto asli desa yang tampil sebagai latar section Hero di beranda. Kosongkan
            kalau belum ada foto — UI otomatis jatuh ke panel warna polos.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative aspect-video w-full max-w-70 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-alt">
              {heroGambarUrl ? (
                <Image
                  src={heroGambarUrl}
                  alt=""
                  fill
                  unoptimized={Boolean(heroPreview)}
                  sizes="280px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageOff className="size-6 text-text-muted" aria-hidden />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                ref={heroFileInputRef}
                type="file"
                name="hero_gambar_file"
                accept={HERO_GAMBAR_MIME_TYPES.join(",")}
                onChange={handleHeroFileChange}
                className="block w-full text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-on-primary-soft"
              />
              <p className="text-[0.7rem] text-text-muted">JPG, PNG, atau WEBP. Maksimal 5MB.</p>
              <div>
                <label htmlFor="hero_gambar_alt" className="text-xs text-text-muted">
                  Alt Teks Foto {heroGambarUrl && <span className="text-danger">*</span>}
                </label>
                <Input
                  id="hero_gambar_alt"
                  name="hero_gambar_alt"
                  defaultValue={profil.hero_gambar_alt ?? ""}
                  maxLength={180}
                  required={Boolean(heroGambarUrl)}
                  placeholder="Deskripsi foto untuk pembaca layar, mis. Danau Ranamese berlatar hutan pegunungan"
                />
              </div>
              {heroGambarUrl && (
                <button
                  type="button"
                  onClick={handleHeroHapus}
                  className="text-[0.7rem] font-medium text-link hover:text-link-hover"
                >
                  Hapus foto ini
                </button>
              )}
            </div>
          </div>
          <input type="hidden" name="hero_gambar_hapus" value={heroHapus ? "1" : "0"} />
        </div>

        <div className="max-w-40">
          <label className="text-xs text-text-muted">Jumlah RT</label>
          <Input name="jumlah_rt" type="number" defaultValue={profil.jumlah_rt} min={1} step={1} required />
          <p className="mt-1 text-[0.7rem] text-text-muted">
            Menambah otomatis membuat RT baru. Mengurangi hanya berhasil kalau RT yang
            dihapus (nomor tertinggi) belum punya data statistik terisi.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">Kontak & Layanan</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-text-muted">Email</label>
            <Input name="email" type="email" defaultValue={profil.email ?? ""} maxLength={120} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Jam Layanan</label>
            <Input name="jam_layanan" defaultValue={profil.jam_layanan ?? ""} maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Zona Waktu</label>
            <Input name="zona_waktu" defaultValue={profil.zona_waktu ?? ""} maxLength={16} />
          </div>
        </div>
        <div className="max-w-[160px]">
          <label className="text-xs text-text-muted">Tahun Berdiri</label>
          <Input name="tahun_berdiri" type="number" defaultValue={profil.tahun_berdiri ?? ""} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">Warna Tema</h2>
          <button
            type="button"
            onClick={resetSemuaWarna}
            className="text-xs font-medium text-link hover:text-link-hover"
          >
            Kembalikan Semua ke Default
          </button>
        </div>
        <p className="text-xs text-text-muted">
          Pilih warna apa pun — sistem otomatis menyesuaikan tingkat gelap-terang
          dan warna teks di atasnya supaya tetap nyaman dibaca. Tidak perlu
          khawatir memilih warna yang terlalu terang atau terlalu mencolok.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {WARNA_SLOTS.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="text-xs text-text-muted">{label}</label>
              <p className="mt-0.5 text-[0.7rem] text-text-muted">{hint}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-8 shrink-0 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: warna[key] }}
                />
                <input
                  type="color"
                  aria-label={`Pilih ${label}`}
                  value={warna[key]}
                  onChange={(e) => setWarna((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="h-8 w-10 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
                />
                <Input
                  name={key}
                  value={warna[key]}
                  onChange={(e) => setWarna((prev) => ({ ...prev, [key]: e.target.value }))}
                  maxLength={7}
                  className="font-mono uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => resetWarna(key)}
                className="mt-1 text-[0.7rem] font-medium text-link hover:text-link-hover"
              >
                Kembalikan ke Default
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="rounded-full">
          {isPending ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
        {state.success && <span className="text-sm text-text-muted">Tersimpan.</span>}
        {state.error && <span className="text-sm text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
