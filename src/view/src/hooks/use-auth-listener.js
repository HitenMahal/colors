import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        return signOut(auth);
    }

    useEffect( () => {
        const listener = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
        return () => {
            listener();
        }
    }, [])

    return (
        <UserContext.Provider value={ {user, signIn, signOut} }>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext);
}