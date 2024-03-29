import { useNavigate, useParams } from 'react-router-dom';
import { useCartContext, useUserContext } from '../../context';
import { useSingleProduct } from '../../hooks';
import { CommentSection } from './components';
import { Footer, Loading, Layout } from '../../common/components';
import { formatNumber } from '../../common/utils';
import Icons from '../../common/Icons';
import { Box, Button, Card, CardContent, CardMedia, List, ListItem, Stack, Typography } from '@mui/material';
import { updateFavorites } from '../../services/favorites';

export const ProductPage = () => {
    const { id } = useParams();
    const { user, setUserData, userData } = useUserContext();
    const { product, setProduct, loading } = useSingleProduct(id);
    const { addProduct } = useCartContext();

    const navigate = useNavigate();

    let isFav;
    if (user) {
        isFav = userData?.favs?.some((item) => item === id);
    }

    const handleFav = () => {
        let newFavs = [];
        if (!isFav) {
            newFavs = [...userData.favs, product.id];
            setUserData({ ...userData, favs: [...userData.favs, product.id] });
            console.log('Agregado a favoritos');
        }
        if (isFav) {
            newFavs = userData.favs.filter((item) => item !== product.id);
            setUserData({ ...userData, favs: newFavs });
            console.log('Eliminado de favoritos');
        }
        updateFavorites(user.uid, newFavs);
    };

    const listStyle = {
        display: 'flex',
        gap: { xs: '1rem', md: '5rem' },
        color: '#455a64',
        fontWeight: 'bold',
        flexWrap: { xs: 'wrap', md: 'noWrap' },
        fontSize: '1.3rem',
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Layout>
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '.3rem 1.2rem 1.2rem',
                    }}>
                    {/* card body */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}>
                        <CardMedia
                            component="img"
                            title={product?.sport}
                            image={product?.image}
                            sx={{
                                width: { xs: '100%', sm: '40%' },
                                objectFit: 'cover',
                                aspectRatio: { sm: '1/1' },
                            }}
                        />
                        {/* Card right info */}
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                flexGrow: 1,
                            }}>
                            {/* Sport | City */}
                            <Stack direction="row" justifyContent="space-between" flexWrap="wrap" sx={{ color: '#455a64' }}>
                                <Typography variant="overline" fontWeight="bold" fontSize="1.2rem">
                                    Clases de {product?.sport}
                                </Typography>
                                <Typography variant="overline" fontSize="1.2rem" fontWeight="bold">
                                    {product?.city}
                                </Typography>
                            </Stack>
                            <Typography
                                variant="h2"
                                fontWeight="bold"
                                fontFamily="Kanit,sans-serif"
                                letterSpacing=".3rem"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3rem' },
                                    wordBreak: 'break-word',
                                }}>
                                {product?.dojo}
                            </Typography>
                            {/* List Direccion | Nivel | Edad */}
                            <List disablePadding>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Nivel:</span>
                                    <span>{product?.level}</span>
                                </ListItem>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Edad:</span>
                                    <span>{product.age}</span>
                                </ListItem>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Dirección:</span>
                                    <span>{product.adress}</span>
                                </ListItem>
                            </List>
                            {/* Precio x mes */}
                            <Box display="flex" gap="1rem" flexDirection="row" alignItems="baseline">
                                <Typography
                                    fontWeight="bold"
                                    color="primary"
                                    letterSpacing=".3rem"
                                    lineHeight="1.5"
                                    sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                                    {product.price === 0 ? 'Gratis' : `$ ${formatNumber(product?.price)}`}
                                </Typography>
                                <Typography variant="subtitle2" fontSize="1.2rem" letterSpacing=".1rem" textTransform="uppercase">
                                    {product?.price !== 0 && 'x mes'}
                                </Typography>
                            </Box>
                            {/* Añadir | Fav */}
                            <Stack direction="row" justifyContent="space-around" gap=".8rem" flexWrap="wrap">
                                {user?.uid !== product?.userId ? (
                                    <Button
                                        disabled={!user}
                                        onClick={handleFav}
                                        variant="outlined"
                                        size="medium"
                                        sx={{ fontSize: '1.2rem', '> svg': { mr: '.2rem' } }}>
                                        {!isFav ? <Icons.FavoriteBorderIcon /> : <Icons.FavoriteIcon />}
                                        {!isFav ? 'Guardar favorito' : 'Eliminar Favorito'}
                                    </Button>
                                ) : (
                                    <Button
                                        size="medium"
                                        sx={{ fontSize: '1.2rem' }}
                                        variant="outlined"
                                        onClick={() => navigate(`/dashboard/products/${product?.id}`)}>
                                        <Icons.EditIcon fontSize="large" sx={{ mr: '.3rem' }} />
                                        Editar
                                    </Button>
                                )}
                                <Button
                                    size="medium"
                                    sx={{ fontSize: '1.2rem' }}
                                    disabled={user?.uid === product?.userId}
                                    variant="contained"
                                    onClick={() => addProduct(product, user)}>
                                    <Icons.AddShoppingCartIcon sx={{ mr: '.2rem' }} />
                                    Añadir al carrito
                                </Button>
                            </Stack>
                        </CardContent>
                    </Box>
                    {/* User | Descripcion | Horarios */}
                    <Stack m="1rem auto" gap="1rem" width="100%">
                        <Typography variant="overline" fontSize="1.2rem" sx={{ lineHeight: '1' }}>
                            Por:
                            <b>{product?.userName}</b>
                        </Typography>
                        <Typography fontSize="1.2rem">
                            <b>Horarios:</b> {product?.days}
                        </Typography>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                fontSize: { xs: '1rem', sm: '1.3rem' },
                            }}>
                            {product?.desc}
                        </Typography>
                    </Stack>
                    <CommentSection product={product} myUserInfo={userData} setProduct={setProduct} />
                </Card>
            </Layout>
            <Footer />
        </>
    );
};
