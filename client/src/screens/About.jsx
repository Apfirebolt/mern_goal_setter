import { Container, Typography, Box } from '@mui/material';

const About = () => {
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="body1" component="p">
                    Welcome to our application. This is a MERN stack project aimed at helping you set and achieve your goals.
                </Typography>
            </Box>
        </Container>
    );
};

export default About;