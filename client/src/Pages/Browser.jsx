import React, { Component } from "react";
import RFB from "@novnc/novnc/lib/rfb"; // Adjust the import path as per your setup
import { CircularProgress } from "@mui/material";
export default class VncScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // Initial loading state
        };
        this.rfb = null;
    }

    static resizeVnc(rfb) {
        if (rfb) {
            rfb.resizeSession = true;
            rfb.scaleViewport = true;
        }
    }

    static defaultPort(protocol) {
        return protocol === "https:" ? "443" : "8090";
    }

    connection(status) {
        this.props.onUpdateState(status);
    }

    onVNCDisconnect = () => {
        this.connection("disconnected");
    };

    onVNCConnect = () => {
        this.connection("connected");
        this.setState({ loading: false }); // Set loading to false when connected
    };

    componentDidMount() {
        const { session } = this.props;
        if (session) {
            this.setState({ loading: true }); // Start loading indicator
            this.connectRFB(session);
        }
    }

    componentDidUpdate(prevProps) {
        const { session } = this.props;
        if (session && session !== prevProps.session) {
            this.disconnect(this.rfb);
            this.setState({ loading: true }); // Start loading indicator
            this.connectRFB(session);
        }
    }

    componentWillUnmount() {
        this.disconnect(this.rfb);
    }

    connectRFB = (session) => {
       
        const hostname="gridview.doingerp.com";
        const link = `http://${hostname}`;
        const port = VncScreen.defaultPort(new URL(link).protocol);
        this.disconnect(this.rfb); // Disconnect any existing connection
        this.rfb = this.createRFB(hostname, port, session, this.isSecure(link));
    };

    createRFB(hostname, port, session, secure) {
        const rfb = new RFB(
            this.canvas,
            `${secure ? "wss" : "ws"}://${hostname}:${port}/vnc/${session}`,
            {
                credentials: {
                    password: "selenoid",
                },
            }
        );

        rfb.addEventListener("connect", this.onVNCConnect);
        rfb.addEventListener("disconnect", this.onVNCDisconnect);

        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        rfb.viewOnly = true;

        return rfb;
    }

    disconnect(rfb) {
        if (rfb && rfb._rfb_connection_state && rfb._rfb_connection_state !== "disconnected") {
            rfb.disconnect();
        }
    }

    isSecure(link) {
        return new URL(link).protocol === "https:";
    }

    render() {
        const { loading } = this.state;

        return (
            <div
                className="vnc-screen"
                style={{
                    display: "contents",
                }}
                ref={screen => {
                    this.canvas = screen;
                    VncScreen.resizeVnc(this.rfb);
                }}
            >
                {loading && (
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                    >
                        <CircularProgress color="secondary" size={100}/>
                    </div>
                )}
            </div>
        );
    }
}