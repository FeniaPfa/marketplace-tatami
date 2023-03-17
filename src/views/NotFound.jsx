import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Container, Stack, Typography } from '@mui/material';
import { Footer } from '../components/Footer';

export const NotFound = () => {
    return (
        <>
            <Container maxWidth="md" >
                <Stack alignItems="center" marginY="5rem">
                    <ErrorOutlineIcon color="primary" sx={{ fontSize: '16rem' }} />
                    <Typography variant="h2" color="primary" fontWeight="bold">
                        Error 404
                    </Typography>
                    <Typography variant="h4" color="primary">
                        Pagina no encontrada
                    </Typography>
                </Stack>
            </Container>
            <Footer />
        </>
    );
};
