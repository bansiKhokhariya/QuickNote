'use client';

import SignInButton from './SignInButton';
import AccountButtonLogin from './AccountButtonLogin';
import { useSession } from "next-auth/react";

const Login = () => {
  const { data: session, status } = useSession();
  return (

    <div>
      {session?.user ? <AccountButtonLogin /> : <SignInButton />}
    </div>

  );
};

export default Login;



