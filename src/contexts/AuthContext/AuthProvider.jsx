import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import auth from "../../firebase/firebase.init"
import { AuthContext } from "./AuthContext"
import { useEffect, useState } from "react"

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // create new user
    const createUser = (email, password) =>{
        setLoading(true)
       return  createUserWithEmailAndPassword(auth, email, password)
    }

    // signin user
    const signIn =(eamil,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, eamil,password)
    }

    // signIn with google 
    const signInWithGoogle = () =>{
        setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }


    // signOut user 
    const logOut = () =>{
        setLoading(true)
        return signOut(auth);
    }


    // chacke user 
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser)
            // console.log('user in the auth stat', currentUser)
            setLoading(false)
        })

        return () => unSubscribe
    },[])



    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut
    }

  return (
   <AuthContext value={authInfo}>
        {children}
   </AuthContext>
  )
}

export default AuthProvider
