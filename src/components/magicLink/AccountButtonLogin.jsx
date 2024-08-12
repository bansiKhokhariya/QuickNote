'use client';
import { useContext } from 'react';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const AccountButtonLogin = () => {
    const [user, setUser] = useContext(UserContext);

    const handleLogout = async () => {
        await magic.user.logout();
        setUser(null);
    };

    const getFirstLetterFromEmail = (email) => {
        if (!email || typeof email !== 'string') return '';
        const shortName = email.split('@')[0];
        return shortName.charAt(0).toUpperCase();
    };

    return (
        <Popover>
            <PopoverTrigger><Button>{getFirstLetterFromEmail(user.email) || 'Account'}</Button></PopoverTrigger>
            <PopoverContent>
                <Button variant='destructive' size='sm' onClick={handleLogout}>Logout</Button>
            </PopoverContent>
        </Popover>
    );
};

export default AccountButtonLogin;