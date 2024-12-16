'use client';

import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import { nanoid } from '@reduxjs/toolkit';
import { Form, Formik, useFormikContext } from 'formik';
import { useDispatch, useSelector } from '@/store/hooks';
import { BASE_URL_ARTCARDS } from '@/constants/api';
import { TOKEN_ADMINS, WS_SERVER_URL } from '@/constants/ws';
import { ARTCARDS_TEMPLATES_STORAGE_URL } from '@/constants/tempĺates';
import { toastrActionsCreators } from '@/features/toastr/slice';

const fields = [
    { id: nanoid(), name: 'general', label: 'General', type: 'divider', size: 12 },
    { id: nanoid(), name: 'title', label: 'Title', type: 'text', size: 12 },
    { id: nanoid(), name: 'name', label: 'Name', type: 'text', size: 6 },
    { id: nanoid(), name: 'category', label: 'Category', type: 'text', size: 6 },
    { id: nanoid(), name: 'width', label: 'Width', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'height', label: 'Height', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'artdivider', label: 'Art', type: 'divider', size: 12 },
    { id: nanoid(), name: 'artleft', label: 'Art Left', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'arttop', label: 'Art Top', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'artsize', label: 'Art Size', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'artrotate', label: 'Art Rotate', type: 'number', size: 2, default: 0 },
    { id: nanoid(), name: 'textdivider', label: 'Text', type: 'divider', size: 12 },
    { id: nanoid(), name: 'textleft', label: 'Text Left', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'texttop', label: 'Text Top', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'textwidth', label: 'Text Width', type: 'number', size: 3, default: 0 },
    { id: nanoid(), name: 'textheight', label: 'Text Height', type: 'number', size: 2, default: 0 },
    { id: nanoid(), name: 'textcolor', label: 'Text Color', type: 'color', size: 2, default: '#000000' },
    { id: nanoid(), name: 'image', label: 'Image', type: 'divider', size: 12 },
    { id: nanoid(), name: 'background', label: 'Background', type: 'image', size: 3, default: null },
];

interface FieldProps {
    label: string;
    name: string;
    type: string;
}

const FieldSimple = ({ label, name, type }: FieldProps) => {
    const formik = useFormikContext<Record<string, string>>();
    return (
        <TextField
            label={label}
            name={name}
            type={type}
            value={formik.values[name]}
            onChange={formik.handleChange}
            fullWidth
        />
    );
};

const FieldImage = ({ label, name, type }: FieldProps) => {
    const formik = useFormikContext();
    return (
        <Box>
            <Typography variant="h6">{label}</Typography>
            <input
                type="file"
                name={name}
                onChange={(event) => {
                    formik.setFieldValue(name, event.currentTarget.files?.[0]);
                }}
            />
        </Box>
    );
};

const Preview = () => {
    const formik = useFormikContext<Record<string, string>>();

    return (
        <Box>
            <pre>
                {JSON.stringify(
                    {
                        title: formik?.values?.title,
                        name: formik?.values?.name,
                        category: formik?.values?.category,
                        width: formik?.values?.width,
                        height: formik?.values?.height,
                        art: {
                            left: formik?.values['artleft'] || 0,
                            top: formik?.values['arttop'] || 0,
                            size: formik?.values['artsize'] || 0,
                            rotate: formik?.values['artrotate'] || 0,
                        },
                        text: {
                            left: formik?.values['textleft'] || 0,
                            top: formik?.values['texttop'] || 0,
                            width: formik?.values['textwidth'] || 0,
                            height: formik?.values['textheight'] || 0,
                        },
                    },
                    null,
                    4
                )}
            </pre>
            {formik?.values?.background && (formik?.values?.background as any) instanceof File && (
                <div
                    style={{
                        position: 'relative',
                        width: 280,
                        height: 200,
                        backgroundImage: `url(${URL.createObjectURL(formik?.values?.background as unknown as File)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: `${Number(formik?.values['textleft']) / 10}px`,
                            top: `${Number(formik?.values['texttop']) / 10}px`,
                            transform: 'translate(-50%, -50%)',

                            border: '1px solid #fbbf24',

                            width: `${Number(formik?.values['textwidth']) / 10}px`,
                            height: `${Number(formik?.values['textheight']) / 10}px`,

                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            lineHeight: `${Number(formik?.values['textheight']) / 10}px`,
                            color: formik?.values['textcolor'],
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        text here
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            left: `${Number(formik?.values['artleft']) / 10}px`,
                            top: `${Number(formik?.values['arttop']) / 10}px`,
                            transform: 'translate(-50%, -50%)',

                            border: '1px solid #ccc',

                            width: `${Number(formik?.values['artsize']) / 10}px`,
                            height: `${Number(formik?.values['artsize']) / 10}px`,

                            rotate: `${formik?.values['artrotate']}deg`,

                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        image here
                    </div>
                </div>
            )}
        </Box>
    );
};

const socket = io(WS_SERVER_URL);

export default function TemplatesPages() {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.auth._id);
    const [values, setValues] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        socket.emit('login', {
            id: userId,
            token: TOKEN_ADMINS,
        });
    }, [userId]);

    useEffect(() => {
        if (!values) return;

        // remove previous listeners
        socket.off('preSignedURL');

        // add new listener
        socket.on('preSignedURL', (data) => {
            const { preSignedURL } = data;

            const file = values.background as unknown as File;
            const url = preSignedURL;

            new Promise((resolve, reject) => {
                if (!file) reject('No file provided');

                const xhr = new XMLHttpRequest();

                xhr.open('PUT', url, true);

                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText,
                        });
                    }
                };

                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                };

                xhr.send(file);
            })
                .then(() => {
                    const mimetype = (values.background as unknown as File).type;

                    const extension = mimetype.split('/')[1];

                    fetch(`${BASE_URL_ARTCARDS}/admin/template/json/upload`, {
                        method: 'post',
                        body: JSON.stringify({
                            values: {
                                category: values.category,
                                name: values.name,
                                title: values.title,
                                width: Number(values.width),
                                height: Number(values.height),
                                art: {
                                    left: Number(values.artleft),
                                    top: Number(values.arttop),
                                    size: Number(values.artsize),
                                    rotate: Number(values.artrotate),
                                },
                                text: {
                                    left: Number(values.textleft),
                                    top: Number(values.texttop),
                                    width: Number(values.textwidth),
                                    height: Number(values.textheight),
                                    color: values.textcolor,
                                },
                                background: `${ARTCARDS_TEMPLATES_STORAGE_URL}/${values.name}.${extension}`,
                            },
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(() => {
                        dispatch(
                            toastrActionsCreators.displayToastr({
                                message: 'Template created successfully',
                                type: 'success',
                            })
                        );

                        // reset form
                        setValues(null);
                    });
                })
                .catch(() => {
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            message: 'Failed to upload image',
                            type: 'error',
                        })
                    );
                });
        });
    }, [values]);

    return (
        <Formik
            initialValues={fields.reduce(
                (acc, field) => {
                    acc[field.name] = field.default?.toString() || '';
                    return acc;
                },
                {} as Record<string, string>
            )}
            onSubmit={(payload, { resetForm }) => {
                if (!payload.background) {
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            message: 'Please upload an image',
                            type: 'error',
                        })
                    );
                    return;
                }

                if (!payload.name) {
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            message: 'Please provide a name',
                            type: 'error',
                        })
                    );
                    return;
                }

                setValues(payload);

                const mimetype = (payload.background as unknown as File).type;
                const transactionId = nanoid();
                const metadata = {
                    ['Content-Type']: mimetype,
                };

                fetch(`${BASE_URL_ARTCARDS}/admin/template/image/upload`, {
                    method: 'post',
                    body: JSON.stringify({
                        mimetype,
                        transactionId,
                        metadata,
                        name: payload.name,
                        userId,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => resetForm())
                    .catch(() => {
                        dispatch(
                            toastrActionsCreators.displayToastr({
                                message: 'Failed to request upload image',
                                type: 'error',
                            })
                        );
                    });
            }}
        >
            <Form>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Create Template</Typography>
                    {values && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <CircularProgress size={24} />
                            <Typography variant="h4">Uploading image...</Typography>
                        </Box>
                    )}
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Grid container gap={2}>
                            {fields.map((field) => {
                                if (field.type === 'divider') {
                                    return (
                                        <Grid key={field.id} xs={12}>
                                            <hr />
                                            <Typography variant="h6">{field.label}</Typography>
                                        </Grid>
                                    );
                                }

                                if (field.type === 'text' || field.type === 'number' || field.type === 'color') {
                                    return (
                                        <Grid key={field.id} md={field.size} xs={12} lg={field.size}>
                                            <FieldSimple
                                                key={field.id}
                                                label={field.label}
                                                name={field.name}
                                                type={field.type}
                                            />
                                        </Grid>
                                    );
                                }

                                if (field.type === 'image') {
                                    return (
                                        <Grid key={field.id} md={field.size} xs={12} lg={field.size}>
                                            <FieldImage
                                                key={field.id}
                                                label={field.label}
                                                name={field.name}
                                                type={field.type}
                                            />
                                        </Grid>
                                    );
                                }

                                return null;
                            })}
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={2}>
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Preview />
                    </Grid>
                </Grid>
            </Form>
        </Formik>
    );
}
