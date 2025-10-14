import "../styles/Mentors.css";
import Shuffle from "./Shuffle";
import mz from "../assets/mentors/Mz.jpeg";
import im from "../assets/mentors/Im.jpg";
import ar from "../assets/mentors/AR.jpg";
import jn from "../assets/mentors/Jynth.png";
import mg from "../assets/mentors/MG.JPG";
import ss from "../assets/mentors/SS.jpg";
import am from "../assets/mentors/AM.jpg";
import shr from "../assets/mentors/Shr.jpg";
import sn from "../assets/mentors/Sn.jpg";
import sr from "../assets/mentors/Sr.jpg";

function Mentors() {
  const handleMouseMove = (e, id) => {
    const card = document.getElementById(`mentor-${id}`);
    const img = card.querySelector(".mentor-photo");
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * -15;
    const baseRotate = card.dataset.rotate || 0;

    card.style.transform = `rotate(${baseRotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    img.style.transform = `translateZ(30px) scale(1.1)`;
  };

  const handleMouseLeave = (id) => {
    const card = document.getElementById(`mentor-${id}`);
    const img = card.querySelector(".mentor-photo");
    const baseRotate = card.dataset.rotate || 0;

    card.style.transform = `rotate(${baseRotate}deg) rotateX(0deg) rotateY(0deg) scale(1)`;
    img.style.transform = "translateZ(0px) scale(1)";
  };

  const mentors = [
    {
      id: 1,
      name: "Muzaffar",
      img: mz,
      github: "https://github.com/muzaffarmhd",
      linkedin: "https://www.linkedin.com/in/muzaffarmhd/",
    },
    {
      id: 2,
      name: "Imad",
      img: im,
      github: "https://github.com/mdimado",
      linkedin: "https://www.linkedin.com/in/mdimado",
    },
    {
      id: 3,
      name: "Akshitha",
      img: ar,
      github: "https://github.com/Domaakshithareddy",
      linkedin: "https://www.linkedin.com/in/akshithareddydoma/",
    },
    {
      id: 4,
      name: "Jayanth",
      img: jn,
      github: "https://github.com/gjaynir0508",
      linkedin: "https://www.linkedin.com/in/jayanth-gudimella/",
    },
    {
      id: 5,
      name: "Meghana",
      img: mg,
      github: "https://github.com/meghana-0211",
      linkedin: "https://www.linkedin.com/in/meghana-sancheti-7086a2258/",
    },
    {
      id: 6,
      name: "Sriya",
      img: ss,
      github: "https://github.com/SrihariSriyaPalaparthi",
      linkedin: "https://www.linkedin.com/in/psriya/",
    },
    {
      id: 7,
      name: "Amulya",
      img: am,
      github: "https://github.com/amulyamotta81",
      linkedin: "https://www.linkedin.com/in/amulya-motta-237074286/",
    },
    {
      id: 8,
      name: "Sharanya",
      img: shr,
      github: "https://github.com/sharperi24",
      linkedin: "https://www.linkedin.com/in/sharanya-peri-21187a293/",
    },
    {
      id: 9,
      name: "Sneha",
      img: sn,
      github: "https://github.com/sneha9730",
      linkedin: "https://www.linkedin.com/in/snehaarumugam/",
    },
    {
      id: 10,
      name: "Srilekha",
      img: sr,
      github: "https://github.com/Srilekha-03",
      linkedin: "https://www.linkedin.com/in/srilekha-kasha-868aa7281/",
    },
  ];

  return (
    <section id="Mentors" className="mentors-section">
      <div className="mentors-container">
      <h2 className="heading">
      
      <Shuffle
        text="Mentors"
        shuffleDirection="right"
        duration={0.45}
        animationMode="evenodd"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.01}
        threshold={0.1}
        triggerOnce={true}
        triggerOnHover={true}
        respectReducedMotion={true}
        
        
         
      />
      
    </h2>
        <div className="mentors-grid">
          {mentors.map((m, index) => {
            const baseRotate = index % 2 === 0 ? -3 : 3;
            return (
              <div
                className="mentor-card"
                id={`mentor-${m.id}`}
                key={m.id}
                data-rotate={baseRotate}
                style={{ transform: `rotate(${baseRotate}deg)` }}
                onMouseMove={(e) => handleMouseMove(e, m.id)}
                onMouseLeave={() => handleMouseLeave(m.id)}
              >
                <img
                  className="mentor-photo"
                  src={m.img}
                  alt={`Mentor ${m.name}`}
                />

                {/* Overlay with name + links */}
                <div className="mentor-overlay">
                  <div className="mentor-links">
                    <h3 className="mentor-name">{m.name}</h3>
                    <a
                      href={m.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="icon-btn"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="22"
                        height="22"
                        aria-hidden="true"
                      >
                        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.11-.76.08-.75.08-.75 1.22.09 1.86 1.25 1.86 1.25 1.09 1.86 2.85 1.32 3.55 1.01.11-.79.43-1.32.78-1.63-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.67 1.65.25 2.87.13 3.17.77.84 1.23 1.92 1.23 3.23 0 4.61-2.8 5.62-5.48 5.92.44.38.83 1.11.83 2.24v3.32c0 .32.22.69.83.58A12 12 0 0 0 12 .5z" />
                      </svg>
                    </a>
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="icon-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 
                        2.24 5 5 5h14c2.76 0 5-2.24 
                        5-5v-14c0-2.76-2.24-5-5-5zm-11 
                        19h-3v-10h3v10zm-1.5-11.3c-.96 
                        0-1.7-.78-1.7-1.7s.74-1.7 
                        1.7-1.7c.96 0 1.7.78 
                        1.7 1.7s-.74 1.7-1.7 
                        1.7zm13.5 11.3h-3v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 
                        0-2.14 1.45-2.14 2.96v5.7h-3v-10h2.88v1.37h.04c.4-.76 
                        1.38-1.56 2.84-1.56 3.04 0 3.6 
                        2 3.6 4.6v5.6z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Mentors;