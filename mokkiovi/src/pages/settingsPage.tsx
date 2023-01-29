// Tables based on https://mui.com/material-ui/react-table/

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CancelablePromise, User, Users } from '../openapi';
import MokkioviService from '../openapi/Mokkiovi';

function Row(props: { row: User }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.email}
        </TableCell>
        <TableCell align="right">{row.given_name}</TableCell>
        <TableCell align="right">{row.family_name}</TableCell>
        <TableCell align="right">{row.id}</TableCell>
        <TableCell align="right">{row.picture_url}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Valid from</TableCell>
                    <TableCell align="right">Valid until</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.roles.map((roleRow) => (
                    <TableRow key={roleRow.role}>
                      <TableCell component="th" scope="row">
                        {roleRow.role}
                      </TableCell>
                      <TableCell>{roleRow.valid_from}</TableCell>
                      <TableCell align="right">{roleRow.valid_until}</TableCell>
    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function SettingsPage() {
    const [users, setUsers] = useState<Users>([])

    useEffect(() => {
      async function getUsers(): CancelablePromise<Users> {
        const usersTemp = await MokkioviService.default.getUsersUsersGet()
        setUsers(usersTemp)
        
        return usersTemp
      }
      const axiosRequest = getUsers()
      return (): void => {
        axiosRequest.cancel  // eslint-disable-line
      }
    }, [])

    console.log(users)
    return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Email</TableCell>
                <TableCell align="right">First name</TableCell>
                <TableCell align="right">Family name</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">Picture URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <Row key={user.id} row={user} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
  