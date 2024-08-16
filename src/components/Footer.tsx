function Footer() {
  return (
    <footer className="grid grid-cols-2 w-screen h-40 bottom-0 mt-auto p-2 bg-[#37517e] text-contrast">
      <div className="text-sm col-span-1 flex flex-col justify-between">
        <img
          src="/images/logo.png"
          className="w-16 h-16"
          alt="GK5GARAGE Logo"
        />
        <p>Jalan Raya No. 123, Kota XYZ, Indonesia</p>
        <div className="text-xs">
          © Copyright{" "}
          <strong>
            <span>GK5GARAGE</span>
          </strong>
          . All Rights Reserved
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-end p-4 gap-2 text-sm">
        <div className="flex items-center gap-2 hover:cursor-pointer">
          +62 812-1185-9385
          <img
            src="https://www.svgrepo.com/show/475692/whatsapp-color.svg"
            className="w-6 h-6 mr-2"
          />
        </div>
        <div className="flex items-center gap-2 hover:cursor-pointer">
          info@gk5garage.com
          <img
            src="https://www.svgrepo.com/show/452287/email.svg"
            className="w-10 h-10"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
