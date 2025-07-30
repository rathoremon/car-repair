import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePromotions } from "../../features/promotion/promotionThunks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRightAlt } from "@mui/icons-material";
import "swiper/css";
import "swiper/css/pagination";

const BannerCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { active } = useSelector((state) => state.promotion);

  useEffect(() => {
    dispatch(fetchActivePromotions());
  }, [dispatch]);

  const handleClick = (url) => {
    if (!url) return;
    if (url.startsWith("/")) navigate(url);
    else window.open(url, "_blank");
  };

  if (!active || active.length === 0) return null;

  return (
    <section className="w-full overflow-x-hidden">
      <div className="w-full">
        <Swiper
          slidesPerView={1}
          loop
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="!w-full !max-w-none"
        >
          {active.map((banner) => {
            const isImage = banner.type === "image";

            return (
              <SwiperSlide key={banner.id} className="!w-full !max-w-none">
                {isImage ? (
                  <a
                    href={banner.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full aspect-[2.5/1] sm:aspect-[3/1] md:aspect-[3.5/1] lg:aspect-[4/1] overflow-hidden"
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || "Image Banner"}
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
                      loading="lazy"
                      draggable={false}
                    />
                  </a>
                ) : (
                  <div className="relative w-full aspect-[2.7/1] sm:aspect-[3/1] md:aspect-[3.5/1] lg:aspect-[4/1]  overflow-hidden">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || "Promotional Banner"}
                      className="w-full h-full object-cover brightness-[0.7]"
                      loading="lazy"
                      draggable={false}
                    />

                    {/* Multi-layered overlays for expert look */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

                    <div className="absolute inset-0 z-30 flex items-center px-2 sm:px-6 md:px-12">
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9 }}
                        className="text-white max-w-full pl-4 sm:pl-8 md:pl-16 lg:pl-24"
                      >
                        {banner.title && (
                          <h2
                            className="
        text-[clamp(1rem,4vw,2.2rem)]
        sm:text-[clamp(1.2rem,5vw,3.2rem)]
        md:text-[clamp(1.5rem,4vw,4.2rem)]
        lg:text-[clamp(2.5rem,3vw,6rem)]
        xl:text-[clamp(3rem,2vw,8rem)]
        2xl:text-[clamp(3.5rem,1.5vw,10rem)]
        font-extrabold tracking-tight drop-shadow-lg
        bg-gradient-to-r from-yellow-300 via-pink-300 to-red-400
        bg-clip-text text-transparent font-display
        leading-tight
      "
                          >
                            {banner.title}
                          </h2>
                        )}
                        {banner.description && (
                          <p
                            className="
        mt-2
        text-[clamp(0.85rem,2.5vw,1.1rem)]
        sm:text-[clamp(1rem,2vw,1.5rem)]
        md:text-[clamp(1.1rem,1.5vw,1.7rem)]
        lg:text-[clamp(1.5rem,1vw,2.5rem)]
        xl:text-[clamp(1.7rem,0.8vw,3rem)]
        2xl:text-[clamp(2rem,0.7vw,3.5rem)]
        text-white/90 font-light tracking-wide drop-shadow
        leading-snug
      "
                          >
                            {banner.description}
                          </p>
                        )}
                        {banner.ctaText && banner.ctaUrl && (
                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleClick(banner.ctaUrl)}
                            className="
    mt-5 inline-flex items-center gap-2
        bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500
        text-black font-semibold
        px-3 py-1 sm:px-5 sm:py-2 md:px-6 md:py-3
        rounded-full shadow-xl
        hover:brightness-110 transition-all
        focus:outline-none focus:ring-4 focus:ring-yellow-300
        text-[clamp(0.7rem,1vw,1.1rem)]
        lg:text-[clamp(1.1rem,1.5vw,1.5rem)]
      "
                          >
                            {banner.ctaText}
                            <ArrowRightAlt />
                          </motion.button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerCarousel;
