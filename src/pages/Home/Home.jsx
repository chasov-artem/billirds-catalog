import React, { useState } from "react";
import {
  Box,
  Container,
  Fade,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { GiReceiveMoney, Gi3dHammer, GiTable } from "react-icons/gi";
import { BsWrenchAdjustable } from "react-icons/bs";
import { Search } from "@mui/icons-material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import SEOHead from "../../components/SEO/SEOHead";
import StructuredData from "../../components/SEO/StructuredData";
import styles from "./Home.module.css";
import { useProducts } from "../../context/ProductsContext";

const services = [
  {
    title: "Скупка більярдних столів",
    icon: <GiReceiveMoney size={48} color="#10b981" />,
    description:
      "Швидко та вигідно викупимо ваш старий більярдний стіл. Оцінка та вивіз у зручний для вас час.",
  },
  {
    title: "Збірка більярдних столів",
    icon: <Gi3dHammer size={48} color="#10b981" />,
    description:
      "Професійна збірка столів будь-якої складності. Гарантія якості та точності монтажу.",
  },
  {
    title: "Перетяжка більярдних столів",
    icon: <GiTable size={48} color="#10b981" />,
    description:
      "Якісна заміна сукна та ремонт ігрової поверхні. Оновимо ваш стіл до ідеального стану!",
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products } = useProducts();
  const filteredProducts = products
    .filter((product) => {
      const name = product.Назва || product.name || "";
      const description = product.Опис || product.description || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const categoryA = a.Категорія || "";
      const categoryB = b.Категорія || "";
      const nameA = a.Назва || a.name || "";
      const nameB = b.Назва || b.name || "";

      // Більярдні столи першими
      if (categoryA === "Більярдні столи" && categoryB !== "Більярдні столи") {
        return -1;
      }
      if (categoryA !== "Більярдні столи" && categoryB === "Більярдні столи") {
        return 1;
      }

      // Якщо категорії однакові, сортуємо за назвою
      return nameA.localeCompare(nameB);
    });
  return (
    <Fade in={true} timeout={800}>
      <Box className={styles.home}>
        <SEOHead
          title="Більярд сервіс — Якісні більярдні столи, аксесуари, монтаж | Дніпро"
          description="Більярд сервіс у Дніпрі — продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна. Доставка по Україні. Професійний сервіс з 10+ роками досвіду."
          keywords="більярд, більярдні столи, аксесуари, сукно, Дніпро, сервіс, монтаж, купити більярдний стіл, збірка більярдних столів, перетяжка сукна"
          ogTitle="Більярд сервіс — Якісні більярдні столи, аксесуари, монтаж"
          ogDescription="Продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна. Доставка по Україні."
          canonical="https://billiard-servis.com/"
        />
        <StructuredData
          id="business"
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Більярд сервіс",
            description:
              "Продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна",
            url: "https://billiard-servis.com/",
            telephone: "+380XXXXXXXXX",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Дніпро",
              addressCountry: "UA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "48.4647",
              longitude: "35.0462",
            },
            openingHours: "Mo-Fr 09:00-18:00",
            priceRange: "$$",
            serviceType: [
              "Більярдні столи",
              "Аксесуари",
              "Монтаж",
              "Обслуговування",
            ],
            areaServed: "Україна",
          }}
        />

        {/* Додаткові structured data для покращення SEO */}
        <StructuredData
          id="organization"
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Більярд сервіс",
            url: "https://billiard-servis.com/",
            logo: "https://billiard-servis.com/logo.png",
            description:
              "Продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна в Дніпрі",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+380XXXXXXXXX",
              contactType: "customer service",
              areaServed: "UA",
              availableLanguage: "Ukrainian",
            },
            sameAs: [
              "https://www.facebook.com/billiardservis",
              "https://www.instagram.com/billiardservis",
            ],
          }}
        />

        <StructuredData
          id="website"
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Більярд сервіс",
            url: "https://billiard-servis.com/",
            description:
              "Офіційний сайт Більярд сервіс - продаж, монтаж та обслуговування більярдних столів",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://billiard-servis.com/catalog?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {/* Hero Section */}
        <Box className={styles.heroSection}>
          <Container maxWidth="lg">
            <Box className={styles.heroContent}>
              {/* <h1>Більярд Сервіс</h1>
              <p>Якісні більярдні столи для вашого дому та бізнесу</p> */}
            </Box>
          </Container>
        </Box>

        {/* Services Section */}
        <Container maxWidth="lg" className={styles.servicesSection}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, mb: 4, color: "#115e59" }}
          >
            Наші послуги
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, sm: 1, md: 2 },
            }}
          >
            {services.map((service, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 33.333%" },
                  display: "flex",
                  height: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  className={styles.serviceCard}
                  sx={{ width: "100%" }}
                >
                  <Box className={styles.serviceIcon}>{service.icon}</Box>
                  <Typography variant="h6" className={styles.serviceTitle}>
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={styles.serviceDescription}
                  >
                    {service.description}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Container>

        {/* Search Section */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className={styles.searchField}
            sx={{ my: 4 }}
          />
        </Container>

        {/* Catalog Section */}
        <CatalogSection products={searchTerm ? filteredProducts : undefined} />
      </Box>
    </Fade>
  );
};

export default Home;
