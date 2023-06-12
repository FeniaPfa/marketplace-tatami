import { useEffect, useState } from 'react';
import { useGetUser, useGetProducts } from '../../hooks';
import { FavCard } from './components';
import { Container, Stack, Typography } from '@mui/material';
import { Loading, EmptyAlert } from '../../common/components';

export const Favorites = () => {
    const { products } = useGetProducts();
    const { userData } = useGetUser();

    const [favorites, setFavorites] = useState();

    const favData = products.filter((item) => userData?.favs.includes(item.id));

    useEffect(() => {
        setFavorites(favData);
    }, [products, userData]);

    if (!favorites) return <Loading />;

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" mb="2rem" fontFamily="Kanit,sans-serif" fontWeight="bold">
                Mis Favoritos
            </Typography>
            <Stack gap="1rem">
                {favorites.length === 0 && <EmptyAlert width="sm" type="favs" />}
                {favorites.map((item) => (
                    <FavCard
                        key={item.id}
                        productData={item}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        userData={userData}
                    />
                ))}
            </Stack>
        </Container>
    );
};