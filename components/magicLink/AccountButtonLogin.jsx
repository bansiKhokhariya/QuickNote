'use client';
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useSession, signOut } from "next-auth/react";

const AccountButtonLogin = () => {

    const { data: session, status } = useSession();

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    const getFirstLetterFromEmail = (email) => {
        if (!email || typeof email !== 'string') return '';
        const shortName = email.split('@')[0];
        return shortName.charAt(0).toUpperCase();
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" size="icon"> {getFirstLetterFromEmail(session?.user?.email) || 'Account'}</Button>
            </PopoverTrigger>
            <PopoverContent>
                <Button variant='destructive' size='sm' onClick={handleSignOut}>Logout</Button>
            </PopoverContent>
        </Popover>
    );
};

export default AccountButtonLogin;