import { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import { useGetProducts } from '../hooks/useGetProducts';
import { MyProduct } from '../components/MyProduct';
import { Container, Stack, Typography } from '@mui/material';
import { EmptyMyProducts } from '../components/EmptyMyProducts';

export const ProductsManager = () => {
    const { user } = useUserContext();
    const { products } = useGetProducts();
    const [myProducts, setMyProducts] = useState([]);

    useEffect(() => {
        setMyProducts(products.filter((item) => item.userId === user.uid));
    }, [products]);

    if (!myProducts) {
        return <p>Loading</p>;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" mb="2rem" fontFamily="Kanit,sans-serif" fontWeight="bold" sx={{wordBreak:"break-word",fontSize:{xs:"3rem", sm:"3.7rem"}}}>
                Mis Publicaciones
            </Typography>
            <Stack gap="1rem">
                {myProducts.length === 0 && <EmptyMyProducts />}
                {myProducts.map((item) => (
                    <MyProduct
                        key={item.id}
                        product={item}
                        setMyProducts={setMyProducts}
                        myProducts={myProducts}
                    />
                ))}
            </Stack>
        </Container>
    );
};
