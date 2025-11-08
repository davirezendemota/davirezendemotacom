import Image from "next/image";

export default function Home() {
  return (
    <div className="font-(family-name:--font-mdlorien)">
      <div className="min-h-screen flex items-center justify-center">
        {/* HEADER */}
        <header className="flex flex-col gap-2 items-center max-w-xs max-h-screen">
          {/* ME  */}
          <div className="relative w-40 bg-white rounded-full mb-5">
            <div className="absolute bottom-0 h-50 w-40 overflow-visible">
              <div className="absolute inset-0 mask-[linear-gradient(to_bottom,white_50%,transparent_50%)]">
                <Image
                  src="/me.png"
                  alt="Davi Rezende Avatar"
                  width={240}
                  height={240}
                  className="absolute object-cover max-w-none left-1/2 -translate-x-1/2 bottom-0"
                />
              </div>
            </div>
            <div className="relative h-40 w-40 overflow-visible">
              {/* Máscara circular que corta só a parte inferior */}
              <div className="absolute inset-0 overflow-hidden mask-[radial-gradient(circle_at_center,white_70%,transparent_71%)]">
                <Image
                  src="/me.png"
                  alt="Davi Rezende Avatar"
                  width={240}
                  height={240}
                  className="absolute object-cover max-w-none left-1/2 -translate-x-1/2 bottom-0"
                />
              </div>
            </div>
          </div>
          <span className="text-4xl font-semibold">Davi Rezende</span>
          <span className="text-xl text-center">tech lead, criador, líder - remoto no mapa, presente na entrega</span>
          <a
            href="https://docs.google.com/document/d/12krmk0uM7LOYOLSlCZlCGh0CYe3ZpfhVlmIoSFcj5Co/export?format=pdf"
            className="cursor-pointer underline transition-all duration-300 underline-offset-4 hover:underline-offset-8 hover:scale-110"
          >
            Hire me
          </a>
        </header>
      </div>
    </div>
  );
}
