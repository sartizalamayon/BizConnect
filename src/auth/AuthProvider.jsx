import { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile , signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
import PropTypes from "prop-types";
import auth from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";


export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    const [editing, setEditing] = useState(false)
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unSubscribe();
        }
      },[user, axiosPublic])

      const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
      };

      const logInWithEmailPass = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
      };

    const profileUpdate = (obj) => {
        return updateProfile(auth.currentUser, obj)
      };

    const logOut = () => {
        setUser(null);
        signOut(auth)
      };


return (
    <AuthContext.Provider
      value={{ 
        user,
        loading,
        setLoading,
        createUser, 
        logInWithEmailPass,
        logOut,
        profileUpdate,
        editing,
        setEditing
        }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
export default AuthProvider;