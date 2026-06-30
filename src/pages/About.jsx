import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container section-padding">
        <div className="about-header text-center">
          <h1>Our Heritage</h1>
          <p className="about-subtitle">Crafted for childhood. Styled for generations.</p>
        </div>

        <div className="about-content grid grid-2">
          <div className="about-text">
            <p className="drop-cap">
              At Heirloom Kids Co., we believe a child's wardrobe should be as timeless as the memories they make. 
              Born from an appreciation for classic tailoring and enduring quality, our garments reflect a true heritage aesthetic.
            </p>
            <p>
              But we also know that children are meant to run, discover, and grow. That is why every piece we design 
              marries country-club elegance with playground durability.
            </p>
            <p>
              From our signature formal pieces to our everyday playwear, we create clothes meant to be worn, loved, 
              and eventually passed down.
            </p>
          </div>
          
          <div className="about-image-grid">
            <img src="/images/about.png" alt="Close-up of premium fabrics" className="about-img-main" />
            <img src="/images/everyday.png" alt="Children playing outdoors" className="about-img-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
