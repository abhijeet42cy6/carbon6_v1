import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
// Import the tiled background component from the external TILE project and cast to a React component
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - external file not in TS compilation scope
import TiledBackgroundExternal from "../../../TILE/src/components/TiledBackground";
import type { FC, ReactNode } from "react";
const TiledBackground: FC<{ children?: ReactNode }> = TiledBackgroundExternal as unknown as FC<{ children?: ReactNode }>;

// manually coded
const images = [
  'image_1.jpg',
  'image_2.jpg',
  'image_3.jpg',
  'image_4.jpg',
  'image_5.jpg',
  'image_6.jpg',
];

// Structured text data for each parallax step
const texts = [
  {
    pre: 'Access over ',
    highlight: '200000+',
    highlightColor: '#1c72f5',
    post: ' verified emission factors using natural language',
    description: 'Everything you need is at your fingertips',
  },
  {
    pre: 'Upload documents and get ',
    highlight: 'instant carbon audits',
    highlightColor: '#2dd4bf',
    post: '',
    description: 'Just upload documents of any format- csv, excel, pdfs, images etc and let AI handle all the calculation',
  },
  {
    pre: 'Get ',
    highlight: 'Scope 1, 2 and 3',
    highlightColor: '#10b981',
    post: ' calculations directly',
    description: 'Get the calculations in downloadable format, and edit them if you want as per your need',
  },
  {
    pre: '',
    highlight: 'Generate insights',
    highlightColor: '#1c72f5',
    post: ' directly from your company data and emission inventory',
    description: 'Ask our AI for outliers, strategy and insights from your company data by directly talking to it using natural language',
  },
  {
    pre: '',
    highlight: 'Generate audit ready reports',
    highlightColor: '#1c72f5',
    post: ' directly using AI',
    description: 'You can also manage and edit the information that has to reflect in the reports. Select reporting format from a collection of frameworks such as TCFD, CDP etc',
  },
  {
    pre: 'Automate data-extraction',
    highlight: ' from company sources',
    highlightColor: '#2dd4bf',
    post: '',
    description: 'Extract data directly from all connected ERP, CRM and supply chain softwares and upload raw company files',
  },
];

// Height of the carousel (image/text) container in pixels
const CAROUSEL_HEIGHT = 540;

export const MacbookPro = (): JSX.Element => {
  // Ref and state for scroll-driven parallax animation
  const parallaxSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isLocked = useRef(false);
  const lastScrollPosition = useRef(0);
  const wheelListener = useRef<((e: WheelEvent) => void) | null>(null);
  const hasCompletedSequence = useRef(false);
  const [showScrollGuide, setShowScrollGuide] = useState(true);

  // Data for the tabs section
  const tabCategories = [
    {
      id: "global",
      title: "Global sustainability intelligence",
      isActive: true,
    },
    {
      id: "company",
      title: "Company data and analytics",
      isActive: false,
    },
    {
      id: "strategic",
      title: "Strategic sustainability intelligence",
      isActive: false,
    },
  ];

  const tabContents = [
    {
      id: "global",
      questions: [
        "What is the emission factor for diesel SUV vehicles in Mumbai?",
      ],
    },
    {
      id: "company",
      questions: [
        "What is your competitor name* scope 1 emission from satellite data?",
      ],
    },
    {
      id: "strategic",
      questions: [
        "What is the emission calculation methodology for steel production according to GHG protocol",
      ],
    },
  ];

  // Data for the satellite emission cards
  const emissionCards = [
    {
      id: 1,
      label: "Chimney 1",
      scope: "Scope 1",
      value: "23,45,000",
      unit: "CO2eMt",
      progress: "66%",
    },
    {
      id: 2,
      label: "Chimney 2",
      scope: "Scope 1",
      value: "56,000",
      unit: "CO2eMt",
      progress: "66%",
    },
  ];

  // Scroll-driven parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !parallaxSectionRef.current) return;

      const rect = contentRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculate how centered the content is in the viewport
      const contentCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const distanceFromCenter = Math.abs(contentCenter - viewportCenter);

      // Reset sequence completion when scrolled back up (content is below viewport)
      if (rect.top > vh) {
        hasCompletedSequence.current = false;
        setScrollProgress(0);
      }

      // Only start animation when content is very close to center (within 50px)
      if (distanceFromCenter < 50 && !hasCompletedSequence.current) {
        if (!isLocked.current) {
          isLocked.current = true;
          lastScrollPosition.current = window.scrollY;
          document.body.style.overflow = 'hidden';
          
          // Set up wheel event listener when locked
          wheelListener.current = (e: WheelEvent) => {
            setScrollProgress(prev => {
              const newProgress = Math.max(0, Math.min(1, prev + (e.deltaY / (vh * 3)))); // Adjusted divisor for better control
              
              // Update animation step
              const step = Math.floor(newProgress * (images.length - 1));
              setAnimationStep(step);

              // Only unlock when truly at the end
              if (newProgress >= 0.999) { // Changed from 0.99 to 0.999 to ensure we reach the last image
                hasCompletedSequence.current = true;
                isLocked.current = false;
                document.body.style.overflow = '';
                if (wheelListener.current) {
                  window.removeEventListener('wheel', wheelListener.current);
                  wheelListener.current = null;
                }
              }

              return newProgress;
            });
          };
          window.addEventListener('wheel', wheelListener.current);
        }
      } else if (isLocked.current) {
        isLocked.current = false;
        document.body.style.overflow = '';
        if (wheelListener.current) {
          window.removeEventListener('wheel', wheelListener.current);
          wheelListener.current = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isLocked.current) {
        document.body.style.overflow = '';
        if (wheelListener.current) {
          window.removeEventListener('wheel', wheelListener.current);
          wheelListener.current = null;
        }
      }
    };
  }, []);

  // Function to create particles
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2
      });
    }
    return particles;
  };

  const [particles] = useState(createParticles());

  // Hide scroll guide after first interaction
  useEffect(() => {
    const handleScroll = () => {
      if (showScrollGuide) {
        setShowScrollGuide(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollGuide]);

  return (
    <div className="flex flex-row justify-center w-full bg-black">
      <div className="overflow-hidden w-full h-[8517px] relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Add keyframes for bounce animations at the top level */}
        <style>
          {`
            @keyframes springScale {
              0% {
                opacity: 0;
                transform: scale(0.94) translateY(20px);
              }
              60% {
                opacity: 1;
                transform: scale(1.02) translateY(-5px);
              }
              80% {
                transform: scale(0.98) translateY(2px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            @keyframes slideUpFade {
              0% {
                opacity: 0;
                transform: translateY(30px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .spring-scale {
              opacity: 0;
              animation: springScale 1.4s cubic-bezier(.22,1,.36,1) forwards;
            }

            .slide-up-fade {
              opacity: 0;
              animation: slideUpFade 0.8s cubic-bezier(.22,1,.36,1) forwards;
            }

            .delay-100 { animation-delay: 0.1s; }
            .delay-200 { animation-delay: 0.2s; }
            .delay-300 { animation-delay: 0.3s; }
            .delay-400 { animation-delay: 0.4s; }

            /* Button hover effect */
            .hover-lift {
              transition: all 0.2s cubic-bezier(.22,1,.36,1);
            }
            .hover-lift:hover {
              transform: translateY(-2px) scale(1.015);
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            }
          `}
        </style>

        {/* Fixed Navigation Bar */}
        <header className="fixed w-full h-[74px] top-0 left-0 bg-[#131313] z-50">
          <div className="max-w-[1450px] mx-auto flex items-center justify-between px-8 h-[74px] relative">
            <div className="flex items-center h-[34px] spring-scale">
                <img
                className="h-[34px] w-auto"
                alt="Carbon6 Logo"
                src="/logo.png"
                />
              <span className="ml-[6px] font-semibold text-white text-xl tracking-[0] leading-[normal] font-['JetBrains_Mono_NL-SemiBold',Helvetica]">
                CARBON6
              </span>
            </div>

            <nav className="flex space-x-[75px] h-[34px] items-center">
              <span className="font-light text-white text-xs tracking-[0.96px] leading-[normal] font-['Helvetica_Neue-Light',Helvetica] slide-up-fade delay-100">
                PRODUCT
              </span>
              <span className="font-light text-white text-xs tracking-[0.96px] leading-[normal] font-['Helvetica_Neue-Light',Helvetica] slide-up-fade delay-200">
                BLOGS
              </span>
              <span className="font-light text-white text-xs tracking-[0.96px] leading-[normal] font-['Helvetica_Neue-Light',Helvetica] slide-up-fade delay-300">
                CONTACT
              </span>
            </nav>

            <div className="flex space-x-4 h-[34px]">
              <Button
                variant="outline"
                className="hover-lift !bg-transparent !border !border-[#757575] !text-white !rounded !h-[34px] !px-4 !py-0 !text-[12px] hover:!bg-[#ffffff15]"
              >
                  LOG IN
              </Button>

              <Button
                variant="default"
                className="hover-lift !bg-white !text-black !rounded !h-[34px] !px-4 !py-0 !text-[12px] !font-medium hover:!bg-[#f5f5f5]"
              >
                  BOOK A DEMO
              </Button>
            </div>
            
            {/* Thinner separator aligned exactly with content */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center w-full">
              <div className="h-[1px] bg-[#ffffff40]" style={{ width: 'calc(100% - 64px)', marginLeft: '32px', marginRight: '32px' }}></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="absolute w-full h-[100vh] top-0 left-0 flex flex-col items-center justify-center overflow-hidden">
          {/* Blue gradient background */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url("/Header-non-grid background.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Black gradient overlay at the bottom */}
            <div className="absolute left-0 right-0 bottom-0 h-[25%]" 
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 85%, #000000 100%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
          </div>

          {/* Tile overlay replacing the old grid lines */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <TiledBackground>
              <></>
            </TiledBackground>
          </div>
          
          {/* Content wrapper for main heading only */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-full max-w-[1200px] px-4">
            {/* Main heading - centered */}
            <h1 className="heading-override w-[900px] font-light text-white text-[58px] text-center tracking-[0] leading-[70px] font-['Alliance_No.2-Light',Helvetica] spring-scale">
              AI Sustainability Analyst <br />
              for Instantaneous Carbon Audits
            </h1>
          </div>
          
          {/* Bottom content container - positioned at bottom */}
          <div className="absolute left-1/2 bottom-[10%] transform -translate-x-1/2 z-10 flex flex-col items-center w-full max-w-[1200px] px-4">
            {/* Subheading - centered */}
            <div className="font-light text-center tracking-[0] leading-[30px] text-xl font-['Alliance_No.2-Light',Helvetica] mb-8 slide-up-fade delay-300">
              <span className="text-[#d3d3d3cc]">
                  Explore a new era of auditing
              </span>
                  <br />
                <span className="text-white">
                  through AI &amp; Satellite data
                </span>
              </div>

            {/* Down arrow button - centered */}
            <Button
              variant="outline"
              className="hover-lift w-[76px] h-[76px] rounded-full border border-solid border-white flex items-center justify-center !bg-transparent hover:!bg-[rgba(255,255,255,0.1)]"
            >
              <img
                className="w-4 h-10"
                alt="Arrow button"
                src="/arrow-button-arrow.png"
              />
            </Button>
          </div>
        </section>

        {/* Video Section */}
        <section className="absolute w-[1140px] h-[683px] top-[850px] left-0 right-0 mx-auto bg-neutral-600 rounded-[10px] overflow-hidden spring-scale delay-400">
          {/* Video placeholder - will be replaced with actual video */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-2xl">Video Placeholder</div>
            {/* Uncomment and update the src when video is ready */}
            {/* <video 
              className="w-full h-full object-cover"
              controls
              poster="/video-poster.jpg"
            >
              <source src="/your-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
          </div>
        </section>

        {/* Supercharge Section */}
        <h2 className="absolute w-[1193px] top-[1800px] left-0 right-0 mx-auto font-light text-white text-[50px] text-center tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica] spring-scale" style={{ 
          animationDelay: '0.2s'
        }}>
          Supercharge your auditing team with the power of AI- research,
          strategize, audit and generate reports instantaneously
        </h2>

        {/* Parallax Section */}
        <section
          ref={parallaxSectionRef}
          className="absolute w-full top-[1800px] left-0"
          style={{ height: `calc(100vh + ${CAROUSEL_HEIGHT}px)` }}
        >
          {/* Progress indicator */}
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
            <div className="flex flex-col gap-3">
              {texts.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === animationStep ? 'bg-white w-4' : 'bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scroll guide */}
          {showScrollGuide && (
            <div 
              className="fixed left-1/2 bottom-8 transform -translate-x-1/2 text-white text-center opacity-80 transition-opacity duration-500 z-50"
              style={{ animation: 'fadeInOut 2s infinite' }}
            >
              <div className="text-sm mb-2">Scroll to explore</div>
              <div className="w-6 h-10 border-2 border-white rounded-full mx-auto relative">
                <div 
                  className="w-1.5 h-1.5 bg-white rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
                  style={{ animation: 'scrollDown 1.5s infinite' }}
                />
              </div>
            </div>
          )}

          <div
            ref={contentRef}
            className="max-w-[1400px] mx-auto h-[540px] flex justify-between relative"
            style={{ position: 'sticky', top: '50%', transform: 'translateY(-50%)' }}
          >
            {/* Tile overlay for parallax area */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <TiledBackground>
                <></>
              </TiledBackground>
            </div>

            {/* Particle effect background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
              {particles.map((particle, idx) => (
                <div
                  key={idx}
                  className="absolute bg-white rounded-full opacity-30"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animation: `float ${3 / particle.speed}s infinite linear`
                  }}
                />
              ))}
            </div>

            {/* Left side - Image Container - Now sticky */}
            <div className="w-[600px] relative" style={{ position: 'sticky', top: '50%', transform: 'translateY(calc(-50% + 300px))' }}>
              <div className="h-[540px] flex items-center justify-center">
                <div className="relative w-[540px] h-[540px] overflow-hidden rounded-lg shadow-xl bg-black flex items-center justify-center">
                  {images.map((imagePath, idx) => (
                    <img
                      key={idx}
                      className="absolute inset-0 w-full h-full object-contain transition-all duration-1000"
                      alt={texts[idx].highlight}
                      src={`/${imagePath}`}
                      style={{
                        opacity: animationStep === idx ? 1 : 0,
                        transform: 'none',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        zIndex: animationStep === idx ? 1 : 0,
                        display: Math.abs(animationStep - idx) > 1 ? 'none' : 'block' // Only render nearby images
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${imagePath}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Text sections - Now scrolling */}
            <div className="w-[600px] relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${-scrollProgress * (texts.length - 1) * 100}vh)`,
                  transition: 'none'
                }}
              >
                {texts.map((t, idx) => (
                  <div
                    key={idx}
                    className="h-[100vh] flex flex-col justify-center relative"
                  >
                    <div className="space-y-4">
                      {/* Pre text line */}
                      {t.pre && (
                        <div className="font-light text-[50px] tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica] text-white">
                          {t.pre}
                        </div>
                      )}
                      
                      {/* Highlight text line */}
                      <div className="font-light text-[50px] tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica]">
                        <span style={{ 
                          color: t.highlightColor,
                          textShadow: '0 0 20px ' + t.highlightColor + '40'
                        }}>{t.highlight}</span>
                      </div>
                      
                      {/* Post text line */}
                      {t.post && (
                        <div className="font-light text-[50px] tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica] text-white">
                          {t.post}
                        </div>
                      )}
                    </div>
                    
                    {/* Description text - split into lines */}
                    <div className="mt-10">
                      {t.description.split('. ').map((line, lineIdx) => (
                        <div
                          key={lineIdx}
                          className="font-light text-white text-xl tracking-[0] leading-[1.8] font-['Alliance_No.2-Light',Helvetica]"
                        >
                          {line + (lineIdx < t.description.split('. ').length - 1 ? '.' : '')}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <img
          className="absolute w-[1432px] h-[652px] top-[3327px] left-0 right-0 mx-auto object-cover rounded-[10px]"
          alt="Satellite Image"
          src={`${window.location.origin}/image-303.jpg`}
        />

        <div className="absolute w-[1432px] h-[652px] top-[3326px] left-0 right-0 mx-auto bg-[#10101094] flex flex-col justify-end rounded-[10px]">
          <div className="absolute top-4 right-6 font-light text-white text-base tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica]">
            Location: Jk Papers Unit CPM Songadh
          </div>
          <div className="flex flex-row justify-between items-end w-full h-full p-10">
            <div className="flex flex-col justify-end w-[600px] h-[180px]">
              <h3 className="font-light text-white text-3xl tracking-[0] leading-[1.1] font-['Alliance_No.2-Light',Helvetica] mb-2">
                Get Scope 1 emissions directly from satellite data
              </h3>
              <p className="font-light text-white text-base tracking-[0] leading-[1.3] font-['Alliance_No.2-Light',Helvetica]">
                We process high resolution satellite imagery to directly estimate scope 1 emissions and drive insights and analytics
              </p>
                </div>
            <button className="bg-white rounded-[5px] px-12 py-5 flex items-center text-black text-xl font-light shadow-md hover:bg-gray-100 transition-all">
              <span className="mr-3">Explore Now</span>
              <img src="/arrow-outward.png" alt="Arrow outward" className="w-7 h-7" />
            </button>
                </div>
                </div>

        {/* Gradient Tile Separator Section */}
        <section
          className="absolute w-full h-[300px] top-[4000px] left-0 overflow-hidden"
          style={{
            background:
              'linear-gradient(to bottom, #000000 0%, #141414 10%, #2b2b2b 25%, #4c4c4c 45%, #6f6f6f 65%, #9c9c9c 85%, #ffffff 100%)',
          }}
        >
          {/* Tile overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <TiledBackground>
              <></>
            </TiledBackground>
          </div>
        </section>

        {/* White Container Section with Table */}
        <section className="absolute w-full min-h-[calc(100vh+200px)] top-[4200px] left-0 bg-white">
          <div className="w-full max-w-[1200px] mx-auto pt-20 pb-40">
            <div className="mt-[50px]">
              <h2 className="font-light text-black text-4xl tracking-[0] leading-[normal] text-center mb-16 font-['Alliance_No.2-Light',Helvetica]">
            Answers to all your questions are now here
          </h2>

              <div className="w-full border border-solid border-gray-300">
                {/* Row 1 */}
                <div className="flex">
                  <div className="w-[312px] p-2 bg-[#1E2E3B] text-white border-b border-solid border-gray-300">
                    <div className="py-2 px-4 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      Global sustainability intelligence
                    </div>
                  </div>
                  <div className="flex-1 p-2 border-b border-l border-solid border-gray-300">
                    <div className="py-2 px-6 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      What is the emission factor for diesel SUV vehicles in Mumbai?
                    </div>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="flex">
                  <div className="w-[312px] p-2 bg-white text-black border-b border-solid border-gray-300">
                    <div className="py-2 px-4 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      Company data and analytics
                    </div>
                  </div>
                  <div className="flex-1 p-2 border-b border-l border-solid border-gray-300">
                    <div className="py-2 px-6 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      What is your competitor name* scope 1 emission from satellite data?
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex">
                  <div className="w-[312px] p-2 bg-white text-black border-solid border-gray-300">
                    <div className="py-2 px-4 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      Strategic sustainability intelligence
                    </div>
                  </div>
                  <div className="flex-1 p-2 border-l border-solid border-gray-300">
                    <div className="py-2 px-6 font-light text-lg font-['Alliance_No.2-Light',Helvetica]">
                      What is the emission calculation methodology for steel production according to GHG protocol
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Era Section */}
        <section className="absolute w-full h-[700px] top-[4800px] left-0 flex flex-col items-center justify-center">
          {/* Background image - full viewport with proper centering */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/Last-CTA-wallpaper.png" 
              alt="Blue gradient background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Semi-transparent overlay for depth */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Tile overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <TiledBackground>
              <></>
            </TiledBackground>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto">
            <h2 className="font-light text-white text-5xl text-center tracking-[0] leading-[normal] mb-12 font-['Alliance_No.2-Light',Helvetica]">
            Enter a new era of carbon accounting
          </h2>

            <button className="bg-white rounded-[5px] px-14 py-6 flex items-center text-black text-2xl font-light shadow-md hover:bg-gray-100 transition-all">
              <span className="mr-4">Book demo</span>
              <img src="/arrow-outward.png" alt="Arrow outward" className="w-7 h-7" />
            </button>
          </div>
        </section>

        {/* API Section */}
        <section className="absolute w-full min-h-[600px] top-[6000px] left-0 bg-black pt-20 pb-40">
          <div className="w-full max-w-[1200px] mx-auto px-4">
            <h2 className="font-light text-white text-5xl tracking-[0] leading-[normal] mb-16 font-['Alliance_No.2-Light',Helvetica] ml-4">
              Explore our APIs
            </h2>
            
            <div className="flex flex-wrap">
              <div className="w-1/2 p-4">
                <div className="h-[258px] bg-[#424242] border border-solid border-[#202020] rounded-none flex items-end p-10">
                  <span className="font-light text-white text-[64px] tracking-[0] leading-[normal] font-['Alliance_No.2-Light',Helvetica]">
                EF360
                  </span>
                </div>
              </div>
              <div className="w-1/2 p-4">
                <div className="h-[258px] bg-[#424242] border border-solid border-[#202020] rounded-none"></div>
              </div>
              <div className="w-1/2 p-4">
                <div className="h-[258px] bg-[#424242] border border-solid border-[#202020] rounded-none"></div>
              </div>
              <div className="w-1/2 p-4">
                <div className="h-[258px] bg-[#424242] border border-solid border-[#202020] rounded-none"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
