import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configuración del primer carrusel
  const settings1 = {
    dots: true,
    infinite: true,
    autoplay: true, 
    speed:1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Configuración del segundo carrusel (con varias imágenes visibles)
const settings2 = {
  dots: false,
  infinite: true,
  autoplay: true, 
  speed: 1500,
  autoplaySpeed: 2000,
  slidesToShow: 2.93, // Mostrar 3 imágenes al mismo tiempo
  slidesToScroll: 1,
  centerMode: true, // Permite que las imágenes de los lados sean visibles
  centerPadding: "10%", // Espaciado en los lados para la vista previa
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2.93,
        centerPadding: "1%",
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2.225,
        centerPadding: "0px",
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.625,
        centerPadding: "0px", // En móvil, solo se muestra una imagen
      }
    }
  ]
};


  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/latest`);
        if (!response.ok) {
          throw new Error('Error al obtener productos');
        }
        const data = await response.json();
        setLatestProducts(data);
      } catch (err) {
        setError('Error al obtener los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Primer carrusel */}
      <div className={styles['carousel-container']}>
        <Slider {...settings1}>
          <div>
            <img
              src="/assets/images/banners/Banner1.jpg"
              alt="Carrusel 1"
              className={styles['carousel-image']}
            />
          </div>
          <div>
            <img
              src="/assets/images/banners/Banner2.jpg"
              alt="Carrusel 2"
              className={styles['carousel-image']}
            />
          </div>
        </Slider>
        <br /><br />
      </div>

      {/* Segundo carrusel */}
    <div className={styles['second-carousel-container']}>
      <Slider {...settings2} className={styles['second-carousel-slider']}>
        <div>
          <img
            src="/assets/images/carruselProducts/carrusel1.png"
            alt="Carrusel 1"
            className={styles['carousel-image2']}
          />
        </div>
        <div>
          <img
            src="/assets/images/carruselProducts/carrusel2.png"
            alt="Carrusel 2"
            className={styles['carousel-image2']}
          />
        </div>
        <div>
          <img
            src="/assets/images/carruselProducts/carrusel3.png"
            alt="Carrusel 3"
            className={styles['carousel-image2']}
          />
        </div>
      </Slider>
    </div>


      {/* Sección 'Lo nuevo' */}
      <div className={styles['contenido']}>
        <p>Lo nuevo</p>
        <a href="/category">Ver todos los productos</a>
        <div className={styles['latest-products-container']}>
          {latestProducts.map((product, index) => (
            <Link to={`/product/${product._id}`} className={styles['product-card']} key={index}>
              <img
                src={`${process.env.REACT_APP_API_URL}${product.srcImage[0]}`}
                alt={product.modelo}
                className={styles['product-image']}
              />
              <h3>{product.brand} {product.modelo} {product.capacity}</h3>
              <p>MX ${product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
