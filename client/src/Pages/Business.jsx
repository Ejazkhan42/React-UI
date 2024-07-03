import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function Business() {
    return (
        <Container maxWidth="md" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box>
                <iframe 
                    title="Business App"
                    width="1500" 
                    height="700" 
                    frameBorder="0" 
                    allow="clipboard-write;camera;geolocation;fullscreen" 
                    src="https://ejaz.budibase.app/embed/doingerp"
                ></iframe>
            </Box>
        </Container>
    );
}
