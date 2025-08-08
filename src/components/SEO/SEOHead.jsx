import { useEffect } from "react";
import {
  generateProductTitle,
  generateProductMetaDescription,
} from "../../utils/seoHelpers";

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  product = null,
  type = "website",
  url = null,
}) => {
  useEffect(() => {
    // Генеруємо title та description для товару
    let finalTitle = title;
    let finalDescription = description;

    if (product) {
      finalTitle = generateProductTitle(product);
      finalDescription = generateProductMetaDescription(product);
    }

    // Оновлюємо title
    document.title = finalTitle;

    // Оновлюємо meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = finalDescription;

    // Оновлюємо keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = keywords;
    }

    // Оновлюємо Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = finalTitle;

    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = finalDescription;

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement("meta");
      ogType.setAttribute("property", "og:type");
      document.head.appendChild(ogType);
    }
    ogType.content = type;

    if (url) {
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        document.head.appendChild(ogUrl);
      }
      ogUrl.content = url;
    }

    if (image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.content = image;
    }

    // Оновлюємо Twitter Card
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement("meta");
      twitterTitle.name = "twitter:title";
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = finalTitle;

    let twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (!twitterDescription) {
      twitterDescription = document.createElement("meta");
      twitterDescription.name = "twitter:description";
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.content = finalDescription;

    if (image) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement("meta");
        twitterImage.name = "twitter:image";
        document.head.appendChild(twitterImage);
      }
      twitterImage.content = image;
    }

    // Додаємо canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }
  }, [title, description, keywords, image, product, type, url]);

  return null; // Цей компонент не рендерить нічого
};

export default SEOHead;
