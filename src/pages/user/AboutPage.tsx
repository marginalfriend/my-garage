import { CheckCircleIcon } from "@heroicons/react/16/solid";
import Button from "../../components/Button";
import { NavLink } from "react-router-dom";
import { FAQ, USER_PRODUCTS } from "../../constants/routes";

function AboutPage() {
  return (
    <main>
      <section className="text-gray-600 body-font px-8">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="animate-slide-in-half title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Temukan Spare Part
              <br className="hidden lg:inline-block" />
              Modifikasi Mobil Impian Anda.
            </h1>
            <p className="animate-slide-in-1 leading-relaxed mb-2">
              GK5GARAGE berdiri sejak 2014 yang menyediakan jual beli spare part
              modifikasi baru maupun bekas. GK5GARAGE berkomitmen secara
              profesional untuk menyediakan produk berkualitas dengan harga
              terbaik, pengiriman yang tepat waktu serta pelayanan yang memberi
              kemudahan akses dan komunikasi.
            </p>
            <ul className="list-none mb-8 animate-slide-in-1">
              <li className="flex items-center gap-2">
                <CheckCircleIcon width={15} height={15} /> Kualitas terbaik
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon width={15} height={15} /> Pilihan suku cadang
                yang lengkap
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon width={15} height={15} /> Pelayanan pelanggan
                terbaik
              </li>
            </ul>
            <div className="flex justify-center">
              <NavLink to={USER_PRODUCTS}>
                <Button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  Our Products
                </Button>
              </NavLink>
              <NavLink to={FAQ}>
                <Button
                  variant="secondary"
                  className="ml-4 inline-flex text-black bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                >
                  FAQ
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src="/images/bgcar.png"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
