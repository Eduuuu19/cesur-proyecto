import React from 'react';
import {
  FiFileText, FiUsers, FiBarChart2,
  FiCheck, FiSend, FiMail, FiInstagram, FiTwitter, FiLinkedin, FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import styles from './LandingPage.module.css';

export default function LandingPage() {

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.landingContainer}>
      {/* BARRA DE NAVEGACION */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo de Konta" className={styles.logoImg} />
          Konta
        </div>
        <div className={styles.navLinks}>
          <button onClick={() => scrollToSection('inicio')}>Inicio</button>
          <button onClick={() => scrollToSection('funcionalidades')}>Funcionalidades</button>
          <button onClick={() => scrollToSection('planes')}>Planes</button>
          <button onClick={() => scrollToSection('contacto')}>Contacto</button>
        </div>
        <div className={styles.navAuth}>
          <Link to="/login" className={styles.btnLink}>Iniciar Sesión</Link>
          <Link to="/register" className={styles.btnPrimary}>Empezar Gratis</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="inicio" className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          La contabilidad de tu negocio, <span className={styles.accent}>simplificada</span>.
        </h1>
        <p className={styles.heroSubtitle}>
          Gestiona facturas, clientes y presupuestos en un solo lugar.
          Diseñado para autónomos y PYMES que valoran su tiempo.
        </p>

        <div className={styles.heroActions}>
          <Link to="/register" className={styles.btnHeroPrimary}>Probar 14 días gratis</Link>
          <button onClick={() => scrollToSection('funcionalidades')} className={styles.btnHeroSecondary}>Ver funciones</button>
        </div>

        {/* MOCKUP PORTÁTIL */}
        <div className={styles.laptopContainer}>
          <div className={styles.laptopFrame}>
            <div className={styles.laptopScreen}>
              <img
                src="/dashboard-preview.png"
                alt="Dashboard de Konta"
                className={styles.dashboardImg}
              />
            </div>
          </div>
          <div className={styles.laptopBase}></div>
        </div>
      </header>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Todo lo que necesitas</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <FiFileText size={40} className={styles.featureIcon} />
            <h3>Ingresos y gastos</h3>
            <p>Registra rápidamente todas tus facturas emitidas y recibidas en una plataforma unificada.</p>
          </div>
          <div className={styles.featureCard}>
            <FiUsers size={40} className={styles.featureIcon} />
            <h3>Clientes y Proveedores</h3>
            <p>Centraliza la información de todos tus contactos en un solo lugar.</p>
          </div>
          <div className={styles.featureCard}>
            <FiBarChart2 size={40} className={styles.featureIcon} />
            <h3>Gráficos financieros</h3>
            <p>Analiza visualmente tus ingresos y gastos para tomar mejores decisiones.</p>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className={styles.pricingSection}>
        <h2 className={styles.sectionTitle}>Planes para cada etapa</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <h3>Básico</h3>
            <div className={styles.price}>0€<span>/mes</span></div>
            <ul>
              <li><FiCheck /> 5 facturas/mes</li>
              <li><FiCheck /> 10 clientes</li>
              <li><FiCheck /> Soporte por email</li>
            </ul>
            <Link to="/register" className={styles.btnPrice}>Elegir Básico</Link>
          </div>
          <div className={`${styles.priceCard} ${styles.featured}`}>
            <div className={styles.badge}>Recomendado</div>
            <h3>Pro</h3>
            <div className={styles.price}>19€<span>/mes</span></div>
            <ul>
              <li><FiCheck /> Facturas ilimitadas</li>
              <li><FiCheck /> Clientes ilimitados</li>
              <li><FiCheck /> Gráficos avanzados</li>
              <li><FiCheck /> Soporte prioritario</li>
            </ul>
            <Link to="/register" className={styles.btnPriceFeatured}>Elegir Pro</Link>
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACTO */}
      <footer id="contacto" className={styles.footer}>
        <div className={styles.footerGrid}>
          {/* Columna 1: Marca */}
          <div className={styles.footerBrand}>
            <div className={styles.logoWhite}>
              Konta
            </div>
            <p>Facturación simplificada para autónomos y pymes.</p>
            <div className={styles.socials}>
              <FiInstagram /> <FiTwitter /> <FiLinkedin />
            </div>
          </div>

          {/* Columna 2: Producto */}
          <div className={styles.footerLinksGroup}>
            <h4>Producto</h4>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#planes">Planes y Precios</a>
            <a href="#seguridad">Seguridad</a>
            <a href="#integraciones">Integraciones</a>
          </div>

          {/* Columna 3: Compañía */}
          <div className={styles.footerLinksGroup}>
            <h4>Compañía</h4>
            <a href="#sobre-nosotros">Sobre nosotros</a>
            <a href="#empleo">Empleo</a>
            <a href="#prensa">Prensa</a>
            <a href="#contacto">Contacto</a>
          </div>

          {/* Columna 4: Recurso */}
          <div className={styles.footerLinksGroup}>
            <h4>Recurso</h4>
            <a href="#blog">Blog</a>
            <a href="#ayuda">Centro de Ayuda</a>
            <a href="#guias">Guías</a>
            <a href="#api">API para desarrolladores</a>
          </div>

          {/* Columna 5: Newsletter */}
          <div className={styles.footerNewsletter}>
            <h4>Suscríbete a novedades</h4>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="ejemplo@correo.com" />
              <button type="button"><FiArrowRight size={20} /></button>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>© 2026 Konta. Todos los derechos reservados.</div>
          <div className={styles.legalLinks}>
            <a href="#privacidad">Políticas de Privacidad</a>
            <a href="#terminos">Términos de Servicio</a>
            <a href="#cookies">Ajustes de Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}