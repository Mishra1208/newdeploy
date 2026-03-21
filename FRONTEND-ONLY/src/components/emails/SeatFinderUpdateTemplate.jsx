import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button, Img, Hr, Row, Column } from '@react-email/components';
import React from 'react';

export default function SeatFinderUpdateTemplate() {
    return (
        <Html>
            <Head />
            <Preview>Huge Seat Finder update: Waitlist tracking is here!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Img
                            src="https://www.conuplanner.com/logo.png"
                            width="180"
                            alt="ConU Planner Logo"
                            style={{ display: "block", margin: "0 auto" }}
                        />
                    </Section>
                    
                    <Heading style={heading}>🚀 Smarter Seat Alerts are Live!</Heading>
                    
                    <Text style={paragraph}>
                        Hey there! We noticed you recently subscribed to a Seat Alert on <strong>ConU Planner</strong>. 
                        We wanted to quickly reach out and let you know that we just shipped a massive, highly-requested update to the Seat Finder engine.
                    </Text>

                    <Text style={paragraph}>
                        Our system is now powered by an advanced state-tracking algorithm. Here is what this means for you:
                    </Text>

                    <ul style={listStyle}>
                        <li style={listItem}><strong>Closed ➔ Waitlist:</strong> If you are monitoring a closed class, you'll instantly get an email the second a waitlist spot opens up.</li>
                        <li style={listItem}><strong>Waitlist ➔ Open:</strong> If you are monitoring a waitlisted class, we block out the noise and <i>only</i> email you the exact second a real seat opens up.</li>
                    </ul>

                    <Text style={paragraph}>
                        Your existing alerts have already been silently upgraded to this new logic. You don't need to do anything! 
                        Just sit back, and we will reliably monitor Concordia's live API for you every 5 minutes.
                    </Text>

                    <Section style={btnContainer}>
                        <Button style={button} href="https://www.conuplanner.com/pages/seat-finder">
                            View Your Dashoard
                        </Button>
                    </Section>

                    <Text style={paragraph}>
                        Happy studying,<br />
                        <strong>Narendra & Team ConUPlanner.com</strong>
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        You are receiving this email because you recently used the ConU Planner Seat Finder.
                        <br />
                        No longer need alerts? You can safely ignore this email.
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

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#912338',
    padding: '17px 0 0',
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#3c4149',
};

const listStyle = {
    paddingLeft: '20px',
    marginBottom: '20px',
    color: '#3c4149',
    fontSize: '15px',
    lineHeight: '1.5',
};

const listItem = {
    marginBottom: '10px',
};

const btnContainer = {
    textAlign: 'center',
    margin: '24px 0',
};

const button = {
    backgroundColor: '#912338', // ConU Maroon
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
    textAlign: 'center',
};
