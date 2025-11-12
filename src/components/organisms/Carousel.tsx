import { Carousel } from "flowbite-react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import Image from "next/image";


const seeds = ["hero-a", "hero-b", "hero-c", "hero-d", "hero-e"];
const carouselImages = seeds.map(
  (s) => `https://picsum.photos/seed/${s}/1600/900`
);

export const CarouselComponent = () => {
  return (
    <>
    {/* Estilos globales para ocultar scrollbars del carrusel */}
      <style>{`
        .overflow-hidden::-webkit-scrollbar {
          display: none;
        }
        .overflow-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        [data-testid="carousel-indicator"] {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background-color: rgba(255, 255, 255, 0.5) !important;
          transition: all 0.3s ease !important;
        }
        
        [data-testid="carousel-indicator"][aria-current="true"] {
          background-color: rgba(255, 255, 255, 1) !important;
          width: 32px !important;
          border-radius: 6px !important;
        }
      `}</style>

      <div className="relative left-1/2 -translate-x-1/2 w-screen h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
        {/* Contenedor con overflow-hidden para ocultar scrollbars */}
        <div className="w-full h-full overflow-hidden">
          <Carousel 
            leftControl={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <CiCircleChevLeft className="text-white text-4xl hover:scale-110 transition-transform" />
              </div>
            } 
            rightControl={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <CiCircleChevRight className="text-white text-4xl hover:scale-110 transition-transform" />
              </div>
            }
            slideInterval={5000}
            className="h-full"
          >
            {carouselImages.map((src, index) => (
              <div key={src} className="w-full h-full relative">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover w-full h-full brightness-90 dark:brightness-75"
                  priority={index === 0}
                />
                {/* Overlay sutil para mejorar contraste */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};