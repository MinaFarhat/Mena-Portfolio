import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { projects } from "../projects";
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function Projects() {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const isDragging = useRef(false);

  // Hover preview
  const [hoverPreview, setHoverPreview] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) {
        setSlidesPerView(3);
      } else if (width === 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    // Set initial value immediately
    const width = window.innerWidth;
    if (width > 1024) {
      setSlidesPerView(3);
    } else if (width === 1024) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const projectChunks = chunkArray(projects, slidesPerView);

  // Update Swiper touch settings when slidesPerView changes
  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.allowTouchMove = slidesPerView < 3;
      swiperInstance.update();
    }
  }, [slidesPerView, swiperInstance]);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div
      className="bg-black px-5 lg:px-28 py-12 pb-20  lg:py-20 mt-3 relative "
      id="projects"
      ref={sectionRef}
    >
      <h2 className="text-2xl lg:text-4xl text-center text-white">
        My <span className="font-extrabold">Projects</span>
      </h2>

      <div className="mt-8 lg:mt-16 relative">
        {/* PREVIEW IMAGE */}
        {hoverPreview && (
          <motion.div
            className="fixed w-64 h-40 rounded-xl shadow-2xl pointer-events-none z-[999] lg:flex hidden flex-col items-center justify-center p-2"
            style={{
              left: mousePos.x + 12,
              top: mousePos.y + 12,
              backgroundColor: "#161616",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <img
              src={hoverPreview.src}
              alt="preview"
              className="w-full h-28 object-fit:cover rounded-lg mb-1 transition-transform duration-300 group-hover:scale-110"
              onLoad={(e) => {
                e.currentTarget.style.opacity = 1;
              }}
              loading="eager"
            />
            <span className="text-xs text-white font-semibold px-2 py-1 rounded">
              {hoverPreview.link ? "Visit Project" : "Preview Only"}
            </span>
          </motion.div>
        )}

        {/* Prev / Next buttons - مخفية على الموبايل والتابلت، تظهر فقط على الشاشات الكبيرة */}
        {activeIndex > 0 && (
          <button
            type="button"
            aria-label="Previous slide"
            className="hidden lg:block absolute left-[-85px] top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              swiperInstance?.slidePrev();
            }}
          >
            <div className="rounded-full w-14 h-14 flex items-center justify-center bg-white shadow-lg hover:scale-110 transition-transform">
              <FiChevronLeft size={38} className="text-black" />
            </div>
          </button>
        )}
        {activeIndex < projectChunks.length - 1 && (
          <button
            type="button"
            aria-label="Next slide"
            className="hidden lg:block absolute right-[-85px] top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              swiperInstance?.slideNext();
            }}
          >
            <div className="rounded-full w-14 h-14 flex items-center justify-center bg-white shadow-lg hover:scale-110 transition-transform">
              <FiChevronRight size={38} className="text-black" />
            </div>
          </button>
        )}

        <Swiper
          key={`swiper-${slidesPerView}`}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={50}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={handleSlideChange}
          onSlideChangeTransitionStart={() => {
            isDragging.current = true;
          }}
          onSlideChangeTransitionEnd={() => {
            setTimeout(() => {
              isDragging.current = false;
            }, 100);
          }}
          direction="horizontal"
          touchStartPreventDefault={false}
          touchMoveStopPropagation={false}
          nested={true}
          passiveListeners={true}
          allowTouchMove={slidesPerView === 1}
          touchRatio={1}
          threshold={10}
          resistance={true}
          resistanceRatio={0.85}
          watchOverflow={true}
          preventClicks={false}
          preventClicksPropagation={false}
          updateOnWindowResize={true}

        >
          {projectChunks.map((chunk, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col lg:flex-row gap-10 justify-center">
                {chunk.map((project, index) => (
                  <motion.div
                    key={`${project.id}-${activeIndex}`}
                    className={`relative flex flex-col bg-[#1F1F1F] p-4 rounded-2xl shadow-lg h-[550px] cursor-pointer overflow-hidden group
                     w-full            /* الافتراضي للموبايل */
                     md:w-1/2  md:mx-auto         /* التابلت: نصف الشاشة */
                     lg:w-1/2           /* الديسكتوب: ثلث الشاشة */
                     xl:w-1/3
                   `}
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 12,
                      delay: index * 0.15,
                    }}
                    onClick={(e) => {
                      if (!isDragging.current && project.link) {
                        window.open(project.link, "_blank");
                      }
                    }}
                    onMouseEnter={() =>
                      setHoverPreview({
                        src: project.preview
                          ? project.preview
                          : "/assets/all-projects-images/placeholder.png",
                        link: project.link ? true : false,
                      })
                    }
                    onMouseLeave={() => setHoverPreview(null)}
                    onMouseMove={(e) =>
                      setMousePos({ x: e.clientX, y: e.clientY })
                    }
                  >

                    {/* IMAGE */}
                    <div className="relative w-full aspect-[16/12] rounded-2xl overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        style={{
                          opacity: 0,
                          filter: "blur(10px)",
                          transform: "scale(1.05)"
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = 1;
                          e.currentTarget.style.filter = "blur(0px)";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        loading="eager"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="mt-2 flex flex-col flex-1">
                      <p className="text-xs text-[#E0E0E0] uppercase mt-1">
                        {project.category}
                      </p>
                      <h2 className="font-bold text-[#ffffff] uppercase text-lg mt-2">
                        {project.name}
                      </h2>
                      <p className="text-sm text-[#BEBEBE] mt-0.5 flex-1 line-clamp-5">
                        {project.description}
                      </p>

                      {/* ROLE */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.role.split(",").map((r, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 0 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.45 + idx * 0.05 }}
                            style={{ border: "1px solid #ffffff" }}
                            className="text-xs bg-zinc-800/80 text-[#C8C8C8] px-3 py-1 rounded-full font-semibold"
                          >
                            {r.trim()}
                          </motion.span>
                        ))}
                      </div>

                      {/* TOOLS */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.tools.split(",").map((tool, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 0 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.45 + idx * 0.05 }}
                            className="text-xs bg-zinc-800 text-[#C8C8C8] px-4 py-1 rounded-full shadow-sm font-medium transition-all duration-200"
                          >
                            {tool.trim()}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SWIPER DOTS */}
      <div className="absolute lg:bottom-8 bottom-[37px] left-1/2 transform -translate-x-1/2 flex gap-3 ">
        {projectChunks.map((_, idx) => (
          <span
            key={idx}
            className={`transition-all duration-300 ${activeIndex === idx
              ? "w-8 h-3 rounded-full bg-white"
              : "w-3 h-3 rounded-full bg-zinc-900"
              }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
