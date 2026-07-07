-- Potensi desa: kartu "Sumber Penghidupan Warga" di beranda (sebelumnya
-- hardcoded di PotensSection.tsx) — kini dikelola dari dashboard admin.
create table potensi_desa (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  icon text not null,           -- nama ikon lucide-react, lihat POTENSI_ICON_OPTIONS
  urutan int not null
);

alter table potensi_desa enable row level security;

create policy "potensi_desa_public_read"
  on potensi_desa for select
  using (true);

create policy "potensi_desa_staff_write"
  on potensi_desa for all
  using (is_staff())
  with check (is_staff());
