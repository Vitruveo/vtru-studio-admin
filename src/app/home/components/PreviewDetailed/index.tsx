import { useState } from 'react';
import { Box, Button, Grid, Pagination, Select, Typography } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import { AppearanceContent } from '@/features/stores/types';
import AssetMock from './assetMock';
import FilterMock from './filterMock';
import './style.css';

interface Props {
    title: string;
    description: string | null;
    domain: string | null;
    banner: string | null;
    logo: string | null;
    logoHorizontal: string | null;
    values?: AppearanceContent;
}

export const PreviewDetailed = (rest: Props) => {
    const [imgLogoError, setImgLogoError] = useState(false);
    const [imgLogoHorizontalError, setImgLogoHorizontalError] = useState(false);

    return (
        <div className="browser-mockup-detailed">
            <div className="browser-title-bar">
                <div className="circles">
                    <span className="circle red"></span>
                    <span className="circle yellow"></span>
                    <span className="circle green"></span>
                </div>
            </div>
            <div className="browser-url-bar">
                {rest.logo && !imgLogoError ? (
                    <img
                        style={{
                            width: '20px',
                            height: '20px',
                            objectFit: 'cover',
                            flexShrink: 0,
                        }}
                        src={rest.logo}
                        alt="logo"
                        onError={() => setImgLogoError(true)}
                    />
                ) : (
                    <Box width={'20px'} height={'20px'} bgcolor="#eeeeee" />
                )}
                <span className="url-text">{rest.domain}</span>
            </div>
            <div className="browser-content">
                {!rest.values?.hideElements.header && (
                    <Grid container mb={1}>
                        <Grid item xs={12} sm={3}>
                            {rest.logoHorizontal && !imgLogoHorizontalError ? (
                                <img
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        objectFit: 'contain',
                                        flexShrink: 0,
                                    }}
                                    src={rest.logoHorizontal}
                                    alt="logo-horizontal"
                                    onError={() => setImgLogoHorizontalError(true)}
                                />
                            ) : (
                                <Box width="100%" height="40px" bgcolor="#eeeeee" />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={9} display="flex" alignItems="center" justifyContent="flex-end" px={2}>
                            <IconMenu2 />
                        </Grid>
                    </Grid>
                )}
                <Grid container style={{ height: 'calc(100% - 55px)' }}>
                    {!rest.values?.hideElements.filters && (
                        <Grid item xs={12} sm={3}>
                            <FilterMock color={rest.values?.highlightColor || '#FF0066'} />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={!rest.values?.hideElements.filters ? 9 : 12} px={2}>
                        <Typography variant="h4" gutterBottom>
                            {rest.title}
                        </Typography>
                        {rest.banner && (
                            <img
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                }}
                                src={rest.banner}
                                alt="banner"
                            />
                        )}
                        <Typography variant="body1" gutterBottom>
                            {rest.description}
                        </Typography>

                        <Box display="flex" gap={3} mt={3} mb={2}>
                            {!rest.values?.hideElements.artworkSpotlight && (
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        variant="body2"
                                        fontWeight={'bold'}
                                        color={rest.values?.highlightColor || '#FF0066'}
                                    >
                                        Artworks Spotlight
                                    </Typography>
                                </Box>
                            )}
                            {!rest.values?.hideElements.artistSpotlight && (
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2">Artists Spotlight</Typography>
                                </Box>
                            )}
                            {!rest.values?.hideElements.recentlySold && (
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2">Recently Sold</Typography>
                                </Box>
                            )}
                        </Box>

                        {![
                            rest.values?.hideElements.artworkSpotlight,
                            rest.values?.hideElements.artistSpotlight,
                            rest.values?.hideElements.recentlySold,
                        ].every((item) => item) && (
                                <Box display="flex" justifyContent="space-between" gap={1} overflow={'hidden'}>
                                    {Array.from({ length: !rest.values?.hideElements.filters ? 5 : 8 }).map((_, index) => (
                                        <Box key={index} width="calc(25% - 8px)" height="100px" bgcolor="#eeeeee" />
                                    ))}
                                </Box>
                            )}

                        <Box display="flex" gap={3} mt={5} mb={3}>
                            {['Sort:', 'Artists:', 'Pagination:'].map((value, index) => (
                                <Box
                                    key={value}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                >
                                    {!rest.values?.hideElements.order && index !== 2 && (
                                        <Box display={'flex'} alignItems={'center'}>
                                            <Typography variant="body1">{value}</Typography>
                                            <Select
                                                sx={{
                                                    width: '75px',
                                                    height: '30px',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                    {!rest.values?.hideElements.pageNavigation && index === 2 && (
                                        <Box display={'flex'} alignItems={'center'}>
                                            <Typography variant="body1">{value}</Typography>
                                            <Select
                                                sx={{
                                                    width: '75px',
                                                    height: '30px',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                }}
                                            />
                                            <Select
                                                sx={{
                                                    width: '75px',
                                                    height: '30px',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${rest.values?.highlightColor || '#FF0066'
                                                            } !important`,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {!rest.values?.hideElements.assets && (
                            <Box
                                display="grid"
                                gridTemplateColumns={`repeat(${!rest.values?.hideElements.filters ? 4 : 6}, 1fr)`}
                                gap={2}
                            >
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <>
                                        {index === 0 && (
                                            <AssetMock
                                                key={index}
                                                showBadge
                                                badgeValue="2"
                                                showDetails={!rest.values?.hideElements.cardDetails}
                                                color={rest.values?.highlightColor || '#FF0066'}
                                            />
                                        )}
                                        {index === 1 && (
                                            <AssetMock
                                                key={index}
                                                showBadge
                                                badgeValue="10"
                                                showDetails={!rest.values?.hideElements.cardDetails}
                                                color={rest.values?.highlightColor || '#FF0066'}
                                            />
                                        )}
                                        {index === 2 && (
                                            <AssetMock
                                                key={index}
                                                showBadge
                                                badgeValue="99+"
                                                showDetails={!rest.values?.hideElements.cardDetails}
                                                color={rest.values?.highlightColor || '#FF0066'}
                                            />
                                        )}
                                        {index > 2 && (
                                            <AssetMock
                                                key={index}
                                                showDetails={!rest.values?.hideElements.cardDetails}
                                                color={rest.values?.highlightColor || '#FF0066'}
                                            />
                                        )}
                                    </>
                                ))}
                            </Box>
                        )}

                        {!rest.values?.hideElements.pageNavigation && (
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Pagination
                                    count={6}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            '&.Mui-selected': {
                                                backgroundColor: rest.values?.highlightColor || '#FF0066',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: rest.values?.highlightColor || '#FF0066',
                                        '&:hover': { backgroundColor: rest.values?.highlightColor || '#FF0066' },
                                    }}
                                >
                                    Scroll to top
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
