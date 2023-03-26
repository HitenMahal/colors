import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../hooks/use-auth-listener';

export default function ProtectedRoute( {children} ) {
    const { user } = UserAuth();
    console.log("Redirect: User=",user ? user.email : "null");
    
    return user ? React.cloneElement(children, {user}) : <Navigate to="/login" />;
}
