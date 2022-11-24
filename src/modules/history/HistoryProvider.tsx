import React, {Context, ReactNode} from "react";

export const HistoryContext: Context<any> = React.createContext({});

interface HistoryProviderProps {
    children: ReactNode;
}
export function HistoryProvider(props: HistoryProviderProps) {
    const {
        children
    } = props;

    return(
        <HistoryContext.Provider value={{}}>
            {children}
        </HistoryContext.Provider>
    );
}
