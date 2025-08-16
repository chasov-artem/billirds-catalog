import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Fade,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import SEOHead from "../../components/SEO/SEOHead";
import StructuredData from "../../components/SEO/StructuredData";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <Fade in={true} timeout={800}>
      <div className={styles.aboutPage}>
        <SEOHead
          title="Про компанію БІЛЬЯРД СЕРВІС | Історія та досягнення з 1996 року"
          description="Дізнайтеся про історію компанії БІЛЬЯРД СЕРВІС з 1996 року. Професійний сервіс з продажу, монтажу та обслуговування більярдних столів у Дніпрі."
          keywords="про компанію, історія, БІЛЬЯРД СЕРВІС, більярдний сервіс Дніпро, з 1996 року, Tweeten Fibre Co"
          ogTitle="Про компанію БІЛЬЯРД СЕРВІС | Історія з 1996 року"
          ogDescription="Історія компанії БІЛЬЯРД СЕРВІС з 1996 року. Професійний сервіс більярдних столів у Дніпрі."
          canonical="https://billiard-servis.com/about"
        />
        
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "БІЛЬЯРД СЕРВІС",
            description: "Компанія з продажу, монтажу та обслуговування більярдних столів з 1996 року",
            url: "https://billiard-servis.com/about",
            foundingDate: "1996",
            address: {
              "@type": "PostalAddress",
              streetAddress: "вул Антоновича 79",
              addressLocality: "Дніпро",
              addressCountry: "UA",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: ["+380664070941", "+380675417308"],
              contactType: "customer service",
            },
          }}
        />

        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs />
          
          {/* Back button */}
          <Box sx={{ mb: 3 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#115e59', cursor: 'pointer' }}>
                <ArrowBack sx={{ mr: 1 }} />
                <Typography variant="body1">Назад до головної</Typography>
              </Box>
            </Link>
          </Box>

          {/* Main content */}
          <Paper elevation={2} sx={{ p: 6, backgroundColor: "#f8fafc" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 4, color: "#115e59", textAlign: 'center' }}
            >
              Про компанію БІЛЬЯРД СЕРВІС
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Наша історія
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Фірма «БІЛЬЯРД СЕРВІС» існує на більярдному ринку з 1996 року. За цей час ми вивчили основні вимоги до більярдних столів та аксесуарів з боку покупців і зосередили під цією маркою широкий асортимент товарів, що утвердився серед професіоналів та любителів більярдного спорту.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Наші переваги
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Сьогодні «БІЛЬЯРД СЕРВІС»™ пропонує на ваш вибір продукцію, що оптимально поєднує в собі дві головні характеристики: ціну і якість. Однією з багатьох наших переваг є той факт, що ми працюємо безпосередньо з виробниками, а це означає, що будь-яке ваше замовлення буде виконано в найкоротші терміни, що будь-яка ваша примха буде задоволена за абсолютно прийнятною ціною.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Наш асортимент
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Більярдні столи професійні та споживчі, будь-якого класу та дизайну, аксесуари на будь-який смак для найвибагливіших та найпретензійніших, а також будь-які більярдні фантазії мислимі та немислимі надасть вам фірма «БІЛЬЯРД СЕРВІС»™ в Дніпрі та по всій Україні.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Співпраця з федераціями
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Досить великий вплив на асортимент пропонованої продукції справила співпраця з Федераціями більярдного спорту різних регіонів України. Задоволення потреб метрів більярду - це, і ви звичайно ж погодитеся з цим, що не вимагає інших роз'яснень.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Офіційний представник
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              У 2008р. ми набули статусу офіційного представника в Україні компанії Tweeten Fibre Co. INC.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#115e59" }}>
              Контактна інформація
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                  Адреса:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Дніпро, вул Антоновича 79
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                  Телефони:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  (066) 407-09-41
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  (067) 541-73-08
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, fontStyle: "italic", textAlign: 'center', color: '#666' }}
            >
              Перш ніж відвідати наші магазини, радимо закінчити інші справи, оскільки світ нашого більярду величезний, і, потрапивши до нього, ви вже не зможете так легко залишити його.
            </Typography>
          </Paper>
        </Container>
      </div>
    </Fade>
  );
};

export default AboutPage;
