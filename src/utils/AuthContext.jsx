import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserOnLoad();
    }, []);

    const getUserOnLoad = async () => {
        try {
            const accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();
        try {
            const response = await account.createEmailPasswordSession(
                credentials.email,
                credentials.password
            );
            console.log("Logged in:", response);
            const accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserLogout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    const handleUserRegister = async (e, credentials) => {
        e.preventDefault();

        if (credentials.password1 !== credentials.password2) {
            alert("Password do not match");
            return;
        }

        try {
            let response = account.create(
                ID.unique(),
                credentials.email,
                credentials.password1,
                credentials.name
            );
            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password1
            );
            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
        handleUserRegister,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
