"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDesaProfilAction, type DesaProfilActionState } from "@/lib/actions/desa-profil";
import { desaProfilMock, type DesaProfil } from "@/lib/data/desa-profil";

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
    <form action={formAction} className="space-y-8">
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
