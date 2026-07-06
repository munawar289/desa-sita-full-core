"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDesaProfilAction, type DesaProfilActionState } from "@/lib/actions/desa-profil";
import { desaProfilMock, type DesaProfil } from "@/lib/data/desa-profil";

const initialState: DesaProfilActionState = { error: null };

const WARNA_SLOTS = [
  { key: "warna_primer", label: "Warna Utama", hint: "CTA, link, ring focus, highlight hero" },
  { key: "warna_sekunder", label: "Warna Sekunder", hint: "Label section, badge hijau, aksen statistik" },
  { key: "warna_aksen", label: "Warna Aksen", hint: "Eyebrow dot, avatar, gradient teks brand" },
  { key: "warna_latar_gelap", label: "Warna Latar Gelap", hint: "Panel Navbar, Footer, background Hero" },
  { key: "warna_latar", label: "Warna Latar Halaman", hint: "Background utama seluruh halaman publik" },
] as const;

export function DesaProfilForm({ profil }: { profil: DesaProfil }) {
  const [state, formAction, isPending] = useActionState(updateDesaProfilAction, initialState);
  const [warna, setWarna] = useState({
    warna_primer: profil.warna_primer,
    warna_sekunder: profil.warna_sekunder,
    warna_aksen: profil.warna_aksen,
    warna_latar_gelap: profil.warna_latar_gelap,
    warna_latar: profil.warna_latar,
  });

  function resetWarna(key: keyof typeof warna) {
    setWarna((prev) => ({ ...prev, [key]: desaProfilMock[key] }));
  }

  function resetSemuaWarna() {
    setWarna({
      warna_primer: desaProfilMock.warna_primer,
      warna_sekunder: desaProfilMock.warna_sekunder,
      warna_aksen: desaProfilMock.warna_aksen,
      warna_latar_gelap: desaProfilMock.warna_latar_gelap,
      warna_latar: desaProfilMock.warna_latar,
    });
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={profil.id} />

      <section className="space-y-4 rounded-xl border border-kakao-200 bg-white p-5">
        <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">Identitas & Lokasi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-espresso-800/60">Nama Desa</label>
            <Input name="nama_desa" defaultValue={profil.nama_desa} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Kecamatan</label>
            <Input name="kecamatan" defaultValue={profil.kecamatan} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Kabupaten</label>
            <Input name="kabupaten" defaultValue={profil.kabupaten} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Provinsi</label>
            <Input name="provinsi" defaultValue={profil.provinsi} required maxLength={80} />
          </div>
        </div>
        <div>
          <label className="text-xs text-espresso-800/60">Deskripsi Hero</label>
          <Textarea name="hero_deskripsi" defaultValue={profil.hero_deskripsi} required rows={3} maxLength={300} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-kakao-200 bg-white p-5">
        <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">Kontak & Layanan</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-espresso-800/60">Email</label>
            <Input name="email" type="email" defaultValue={profil.email ?? ""} maxLength={120} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Jam Layanan</label>
            <Input name="jam_layanan" defaultValue={profil.jam_layanan ?? ""} maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Zona Waktu</label>
            <Input name="zona_waktu" defaultValue={profil.zona_waktu ?? ""} maxLength={16} />
          </div>
        </div>
        <div className="max-w-[160px]">
          <label className="text-xs text-espresso-800/60">Tahun Berdiri</label>
          <Input name="tahun_berdiri" type="number" defaultValue={profil.tahun_berdiri ?? ""} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-kakao-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">Warna Tema</h2>
          <button
            type="button"
            onClick={resetSemuaWarna}
            className="text-xs font-medium text-kopi-600 hover:text-kopi-400"
          >
            Kembalikan Semua ke Default
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {WARNA_SLOTS.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="text-xs text-espresso-800/60">{label}</label>
              <p className="mt-0.5 text-[0.7rem] text-espresso-800/45">{hint}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-8 shrink-0 rounded-full border border-kakao-200 shadow-sm"
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
                className="mt-1 text-[0.7rem] font-medium text-kopi-600 hover:text-kopi-400"
              >
                Kembalikan ke Default
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="rounded-full bg-kopi-600 hover:bg-kopi-600/90">
          {isPending ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
        {state.success && <span className="text-sm text-sawah-700">Tersimpan.</span>}
        {state.error && <span className="text-sm text-tanah-500">{state.error}</span>}
      </div>
    </form>
  );
}
