// MOCK DATA — menunggu dukungan backend. Lihat BACKEND_TODO.md
//
// Foto latar Hero beranda. Backend `desa_profil` belum menyediakan kolom
// gambar hero, jadi sumbernya dipatok ke aset lokal. Foto asli daerah desa
// selalu menang atas stock photo (DESIGN.md §5.2 & §7.4).

export type HeroMedia = {
  src: string;
  alt: string;
};

export const heroMedia: HeroMedia = {
  src: "/images/ranamese.jpg",
  alt: "Danau Ranamese berlatar hutan pegunungan Rana Mese, Manggarai Timur",
};
