import { useGetProducts } from '../hooks/useGetProducts';
import { ProductCard } from '../components/ProductCard';
import { CardSkeleton } from '../components/CardSkeleton';
import { Stack } from '@mui/material';
import { Main } from '../containers/Main';
import { Filters } from '../components/Filters';
import { useEffect, useState } from 'react';

export const Products = () => {
    const { products, loading, setProducts} = useGetProducts();
    const [filteredList, setFilteredList] = useState([])

    useEffect(() => {
        setFilteredList(products)
    },[products])
    return (
        <Main>
            <Filters products={products} setFilteredList={setFilteredList}/>
        <Stack direction="row" gap="2rem" flexWrap="wrap">
            {loading
                ? Array.from(new Array(6)).map((item, index) => <CardSkeleton key={index} />)
                : filteredList.map((item) => <ProductCard key={item.id} product={item} />)}
        </Stack>
                </Main>
    );
};