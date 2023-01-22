import React from 'react';

import { Container } from '@mui/material';
import { useAuth } from '../auth';
import  MainAppBar  from '../components/appBar';


export default function FeedPage() {
    const auth = useAuth();
    return (
      <Container>
        <MainAppBar/>
        <h1>
          You are on Feed page, {auth.user.given_name}
        </h1>
      </Container>
    );
  }
  