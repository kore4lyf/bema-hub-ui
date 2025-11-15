"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee"
import { Music, Radio, Users2, Crown, Calendar, Newspaper, MessageSquareDashed } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useState, useEffect } from "react";
import { heroImages } from "@/assets/images/hero/heroImages";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type TextSlide = {
  type: 'text';
  texts: { title: string; subtitle: string }[];
};

type CampaignSlide = {
  type: 'campaign';
  slug: string;
  title: string;
  description: string;
  image: string;
  status: string;
  participants: number;
  daysLeft: number;
  cta: { text: string; link: string };
};

type MediaSlide = {
  type: 'media';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  subtitle?: string;
  ctas?: { text: string; link: string; variant?: 'default' | 'outline' }[];
};

type HeroSlide = TextSlide | CampaignSlide | MediaSlide;

const heroSlides: HeroSlide[] = [
  {
    type: 'text',
    texts: [
      {
        title: "Join the Echo Loop",
        subtitle: "Connect with faith-driven artists and help them share their music with people who will actually appreciate it"
      },
      {
        title: "Exclusive Live Sessions",
        subtitle: "Get access to intimate performances and behind-the-scenes content you won't find anywhere else"
      },
      {
        title: "Support Real Artists",
        subtitle: "Help independent faith-based musicians grow their audience and make a living doing what they love"
      }
    ]
  },
  {
    type: 'campaign',
    slug: "new-album-launch",
    title: "New Album Launch Campaign",
    description: "Be part of the exclusive launch of Bema Music's latest album. Early access, signed copies, and studio footage for Echo Loop members.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    status: "Active",
    participants: 1567,
    daysLeft: 21,
    cta: { text: "Join Campaign", link: "/campaigns/new-album-launch" }
  },
  {
    type: 'media',
    mediaUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80",
    mediaType: 'image',
    title: "Intimate Acoustic Sessions",
    subtitle: "Join exclusive acoustic performances in unique venues",
    ctas: [
      { text: "Learn More", link: "/campaigns/acoustic-sessions-series", variant: 'default' },
      { text: "View Schedule", link: "#live", variant: 'outline' }
    ]
  }
];

export function Hero() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    // Preload all images
    heroSlides.forEach(slide => {
      if (slide.type === 'campaign') {
        const img = new Image();
        img.src = slide.image;
      } else if (slide.type === 'media' && slide.mediaType === 'image') {
        const img = new Image();
        img.src = slide.mediaUrl;
      }
    });
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slide = heroSlides[currentSlide];
    if (slide.type === 'text') {
      const timer = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % slide.texts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTextIndex(0);
    }, 10000);
    return () => clearInterval(timer);
  }, [timerKey]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setTextIndex(0);
    setTimerKey(prev => prev + 1); // Restart timer
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden py-24 md:py-32 bg-background">
      <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-black/40" />
      
      {/* Render all backgrounds */}
      {heroSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        
        if (slide.type === 'text') {
          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <ThreeDMarquee className="min-h-screen w-full" images={heroImages} />
            </div>
          );
        }
        
        if (slide.type === 'media') {
          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {slide.mediaType === 'image' ? (
                <img src={slide.mediaUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={slide.mediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
              )}
            </div>
          );
        }
        
        if (slide.type === 'campaign') {
          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.image} alt="" className="w-full h-full object-cover blur-sm scale-110" />
            </div>
          );
        }
      })}

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-16 w-3/4 mx-auto" />
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Render all slide content */}
              {heroSlides.map((slide, index) => {
                const isActive = index === currentSlide;
                
                return (
                  <div 
                    key={index}
                    className={`transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
                  >
                    {slide.type === 'text' && (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isActive ? textIndex : `inactive-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto max-w-5xl text-center"
                          >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                              {slide.texts[textIndex].title.includes("Echo Loop") ? (
                                <>
                                  Join the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Echo Loop</span>
                                </>
                              ) : (
                                slide.texts[textIndex].title
                              )}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
                              {slide.texts[textIndex].subtitle}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                          <div>
                            <motion.button 
                            onClick={() => scrollToSection('ambassador')}
                            className="cursor-pointer"
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Crown className="h-9 w-9 border border-white/10 transition-colors  text-yellow-400 mx-auto mb-0.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
                            <p className="text-white/90 font-medium">Ambassador</p>
                            </motion.button>
                          </div>
                          <div>
                            <motion.button 
                              onClick={() => scrollToSection('live')}
                              className="transition-colors cursor-pointer md:translate-y-10"
                              whileHover={{ y: -10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Radio className="h-9 w-9 border border-white/10 transition-colors  text-blue-400 mx-auto mb-0.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
                              <p className="text-white/90 font-medium">Live Sessions</p>
                            </motion.button>
                          </div>                         
                          <div>
                            <motion.button 
                            onClick={() => scrollToSection('latest')}
                            className=" transition-colors cursor-pointer md:translate-y-10"
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Newspaper className="h-9 w-9 border border-white/10 transition-colors  text-purple-400 mx-auto mb-0.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
                            <p className="text-white/90 font-medium">Updates</p>
                            </motion.button>
                          </div>
                          <div>
                            <motion.button 
                            onClick={() => scrollToSection('testimonials')}
                            className="cursor-pointer"
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }} 
                          > 
                            <MessageSquareDashed className="h-9 w-9 border border-white/10 transition-colors  text-green-400 mx-auto mb-0.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
                              <p className="text-white/90 font-medium">Testimonials</p>
                            </motion.button>
                          </div> 
                        </div>
                      </>
                    )}

                    {slide.type === 'campaign' && (
                      <div className="mx-auto max-w-6xl">
                        <div className="bg-black/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
                          <div className="flex flex-col md:grid md:grid-cols-3">
                            <div className="relative">
                              <img src={slide.image} alt={slide.title} className="aspect-ratio aspect-auto w-full h-full object-cover" />
                            </div>
                            <div className="p-6 md:p-10 flex flex-col md:col-span-2 space-y-4 text-left">
                              <div className="flex gap-2">
                                <Badge className="bg-green-600 text-white">{slide.status}</Badge>
                              </div>
                              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">{slide.title}</h2>
                              <p className="text-sm md:text-base text-white/90 leading-relaxed">{slide.description}</p>
                              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                                <div className="flex items-center gap-2">
                                  <Users2 className="h-4 w-4 text-blue-400" />
                                  <span className="font-medium">{slide.participants.toLocaleString()} joined</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-green-400" />
                                  <span className="font-medium">{slide.daysLeft} days left</span>
                                </div>
                              </div>
                              <div className="pt-2">
                                <Link href={slide.cta.link}>
                                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                                    {slide.cta.text}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.type === 'media' && (
                      <div className="grid place-items-center">
                        <div className="mx-auto max-w-5xl text-center">
                          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                            {slide.title}
                          </h1>
                          {slide.subtitle && (
                            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.ctas && (
                            <div className="flex gap-4 justify-center">
                              {slide.ctas.map((cta, idx) => (
                                <Link key={idx} href={cta.link}>
                                  <Button 
                                    size="lg" 
                                    variant={cta.variant || 'default'}
                                    className={cta.variant === 'outline' 
                                      ? "bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm" 
                                      : "bg-blue-600 hover:bg-blue-700 text-white"}
                                  >
                                    {cta.text}
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
