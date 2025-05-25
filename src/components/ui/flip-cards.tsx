import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

type Testimonial = {
  description: string;
  name: string;
  designation: string;
  src: string;
  tags?: string[];
  website?: string; // Add website
  id?: string; // Add id for navigation
};

interface FlippableCardsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  onActiveChange?: (index: number) => void;
  onVisitWebsite?: () => void; // Add website handler
  onViewClubPage?: () => void; // Add club page handler
}

export const FlippableCards = ({
  testimonials,
  autoplay = false,
  onActiveChange,
  onVisitWebsite,
  onViewClubPage,
}: FlippableCardsProps) => {
  const [active, setActive] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [rotations, setRotations] = useState<number[]>([]);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const newRotations = testimonials.map(
      () => Math.floor(Math.random() * 21) - 10
    );
    setRotations(newRotations);
  }, [testimonials.length]);

  const handleNext = (): void => {
    const newActive = (active + 1) % testimonials.length;
    setActive(newActive);
    onActiveChange?.(newActive);
  };

  const handlePrev = (): void => {
    const newActive = (active - 1 + testimonials.length) % testimonials.length;
    setActive(newActive);
    onActiveChange?.(newActive);
  };

  const isActive = (index: number): boolean => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active]);

  // Get consistent rotation value
  const getRotation = (index: number): number => {
    return rotations[index] || 0;
  };

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="mx-auto max-w-sm px-4 py-4 font-sans antialiased md:max-w-4xl md:px-8">
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left side - Image with buttons */}
          <div className="space-y-4">
            <div className="relative h-64 w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.src}
                  className={`absolute inset-0 transition-opacity duration-400 ${
                    index === 0 ? "opacity-100" : "opacity-70"
                  }`}
                  style={{
                    zIndex: index === 0 ? 40 : testimonials.length + 2 - index,
                  }}
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Buttons under the image */}
            <div className="flex justify-center gap-3">
              <button
                onClick={onVisitWebsite}
                className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Visit Website
              </button>
              <button
                onClick={onViewClubPage}
                className="px-4 py-2 text-sm border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                View Club Page
              </button>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                {testimonials[0]?.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mb-3">
                {testimonials[0]?.designation}
              </p>

              {/* Badges under title */}
              {testimonials[0]?.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {testimonials[0].tags.slice(0, 4).map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200"
                    >
                      {tag.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-neutral-300 leading-relaxed">
                {testimonials[0]?.description}
              </p>
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handlePrev}
                className="group/button flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              >
                <IconArrowLeft className="h-4 w-4 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
              </Button>
              <Button
                onClick={handleNext}
                className="group/button flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              >
                <IconArrowRight className="h-4 w-4 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-4 font-sans antialiased md:max-w-4xl md:px-8">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left side - Image with buttons */}
        <div className="space-y-4">
          <div className="relative h-64 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: getRotation(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : getRotation(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: getRotation(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Buttons under the image with animation */}
          <motion.div
            className="flex justify-center gap-3 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <button
              onClick={onVisitWebsite}
              className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Visit Website
            </button>
            <button
              onClick={onViewClubPage}
              className="px-4 py-2 text-sm border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium"
            >
              View Club Page
            </button>
          </motion.div>
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col justify-between py-2">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              {testimonials[active]?.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-500 mb-3">
              {testimonials[active]?.designation}
            </p>

            {/* Badges under title with animation */}
            {testimonials[active]?.tags && (
              <motion.div
                className="flex flex-wrap gap-1 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {testimonials[active].tags
                  .slice(0, 4)
                  .map((tag: string, index: number) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200"
                      >
                        {tag.replace("-", " ")}
                      </Badge>
                    </motion.div>
                  ))}
              </motion.div>
            )}

            <motion.p className="text-sm text-gray-500 dark:text-neutral-300 leading-relaxed">
              {testimonials[active]?.description
                .split(" ")
                .map((word: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>
          </motion.div>

          {/* Navigation arrows */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handlePrev}
              className="group/button flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowLeft className="h-4 w-4 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </Button>
            <Button
              onClick={handleNext}
              className="group/button flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowRight className="h-4 w-4 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
