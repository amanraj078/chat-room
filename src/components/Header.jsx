import React from "react";
import { useAuth } from "../utils/AuthContext";
import { LogOut } from "react-feather";

const Header = () => {
    const { user, handleUserLogout } = useAuth();
    return (
        <div id="header--wrapper">
            {user ? (
                <>
                    Welcome {user.name}
                    <LogOut
                        onClick={handleUserLogout}
                        className="header--link"
                    />
                </>
            ) : (
                <button>LOGIN</button>
            )}
        </div>
    );
};

export default Header;
