'use client';

import { useState, useEffect } from 'react';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import SignInButton from './SignInButton';
import AccountButtonLogin from './AccountButtonLogin';

const Login = ({  redirectUrl }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        magic.user.isLoggedIn().then((isLoggedIn) => {
            if (isLoggedIn) {
                magic.user.getInfo().then(setUser);
            }
        });
    }, []);

    return (
        <UserContext.Provider value={[user, setUser]}>
            <div>
                {user ? <AccountButtonLogin /> : <SignInButton redirectUrl={redirectUrl} />}
            </div>
        </UserContext.Provider>
    );
};

export default Login;

