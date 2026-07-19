import React, { useEffect, useState } from "react";
import "./Home.css";
import founderImg from "./founder-image.jpeg";
import ClassGraph from "./ClassGraph";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 🔢 Counter states
  const [students, setStudents] = useState(0);
  const [events, setEvents] = useState(0);
  const [competitions, setCompetitions] = useState(0);

  // Slider state
  const images = [
    "/Result1.jpg",
    "/Result2.jpg",
    "/Result3.jpg",
    "/Result4.jpeg",
    "/Result5.jpg",
    "/Result6.jpeg",
    "/Result7.jpeg",
    "/Result8.jpeg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 🔥 Counter animation
  useEffect(() => {
    const animate = (setter, target, speed) => {
      let value = 0;
      const interval = setInterval(() => {
        value += 1;
        setter(value);
        if (value >= target) clearInterval(interval);
      }, speed);
    };

    animate(setStudents, 160, 15);
    animate(setEvents, 5, 50);
    animate(setCompetitions, 2, 80);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? "visible" : ""}`}>
            <h1 className="hero-title">
              Welcome to <span className="hero-highlight">Gyanexia</span>
            </h1>

            <p className="hero-description">
              Empowering minds through knowledge and innovation. Your journey to
              excellence starts here.
            </p>

            <div className="marquee-container">
              <div className="marquee-content">
                <span>🏆 Gyanexia Talent Hunt 2026 is Coming This December – Registrations Opening Soon!</span>
                <span>🏆 Gyanexia Talent Hunt 2026 is Coming This December – Registrations Opening Soon!</span>
                <span>🏆 Gyanexia Talent Hunt 2026 is Coming This December – Registrations Opening Soon!</span>
               <span>🏆 Gyanexia Talent Hunt 2026 is Coming This December – Registrations Opening Soon!</span>
               <span>🏆 Gyanexia Talent Hunt 2026 is Coming This December – Registrations Opening Soon!</span>
              </div>
            </div>
          </div>
        </div>
      </section>
     


{/* Featured Programs */}
<section className="courses-section">
  <div className="courses-header">
    <h2>Featured Programs</h2>
    <p>
      Explore Gyanexia's featured learning programs and summer camp
    </p>
  </div>

  <div className="courses-grid">

    {/* Basic Maths */}
    <div className="course-card">
      <img
        src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800"
        alt="Basic Mathematics"
        className="course-image"
      />

      <span className="course-tag">Maths</span>

      <div className="course-content">
        <h3>Basic Mathematics</h3>

        <p>
          Designed for Class 5th & 6th students. Learn arithmetic,
          fractions, decimals, percentages and problem-solving skills
          through interactive lessons.
        </p>

        <div className="course-info">
          <span>👨‍🎓 Class 5-6</span>
          <span>📚 Foundation</span>
        </div>

        <div className="course-footer">
          <span className="course-price">Basic Mathematics</span>
        </div>

        <button className="course-btn disabled-btn" disabled>
  Coming Soon
</button>
      </div>
    </div>

    {/* Advanced Maths */}
<div className="course-card">
  <img
    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"
    alt="Advanced Mathematics"
    className="course-image"
  />

  <span className="course-tag">Maths</span>

  <div className="course-content">
    <h3>Advanced Mathematics</h3>

    <p>
      For Class 8th to 10th students. Strengthen algebra,
      geometry, reasoning and Olympiad-level thinking with
      advanced concepts and problem solving.
    </p>

    <div className="course-info">
      <span>👨‍🎓 Class 8-10</span>
      <span>📚 Advanced</span>
    </div>

    <div className="course-footer">
      <span className="course-price">Advanced Mathematics</span>
    </div>

   <button className="course-btn disabled-btn" disabled>
  Coming Soon
</button>
  </div>
</div>

    {/* Gyanexia Summer Camp */}
<div className="course-card">
  <img
    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
    alt="Gyanexia Summer Camp"
    className="course-image"
  />

  <span className="course-tag">Summer Camp</span>

  <div className="course-content">
    <h3>GYANEXIA SUMMER CAMP'26</h3>

    <p>
      FREE Online Summer Camp for students of Class 5th to 10th.
      Learn Basic Maths, AI Basics, Communication Skills,
      Creativity, Life Skills and Teamwork with expert teachers.
    </p>

    <div className="course-info">
      <span>📅 25 May - 15 June</span>
      <span>👨‍🎓 Class 5-10</span>
    </div>

    <div className="course-footer">
      <span className="course-closed">Registration Closed</span>
    </div>

  <button className="course-btn disabled-btn" disabled>
  Registration Closed
</button>
  </div>
</div>
  </div>
</section>

      {/* Slider Section */}
      <section className="slider-section">
        <div className="slider-container">
          <button className="slider-btn prev" onClick={handlePrev}>
            &#10094;
          </button>

          <div className="slider-image-container">
            <img
              src={images[currentIndex]}
              alt="Slide"
              className="slider-image"
            />
          </div>

          <button className="slider-btn next" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      </section>
      {/* 🔥 GRAPH SECTION */}
      <section>
        <ClassGraph />
      </section>


      

      {/* Founder Section */}
      <section className="founder-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Meet Our Founder</h2>
            <p className="section-description">
              "At Gyanexia, our mission is to transform quality education and
              knowledge sharing into an accessible and impactful experience for
              all."
            </p>
          </div>

          <div className="founder-card-container">
            <div className="founder-card">
              <div className="founder-card-content">

                <div className="founder-image-container">
                  <div
                    className="founder-image"
                    style={{ backgroundImage: `url(${founderImg})` }}
                  ></div>
                </div>
                

                <div className="founder-details">
                  <div className="founder-info">
                    <h3 className="founder-name">Nikhil Prajapati</h3>
                    <p className="founder-title">Founder</p>
                    <p className="founder-bio">
                      Hi, I am Nikhil Prajapati, a student at IIT Kanpur and the
                      founder of Gyanexia.
                    </p>
                    <blockquote className="founder-quote">
                      “Talent is everywhere, but opportunity is not. We’re here to
                      ensure every student gets a fair chance.”
                    </blockquote>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-box">
            <h2 className="stat-number">{students}+</h2>
            <p className="stat-label">Students Participated 🧑‍🎓</p>
          </div>

          <div className="stat-box">
            <h2 className="stat-number">{events}+</h2>
            <p className="stat-label">Events Conducted 📅</p>
          </div>

          <div className="stat-box">
            <h2 className="stat-number">{competitions}+</h2>
            <p className="stat-label">Competitions Conducted 🏆</p>
          </div>
        </div>
      </section>

      

    </div>
  );
};

export default Home;