import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../store";
import { ProxySocketConnection } from "./proxySocketConnection";

export interface ProxyServer {
    id: number;
    port: number;

    // additional parameters
    state: 'running' | 'starting' | 'idle' | 'stopping';
}

export interface ProxyServerState {
    proxyServers: ProxyServer[];
    isLoading: boolean;

    runningServersPorts: number[];
    receivingRunningServersPorts: boolean;
}

const initialState: ProxyServerState = {
    proxyServers: [],
    isLoading: false,

    runningServersPorts: [],
    receivingRunningServersPorts: false,
};

interface ReceiveProxyServerAction {
    proxyServers: ProxyServer[];
}

interface ReceiveRunningProxyServersPortsAction {
    runningProxyServersPorts: number[];
}

export const proxyServerSlice = createSlice({
    name: 'proxyServer',
    initialState,
    reducers: {
        requestProxyServers(state: ProxyServerState) {
            state.isLoading = true;
        },
        receiveProxyServers(state: ProxyServerState, action: PayloadAction<ReceiveProxyServerAction>) {
            action.payload.proxyServers.forEach(ps => ps.state = 'idle');
            state.proxyServers = action.payload.proxyServers;
            state.isLoading = false;
        },
        requestRunningProxyServersPorts(state: ProxyServerState) {
            state.receivingRunningServersPorts = true;
        },
        receiveRunningProxyServersPorts(state: ProxyServerState, action: PayloadAction<ReceiveRunningProxyServersPortsAction>) {
            state.runningServersPorts = action.payload.runningProxyServersPorts;
            state.receivingRunningServersPorts = false;
        },
        updateRunningServersStatus(state: ProxyServerState) {
            state.proxyServers.forEach(proxyServer => {
                if (state.runningServersPorts.includes(proxyServer.port)) {
                    proxyServer.state = 'running';
                }
            })
        },
        requestStartServer(state: ProxyServerState, action: PayloadAction<number>) {
            const port: number = action.payload;
            let proxyServer = state.proxyServers.find(ps => ps.port === port)!;
            proxyServer.state = 'starting';
        },

        serverStarted(state, action: PayloadAction<number>) {
            const port: number = action.payload;
            let proxyServer = state.proxyServers.find(ps => ps.port === port)!;
            proxyServer.state = 'running';
            state.runningServersPorts.push(port);
        },

        requestStopServer(state: ProxyServerState, action: PayloadAction<number>) {
            const port: number = action.payload;
            let proxyServer = state.proxyServers.find(ps => ps.port === port)!;
            proxyServer.state = 'stopping';
        },

        serverStopped(state, action: PayloadAction<number>) {
            const port: number = action.payload;
            let proxyServer = state.proxyServers.find(ps => ps.port === port)!;
            proxyServer.state = 'idle';
            state.runningServersPorts.push(port);
        }
    }
});

export const {
    receiveProxyServers,
    requestProxyServers,
    receiveRunningProxyServersPorts,
    requestRunningProxyServersPorts,
    updateRunningServersStatus,
    serverStarted,
    requestStartServer,
    requestStopServer,
    serverStopped
} = proxyServerSlice.actions;

export const fetchRunningProxyServersPorts = (): AppThunk => async (dispatch, getState) => {
    const { proxyServer } = getState();

    // fetch only if not loaded
    if (!proxyServer.receivingRunningServersPorts) {
        dispatch(requestRunningProxyServersPorts());

        return fetch('api/proxyServer/getRunningProxyServers')
            .then(response => {
                return response.json()
            })
            .then(data => {
                return dispatch(receiveRunningProxyServersPorts({ runningProxyServersPorts: data }));
            })
            .then(() => {
                return dispatch(updateRunningServersStatus());
            });
    }
};

export const fetchProxyServers = (): AppThunk => async (dispatch, getState) => {
    const { proxyServer } = getState();

    // fetch only if not loaded
    if (!proxyServer.isLoading && proxyServer.proxyServers.length === 0) {
        dispatch(requestProxyServers());

        return fetch('api/proxyServer/getProxyServers')
            .then(response => {
                return response.json()
            })
            .then(data => {
                return dispatch(receiveProxyServers({ proxyServers: data }));
            })
            .then(() => {
                return dispatch(fetchRunningProxyServersPorts());
            });
    }
};

export const startServer = (port: number, connection: ProxySocketConnection): AppThunk => async (dispatch, getState) => {
    dispatch(requestStartServer(port));
    return connection.startProxyServer(port);
};

export const stopServer = (port: number, connection: ProxySocketConnection): AppThunk => async (dispatch, getState) => {
    dispatch(requestStopServer(port));
    return connection.stopProxyServer(port);
};