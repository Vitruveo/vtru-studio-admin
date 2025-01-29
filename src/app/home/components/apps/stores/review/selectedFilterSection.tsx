import { hasTruthyObject } from '@/utils/truthyObject';
import { Box, Grid, Typography } from '@mui/material';
import { ShortcutFilter } from './shortcutFilter';
import { LicensesFilter } from './licensesFilter';
import { ColorFilter, ColorPrecisionFilter } from './colorFilter';
import { MultiSelectFilter } from './multiSelectFilter';
import { useEffect, useState } from 'react';

interface SelectedFilterProps {
    title: string;
    content: any;
}

export const SelectedFilter = ({ title, content }: SelectedFilterProps) => {
    const [hasColors, setHasColors] = useState(false);

    useEffect(() => {
        if (content.colors && Array.isArray(content.colors)) {
            setHasColors(content.colors.length > 0);
        }
    }, [content.colors]);

    const contentCopy = { ...content };
    delete contentCopy.precision;

    const renderTitle = (): string => {
        if (!hasTruthyObject(contentCopy)) {
            return '';
        }
        if (
            title === 'general' &&
            contentCopy.licenses &&
            !contentCopy.licenses.enabled &&
            !hasTruthyObject(contentCopy.shortcuts)
        ) {
            return '';
        }

        return title;
    };

    return (
        <Grid item xs={6}>
            <Typography variant="overline" fontWeight="bold">
                {renderTitle()}
            </Typography>
            <Box ml={4}>
                {Object.entries(content)
                    .filter(([_key, value]) => (Array.isArray(value) ? value.length : !!value))
                    .map((element) => {
                        const [key, value] = element;
                        const isShortcut = key === 'shortcuts';
                        const isLicense = key === 'licenses';
                        const isColorPrecision = key === 'precision';
                        const isColors = key === 'colors';

                        const valueCopy = typeof value === 'object' ? { ...value } : value;
                        if (typeof valueCopy === 'object' && 'enabled' in valueCopy) {
                            delete (valueCopy as any).minPrice;
                            delete (valueCopy as any).maxPrice;
                        }
                        return (
                            <Box
                                key={key}
                                display={'flex'}
                                flexDirection={isColorPrecision || isColors ? 'row' : 'column'}
                                marginBlock={1}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {hasTruthyObject(valueCopy) || (isColorPrecision && hasColors) ? key : ''}
                                </Typography>
                                {isShortcut && <ShortcutFilter content={value as { [key: string]: boolean }} />}
                                {isLicense && <LicensesFilter content={value as { [key: string]: string }} />}
                                {isColorPrecision && hasColors && (
                                    <ColorPrecisionFilter content={{ value: value as number }} />
                                )}
                                {isColors && <ColorFilter content={value as string[]} />}
                                {!isShortcut && !isLicense && !isColorPrecision && !isColors && (
                                    <MultiSelectFilter content={{ title, key, value: value as string[] }} />
                                )}
                            </Box>
                        );
                    })}
            </Box>
        </Grid>
    );
};
