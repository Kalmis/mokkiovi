import React from 'react';

import { useAuth } from '../auth';


export default function FeedPage() {
    const auth = useAuth();
    return (
      <div>
        <h1>
          You are on Feed page, {auth.user.given_name}
        </h1>
      </div>
    );
  }
  