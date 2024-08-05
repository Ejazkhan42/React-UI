import React, { Component } from "react";
import RFB from "@novnc/novnc/lib/rfb"; // Adjust the import path as per your setup
import { CircularProgress } from "@mui/material";

const VNC_URL = process.env.REACT_APP_SELENOID
const VNC_Password = process.env.REACT_APP_SELENOID_PASSWORD

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

        const selenoid = new URL(VNC_URL);
        const protocol = selenoid.protocol
        const port = selenoid.port
        const hostname = selenoid.hostname
        this.disconnect(this.rfb);
        this.rfb = this.createRFB(hostname, port, session, this.isSecure(protocol));
    };

    createRFB(hostname, port, session, secure) {
        const rfb = new RFB(
            this.canvas,
            `${secure ? "wss" : "ws"}://${hostname}:${port}/vnc/${session}`,
            {
                credentials: {
                    password: VNC_Password,
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
        return link === "https:";
    }

    render() {
        const { loading } = this.state;

        return (
            <div
                className="vnc-screen"
                style={{
                    display: "flex",       // Use flex to align children
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    height: "100%", // Ensure full viewport height if needed
                }}
                ref={screen => {
                    this.canvas = screen;
                    VncScreen.resizeVnc(this.rfb);
                }}
            >
                   
                {loading && (
                     <CircularProgress style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position:"absolute"
                    }} color="secondary" size={200} />
                )}
            </div>
        );
    }
}
