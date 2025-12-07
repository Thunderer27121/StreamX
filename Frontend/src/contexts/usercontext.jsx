// src/contexts/usercontext.jsx
import { googleLogout } from "@react-oauth/google";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext();

const STORAGE_KEYS = {
  SAVED: "savedAccounts",
  CURRENT: "currentAccountId",
};

const getAccountId = (u) =>
  u?.googleId || u?.sub || u?.id || u?._id;

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);         
  const [savedAccounts, setSavedAccounts] = useState([]); 

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED) || "[]");
    let currentId = localStorage.getItem(STORAGE_KEYS.CURRENT);

    setSavedAccounts(stored);

    if (stored.length > 0) {
      const current =
        stored.find((acc) => getAccountId(acc) === currentId) || stored[0];

      if (current) {
        setUser(current);
        localStorage.setItem(STORAGE_KEYS.CURRENT, getAccountId(current));
      }
    } else {
      setUser(null);
    }

    localStorage.removeItem("user");
  }, []);

  const loginUser = (rawUser) => {
    if (!rawUser) return;

    const id =
      rawUser.googleId || rawUser.sub || rawUser.id || rawUser._id;

    const normalized = {
      ...rawUser,
      googleId: id, 
    };

    setSavedAccounts((prev) => {
      const filtered = prev.filter(
        (acc) => getAccountId(acc) !== id
      );
      const updated = [normalized, ...filtered];

      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.CURRENT, id);

      return updated;
    });

    setUser(normalized);
  };

  const switchAccount = (accountId) => {
    setSavedAccounts((prev) => {
      const target = prev.find(
        (acc) => getAccountId(acc) === accountId
      );
      if (!target) return prev;

      setUser(target);
      localStorage.setItem(
        STORAGE_KEYS.CURRENT,
        getAccountId(target)
      );
      return prev;
    });
  };

  const logout = () => {
    googleLogout(); 
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT);
  };

  const logoutAll = () => {
    googleLogout();
    setUser(null);
    setSavedAccounts([]);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.CURRENT);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        savedAccounts,
        loginUser,
        switchAccount,
        logout,
        logoutAll,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
