import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../hooks/use-auth-listener';

export default function ProtectedRoute( {children} ) {
    const { userAuth } = UserAuth();
    console.log("Redirect: User=",userAuth ? userAuth.email : "null");
    
    return userAuth ? React.cloneElement(children) : <Navigate to="/login" />;
}
