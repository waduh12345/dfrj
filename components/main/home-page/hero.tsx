"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-[#A80038] to-[#D32F2F] overflow-hidden min-h-screen md:min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Konten Hero */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col md:pt-20 lg:pt-0 lg:flex-row items-center gap-8">
        {/* Text Section */}
        <div className="text-center lg:text-left space-y-6 transform md:-translate-y-8 lg:-translate-y-20 transition-all duration-300 flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Koperasi Digital untuk Masa Depan
          </h1>
          <p className="text-neutral-100 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
            Koperasi Merah Putih hadir untuk memperkuat ekonomi kerakyatan
            dengan semangat gotong royong, transparansi, dan teknologi. Bersama,
            kita membangun masa depan yang sejahtera bagi seluruh anggota.
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("join");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-white text-[#A80038] font-semibold px-6 py-3 rounded-md text-sm hover:bg-[#A80038] hover:text-white hover:border hover:border-white transition"
            >
              Gabung Sekarang
            </button>
          </div>
        </div>

        {/* Gambar Hero */}
        <div className="flex justify-center lg:justify-end transform md:-translate-y-6 lg:-translate-y-12 transition-all duration-300 relative flex-1">
          <Image
            src="/images/people-char.png"
            alt="Koperasi"
            width={600}
            height={600}
            className="w-full max-w-md lg:max-w-[700px] object-contain relative z-10"
            priority
          />

          {/* Badge Happy Customer */}
          <div className="hidden lg:flex absolute bottom-56 right-0 bg-white/60 backdrop-blur-md shadow-md rounded-2xl px-4 py-2 flex-col items-start gap-1 z-20">
            <span className="text-sm font-semibold text-gray-900">
              Happy Customer
            </span>
            <div className="flex items-center gap-1">
              {[
                "/avatars/1.jpeg",
                "/avatars/2.jpeg",
                "/avatars/3.jpeg",
                "/avatars/4.jpeg",
                "/avatars/5.jpeg",
              ].map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white -ml-1 first:ml-0"
                />
              ))}
              <div className="bg-sky-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center -ml-1">
                99+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Transisi */}
      <div className="absolute bottom-0 w-full z-20 pointer-events-none">
        <svg
          className="w-full h-auto block"
          viewBox="0 0 1440 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,400L60,370C120,340,240,280,360,290C480,300,600,370,720,390C840,410,960,370,1080,330C1200,290,1320,250,1380,230L1440,210V500H0Z"
          />
        </svg>
      </div>
    </div>
  );
}