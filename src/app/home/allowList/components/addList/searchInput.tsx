import { useEffect, useState, useRef, useMemo, forwardRef, cloneElement, Children } from 'react';
import { VariableSizeList } from 'react-window';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { useLiveStream } from '@/app/home/components/liveStream';
import { CreatorType } from '@/features/creator';
import {
    CREATED_CREATOR,
    DELETED_CREATOR,
    EVENTS_CREATORS,
    LIST_CREATORS,
    UPDATED_CREATOR,
} from '@/app/home/components/liveStream/events';
import { AllowItem } from '@/features/allowList/types';
import { Box } from '@mui/material';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const renderRow = ({ data, index, style }: any) => {
    const item = data[index];
    return cloneElement(item, {
        style: {
            ...style,
            top: (style.top as number) + 2,
        },
    });
};

interface ListBoxComponentProps {
    children: React.ReactNode;
}

const ListboxComponent = forwardRef<HTMLDivElement, ListBoxComponentProps>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const items = Children.toArray(children);
    const itemSize = 48;

    return (
        <div ref={ref} {...other} onMouseDown={(event) => event.preventDefault()}>
            <VariableSizeList
                height={Math.min(items.length * itemSize, 300)}
                itemCount={items.length}
                itemSize={() => itemSize}
                width="100%"
                itemData={items}
            >
                {renderRow}
            </VariableSizeList>
        </div>
    );
});

interface AsyncAutocompletePropsType {
    creators: CreatorType[];
    allowList: AllowItem[];
    handleEmailsChange: (emails: string[]) => void;
}

export default function AsyncAutocomplete({ allowList, creators, handleEmailsChange }: AsyncAutocompletePropsType) {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedInputValue = useDebounce(inputValue, 300);

    const emailsFiltered = useMemo(() => {
        return creators
            .flatMap((creator) =>
                creator.emails.filter((item) => {
                    const isAllowed = !allowList?.some((v) => v.email === item.email);
                    const matchesInput =
                        debouncedInputValue.length === 0 ||
                        item.email.toLowerCase().includes(debouncedInputValue.toLowerCase());

                    return isAllowed && matchesInput;
                })
            )
            .map((item) => item.email)
            .sort();
    }, [creators, debouncedInputValue, allowList]);

    const handleAddValue = (newValue: string[]) => {
        setSelectedValues(newValue);
        handleEmailsChange(newValue);
        setOpen(true);
    };

    const handleFocus = () => {
        setOpen(true);
    };

    return (
        <Autocomplete
            multiple
            disableClearable
            disableCloseOnSelect
            ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
            options={emailsFiltered}
            value={selectedValues}
            onChange={(event, newValue) => {
                handleAddValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            freeSolo
            filterSelectedOptions
            loading={loading}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            sx={{ minWidth: '100%' }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputRef={inputRef}
                    label="Search and Select"
                    placeholder="Type to search..."
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        minWidth: '100%',
                    }}
                    onFocus={handleFocus}
                />
            )}
            renderTags={(value, getTagProps) => {
                const itemSize = 48;

                const renderRowTag = ({ index, style }: any) => {
                    const option = value[index];
                    return (
                        <Box key={option.toString()} style={style}>
                            <Chip label={option} {...getTagProps({ index })} />
                        </Box>
                    );
                };

                return (
                    <Box width="100%" maxHeight={280} overflow="auto">
                        <VariableSizeList
                            height={value.length * 5 * 10 < 280 ? value.length * 5 * 10 : 280}
                            itemCount={value.length}
                            itemSize={() => itemSize}
                            width="100%"
                        >
                            {renderRowTag}
                        </VariableSizeList>
                    </Box>
                );
            }}
        />
    );
}
