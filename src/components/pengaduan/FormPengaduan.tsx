"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KATEGORI_OPTIONS = ["Infrastruktur", "Pelayanan", "Sosial", "Lainnya"] as const;

const pengaduanSchema = z.object({
  nama: z.string().optional(),
  no_kontak: z.string().optional(),
  kategori: z.enum(KATEGORI_OPTIONS, {
    error: "Pilih kategori pengaduan",
  }),
  isi: z.string().min(20, "Isi pengaduan minimal 20 karakter"),
});

type FormState = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"kategori" | "isi", string>>;

export function FormPengaduan() {
  const [nama, setNama] = useState("");
  const [noKontak, setNoKontak] = useState("");
  const [kategori, setKategori] = useState<string>("");
  const [isi, setIsi] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = pengaduanSchema.safeParse({
      nama: nama || undefined,
      no_kontak: noKontak || undefined,
      kategori,
      isi,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "kategori" || field === "isi") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setState("loading");

    try {
      // Sementara tanpa integrasi backend — submit di-log ke console.
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Pengaduan terkirim:", result.data);
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-sawah-100 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-sawah-700" />
        <h2 className="font-heading text-xl font-semibold text-sawah-700">
          Terima kasih atas pengaduan Anda
        </h2>
        <p className="text-sm text-espresso-800/70">
          Pengaduan Anda telah kami terima dan akan segera ditindaklanjuti.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-kakao-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="nama">Nama</Label>
        <Input
          id="nama"
          value={nama}
          onChange={(event) => setNama(event.target.value)}
          placeholder="Anonim jika dikosongkan"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="no_kontak">No. Kontak</Label>
        <Input
          id="no_kontak"
          value={noKontak}
          onChange={(event) => setNoKontak(event.target.value)}
          placeholder="Opsional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori</Label>
        <Select value={kategori} onValueChange={setKategori}>
          <SelectTrigger id="kategori" className="w-full">
            <SelectValue placeholder="Pilih kategori pengaduan" />
          </SelectTrigger>
          <SelectContent>
            {KATEGORI_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kategori && <p className="text-sm text-tanah-500">{errors.kategori}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="isi">Isi Pengaduan</Label>
        <Textarea
          id="isi"
          value={isi}
          onChange={(event) => setIsi(event.target.value)}
          rows={5}
          placeholder="Sampaikan pengaduan atau masukan Anda&hellip;"
        />
        <div className="flex items-center justify-between text-xs">
          <span className={errors.isi ? "text-tanah-500" : "text-espresso-800/50"}>
            {errors.isi ?? `Minimal 20 karakter`}
          </span>
          <span className="text-espresso-800/50">{isi.length}/20</span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-espresso-800/50">
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        <p>
          Data pribadi Anda (nama, kontak) hanya digunakan untuk menindaklanjuti
          pengaduan dan tidak akan dipublikasikan.
        </p>
      </div>

      {state === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          <XCircle className="size-4 shrink-0" />
          Gagal mengirim pengaduan. Silakan coba lagi.
        </div>
      )}

      <Button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-kopi-600 text-white hover:bg-kopi-600/90"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Mengirim&hellip;
          </>
        ) : (
          "Kirim Pengaduan"
        )}
      </Button>
    </form>
  );
}
