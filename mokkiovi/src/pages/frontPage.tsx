import React from 'react';

import { Container } from '@mui/material';
import { useAuth } from '../auth';


export default function FrontPage() {
    const auth = useAuth();
    return (
      <Container>
        <h1>
          Hello {auth.user.given_name}
        </h1>
      </Container>
    );
  }
  