import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import earthVideo from "./assets/earth.mp4";
import moonImage from "./assets/Moon.png";
import { ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiNodedotjs, SiPostgresql, SiPrisma, SiNestjs, SiReact, SiTypescript, SiNextdotjs, SiExpress, SiMysql, SiFigma, SiSocketdotio, SiExpo, SiFlutter, SiSqlite } from "react-icons/si";
import type { IconType } from "react-icons";
import projectData from "./data/projects.json";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  description: string;
  image: string;
  category: string;
  year: string;
  techStack: { label: string; icon: string }[];
  link: string;
};

const projects: Project[] = projectData;

const techIcons: Record<string, IconType> = {
  figma: SiFigma,
  postgres: SiPostgresql,
  react: SiReact,
  typescript: SiTypescript,
  socketIO: SiSocketdotio,
  nestJS: SiNestjs,
  expo: SiExpo,
  flutter: SiFlutter,
  expressJS: SiExpress,
  mySql: SiMysql,
  sqlite: SiSqlite
};

function ProjectPages() {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const totalPages = projects.length + 1;

  useEffect(() => {
    const pages = pagesRef.current;
    const track = trackRef.current;
    if (!pages || !track) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 601px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-page", track);
        if (cards.length === 0) return;

        const lastCard = cards[cards.length - 1];
        const scrollAmount = lastCard.offsetLeft + lastCard.offsetWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: pages,
            start: "top top",
            end: () => `+=${scrollAmount}`,
            scrub: 1.35,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, pagesRef);
    
    return () => context.revert();
  }, [totalPages]);

  return (
    <div className="project-pages" ref={pagesRef} aria-label="Horizontal project pages">
      <div className="project-pages-track" ref={trackRef}>
        {projects.map((project) => (
          <article className="project-page" key={project.title}>
            <div className="project-page-card">
              <div className="project-page-image">
                <img src={project.image} alt={`${project.title} project preview`} />
              </div>
              <div className="carousel-detail">
                <div className="project-detail-top">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="skill-card-stack" aria-label={`${project.title} technology stack`}>
                  {project.techStack.map((tech) => {
                    const TechIcon = techIcons[tech.icon] ?? SiReact;
                    return <span className="tech-chip" key={tech.label}><TechIcon /> {tech.label}</span>;
                  })}
                </div>
                <a className="project-detail-link" href={project.link} target="_blank">
                  View project <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
        <article className="project-page next-project-page">
          <div className="next-big-thing">
            <span className="eyebrow">Coming soon</span>
            <h3>Next Big Thing</h3>
            <p>What could be coming next?</p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function App() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const earthVideoARef = useRef<HTMLVideoElement | null>(null);
  const earthVideoBRef = useRef<HTMLVideoElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const orbitRingRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const heroNameRef = useRef<HTMLHeadingElement | null>(null);
  const heroRoleRef = useRef<HTMLParagraphElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ---------------- Starfield canvas ----------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: { x: number; y: number; r: number; baseAlpha: number; speed: number; phase: number }[] = [];
    let raf = 0;
    let frame = 0;

    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const count = Math.floor((w * h) / 6000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(frame * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,239,233,${Math.max(0, alpha)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    window.addEventListener("resize", build);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, []);

  useEffect(() => {
    const firstVideo = earthVideoARef.current;
    const secondVideo = earthVideoBRef.current;
    if (!firstVideo || !secondVideo) return;

    const videos = [firstVideo, secondVideo];

    let transitionTimer: number | undefined;

    const switchVideo = (finishedVideo: HTMLVideoElement) => {
      const finishedIndex = videos.indexOf(finishedVideo);
      const nextIndex = finishedIndex === 0 ? 1 : 0;
      const nextVideo = videos[nextIndex];
      if (!nextVideo) return;

      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => undefined);
      gsap.set(nextVideo, { opacity: 0 });
      gsap.to(nextVideo, { opacity: 1, duration: 0.8, ease: "power2.inOut" });

      transitionTimer = window.setTimeout(() => {
        finishedVideo.pause();
        finishedVideo.currentTime = 0;
        gsap.set(finishedVideo, { opacity: 0 });
      }, 850);
    };

    const handleEnd = (event: Event) => {
      switchVideo(event.currentTarget as HTMLVideoElement);
    };

    videos.forEach((video, index) => {
      video.addEventListener("ended", handleEnd);
      video.preload = "auto";
      if (index === 0) video.play().catch(() => undefined);
    });

    return () => {
      videos.forEach((video) => video.removeEventListener("ended", handleEnd));
      if (transitionTimer) window.clearTimeout(transitionTimer);
      videos.forEach((video) => video.pause());
      gsap.killTweensOf(videos);
    };
  }, []);

  // ---------------- Orbit + cinematic intro ----------------
  useEffect(() => {
    const stage = stageRef.current;
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (!stage || !sun || !moon) return;

    let radiusX = 0;
    let radiusY = 0;

    const computeRadii = () => {
      const w = stage.clientWidth;
      radiusX = w * 0.42;
      radiusY = w * 0.15;
    };
    computeRadii();
    window.addEventListener("resize", computeRadii);

    let angle = 0;
    const angularSpeed = (Math.PI * 2) / 22;
    const tick = (_time: number, deltaMs: number) => {
      angle += angularSpeed * (deltaMs / 1000);

      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;

      const depthT = (Math.sin(angle) + 1) / 2;
      const illumination = (Math.cos(angle) + 1) / 2;
      const scale = 0.74 + depthT * 0.48;
      const brightness = 0.02 + illumination * 1.08;
      const shadeOpacity = 0.98 - illumination * 0.98;
      const shadeAngle = angle * (180 / Math.PI) + 90;

      moon.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      moon.style.filter = `brightness(${brightness}) contrast(${0.92 + depthT * 0.16})`;
      moon.style.setProperty("--moon-shade-opacity", shadeOpacity.toFixed(3));
      moon.style.setProperty("--moon-shade-angle", `${shadeAngle}deg`);
      moon.style.zIndex = depthT > 0.5 ? "5" : "1";
    };

    gsap.ticker.add(tick);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(stage, { scale: 0.7, rotate: -12, opacity: 0, filter: "blur(18px)" });
      gsap.set(sun, { scale: 0.2, opacity: 0, rotate: -18 });
      gsap.set(orbitRingRef.current, { scale: 0.5, rotate: -28, opacity: 0 });
      gsap.set(moon, { opacity: 0, scale: 0.5 });
      gsap.set([heroNameRef.current, heroRoleRef.current, heroCtaRef.current], { y: 34, opacity: 0 });

      tl.to(curtainRef.current, { opacity: 0, duration: 1.3, ease: "power2.inOut" }, 0.15)
        .to(stage, { scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)", duration: 2.2, ease: "expo.out" }, 0)
        .to(sun, { scale: 1, rotate: 0, opacity: 1, duration: 1.8, ease: "back.out(1.5)" }, 0.35)
        .to(orbitRingRef.current, { scale: 1, rotate: 0, opacity: 1, duration: 1.8, ease: "power3.out" }, 0.6)
        .to(moon, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 1.1)
        .to(heroNameRef.current, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, 1.85)
        .to(heroRoleRef.current, { y: 0, opacity: 1, duration: 0.8 }, 2.15)
        .to(heroCtaRef.current, { y: 0, opacity: 1, duration: 0.8 }, 2.35);

      gsap.to(sun, {
        boxShadow: "0 0 130px 34px rgba(240,147,90,0.42)",
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.8,
      });

      gsap.to(orbitRingRef.current, { rotate: 360, duration: 90, repeat: -1, ease: "none" });
    }, stage);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", computeRadii);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(
        ".reveal, .section-head, .about-text, .stat-list, .skill-cards, .skill-groups, .project-pages, .contact h2, .contact-copy, .contact-email, .contact-links, .contact-bottom"
      );
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="top" ref={rootRef}>
      <canvas id="starCanvas" ref={canvasRef} className="stars-canvas" />

      <header>
        <nav className="wrap">
          <a className="brand" href="#top">Edward Aria T.</a>
          <div className="navlinks">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="curtain" ref={curtainRef} />

        <div className="eclipse-stage" ref={stageRef}>
          <div className="orbit-ring" ref={orbitRingRef} />
          <div className="orbit-ring orbit-ring-secondary" />
          <div className="sun-core" ref={sunRef}>
            <video
              ref={earthVideoARef}
              className="earth-video is-active"
              src={earthVideo}
              autoPlay
              muted
              playsInline
              aria-label="Animated Earth"
            />
            <video
              ref={earthVideoBRef}
              className="earth-video"
              src={earthVideo}
              muted
              playsInline
              aria-hidden="true"
            />
          </div>
          <div className="moon-disc" ref={moonRef}>
            <img className="moon-image" src={moonImage} alt="" aria-hidden="true" />
            <span className="moon-shade" aria-hidden="true" />
          </div>
        </div>

        <h1 className="name" ref={heroNameRef}>
          Edward Aria
          <span className="last">Tanujaya</span>
        </h1>
        <p className="role" ref={heroRoleRef}>
          A Passionate Software Developer
        </p>

        <div className="hero-cta" ref={heroCtaRef}>
          <a href="/Edward_Aria_T.pdf" className="btn primary" target="_blank">My CV<ExternalLink size={18}/></a>
        </div>

        <div className="social-links" aria-label="Social media links">
          <a href="https://github.com/maltzu-edward" className="social-link" aria-label="GitHub" title="GitHub" target="_blank">
            <FaGithub size={21} />
          </a>
          <a href="https://www.linkedin.com/in/edward-aria-tanujaya/" className="social-link" aria-label="LinkedIn" title="LinkedIn" target="_blank">
            <FaLinkedinIn size={21} />
          </a>
          <a href="mailto:edwardariatanujaya@gmail.com" className="social-link" aria-label="Mail" title="Gmail" target="_blank">
            <Mail size={21} />
          </a>
        </div>


      </section>

      <section id="about">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">A little about me</span>
              <h2>Building useful things<br />with a curious mind.</h2>
            </div>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I&apos;m Edward Aria Tanujaya, a computer science undergradute student from Bina Nusantara University. My main focus is software development, and I enjoy turning complex ideas into calm, intuitive experiences. I have built various projects using different technology stacks.
              </p>
            </div>
            <div className="skill-cards" aria-label="Technical skills">
              <article className="skill-card">
                <div>
                  <h3>Frontend</h3>
                  <div className="skill-card-stack">
                    <span className="tech-chip"><SiReact /> React</span>
                    <span className="tech-chip"><SiTypescript /> TypeScript</span>
                    <span className="tech-chip"><SiNextdotjs /> Next</span>
                  </div>
                </div>
              </article>
              <article className="skill-card">
                <div>
                  <h3>Backend</h3>
                  <div className="skill-card-stack">
                    <span className="tech-chip"><SiNodedotjs /> Node.js</span>
                    <span className="tech-chip"><SiNestjs /> Nest</span>
                    <span className="tech-chip"><SiExpress/> Express</span>
                  </div>
                </div>
              </article>
              <article className="skill-card">
                <div>
                  <h3>Database</h3>
                  <div className="skill-card-stack">
                    <span className="tech-chip"><SiPostgresql /> Postgres</span>
                    <span className="tech-chip"><SiMysql /> MySql</span>
                    <span className="tech-chip"><SiPrisma /> Prisma</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>Project in Orbit</h2>
            </div>
            <p>A small constellation of things I have built, shaped, and shipped.</p>
          </div>
          <ProjectPages />
        </div>
        <div className="project-transition" aria-hidden="true" />
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <span className="eyebrow">Have something in mind?</span>
          <h2>Let&apos;s make something worth remembering.</h2>
          <p className="contact-copy">Whether it&apos;s a product, an experiment, or a particularly stubborn idea, I&apos;d love to hear about it.</p>
          <a className="contact-email" href="mailto:edwardariatanujaya@gmail.com">
            edwardariatanujaya@gmail.com <Mail size={17} />
          </a>
          <div className="contact-links">
            <a href="https://github.com/maltzu-edward" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a>
            <a href="https://www.linkedin.com/in/edward-aria-tanujaya/" target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={14} /></a>
          </div>
          <div className="contact-bottom">
            <span>© 2026 Edward Aria Tanujaya</span>
            <span>Built with curiosity.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
