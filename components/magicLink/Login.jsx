'use client';

import SignInButton from './SignInButton';
import AccountButtonLogin from './AccountButtonLogin';
import { useSession } from "next-auth/react";

const Login = ({ redirectUrl }) => {
  const { data: session, status } = useSession();
  return (

    <div>
      {session?.user ? <AccountButtonLogin /> : <SignInButton redirectUrl={redirectUrl} />}
    </div>

  );
};

export default Login;



