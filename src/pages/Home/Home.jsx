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
  Button,
} from "@mui/material";
import { GiReceiveMoney, Gi3dHammer, GiTable } from "react-icons/gi";
import { BsWrenchAdjustable } from "react-icons/bs";
import { Search } from "@mui/icons-material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import SEOHead from "../../components/SEO/SEOHead";
import StructuredData from "../../components/SEO/StructuredData";
import styles from "./Home.module.css";
import { useProducts } from "../../context/ProductsContext";
import { Link } from "react-router-dom";

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
            name: "БІЛЬЯРД СЕРВІС",
            description:
              "Продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна з 1996 року",
            url: "https://billiard-servis.com/",
            telephone: ["+380664070941", "+380675417308"],
            address: {
              "@type": "PostalAddress",
              streetAddress: "вул Антоновича 79",
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
            foundingDate: "1996",
          }}
        />

        {/* Додаткові structured data для покращення SEO */}
        <StructuredData
          id="organization"
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "БІЛЬЯРД СЕРВІС",
            url: "https://billiard-servis.com/",
            logo: "https://billiard-servis.com/logo.png",
            description:
              "Продаж, монтаж та обслуговування більярдних столів, аксесуарів та сукна в Дніпрі з 1996 року",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: ["+380664070941", "+380675417308"],
              contactType: "customer service",
              areaServed: "UA",
              availableLanguage: "Ukrainian",
            },
            sameAs: [
              "https://www.facebook.com/billiardservis",
              "https://www.instagram.com/billiardservis",
            ],
            foundingDate: "1996",
          }}
        />

        <StructuredData
          id="website"
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "БІЛЬЯРД СЕРВІС",
            url: "https://billiard-servis.com/",
            description:
              "Офіційний сайт БІЛЬЯРД СЕРВІС - продаж, монтаж та обслуговування більярдних столів з 1996 року",
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
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {services.map((service, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: { xs: "1 1 100%", md: "0 1 300px" },
                  display: "flex",
                  height: "100%",
                  maxWidth: { md: "300px" },
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

        {/* SEO Content Section */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: "#f8fafc" }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, mb: 3, color: "#115e59" }}
            >
              БІЛЬЯРД СЕРВІС - професійний сервіс з 1996 року
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Фірма «БІЛЬЯРД СЕРВІС» існує на більярдному ринку з 1996 року. За
              цей час ми вивчили основні вимоги до більярдних столів та
              аксесуарів з боку покупців і зосередили під цією маркою широкий
              асортимент товарів, що утвердився серед професіоналів та любителів
              більярдного спорту.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Сьогодні «БІЛЬЯРД СЕРВІС»™ пропонує на ваш вибір продукцію, що
              оптимально поєднує в собі дві головні характеристики: ціну і
              якість. Ми працюємо безпосередньо з виробниками, що гарантує
              найкращі ціни та якість.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              <strong>Наша адреса:</strong> Дніпро, вул Антоновича 79
              <br />
              <strong>Телефони:</strong> (066) 407-09-41 ; (067) 541-73-08
            </Typography>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/about"
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #134e4a 0%, #0f3d3a 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(17, 94, 89, 0.3)",
                  },
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(17, 94, 89, 0.2)",
                }}
              >
                Дізнатися більше про компанію →
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* SEO Information Section */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: "#f8fafc" }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: "#115e59",
                textAlign: "center",
              }}
            >
              Більярдні столи - традиції в поєднанні з якістю!
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Шанувальникам естетично-елегантної гри в більярд наш магазин
              пропонує заглянути в розділ більярдні столи, купити товар тут
              можна за дуже привабливою ціною! В останні роки спостерігається
              справжній бум на гру в більярд, навіть далекі від спортивного
              життя люди хочуть купити на дачі або в котеджі більярдний стіл,
              щоб балувати себе у вихідні дні прекрасним проведенням часу.
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Більярд, хоча і є олімпійським видом спорту, складно назвати
              спортом з великим фізичним навантаженням. Для багатьох більярд -
              це скоріше розслабляючий вид культурного відпочинку, схоже на
              захоплення мистецтвом. Число людей, які бажають купити більярдний
              стіл в Україні, зростає щодня.
            </Typography>

            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: 600, mb: 3, color: "#115e59" }}
            >
              Столи для більярду: як зробити правильний вибір?
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>Визначтеся з типом гри:</strong> карамболь, пул, російська
              піраміда або снукер. Для різних ігор передбачені різні моделі
              більярдних столів - з різними профілями бортиків, з вузькими,
              широкими лузами або зовсім без луз, з різним видом сукна для
              оббивки.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>Розміри стола:</strong> аматорські столи можуть бути
              зовсім невеликими, для пулу підійде стіл в 9 футів, а для
              російської піраміди потрібен стіл з габаритами не менше 10 футів.
              Крім того, потрібно орієнтуватися і на розмір приміщення.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>Цінова категорія:</strong> виробники випускають більярдні
              столи в різних цінових категоріях. Дорогий більярдний стіл
              виготовляється з елітних матеріалів таких як ардезія, цінна
              деревина з ручним різьбленням, краще за якістю сукно,
              індивідуальний дизайнерський стиль.
            </Typography>

            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: 600, mb: 3, color: "#115e59" }}
            >
              З яких матеріалів виготовляють столи для більярду?
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              <strong>Стандартний варіант:</strong> масив дерева. Кожна
              фірма-виробник використовує породи деревини на свій розсуд.
              Більшість українських фабрик використовують деревину дуба, берези,
              сосни, клена або ясена. Елітні компанії воліють виготовляти столи
              з червоного дерева або рідкісних порід деревини.
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              <strong>Бюджетний варіант:</strong> плити ЛДСП. Кращим варіантом
              тут вважаються плити сланцю ардезіта. Такі столи більше підходять
              для домашнього використання.
            </Typography>

            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: 600, mb: 3, color: "#115e59" }}
            >
              Умови експлуатації більярдних столів
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              • <strong>Температура:</strong> постійна температура повітря (+20
              +24°С) і помірна вологість (30-60%)
              <br />• <strong>Обігрівачі:</strong> не можна встановлювати
              поблизу більярдних столів
              <br />• <strong>Кондиціонери:</strong> не рекомендується включати
              в більярдній кімнаті
              <br />• <strong>Вирівнювання:</strong> рекомендується не рідше
              одного разу на рік
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Замовляйте більярдні столи в нашій компанії, ми підберемо для вас
              ідеальний варіант. Вам сподобається наше обслуговування, наші ціни
              і наш професіоналізм!
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default Home;
