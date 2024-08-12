import heroImage from "/images/bgcar.png";

function HomePage() {
  return (
    <div className="flex w-screen h-screen overflow-x-hidden justify-center items-center">
      <div className="grid grid-cols-2 h-full items-center max-w-screen">
        <div className="px-10 flex flex-col col-span-1 bg-gradient-to-r from-black/80 via-black/50 to-white/0 bg-opacity-40 h-full justify-center">
          <h1 className="text-5xl font-black text-contrast text-wrap">
            Eksplorasi Kreativitas di Jalanan
          </h1>
          <h1 className="text-xl font-bold text-contrast">
            Temukan Spare Part Modifikasi Mobil Impian Anda.
          </h1>
        </div>
      </div>
      <img
        src={heroImage}
        className="h-full w-full object-cover fixed -z-50 self-start m-0 p-0"
      />
    </div>
  );
}

export default HomePage;
