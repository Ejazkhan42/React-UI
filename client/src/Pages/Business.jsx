import React from "react";
import { Container, Box } from "@mui/material";
import { useLocation  } from "react-router-dom";
const BU_URL=process.env.REACT_APP_BU_URL
export default function Business() {
    const location = useLocation();
    const path = location.pathname.replace('/business', ''); 
    console.log(path)
    const SRC_URL=BU_URL+"#"+path
    console.log(SRC_URL)
    return (
        <Container maxWidth="md" style={{ display: "flex", justifyContent: "center", alignItems: "center" , marginLeft:"26%" }}>
            <Box>
                <iframe 
                    title="Business App"
                    width="1300" 
                    height="700" 
                    frameBorder="0" 
                    allow="clipboard-write;camera;geolocation;fullscreen" 
                    src={SRC_URL}
                ></iframe>
            </Box>
        </Container>
    );
}
