import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { fetchProxyServers, ProxyServer, ProxyServerState, startServer, stopServer } from "./proxyServerSlice";

import { useProxySocketServerConnection } from "./proxySocketConnectionProvider";

interface ProxyServerItemProps {
    proxyServer: ProxyServer;
    onStart: (port: number) => void;
    onStop: (port: number) => void;
}

const ProxyServerItem = ({ proxyServer, onStart, onStop }: ProxyServerItemProps) => {
    switch (proxyServer.state) {
        case 'idle':
            return (
                <button className="btn btn-success" onClick={() => onStart(proxyServer.port)}>Start Proxy Server</button>
            );
        case "running":
            return (
                <button className="btn btn-danger" onClick={() => onStop(proxyServer.port)}>Stop Proxy Server</button>
            );
        case "starting":
            return (
                <button className="btn btn-warning" disabled>Starting server . . . </button>
            );
        case "stopping":
            return (
                <button className="btn btn-warning" disabled>Stopping server . . . </button>
            );
    }
};

export const ProxyServers = () => {
    const { proxyServers } = useSelector<ApplicationState, ProxyServerState>(state => state.proxyServer);
    const dispatch = useDispatch();
    const { proxySocketServerConnection } = useProxySocketServerConnection();

    useEffect(() => {
        dispatch(fetchProxyServers());
    });

    const handleStartServer = (port: number) => {
        dispatch(startServer(port, proxySocketServerConnection));
    };

    const handleStopServer = (port: number) => {
        dispatch(stopServer(port, proxySocketServerConnection));
    }

    return (
        <>
            <div className="list-group">
                {proxyServers.map(proxyServer =>
                    <div className="list-group-item" key={proxyServer.id}>
                        <div className="row">
                            <div className="col">
                                <p>{proxyServer.port}</p>
                            </div>
                            <div className="col">
                                <ProxyServerItem onStart={handleStartServer} onStop={handleStopServer} proxyServer={proxyServer} />
                            </div>
                        </div>
                    </div>)}
            </div>
        </>
    );
};