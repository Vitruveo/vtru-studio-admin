import { TableContainer, Table, TableRow, TableCell, TableBody, Typography, TableHead, Switch } from '@mui/material';
import BlankCard from '@/app/home/components/shared/BlankCard';
import { RoleType } from '@/mock/roles';

interface Props {
    roles: RoleType[];
    activeRoles: string[];
    handleChangeRole(roleId: string): void;
}

export default function UserRolesTable({ roles, activeRoles, handleChangeRole }: Props) {
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
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography display="flex" justifyContent="center" variant="h6">
                                    Count Permissions
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
                        {roles.map((role) => {
                            return (
                                <TableRow key={role._id}>
                                    <TableCell>
                                        <Typography
                                            display="flex"
                                            justifyContent="center"
                                            color="textSecondary"
                                            variant="h6"
                                            fontWeight={400}
                                        >
                                            {role.name}
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
                                            {role.permissions.length}
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
                                                checked={activeRoles?.includes(role._id)}
                                                onChange={() => handleChangeRole(role._id)}
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
