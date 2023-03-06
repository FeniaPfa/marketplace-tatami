import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase';

export const Product = ({product}) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const imgRef = ref(storage, `products-img/${product.id}`);

    const handleClick = () => {
      console.log("click")
        // navigate(`/products/${product.id}`);
    };

    useEffect(() => {
        getDownloadURL(imgRef).then((url) => setImage(url));
    }, []);

    return (
        <>
            <Card sx={{ maxWidth: 350 }}>
                <CardMedia
                    component="img"
                    sx={{ maxHeight: '200px', minWidth:"200px" }}
                    image={image}
                    alt={product.dojo}
                />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
                        Clases de {product.sport}
                    </Typography>
                    <Typography mb=".8rem" variant="h5" component="h5" fontWeight="bold">
                        {product.dojo}
                    </Typography>
                    <Button variant="contained" size="small" onClick={handleClick}>
                        Ver mas
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};