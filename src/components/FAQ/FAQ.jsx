import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import StructuredData from '../SEO/StructuredData';

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqData = [
    {
      question: "Які більярдні столи ви пропонуєте?",
      answer: "Ми пропонуємо широкий асортимент більярдних столів: від професійних до домашніх моделей. У нас є столи різних розмірів, з різними типами покриття та в різних цінових категоріях."
    },
    {
      question: "Чи надаєте ви послуги монтажу?",
      answer: "Так, ми надаємо повний спектр послуг з монтажу більярдних столів. Наші майстри мають великий досвід та встановлять стіл з дотриманням всіх технічних вимог."
    },
    {
      question: "Яка гарантія на більярдні столи?",
      answer: "На всі наші більярдні столи надається гарантія від виробника. Термін гарантії залежить від моделі та виробника, зазвичай становить 1-3 роки."
    },
    {
      question: "Чи можна замовити доставку по Україні?",
      answer: "Так, ми здійснюємо доставку по всій Україні. Доставка може бути як до адреси, так і до найближчого відділення транспортної компанії."
    },
    {
      question: "Як вибрати правильний більярдний стіл?",
      answer: "При виборі більярдного столу варто враховувати: розмір приміщення, частоту використання, бюджет та особисті уподобання. Наші консультанти допоможуть зробити правильний вибір."
    },
    {
      question: "Чи продаєте ви аксесуари для більярду?",
      answer: "Так, у нас є повний асортимент аксесуарів: киї, крейди, трикутники, мостики, чохли та багато іншого. Всі аксесуари високої якості від перевірених виробників."
    }
  ];

  // Структуровані дані для FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <StructuredData data={structuredData} />
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Часті питання
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Відповіді на найпопулярніші питання наших клієнтів
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {faqData.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 1,
              '&:before': {
                display: 'none',
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(17, 94, 89, 0.04)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
