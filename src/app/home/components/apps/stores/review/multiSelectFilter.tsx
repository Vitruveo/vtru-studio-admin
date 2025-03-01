import { Box, Paper, Typography } from '@mui/material';
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

interface MultiSelectFilterProps {
    content: { title: string; key: string; value: string[] };
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
};

export const MultiSelectFilter = ({ content }: MultiSelectFilterProps) => {
    if (!content.value.length) return null;
    const isLast = (index: number) => index < content.value.length - 1;

    return (
        <Box display={'flex'} gap={1} flexWrap={'wrap'}>
            {content.value.map((item) => {
                return (
                    <Typography key={item} variant="body1">
                        {options[content.title][content.key].length
                            ? options[content.title][content.key].find((option) => option.value === item)?.label
                            : item}
                        {isLast(content.value.indexOf(item)) ? ', ' : ''}
                    </Typography>
                );
            })}
        </Box>
    );
};
