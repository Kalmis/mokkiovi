import React from 'react';

import { useAuth } from '../auth';


export default function HowToPage() {
    const auth = useAuth();
    return (
      <div>
        <h1>
          You are on How-to page, {auth.user.given_name}
        </h1>
      </div>
    );
  }
  