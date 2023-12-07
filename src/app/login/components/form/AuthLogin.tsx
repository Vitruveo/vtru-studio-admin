import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Divider,
} from '@mui/material';
import Link from 'next/link';
import { loginType } from '@/app/home/types/auth/auth';
import CustomCheckbox from '@/app/home/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => (
    <>
        {title ? (
            <Typography fontWeight="700" variant="h3" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        <Stack>
            <Box>
                <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                <CustomTextField id="email" variant="outlined" fullWidth />
            </Box>

            <Stack
                justifyContent="space-between"
                direction="row"
                alignItems="center"
                my={2}
            >
                <FormGroup>
                    <FormControlLabel
                        control={<CustomCheckbox defaultChecked />}
                        label="Remember this Device"
                    />
                </FormGroup>
            </Stack>
        </Stack>
        <Box>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/home"
                type="submit"
            >
                Sign In
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthLogin;
