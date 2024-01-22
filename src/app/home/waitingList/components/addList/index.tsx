import React, { Fragment, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Papa from 'papaparse';
import xml2js from 'xml2js';

import { useDispatch } from '@/store/hooks';

interface Props {
    handleAddNewEmails(params: { emails: string[] }): void;
}

export default function AddList({ handleAddNewEmails }: Props) {
    const fileInput = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const [modal, setModal] = React.useState(false);

    const { handleSubmit, handleChange, resetForm, setFieldValue, values, errors } = useFormik({
        initialValues: {
            email: '',
            emails: [],
        },
        onSubmit: async (payload) => {
            const newEmails = values.email.length ? [values.email, ...values.emails] : values.emails;
            handleAddNewEmails({
                emails: newEmails,
            });
            toggle();
            resetForm();
        },
    });

    const toggle = () => {
        setModal(!modal);
    };

    const handleButtonClick = () => {
        // trigger the click event of the hidden file input
        if (fileInput.current) {
            fileInput.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!e.target) return;
            const text = e.target.result as string;
            let emails = [];

            if (file.name.endsWith('.csv')) {
                const results = Papa.parse(text, { header: true });

                emails = results.data.map((row: any) => row.email);
            } else if (file.name.endsWith('.xml')) {
                const parser = new xml2js.Parser();
                const result = await parser.parseStringPromise(text);
                // Ajuste o caminho para o campo de email de acordo com a estrutura do seu XML
                emails = result.root.user.map((user: any) => user.email[0]);
            }

            setFieldValue('emails', emails);
            event.target.value = '';
        };

        reader.readAsText(file);
    };

    return (
        <>
            <Box p={3} pb={1}>
                <Button color="primary" variant="contained" fullWidth onClick={toggle}>
                    Add new emails
                </Button>
            </Box>
            <Dialog
                open={modal}
                onClose={toggle}
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant="h5">
                    Add new emails
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Import CSV or add manually</DialogContentText>
                    <Box mt={3}>
                        <form onSubmit={handleSubmit}>
                            <Grid spacing={3} container>
                                <Grid item xs={12} lg={9}>
                                    <Box
                                        width={'100%'}
                                        display={values.emails.length ? '' : 'none'}
                                        marginBottom={2}
                                        maxHeight={150}
                                        overflow="auto"
                                    >
                                        {values.emails.map((email, key) => (
                                            <Box key={key}>{email}</Box>
                                        ))}
                                    </Box>
                                    <Box width="100%" gap={1} display="flex" justifyContent="flex-start">
                                        <input
                                            type="file"
                                            accept=".csv, .xml"
                                            style={{ display: 'none' }}
                                            ref={fileInput}
                                            onChange={handleFileChange}
                                        />
                                        {values.emails.length ? (
                                            <Button
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                onClick={() => setFieldValue('emails', [])}
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Fragment />
                                        )}

                                        <Button
                                            size="small"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={handleButtonClick}
                                        >
                                            Import
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid marginTop={1} spacing={3} container>
                                <Grid item xs={12} lg={9}>
                                    <FormLabel>Email</FormLabel>
                                    <Box>
                                        <TextField
                                            id="email"
                                            placeholder="Enter email address"
                                            name="email"
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            value={values.email}
                                            onChange={handleChange}
                                        />
                                        {errors?.email && <span>{errors.email}</span>}
                                    </Box>
                                </Grid>

                                <Box
                                    width="100%"
                                    marginTop={1}
                                    paddingY={3}
                                    gap={1}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button variant="outlined" color="error" onClick={toggle}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit">
                                        Save
                                    </Button>
                                </Box>
                            </Grid>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
