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
  Tabs,
  Tab,
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

// SEO контент для різних категорій
const categoryContent = {
  tables: {
    title: "Більярдні столи - традиції в поєднанні з якістю!",
    content: [
      {
        type: "paragraph",
        text: "Шанувальникам естетично-елегантної гри в більярд наш магазин пропонує заглянути в розділ більярдні столи, купити товар тут можна за дуже привабливою ціною! В останні роки спостерігається справжній бум на гру в більярд, навіть далекі від спортивного життя люди хочуть купити на дачі або в котеджі більярдний стіл, щоб балувати себе у вихідні дні прекрасним проведенням часу.",
      },
      {
        type: "paragraph",
        text: "Більярд, хоча і є олімпійським видом спорту, складно назвати спортом з великим фізичним навантаженням. Для багатьох більярд - це скоріше розслабляючий вид культурного відпочинку, схоже на захоплення мистецтвом.",
      },
      {
        type: "heading",
        text: "Столи для більярду: як зробити правильний вибір?",
      },
      {
        type: "list",
        items: [
          "Визначтеся з типом гри: карамболь, пул, російська піраміда або снукер",
          "Розміри стола: аматорські столи можуть бути зовсім невеликими, для пулу підійде стіл в 9 футів",
          "Цінова категорія: виробники випускають більярдні столи в різних цінових категоріях",
        ],
      },
    ],
  },
  cues: {
    title: "Більярдні киї - головні атрибути гри в більярд!",
    content: [
      {
        type: "paragraph",
        text: "Головним інструментом для гри в більярд є більярдні киї, купити які в різних модельних варіантах ми пропонуємо за доступною ціною в нашому магазині. Більярдні киї називають «найголовнішим атрибутом» в більярді, адже для досягнення успіхів в грі потрібно вміти не просто користуватися цим інструментом, а володіти ним віртуозно, як музикант володіє смичком, відтворюючи чудові звуки музики.",
      },
      {
        type: "paragraph",
        text: "У нашому магазині купити більярдний кий можна за ціною, яка вас влаштує - від недорогих стандартних моделей до ексклюзивних інструментів. Якщо ви сумніваєтеся, який більярдний кий купити, задавайте питання менеджерам магазину.",
      },
      {
        type: "heading",
        text: "Що слід знати, вибираючи і купуючи більярдний кий?",
      },
      {
        type: "list",
        items: [
          "Зверніть увагу на матеріал виготовлення - для професіоналів це життєво важливо",
          "Слід звернути увагу на балансування інструменту за вагою і довжині",
          "Важливі діаметри наклейок на киї і їх ступінь м'якості",
          "Для новачків рекомендується купувати киї з наклейками з м'якої шкіри",
        ],
      },
      {
        type: "heading",
        text: "Більярдні киї: які породи деревини використовують?",
      },
      {
        type: "paragraph",
        text: "Найякісніші інструменти виготовляють з цінних порід деревини: амарант, падук, венге, палісандр, кокоболо, ебен, чорний граб, лимонник, сапеллі. Майстри гри в більярд замовляють собі інструменти за індивідуальними проектами.",
      },
    ],
  },
  accessories: {
    title: "Більярдні кулі: якісні аксесуари для якісної гри!",
    content: [
      {
        type: "paragraph",
        text: "Здавалося б, що може бути складного в тому, щоб купити більярдні кулі. Але, професійні гравці в більярд прекрасно знають, яка це відповідальна справа. Від якості виготовлення залежить результативність гри, тому важливо купити кулі для більярду, які відповідають стандартам ваги, діаметра і навіть кольору.",
      },
      {
        type: "paragraph",
        text: "Наприклад, для гри в пул виробляють більярдні кулі вагою 210 грам, а для російського більярду необхідні вагою в 265 грам. Відомі виробники більярдних куль дають гарантії на свій товар на 400 тисяч ударів.",
      },
      {
        type: "heading",
        text: "Більярдні кулі: основні критерії вибору",
      },
      {
        type: "list",
        items: [
          "Визначтеся з вибором матеріалу - від цього залежить ціна",
          "Слід враховувати вид гри - під різні ігри змінюється діаметр і вага",
          "Завжди можна купити більярдні кулі поштучно",
          "Обов'язково придбайте спеціальні очищаючі рідини",
          "Для додання ідеальної гладкості рекомендується поліроль",
        ],
      },
      {
        type: "heading",
        text: "Як вибирати більярдні кулі?",
      },
      {
        type: "paragraph",
        text: "Перш за все, потрібно точно знати якою вагою, діаметром і щільністю повинна володіти потрібна вам більярдна куля. Далі кулі перевіряються на шліфування поверхні, щоб не купити товар з подряпинами або тріщинами на поверхні.",
      },
    ],
  },
  cloth: {
    title: "Більярдне сукно для ідеальної ігрової поверхні",
    content: [
      {
        type: "paragraph",
        text: "В нашому магазині можна купити більярдне сукно різного кольору і різної товщини, весь товар відрізняється високою якістю, має стандартизовані гарантійні терміни по зносостійкості.",
      },
      {
        type: "paragraph",
        text: "Як ставляться до сукна для більярдного столу професіонали можна побачити, подивившись міжнародні турніри з більярду, де перед кожною грою сукно перевіряють експерти. На подібних заходах допустимо використання сукна тільки найвищої якості.",
      },
      {
        type: "heading",
        text: "Яким має бути сукно для більярдного столу?",
      },
      {
        type: "paragraph",
        text: "Сукно для більярдного столу купити легко, пропозицій дуже багато. Але купуючи цю продукцію, слід поцікавитися, які гарантії дають виробники і як часто його потрібно міняти.",
      },
      {
        type: "paragraph",
        text: "Для виробництва більярдного сукна використовується міцний і щільний матеріал, що складається з натуральної вовни з додаванням нейлону. Шерсть має потрібну щільність і міцність ниток переплетення, а нейлон забезпечує матеріалу еластичність.",
      },
      {
        type: "heading",
        text: "Сукно більярдне: на що звертати увагу при покупці?",
      },
      {
        type: "list",
        items: [
          "Якість матеріалу - сукно повинно бути дуже щільним",
          "Переважний склад - від 50% до 80% вовни, решта припадає на нейлон",
          "У залежності від розмірів більярдного столу обираються параметри для оббивки",
          "Традиційно виробники випускають два варіанти: з шириною 165 см і 195 см",
        ],
      },
    ],
  },
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tables");
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

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const renderCategoryContent = () => {
    const content = categoryContent[selectedCategory];
    if (!content) return null;

    return (
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
            {content.title}
          </Typography>

          {content.content.map((item, index) => {
            if (item.type === "paragraph") {
              return (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{ mb: 4, lineHeight: 1.8 }}
                >
                  {item.text}
                </Typography>
              );
            }
            if (item.type === "heading") {
              return (
                <Typography
                  key={index}
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 600, mb: 3, color: "#115e59" }}
                >
                  {item.text}
                </Typography>
              );
            }
            if (item.type === "list") {
              return (
                <Box key={index} sx={{ mb: 4 }}>
                  {item.items.map((listItem, listIndex) => (
                    <Typography
                      key={listIndex}
                      variant="body1"
                      sx={{ mb: 2, lineHeight: 1.8, pl: 2 }}
                    >
                      • {listItem}
                    </Typography>
                  ))}
                </Box>
              );
            }
            return null;
          })}

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Замовляйте товари в нашій компанії, ми підберемо для вас ідеальний
            варіант. Вам сподобається наше обслуговування, наші ціни і наш
            професіоналізм!
          </Typography>
        </Paper>
      </Container>
    );
  };
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

        {/* Category Tabs Section */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: "#f8fafc" }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "#115e59",
                textAlign: "center",
              }}
            >
              Дізнайтеся більше про наші товари
            </Typography>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              centered
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  color: "#115e59",
                  "&.Mui-selected": {
                    color: "#10b981",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#10b981",
                  height: 3,
                },
              }}
            >
              <Tab label="Більярдні столи" value="tables" />
              <Tab label="Більярдні киї" value="cues" />
              <Tab label="Аксесуари" value="accessories" />
              <Tab label="Сукно" value="cloth" />
            </Tabs>
          </Paper>
        </Container>

        {/* SEO Information Section */}
        {renderCategoryContent()}
      </Box>
    </Fade>
  );
};

export default Home;
