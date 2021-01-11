import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ProxySocketConnection } from "./proxySocketConnection";

type ProxySocketConnectionContextType = {
    connection: ProxySocketConnection | null
}

const ProxySocketConnectionContext = createContext<ProxySocketConnectionContextType>({
    connection: null
});

const logsEnabled = true;

const logInfo = (message: string) => {
    if (logsEnabled) {
        console.log(`%c ProxySocketConnectionProvider: ${message}`, 'background: #222; color: #bada55');
    }
}

export const ProxySocketConnectionProvider = ({ children }: { children: React.ReactNode }) => {

    logInfo('Initializing provider component');

    // dispatch required for ProxySocketConnection class
    const dispatch = useDispatch();

    // keep connection state and show children components only if connection initialized
    const [isConnected, setIsConnected] = useState(false);

    // default context value
    // use 'useMemo()' to have access in cleanup code. Otherwise 'contextValue' aways null at the beggining
    const contextValue: ProxySocketConnectionContextType = useMemo(() => {
        return { connection: null }
    }, []);

    useEffect(() => {

        if (!isConnected && contextValue.connection === null) {
            logInfo('Creating socket connection and connecting . . . ');
            contextValue.connection = new ProxySocketConnection(dispatch);
            contextValue.connection.init().then(() => {
                setIsConnected(true);
                logInfo('Proxy Socket connection connected.')
            });
        }

        return () => {
            if (isConnected && contextValue.connection) {
                logInfo('Disposing provider component and closing connection . . . ');
                contextValue.connection.closeConnection().then(() => {
                    logInfo('Component disposed and connection is closed');
                });
            }
        };

    }, [dispatch, isConnected, contextValue.connection]);

    return (
        <>
            <ProxySocketConnectionContext.Provider value={contextValue}>
                {isConnected ? children : 'Connecting to Proxy Socket Server . . . '}
            </ProxySocketConnectionContext.Provider>
        </>
    );
};

export const useProxySocketServerConnection = () => {
    const { connection } = useContext(ProxySocketConnectionContext);
    return {
        proxySocketServerConnection: connection!
    };
}