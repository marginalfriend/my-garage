import { useState, useEffect, useRef, ReactNode } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const DisclosurePanelFAQ = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(true);
    return () => setIsOpen(false);
  }, []);

  return (
    <DisclosurePanel static>
      {({ open }) => (
        <div
          ref={panelRef}
          className={`disclosure-content ${open && isOpen ? "open" : ""}`}
        >
          <div className="px-4 py-2 text-sm text-black bg-default bg-opacity-5 rounded-b-lg">
            {children}
          </div>
        </div>
      )}
    </DisclosurePanel>
  );
};

const FAQList = ({
  faqItems,
  openIndex,
  setOpenIndex,
}: {
  faqItems: { q: string; a: string }[];
  openIndex: number | null;
  setOpenIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <ul className="flex flex-col w-[50%]">
      {faqItems.map((item, index) => (
        <li key={item.q} className="py-3">
          <Disclosure as="div" className="w-full">
            {({ open }) => (
              <>
                <DisclosureButton
                  onClick={() =>
                    setOpenIndex(index === openIndex ? null : index)
                  }
                  as="button"
                  className="flex items-center justify-between z-10 bg-default bg-opacity-10 hover:bg-opacity-40 p-2 text-left text-black w-full rounded data-[open]:rounded-b-none"
                >
                  <span>{item.q}</span>
                  <ChevronDownIcon
                    height={16}
                    width={16}
                    strokeWidth={2}
                    className={`transition-transform duration-200 ${
                      open ? "transform rotate-180" : ""
                    }`}
                  />
                </DisclosureButton>
                <DisclosurePanelFAQ>
                  <p>{item.a}</p>
                </DisclosurePanelFAQ>
              </>
            )}
          </Disclosure>
        </li>
      ))}
    </ul>
  );
};

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  console.log(openIndex);

  const faqItems = [
    {
      q: "Apa itu GK5Garage?",
      a: "GK5Garage adalah penyedia spare part baru maupun bekas. Kami menyediakan beragam pilihan produk dan solusi untuk memenuhi kebutuhan modifikasi kendaraan Anda.",
    },
    {
      q: "Apakah GK5Garage hanya untuk modifikasi mobil tertentu saja?",
      a: "Iya.",
    },
    {
      q: "Apakah produk di GK5Garage dijamin berkualitas?",
      a: "Ya, kami memilih dengan hati-hati setiap produk yang ditawarkan di GK5Garage untuk memastikan kualitas dan daya tahan yang tinggi. Produk kami berasal dari produsen terpercaya.",
    },
    {
      q: "Bagaimana cara memesan produk di GK5Garage?",
      a: "Anda dapat memilih produk yang Anda inginkan dari katalog kami dan menambahkannya ke keranjang belanja. Setelah selesai berbelanja, lanjutkan untuk mengisi informasi pengiriman dan pembayaran.",
    },
    {
      q: "Berapa lama waktu pengiriman yang diperlukan?",
      a: "Waktu pengiriman dapat bervariasi tergantung lokasi pengiriman dan ketersediaan produk. Kami akan memberikan perkiraan waktu pengiriman pada saat pemesanan.",
    },
    {
      q: "Metode pembayaran apa yang diterima di GK5Garage?",
      a: "Sementara ini kami hanya menerima Bank BCA.",
    },
    {
      q: "Apakah pembayaran saya aman di situs GK5Garage?",
      a: "Ya, kami sangat mengutamakan keamanan transaksi pelanggan kami.",
    },
  ];
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-heading text-3xl font-semibold py-8">
        Pertanyaan yang Sering Diajukan (FAQ)
      </h1>
      <FAQList
        faqItems={faqItems}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
      />
    </main>
  );
}

export default FAQPage;
