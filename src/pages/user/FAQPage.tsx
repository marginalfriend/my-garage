import { ReactNode } from "react";

import {
  Disclosure,
  DisclosureButton,
  DisclosureButtonProps,
  DisclosurePanel,
} from "@headlessui/react";

const DisclosureFAQ = ({ children }: { children: ReactNode }) => {
  return (
    <Disclosure as="div" className="w-full p-2">
      {children}
    </Disclosure>
  );
};

const DisclosureButtonFAQ = ({
  children,
  ...props
}: {
  children: ReactNode;
  props?: DisclosureButtonProps;
}) => {
  return (
    <DisclosureButton
      {...props}
      className="z-10 bg-default bg-opacity-10 hover:bg-opacity-40 p-2 text-left text-black w-full rounded data-[open]:rounded-b-none"
    >
      {children}
    </DisclosureButton>
  );
};

const DisclosurePanelFAQ = ({ children }: { children: ReactNode }) => {
  return (
    <DisclosurePanel
      transition
      className="border-b border-x p-2 rounded-b text-sm bg-default bg-opacity-5 origin-top transition duration-200 ease-out data-[closed]:opacity-0"
    >
      {children}
    </DisclosurePanel>
  );
};

function FAQPage() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-heading text-2xl font-semibold py-5">
        Pertanyaan yang Sering Diajukan (FAQ)
      </h1>
      <ul className="flex flex-col w-[50%]">
        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Apa itu GK5Garage?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>
                  GK5Garage adalah penyedia spare part baru maupun bekas. Kami
                  menyediakan beragam pilihan produk dan solusi untuk memenuhi
                  kebutuhan modifikasi kendaraan Anda.
                </p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>
                Apakah GK5Garage hanya untuk modifikasi mobil tertentu saja?
              </span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>Iya.</p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Apakah produk di GK5Garage dijamin berkualitas?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>
                  Ya, kami memilih dengan hati-hati setiap produk yang
                  ditawarkan di GK5Garage untuk memastikan kualitas dan daya
                  tahan yang tinggi. Produk kami berasal dari produsen
                  terpercaya.
                </p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Bagaimana cara memesan produk di GK5Garage?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>
                  Anda dapat memilih produk yang Anda inginkan dari katalog kami
                  dan menambahkannya ke keranjang belanja. Setelah selesai
                  berbelanja, lanjutkan untuk mengisi informasi pengiriman dan
                  pembayaran.
                </p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Berapa lama waktu pengiriman yang diperlukan?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>
                  Waktu pengiriman dapat bervariasi tergantung lokasi pengiriman
                  dan ketersediaan produk. Kami akan memberikan perkiraan waktu
                  pengiriman pada saat pemesanan.
                </p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Metode pembayaran apa yang diterima di GK5Garage?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>Sementara ini kami hanya menerima Bank BCA.</p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>

        <li>
          <DisclosureFAQ>
            <DisclosureButtonFAQ>
              <span>Apakah pembayaran saya aman di situs GK5Garage?</span>
            </DisclosureButtonFAQ>
            <DisclosurePanelFAQ>
              <div>
                <p>
                  Ya, kami sangat mengutamakan keamanan transaksi pelanggan
                  kami.
                </p>
              </div>
            </DisclosurePanelFAQ>
          </DisclosureFAQ>
        </li>
      </ul>
    </main>
  );
}

export default FAQPage;
