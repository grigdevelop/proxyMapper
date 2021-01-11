import { useDispatch } from "react-redux";
import * as signalr from '@microsoft/signalr';
import { serverStarted, serverStopped } from './proxyServerSlice';

export class ProxySocketConnection {

    private readonly connection: signalr.HubConnection;

    constructor(private readonly dispatch: ReturnType<typeof useDispatch>) {
        this.connection = new signalr.HubConnectionBuilder().withUrl('proxyServerHub').build();
    }

    async init(): Promise<void> {
        await this.connection.start();

        // init handlers
        this.connection.on('PROXY_SERVER_STARTED', (port: number) => this.onServerStarted(port));
        this.connection.on('PROXY_SERVER_STOPPED', (port: number) => this.onServerStopped(port));
    }

    async closeConnection(): Promise<void> {
        await this.connection.stop();
    }

    async startProxyServer(port: number): Promise<void> {
        await this.connection.send('startServer', port);
    }

    async stopProxyServer(port: number): Promise<void> {
        await this.connection.send('stopServer', port);
    }

    // receivers
    private onServerStarted(port: number): void {
        this.dispatch(serverStarted(port));
    }

    private onServerStopped(port: number): void {
        this.dispatch(serverStopped(port));
    }
}