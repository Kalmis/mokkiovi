import React from 'react';

import { useAuth } from '../auth';


export default function SettingsPage() {
    const auth = useAuth();
    return (
      <div>
        <h1>
          You are on settings page, {auth.user.given_name}
        </h1>
      </div>
    );
  }
  