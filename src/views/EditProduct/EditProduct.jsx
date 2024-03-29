import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { Button, Container, MenuItem, Stack, TextField, Typography } from '@mui/material';

export const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productInfo, setProductInfo] = useState({});
    const [img, setImg] = useState();

    const [fileError, setFileError] = useState(false);

    const productRef = doc(db, 'products', id);
    const imgRef = ref(storage, `products-img/${id}`);

    const getProduct = async () => {
        const docSnap = await getDoc(productRef);
        const data = docSnap.data();

        setProductInfo(data);
    };

    const handleFile = (e) => {
        setFileError(false);
        const fileSize = e.target?.files[0].size / 1024 / 1024;
        if (fileSize > 1) {
            setFileError(true);
            e.target.value = null;
            setImg(null);
            return;
        }
        setImg(e.target.files[0]);
    };

    const uploadFile = async () => {
        try {
            await uploadBytes(imgRef, img);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!img) {
            await updateDoc(productRef, productInfo);
        }
        if (img) {
            await updateDoc(productRef, productInfo);
            uploadFile();
        }
        console.log('Producto Actualizado');
        navigate(`/products/${id}`);
    };

    useEffect(() => {
        getProduct();
    }, []);

    return (
        <Container maxWidth="sm" component="form" onSubmit={handleSubmit}>
            <Stack gap="1rem">
                <Typography variant="h3" mb="2rem" fontFamily="Kanit,sans-serif" fontWeight="bold">
                    Editar Producto
                </Typography>
                <Stack direction="row" gap="1.2rem" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        fullWidth
                        value={productInfo?.sport || ''}
                        type="text"
                        label="Disciplina"
                        placeholder="Karate"
                        onChange={(e) => setProductInfo({ ...productInfo, sport: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        value={productInfo?.dojo || ''}
                        type="text"
                        label="Dojo o institución"
                        placeholder="Seishin Dojo"
                        onChange={(e) => setProductInfo({ ...productInfo, dojo: e.target.value })}
                    />
                </Stack>

                <Stack direction="row" gap="1.2rem" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        select
                        fullWidth
                        label="Nivel"
                        helperText="Selecciona el nivel de dificultad de la clase"
                        value={productInfo?.level || ''}
                        // defaultValue="Universal"
                        onChange={(e) => setProductInfo({ ...productInfo, level: e.target.value })}>
                        <MenuItem value="Universal">Universal</MenuItem>
                        <MenuItem value="Principiantes">Principiante</MenuItem>
                        <MenuItem value="Intermedio">Intermedio</MenuItem>
                        <MenuItem value="Avanzado">Avanzado</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Edad"
                        helperText="Selecciona para que edad son las clases"
                        value={productInfo?.age || ''}
                        onChange={(e) => setProductInfo({ ...productInfo, age: e.target.value })}>
                        <MenuItem value="Todas las edades">Todas las edades</MenuItem>
                        <MenuItem value="Niños">Niños</MenuItem>
                        <MenuItem value="Adultos">Adultos</MenuItem>
                    </TextField>
                </Stack>

                <Stack direction="row" gap="1.2rem" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        fullWidth
                        value={productInfo?.city || ''}
                        type="text"
                        label="Ciudad"
                        placeholder="Viña del Mar"
                        onChange={(e) => setProductInfo({ ...productInfo, city: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        value={productInfo?.price || ''}
                        type="number"
                        label="Precio Mensual"
                        placeholder="$"
                        onChange={(e) => setProductInfo({ ...productInfo, price: e.target.valueAsNumber })}
                    />
                </Stack>
                <Stack direction="row" gap="1.2rem">
                    <TextField
                        fullWidth
                        type="file"
                        helperText={
                            fileError ? 'El tamaño maximo de la imagen es 1MB' : 'Sube una imagen acorde a la clase que ofreces'
                        }
                        inputProps={{ accept: 'image/png, image/jpeg' }}
                        onChange={handleFile}
                    />
                </Stack>
                <TextField
                    value={productInfo?.days || ''}
                    type="text"
                    label="Horarios"
                    placeholder="Lunes, Miercoles y Sabado de 19:00 a 21:00"
                    helperText="Ingresa que dias y a que hora son las clases"
                    onChange={(e) => setProductInfo({ ...productInfo, days: e.target.value })}
                />
                <TextField
                    value={productInfo?.adress || ''}
                    type="text"
                    label="Dirección Completa"
                    placeholder="Los Alamos 123, Viña del Mar"
                    helperText="Ingresa la calle y numero seguido de la ciudad"
                    onChange={(e) => setProductInfo({ ...productInfo, adress: e.target.value })}
                />

                <TextField
                    value={productInfo?.desc || ''}
                    multiline
                    label="Descripción"
                    rows={4}
                    helperText="Ingresa información adicional como duración de las clases u otros"
                    onChange={(e) => setProductInfo({ ...productInfo, desc: e.target.value })}
                />

                <Button variant="contained" type="submit">
                    Actualizar
                </Button>
            </Stack>
        </Container>
    );
};
