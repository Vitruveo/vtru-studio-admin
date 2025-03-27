import { Box, Typography } from '@mui/material';
import {
    cultureOptions,
    moodOptions,
    orientationOptions,
    objectTypeOptions,
    aiGenerationOptions,
    arEnabledOptions,
    nudityOptions,
    categoryOptions,
    mediumOptions,
    styleOptions,
} from './options';
import { countryData } from '@/utils/countryData';
import { formatWallet } from '@/utils/formatWallet';

interface MultiSelectFilterProps {
    content: { title: string; key: string; value: string[] | { value: string; label: string }[] };
}

const options: Record<string, { [key: string]: { label: string; value: string }[] }> = {
    general: {},
    context: {
        culture: cultureOptions,
        mood: moodOptions,
        orientation: orientationOptions,
    },
    taxonomy: {
        objectType: objectTypeOptions,
        tags: [],
        collections: [],
        aiGeneration: aiGenerationOptions,
        arEnabled: arEnabledOptions,
        nudity: nudityOptions,
        category: categoryOptions,
        medium: mediumOptions,
        style: styleOptions,
        subject: [],
    },
    artists: {
        name: [],
        nationality: countryData.map((country) => ({ value: country.code, label: country.label })),
        residence: countryData.map((country) => ({ value: country.code, label: country.label })),
    },
    portfolio: {
        wallets: [],
    },
    exclude: {
        arts: [],
        artists: [],
    },
    include: {
        arts: [],
        artists: [],
    },
};

export const MultiSelectFilter = ({ content }: MultiSelectFilterProps) => {
    if (!content.value.length) return null;

    const getItemTitle = (item: string | { value: string; label: string }): string => {
        if (options[content.title][content.key].length) {
            return options[content.title][content.key].find((option) => option.value === item)?.label || '';
        }
        if (content.title === 'exclude' || content.title === 'include') {
            return (item as any).label;
        }
        return formatWallet(item as string) || '';
    };

    return (
        <Box display={'flex'} gap={1} flexWrap={'wrap'}>
            {content.value.map((item, index) => {
                return (
                    <Typography key={index} variant="body1">
                        {getItemTitle(item)}
                    </Typography>
                );
            })}
        </Box>
    );
};
