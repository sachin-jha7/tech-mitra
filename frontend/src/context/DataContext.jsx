import { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL, {
                    credentials: "include"
                });
                const data = await res.json();
                // console.log(data)
                setResult(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ result, setResult, loading, notification, setNotification }}>
            {children}
        </DataContext.Provider>
    )
}