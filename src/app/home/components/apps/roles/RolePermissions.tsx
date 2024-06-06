import { TableContainer, Table, TableRow, TableCell, TableBody, Typography, TableHead, Switch } from '@mui/material';
import BlankCard from '@/app/home/components/shared/BlankCard';

const permissions = [
    'asset:admin',
    'asset:reader',
    'creator:admin',
    'creator:reader',
    'role:admin',
    'role:reader',
    'user:admin',
    'user:reader',
    'allow-list:admin',
    'allow-list:reader',
    'waiting-list:admin',
    'waiting-list:reader',
    'moderator:admin',
    'moderator:reader',
];

interface Props {
    activePermissions: string[];
    handleChangePermission(permissionKey: string): void;
}

export default function RolePermissionsTable({ activePermissions, handleChangePermission }: Props) {
    return (
        <BlankCard>
            <TableContainer>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography display="flex" justifyContent="center" variant="h6">
                                    Category
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography display="flex" justifyContent="center" variant="h6">
                                    Permission
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography display="flex" justifyContent="center" variant="h6">
                                    Status
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map((permission) => {
                            const [category, name] = permission.split(':');

                            return (
                                <TableRow key={permission}>
                                    <TableCell>
                                        <Typography
                                            display="flex"
                                            justifyContent="center"
                                            color="textSecondary"
                                            variant="h6"
                                            fontWeight={400}
                                        >
                                            {category}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            display="flex"
                                            justifyContent="center"
                                            color="textSecondary"
                                            variant="h6"
                                            fontWeight={400}
                                        >
                                            {name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            display="flex"
                                            justifyContent="center"
                                            color="textSecondary"
                                            variant="h6"
                                            fontWeight={400}
                                        >
                                            <Switch
                                                checked={activePermissions.includes(permission)}
                                                onChange={() => handleChangePermission(permission)}
                                            />
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </BlankCard>
    );
}
