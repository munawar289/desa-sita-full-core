/**
 * Tipe skema database Supabase — cerminan tabel di PRD §9.1.
 * Ditulis manual untuk sekarang; bisa diganti hasil `supabase gen types typescript`
 * setelah project cloud terhubung.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamped = { created_at: string };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nama_lengkap: string;
          role: "admin" | "operator";
          created_at: string;
        };
        Insert: {
          id: string;
          nama_lengkap: string;
          role?: "admin" | "operator";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      tenants: {
        Row: {
          id: string;
          slug: string;
          domain: string | null;
          nama: string;
          status: "active" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          domain?: string | null;
          nama: string;
          status?: "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string;
          role: "admin" | "operator";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id: string;
          role?: "admin" | "operator";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Insert"]>;
        Relationships: [];
      };
      platform_admins: {
        Row: {
          id: string;
          profile_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platform_admins"]["Insert"]>;
        Relationships: [];
      };
      statistik: {
        Row: {
          id: string;
          tenant_id: string;
          category: string;
          key: string;
          label: string;
          value: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          category: string;
          key: string;
          label: string;
          value: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["statistik"]["Insert"]>;
        Relationships: [];
      };
      statistik_kelompok_umur: {
        Row: {
          id: string;
          tenant_id: string;
          kelompok_usia: string;
          jumlah: number;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          kelompok_usia: string;
          jumlah: number;
          urutan: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["statistik_kelompok_umur"]["Insert"]
        >;
        Relationships: [];
      };
      statistik_pendidikan: {
        Row: {
          id: string;
          tenant_id: string;
          tingkat: string;
          jumlah: number;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          tingkat: string;
          jumlah: number;
          urutan: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["statistik_pendidikan"]["Insert"]
        >;
        Relationships: [];
      };
      wilayah_rt: {
        Row: {
          id: string;
          tenant_id: string;
          nomor: string;
          nama: string;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nomor: string;
          nama: string;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["wilayah_rt"]["Insert"]>;
        Relationships: [];
      };
      statistik_rt: {
        Row: {
          id: string;
          tenant_id: string;
          category: string;
          rt_id: string;
          value: number | null;
          detail: Json | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          category: string;
          rt_id: string;
          value?: number | null;
          detail?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["statistik_rt"]["Insert"]>;
        Relationships: [];
      };
      statistik_sektor_usaha: {
        Row: {
          id: string;
          tenant_id: string;
          jenis: "pdb" | "pendapatan_riil";
          kode: string;
          nama: string;
          nilai_ribu_rupiah: number | null;
          updated_by: string | null;
          updated_at: string;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          jenis: "pdb" | "pendapatan_riil";
          kode: string;
          nama: string;
          nilai_ribu_rupiah?: number | null;
          updated_by?: string | null;
          updated_at?: string;
          urutan: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["statistik_sektor_usaha"]["Insert"]
        >;
        Relationships: [];
      };
      kepala_desa_riwayat: {
        Row: {
          id: string;
          tenant_id: string;
          nama: string;
          periode_mulai: number;
          periode_selesai: number | null;
          keterangan: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama: string;
          periode_mulai: number;
          periode_selesai?: number | null;
          keterangan?: string | null;
          urutan: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["kepala_desa_riwayat"]["Insert"]
        >;
        Relationships: [];
      };
      aparatur: {
        Row: {
          id: string;
          tenant_id: string;
          nama: string | null;
          jabatan: string;
          pendidikan: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama?: string | null;
          jabatan: string;
          pendidikan?: string | null;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["aparatur"]["Insert"]>;
        Relationships: [];
      };
      bpd_anggota: {
        Row: {
          id: string;
          tenant_id: string;
          nama: string;
          jabatan: string;
          pendidikan: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama: string;
          jabatan: string;
          pendidikan?: string | null;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["bpd_anggota"]["Insert"]>;
        Relationships: [];
      };
      lembaga: {
        Row: {
          id: string;
          tenant_id: string;
          kategori: string;
          nama: string;
          dasar_hukum: string | null;
          jumlah_pengurus: number | null;
          keterangan: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          kategori: string;
          nama: string;
          dasar_hukum?: string | null;
          jumlah_pengurus?: number | null;
          keterangan?: string | null;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["lembaga"]["Insert"]>;
        Relationships: [];
      };
      komoditas: {
        Row: {
          id: string;
          tenant_id: string;
          nama: string;
          luas_ha: number | null;
          hasil_panen: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama: string;
          luas_ha?: number | null;
          hasil_panen?: string | null;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["komoditas"]["Insert"]>;
        Relationships: [];
      };
      peternakan: {
        Row: {
          id: string;
          tenant_id: string;
          jenis_ternak: string;
          populasi: number | null;
          jumlah_pemilik: number | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          jenis_ternak: string;
          populasi?: number | null;
          jumlah_pemilik?: number | null;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["peternakan"]["Insert"]>;
        Relationships: [];
      };
      potensi_desa: {
        Row: {
          id: string;
          tenant_id: string;
          judul: string;
          deskripsi: string;
          icon: string;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          judul: string;
          deskripsi: string;
          icon: string;
          urutan: number;
        };
        Update: Partial<Database["public"]["Tables"]["potensi_desa"]["Insert"]>;
        Relationships: [];
      };
      sarana_prasarana: {
        Row: {
          id: string;
          tenant_id: string;
          kategori: string;
          nama: string;
          jumlah: string | null;
          urutan: number;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          kategori: string;
          nama: string;
          jumlah?: string | null;
          urutan: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["sarana_prasarana"]["Insert"]
        >;
        Relationships: [];
      };
      wilayah_info: {
        Row: {
          id: string;
          tenant_id: string;
          section: string;
          konten: string;
          page: string;
          judul: string;
          eyebrow: string;
          urutan: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          section: string;
          konten: string;
          page?: string;
          judul: string;
          eyebrow: string;
          urutan?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wilayah_info"]["Insert"]>;
        Relationships: [];
      };
      desa_profil: {
        Row: {
          id: string;
          tenant_id: string;
          nama_desa: string;
          kecamatan: string;
          kabupaten: string;
          provinsi: string;
          hero_deskripsi: string;
          hero_gambar_url: string | null;
          hero_gambar_alt: string | null;
          email: string | null;
          jam_layanan: string | null;
          zona_waktu: string | null;
          tahun_berdiri: number | null;
          warna_primer: string;
          warna_sekunder: string;
          warna_aksen: string;
          jumlah_rt: number;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama_desa: string;
          kecamatan: string;
          kabupaten: string;
          provinsi: string;
          hero_deskripsi: string;
          hero_gambar_url?: string | null;
          hero_gambar_alt?: string | null;
          email?: string | null;
          jam_layanan?: string | null;
          zona_waktu?: string | null;
          tahun_berdiri?: number | null;
          warna_primer?: string;
          warna_sekunder?: string;
          warna_aksen?: string;
          jumlah_rt?: number;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["desa_profil"]["Insert"]>;
        Relationships: [];
      };
      berita: {
        Row: {
          id: string;
          judul: string;
          slug: string;
          kategori: string | null;
          ringkasan: string | null;
          konten: string;
          cover_image_url: string | null;
          status: "draft" | "published";
          author_id: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          judul: string;
          slug: string;
          kategori?: string | null;
          ringkasan?: string | null;
          konten: string;
          cover_image_url?: string | null;
          status?: "draft" | "published";
          author_id?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["berita"]["Insert"]>;
        Relationships: [];
      };
      galeri: {
        Row: {
          id: string;
          judul: string | null;
          image_url: string;
          urutan: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          judul?: string | null;
          image_url: string;
          urutan?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["galeri"]["Insert"]>;
        Relationships: [];
      };
      pengaduan: {
        Row: {
          id: string;
          tenant_id: string;
          nama: string | null;
          no_kontak: string | null;
          kategori: string | null;
          isi: string;
          status: "baru" | "ditindaklanjuti" | "selesai";
          tanggapan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          nama?: string | null;
          no_kontak?: string | null;
          kategori?: string | null;
          isi: string;
          status?: "baru" | "ditindaklanjuti" | "selesai";
          tanggapan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pengaduan"]["Insert"]>;
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          table_name: string;
          record_id: string | null;
          action: string;
          old_value: Json | null;
          new_value: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          table_name: string;
          record_id?: string | null;
          action: string;
          old_value?: Json | null;
          new_value?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Utilitas ringkas untuk mengambil tipe Row per tabel.
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// Menandai bahwa Timestamped tetap dipakai untuk dokumentasi bentuk baris.
export type WithTimestamp<T> = T & Timestamped;
