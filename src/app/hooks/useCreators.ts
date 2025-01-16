import { useEffect, useState } from 'react';
import { useDispatch } from '@/store/hooks';
import { getCreatorsPaginatedThunk } from '@/features/creator/thunks';
import { CreatorType } from '@/features/creator';

export const useCreators = () => {
    const dispatch = useDispatch();

    const [paginatedData, setPaginatedData] = useState<{
        currentPage: number;
        data: { [key: string]: CreatorType };
        total: number;
        totalPage: number;
    }>({
        currentPage: 0,
        data: {},
        total: 0,
        totalPage: 0,
    });

    useEffect(() => {
        const fetchPaginatedData = async (page = 1, aggregatedData = {}) => {
            const response = await dispatch(getCreatorsPaginatedThunk({ page, limit: 100 }));

            const updatedData = {
                ...aggregatedData,
                ...response.data.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
            };

            setPaginatedData({
                data: updatedData,
                currentPage: response.page,
                total: response.total,
                totalPage: response.totalPage,
            });

            if (response.page < response.totalPage) {
                fetchPaginatedData(page + 1, updatedData);
            }
        };

        fetchPaginatedData();
    }, [dispatch]);

    return {
        paginatedData,
    };
};
