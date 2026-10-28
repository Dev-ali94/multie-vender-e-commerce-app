import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("storeifly_token"));
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshMe = async () => {
        const savedToken = localStorage.getItem("storeifly_token");
        const savedUser = localStorage.getItem("storeifly_user");
        const savedStore = localStorage.getItem("storeifly_store");

        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                if (savedStore) setStore(JSON.parse(savedStore));
            } catch {
                setUser(null);
                setStore(null);
            }
        } else {
            setUser(null);
            setStore(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshMe();
    }, []);

    const login = (newToken, newUser, newStore) => {
        localStorage.setItem("storeifly_token", newToken);
        localStorage.setItem("storeifly_user", JSON.stringify(newUser));
        if (newStore !== undefined && newStore !== null) {
            localStorage.setItem("storeifly_store", JSON.stringify(newStore));
        } else {
            localStorage.removeItem("storeifly_store");
        }
        setToken(newToken);
        setUser(newUser);
        if (newStore !== undefined) {
            setStore(newStore);
        }
    };

    const logout = () => {
        localStorage.removeItem("storeifly_token");
        localStorage.removeItem("storeifly_user");
        localStorage.removeItem("storeifly_store");
        setToken(null);
        setUser(null);
        setStore(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, store, loading, login, logout, refreshMe, setStore }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = ()=> {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
