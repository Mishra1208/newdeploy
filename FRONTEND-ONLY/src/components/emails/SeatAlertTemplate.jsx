import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button, Img, Hr, Row, Column } from '@react-email/components';
export default function SeatAlertTemplate({ 
    subject = "COMP", 
    courseNumber = "248", 
    classNumber = "1234", 
    term = "Fall 2026",
    actionUrl = "https://hub.concordia.ca"
}) {
    return (
        <Html>
            <Head />
            <Preview>A seat just opened in {subject} {courseNumber}!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Row>
                            <Column style={{ width: "40px" }}>
                                <Img
                                    src="https://www.conuplanner.com/logo.png"
                                    width="32"
                                    height="32"
                                    alt="ConU Planner Logo"
                                />
                            </Column>
                            <Column>
                                <Text style={logoText}>ConU Planner</Text>
                            </Column>
                        </Row>
                    </Section>
                    
                    <Heading style={heading}>🚨 Seat Alert: {subject} {courseNumber}</Heading>
                    
                    <Text style={paragraph}>
                        Great news! We've been monitoring the waitlists and a seat just opened up for <strong>{subject} {courseNumber}</strong> (Class # {classNumber}) for {term}.
                    </Text>

                    <Text style={paragraph}>
                        Because seats fill up fast, we recommend heading to your Concordia Student Hub immediately to register.
                    </Text>

                    <Section style={btnContainer}>
                        <Button style={button} href={actionUrl}>
                            Go to Student Hub
                        </Button>
                    </Section>

                    <Text style={paragraph}>
                        Thanks,<br />
                        <strong>Team ConUPlanner.com</strong>
                    </Text>

                    <Hr style={hr} />


                    <Text style={footer}>
                        This alert was generated automatically by ConU Planner's Seat Finder automation.
                        <br />
                        Once we notify you that a class has opened, your alert subscription is complete. If the seat is taken before you register, you can set a new alert on ConU Planner.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const headerSection = {
    padding: '24px 0',
    textAlign: 'center',
};

const logoText = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#912338', // ConU Maroon
    letterSpacing: '-0.5px',
    margin: '0',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
};

const btnContainer = {
    textAlign: 'center',
    marginTop: '32px',
    marginBottom: '32px',
};

const button = {
    backgroundColor: '#912338',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 24px',
    fontWeight: 'bold',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};
