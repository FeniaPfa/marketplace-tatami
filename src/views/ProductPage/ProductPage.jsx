import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, getImg } from '../../config/firebase';
import { useCartContext, useUserContext } from '../../context';
import { useGetSingleProduct } from '../../hooks';
import { CommentSection } from './components';
import { Footer, Loading, Layout } from '../../common/components';
import { formatNumber } from '../../common/utils';
import Icons from '../../common/Icons';
import { Box, Button, Card, CardContent, CardMedia, List, ListItem, Stack, Typography } from '@mui/material';

export const ProductPage = () => {
    const { id } = useParams();
    const { user, setUserData, userData } = useUserContext();
    const { productData, getProduct, setProductData } = useGetSingleProduct(id);
    const [img, setImg] = useState();
    const { addProduct } = useCartContext();

    const navigate = useNavigate();

    // Datos del usuario que publico la clase
    const [productUserInfo, setProductUserInfo] = useState();
    // Datos del usuario logeado
    const [myUserInfo, setMyUserInfo] = useState();

    const getUserInfo = async (id, setInfo) => {
        try {
            if (productData) {
                const userRef = doc(db, 'users', id);
                const docSnap = await getDoc(userRef);
                const data = docSnap.data();
                setInfo(data);
            }
        } catch (err) {
            console.error({ err });
        }
    };

    let myUserRef;
    let isFav;
    if (user) {
        myUserRef = doc(db, 'users', user?.uid);
        isFav = myUserInfo?.favs?.some((item) => item === productData.id);
    }

    let favorites = [];
    const handleFav = () => {
        if (!isFav) {
            favorites = [...myUserInfo.favs, productData.id];
            setUserData({ ...userData, favs: [...userData.favs, productData.id] });
            uploadFav();
            setMyUserInfo({ ...myUserInfo, favs: [...myUserInfo.favs, productData.id] });
            console.log('Agregado a favoritos');
        }
        if (isFav) {
            const newFavs = myUserInfo.favs.filter((item) => item !== productData.id);
            favorites = [...newFavs];
            uploadFav();
            setMyUserInfo({ ...myUserInfo, favs: newFavs });
            console.log('Eliminado de favoritos');
        }
    };
    const uploadFav = async () => {
        try {
            await updateDoc(myUserRef, { favs: favorites });
            console.log('Favoritos actualizados');
        } catch (err) {
            console.error({ err });
        }
    };

    useEffect(() => {
        getImg(id, setImg);
        getUserInfo(productData?.userId, setProductUserInfo);

        if (user) {
            getUserInfo(user?.uid, setMyUserInfo);
        }
    }, [productData]);

    const listStyle = {
        display: 'flex',
        gap: { xs: '1rem', md: '5rem' },
        color: '#455a64',
        fontWeight: 'bold',
        flexWrap: { xs: 'wrap', md: 'noWrap' },
        fontSize: '1.3rem',
    };

    if (!productData) {
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
                            title={productData?.sport}
                            image={img}
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
                                    Clases de {productData?.sport}
                                </Typography>
                                <Typography variant="overline" fontSize="1.2rem" fontWeight="bold">
                                    {productData?.city}
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
                                {productData?.dojo}
                            </Typography>
                            {/* List Direccion | Nivel | Edad */}
                            <List disablePadding>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Nivel:</span>
                                    <span>{productData.level}</span>
                                </ListItem>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Edad:</span>
                                    <span>{productData.age}</span>
                                </ListItem>
                                <ListItem sx={listStyle}>
                                    <span style={{ flexGrow: '1' }}>Dirección:</span>
                                    <span>{productData.adress}</span>
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
                                    {productData.price === 0 ? 'Gratis' : `$ ${formatNumber(productData?.price)}`}
                                </Typography>
                                <Typography variant="subtitle2" fontSize="1.2rem" letterSpacing=".1rem" textTransform="uppercase">
                                    {productData?.price !== 0 && 'x mes'}
                                </Typography>
                            </Box>
                            {/* Añadir | Fav */}
                            <Stack direction="row" justifyContent="space-around" gap=".8rem" flexWrap="wrap">
                                {user?.uid !== productData?.userId ? (
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
                                        onClick={() => navigate(`/dashboard/products/${productData?.id}`)}>
                                        <Icons.EditIcon fontSize="large" sx={{ mr: '.3rem' }} />
                                        Editar
                                    </Button>
                                )}
                                <Button
                                    size="medium"
                                    sx={{ fontSize: '1.2rem' }}
                                    disabled={user?.uid === productData?.userId}
                                    variant="contained"
                                    onClick={() => addProduct(productData, user)}>
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
                            <b>
                                {productUserInfo?.name} {productUserInfo?.apellido}
                            </b>
                        </Typography>
                        <Typography fontSize="1.2rem">
                            <b>Horarios:</b> {productData?.days}
                        </Typography>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                fontSize: { xs: '1rem', sm: '1.3rem' },
                            }}>
                            {productData?.desc}
                        </Typography>
                    </Stack>
                    <CommentSection
                        productData={productData}
                        myUserInfo={myUserInfo}
                        getProduct={getProduct}
                        setProductData={setProductData}
                    />
                </Card>
            </Layout>
            <Footer />
        </>
    );
};
