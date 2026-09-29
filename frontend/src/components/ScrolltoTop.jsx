import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";


export default function ScrollToTop() {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        if (navigationType === "PUSH") {
            window.scrollTo(0, 0);
            
        }
        if (navigationType === "POP" && pathname === "/") {
            const savedPosition = sessionStorage.getItem(
                "homeScrollPosition"
            );

            if (savedPosition !== null) {
                window.scrollTo(
                    0,
                    Number(savedPosition)
                );
            }
        }
    }, [pathname, navigationType]);

    return null;
}