import { Typography, Tooltip, Fab, CardContent, Stack, Rating, Skeleton } from '@mui/material';
import { IconBasket } from '@tabler/icons-react';
import Link from 'next/link';
import BlankCard from '../../../shared/BlankCard';
import Image from 'next/image';

interface ProductCardProps {
    id: string | number;
    title: string;
    photo: string;
    price: number;
    salesPrice: number;
    rating: number;
    isLoading?: boolean;
}

export const ProductCard = ({ id, photo, price, rating, salesPrice, title, isLoading }: ProductCardProps) => {
    if (isLoading)
        return (
            <Skeleton
                variant="rectangular"
                width={270}
                height={300}
                sx={{
                    borderRadius: (theme) => theme.shape.borderRadius / 5,
                }}
            ></Skeleton>
        );

    return (
        <BlankCard className="hoverCard">
            <Typography component={Link} href={`/apps/ecommerce/detail/${id}`}>
                <Image src={photo} alt="img" width={250} height={268} style={{ width: '100%' }} />
            </Typography>
            <Tooltip title="Add To Cart">
                <Fab
                    size="small"
                    color="primary"
                    onClick={() => {}}
                    sx={{
                        bottom: '75px',
                        right: '15px',
                        position: 'absolute',
                    }}
                >
                    <IconBasket size="16" />
                </Fab>
            </Tooltip>
            <CardContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6">{title}</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h6">${price}</Typography>
                        <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                            ${salesPrice}
                        </Typography>
                    </Stack>
                    <Rating name="read-only" size="small" value={rating} readOnly />
                </Stack>
            </CardContent>
        </BlankCard>
    );
};
