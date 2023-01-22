import React from 'react';

import { Container } from '@mui/material';
import { useAuth } from '../auth';
import  MainAppBar  from '../components/appBar';


export default function FrontPage() {
    const auth = useAuth();
    return (
      <Container>
        <MainAppBar/>
        <h1>
          Hello {auth.user.given_name}
        </h1>
      </Container>
    );
  }
  