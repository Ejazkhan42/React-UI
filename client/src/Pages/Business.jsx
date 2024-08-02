import React from "react";
import { Container, Typography, Box } from "@mui/material";
const BU_URL=process.env.REACT_APP_BU_URL
export default function Business() {
    return (
        <Container maxWidth="md" style={{ display: "flex", justifyContent: "center", alignItems: "center" , marginLeft:"26%" }}>
            <Box>
                <iframe 
                    title="Business App"
                    width="1300" 
                    height="700" 
                    frameBorder="0" 
                    allow="clipboard-write;camera;geolocation;fullscreen" 
                    src='https://ejaz.budibase.app/embed/doingerp'
                ></iframe>
            </Box>
        </Container>
    );
}
