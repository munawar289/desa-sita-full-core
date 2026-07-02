import Link from "next/link";
import { footerNavItems } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="bg-espresso-800 text-krem-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold">Desa Sita</p>
          <p className="mt-3 text-sm leading-relaxed text-krem-50/70">
            Kecamatan Rana Mese, Kabupaten Manggarai Timur,
            Nusa Tenggara Timur
          </p>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-krem-50/80">
            Navigasi
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-krem-50/70 transition-all duration-200 hover:text-kopi-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-krem-50/80">
            Kontak
          </p>
          <ul className="mt-3 space-y-2 text-sm text-krem-50/70">
            <li>desasita@ranames.manggaraitimurkab.go.id</li>
            <li>Senin&ndash;Jumat, 08.00&ndash;16.00 WITA</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-krem-50/10 px-4 py-4 text-center text-xs text-krem-50/50 sm:px-6">
        &copy; {new Date().getFullYear()} Pemerintah Desa Sita. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
