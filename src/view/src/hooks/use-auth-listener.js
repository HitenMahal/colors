import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/firebase-config";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { createUserProfile, uploadUserPicture } from '../services/firebase';

const UserContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [userAuth, setUser] = useState(null);

    const signIn = (email, password) => {
        console.log("REAL AUTH CONFIG", auth);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        return signOut(auth);
    }

    const register = (username, password, email, image) => {
        createUserWithEmailAndPassword(auth, email, password).then( (newUser) => {
            console.log("REGISTER NEWUSER=", newUser);
            createUserProfile(newUser.user.uid, username, email);
            uploadUserPicture(auth, image);
            return newUser;    
        } );
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
        <UserContext.Provider value={ {userAuth, signIn, logOut, register} }>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext);
}