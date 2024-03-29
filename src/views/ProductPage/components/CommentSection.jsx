import { useEffect, useState } from 'react';
import { useUserContext } from '../../../context';
import { Box, Button, Container, Divider, Rating, Stack, TextField, Typography } from '@mui/material';
import { EmptyAlert } from '../../../common/components';
import { Comment } from './Comment';
import { updateProduct } from '../../../services/products';

export const CommentSection = ({ product, myUserInfo, setProduct }) => {
    const { user } = useUserContext();

    const [newComment, setNewComment] = useState({
        score: 0,
        text: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newComments = { comments: [...product.comments, newComment] };
            updateProduct(product.id, newComments);

            console.log('Nuevo Comentario');
            setProduct({ ...product, comments: [...product.comments, newComment] });
            setNewComment({ score: 0, text: '' });
        } catch (err) {
            console.error({ err });
        }
    };

    useEffect(() => {
        if (myUserInfo) {
            setNewComment({
                ...newComment,
                userId: myUserInfo.id,
                name: `${myUserInfo.name} ${myUserInfo.apellido}`,
                hasAvatar: myUserInfo.hasAvatar,
            });
        }
    }, [myUserInfo]);

    return (
        <>
            <Divider sx={{ marginY: '1rem' }} />

            {user && user.uid !== product.userId && (
                <Container sx={{ margin: '2rem auto' }} component="form" onSubmit={handleSubmit}>
                    <Stack gap="1rem" alignItems="flex-start">
                        <Typography variant="h5" fontWeight="bold">
                            Deja un comentario
                        </Typography>

                        <Rating
                            size="large"
                            value={newComment.score}
                            onChange={(event, newValue) => {
                                setNewComment({ ...newComment, score: newValue });
                            }}
                        />
                        <TextField
                            multiline
                            required
                            value={newComment.text}
                            rows={2}
                            fullWidth
                            placeholder="Comentario..."
                            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                        />
                        <Button variant="contained" type="submit">
                            Comentar
                        </Button>
                    </Stack>
                </Container>
            )}

            <Container className="commentList" mt="1rem">
                <Typography variant="h5" fontWeight="bold">
                    Comentarios
                </Typography>
                <Box marginY="2rem">{product.comments.length === 0 && <EmptyAlert width="md" type="comments" />}</Box>
                {product.comments.map((item, index) => <Comment key={index} comment={item} />).reverse()}
            </Container>
        </>
    );
};
