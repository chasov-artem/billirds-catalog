import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useFavorites } from '../../context/FavoritesContext';

const RelatedProducts = ({ currentProduct, products, maxItems = 4 }) => {
  const { toggleFavorite, isInFavorites } = useFavorites();

  // Фільтруємо схожі товари
  const getRelatedProducts = () => {
    if (!currentProduct || !products.length) return [];

    const currentCategory = currentProduct.Категорія || currentProduct.category;
    const currentId = currentProduct.id;

    return products
      .filter(product => {
        // Виключаємо поточний товар
        if (product.id === currentId) return false;
        
        // Спочатку товари з тієї ж категорії
        const productCategory = product.Категорія || product.category;
        return productCategory === currentCategory;
      })
      .slice(0, maxItems);
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) return null;

  const formatPrice = (price) => {
    if (!price) return "За запитом";
    return `${new Intl.NumberFormat("uk-UA").format(price)} грн`;
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Схожі товари
      </Typography>
      
      <Grid container spacing={3}>
        {relatedProducts.map((product) => {
          const mainImage = product.Фото?.[0] || product.imageUrl || product.зображення;
          
          return (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={mainImage}
                  alt={product.Назва || product.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                      label={product.Категорія || product.category || "Більярдні товари"}
                      size="small"
                      sx={{ 
                        backgroundColor: '#115e59',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => toggleFavorite(product.id)}
                      sx={{
                        minWidth: 'auto',
                        p: 0.5,
                        color: isInFavorites(product.id) ? '#ff4081' : '#666',
                        '&:hover': {
                          color: isInFavorites(product.id) ? '#f50057' : '#ff4081',
                        },
                      }}
                    >
                      {isInFavorites(product.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </Button>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      mb: 1
                    }}
                  >
                    {product.Назва || product.name}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      color: '#115e59'
                    }}
                  >
                    {formatPrice(product.Ціна || product.price)}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/product/${product.id}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #115e59 0%, #134e4a 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #134e4a 0%, #0f3d3a 100%)',
                      },
                    }}
                  >
                    Детальніше
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
