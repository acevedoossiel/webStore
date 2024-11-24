import React from 'react';
import Slider from 'react-slick';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src="/assets/images/banners/carrusel1.jpg" alt="Carrusel 1" className="carousel-image" />
        </div>
        <div>
          <img src="/assets/images/banners/carrusel2.jpg" alt="Carrusel 2" className="carousel-image" />
        </div>
      </Slider>
    </div>
  );
};

export default Home;
