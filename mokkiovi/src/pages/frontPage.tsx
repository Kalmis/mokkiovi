import React from 'react';

import { useAuth } from '../auth';


export default function FrontPage() {
    const auth = useAuth();
    return (
      <div>
        <h1>
          Hello {auth.user.given_name}
        </h1>
      </div>
    );
  }
  