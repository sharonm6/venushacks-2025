"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Check, Plus, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { profilesCollection } from "@/utils/firebase.browser";
import { index } from "@/services/profiles";

type Testimonial = {
  description: string;
  name: string;
  designation: string;
  src: string;
  tags?: string[];
  website?: string;
  id?: string;
  isJoined?: boolean;
};

// Word-by-word blur animation component (like the original)
const WordBlurAnimation = ({ text }: { text: string }) => {
  return (
    <>
      {text.split(" ").map((word, index) => (
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
            delay: 0.02 * index, // Staggered delay for each word
          }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  );
};

// Smart tag display component with proper width calculation
const SmartTagDisplay = ({ tags }: { tags: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayState, setDisplayState] = useState<{
    displayTags: string[];
    extraCount: number;
  }>({ displayTags: tags, extraCount: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !tags.length) return;

    // Use setTimeout to ensure the component is fully rendered
    const calculateTags = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      // Get the actual available width (accounting for padding and margins)
      const containerWidth = container.getBoundingClientRect().width;

      // Create a temporary measuring container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.top = "-9999px";
      tempContainer.style.left = "-9999px";
      tempContainer.style.display = "flex";
      tempContainer.style.gap = "4px";
      tempContainer.style.alignItems = "center";
      tempContainer.style.fontSize = "12px"; // text-xs
      tempContainer.style.fontFamily = getComputedStyle(container).fontFamily;
      document.body.appendChild(tempContainer);

      let totalWidth = 0;
      let fittingTags = 0;
      const plusBadgeWidth = 40; // Estimated width for "+n" badge

      // Measure each tag
      for (let i = 0; i < tags.length; i++) {
        const tempBadge = document.createElement("span");
        tempBadge.className =
          "text-xs px-2 py-0.5 bg-purple-100 text-purple-700 whitespace-nowrap inline-flex items-center rounded-md border border-transparent font-medium";
        tempBadge.textContent = tags[i];
        tempBadge.style.fontSize = "12px";
        tempBadge.style.padding = "2px 8px";
        tempContainer.appendChild(tempBadge);

        // Force a reflow to get accurate measurements
        tempBadge.offsetHeight;
        const badgeWidth = tempBadge.getBoundingClientRect().width;

        const gapWidth = i > 0 ? 4 : 0; // Gap between badges
        const widthWithGap = totalWidth + gapWidth + badgeWidth;

        // Check if we need to reserve space for "+n" badge
        const needsPlusBadge = i < tags.length - 1;
        const totalNeededWidth =
          widthWithGap + (needsPlusBadge ? 4 + plusBadgeWidth : 0);

        if (totalNeededWidth <= containerWidth - 8) {
          // 8px buffer
          totalWidth = widthWithGap;
          fittingTags = i + 1;
        } else {
          break;
        }
      }

      document.body.removeChild(tempContainer);

      // Ensure we show at least 3 tags if available, even if measurements are off
      const minTags = Math.min(3, tags.length);
      if (fittingTags < minTags && tags.length >= minTags) {
        fittingTags = minTags;
      }

      // Set the display state
      if (fittingTags >= tags.length) {
        setDisplayState({ displayTags: tags, extraCount: 0 });
      } else {
        // If we can't fit all tags, show as many as possible with "+n"
        const safeTagCount = Math.max(1, fittingTags - 1);
        setDisplayState({
          displayTags: tags.slice(0, safeTagCount),
          extraCount: tags.length - safeTagCount,
        });
      }
    };

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(calculateTags, 100);

    // Also add a resize observer for responsiveness
    const resizeObserver = new ResizeObserver(calculateTags);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [tags, mounted]);

  if (!tags.length || !mounted) return null;

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 mb-3 min-h-[24px] w-full"
    >
      {displayState.displayTags.map((tag, tagIndex) => (
        <Badge
          key={tagIndex}
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 hover:bg-purple-200 whitespace-nowrap flex-shrink-0"
        >
          {tag}
        </Badge>
      ))}
      {displayState.extraCount > 0 && (
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 whitespace-nowrap flex-shrink-0"
        >
          +{displayState.extraCount}
        </Badge>
      )}
    </div>
  );
};

export const FlippableCards = ({
  testimonials,
  autoplay = false,
  onActiveChange,
  onVisitWebsite,
  onViewClubPage,
  joinedClubs,
  setJoinedClubs,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  onActiveChange?: (index: number) => void;
  onVisitWebsite?: () => void;
  onViewClubPage?: () => void;
  joinedClubs: string[];
  setJoinedClubs: (clubs: string[] | ((prev: string[]) => string[])) => void;
}) => {
  const userid = "jZDLVSPOI9A3xQQhwEef";

  const [active, setActive] = useState(0);
  const [justJoinedClub, setJustJoinedClub] = useState<string | null>(null);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const isActive = useCallback(
    (index: number) => {
      return index === active;
    },
    [active]
  );

  const handleJoinClub = useCallback(
    async (clubId: string, clubName: string) => {
      if (!clubId) return;

      const now = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedDate = `${
        monthNames[now.getMonth()]
      } ${now.getFullYear()}`;

      const profileRef = doc(profilesCollection, userid || "");
      const profile = await index(userid);

      updateDoc(profileRef, {
        clubs:
          profile.clubs.length > 0
            ? profile.clubs + "," + (clubId + "(" + formattedDate + ")")
            : clubId + "(" + formattedDate + ")",
      });

      // Add to joined clubs
      setJoinedClubs((prev) => [...prev, clubId]);
      setJustJoinedClub(clubId);

      console.log(`Joined club: ${clubName} (ID: ${clubId})`);
    },
    []
  );

  const isClubJoined = useCallback(
    (clubId: string) => {
      if (!clubId) return false;
      return (
        joinedClubs?.includes(clubId) ||
        testimonials.find((t) => t.id === clubId)?.isJoined
      );
    },
    [joinedClubs, testimonials]
  );

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(active);
    }
  }, [active, onActiveChange]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const isJoined = isClubJoined(testimonial.id || "");
                const wasJustJoined = justJoinedClub === testimonial.id;

                return (
                  <motion.div
                    key={testimonial.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index)
                        ? 999
                        : testimonials.length + 2 - index,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <div
                      className={cn(
                        "relative h-full w-full rounded-3xl p-6 origin-bottom flex flex-col justify-between",
                        "bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100",
                        "border-2 border-pink-200 shadow-lg"
                      )}
                    >
                      {/* Join Status Indicator with Animation */}
                      <div className="absolute top-4 right-4 z-10">
                        <AnimatePresence mode="wait">
                          {isJoined ? (
                            <motion.div
                              key="joined"
                              initial={
                                wasJustJoined
                                  ? { scale: 0, rotate: -180 }
                                  : false
                              }
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 25,
                                duration: 0.6,
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium shadow-sm cursor-default"
                            >
                              <motion.div
                                initial={wasJustJoined ? { scale: 0 } : false}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Check className="h-3 w-3" />
                              </motion.div>
                              Joined
                            </motion.div>
                          ) : (
                            <motion.button
                              key="join"
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleJoinClub(
                                  testimonial.id || "",
                                  testimonial.name
                                )
                              }
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-full text-xs font-medium shadow-sm transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              Join
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Logo Image - Centered and larger since no description */}
                      <div className="flex justify-center items-center flex-1">
                        <div className="h-48 w-full bg-white rounded-2xl p-6 flex items-center justify-center shadow-sm">
                          <img
                            src={testimonial.src}
                            alt={testimonial.name}
                            className="max-h-36 max-w-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Bottom section with tags and buttons */}
                      <div className="mt-4">
                        {/* Smart Tags - Dynamically fit as many as possible */}
                        {testimonial.tags && testimonial.tags.length > 0 && (
                          <SmartTagDisplay tags={testimonial.tags} />
                        )}

                        <div className="flex justify-center space-x-2">
                          {onVisitWebsite && testimonial.website && (
                            <button
                              onClick={onVisitWebsite}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </button>
                          )}
                          {onViewClubPage && testimonial.id && (
                            <motion.button
                              onClick={onViewClubPage}
                              className={cn(
                                "flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors",
                                wasJustJoined && isActive(index)
                                  ? "bg-purple-200 text-purple-800 ring-2 ring-purple-300 animate-pulse"
                                  : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                              )}
                              animate={
                                wasJustJoined && isActive(index)
                                  ? {
                                      scale: [1, 1.05, 1],
                                      transition: {
                                        repeat: Infinity,
                                        duration: 0.5,
                                      },
                                    }
                                  : {}
                              }
                            >
                              <Eye className="h-3 w-3" />
                              View Club
                              {wasJustJoined && isActive(index) && (
                                <ArrowDown className="h-3 w-3 ml-1 animate-bounce" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
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
            <h3 className="text-2xl font-bold text-purple-800 mb-2">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-purple-600 mb-6">
              {testimonials[active].designation}
            </p>

            {/* Description with word-by-word blur animation */}
            <motion.p
              className="text-gray-600 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <WordBlurAnimation text={testimonials[active].description} />
            </motion.p>
          </motion.div>

          {/* Navigation buttons with more padding from description */}
          <div className="flex gap-4 pt-20 md:pt-16">
            <Button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center group/button shadow-lg transition-all duration-200"
            >
              <IconArrowLeft className="h-5 w-5 text-white group-hover/button:rotate-12 transition-transform duration-200" />
            </Button>
            <Button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center group/button shadow-lg transition-all duration-200"
            >
              <IconArrowRight className="h-5 w-5 text-white group-hover/button:-rotate-12 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
