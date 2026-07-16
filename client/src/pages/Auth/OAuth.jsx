import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from './firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider)

            // console.log(result); // show in browser console
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //   body: JSON.stringify(result),
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            // console.log(data); // show in browser console
            dispatch(signInSuccess(data));
            navigate('/'); // navigate to the home page
        } catch (error) {
            console.log('Could not sign in with google', error);
        }
    };
    return (
        // this button is inside the form, so i have to change their type to button not submit by default
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg
    uppercase hover:opacity-95 disabled:opacity-80
    transition duration-300'>continue with google</button>
    )
}

export default OAuth;