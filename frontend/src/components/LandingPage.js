import React, { useState,useEffect } from 'react';
import './LandingPage.css'; // Import the CSS file for styling
import bgiamge from './assets/aboutusbg.jpg';  
import logo from './assets/logo.png'; 
import './CardSection.css'; // Import CSS for styling
import cardImage1 from './assets/cardImage1.jpg'; // Example image 1
import cardImage2 from './assets/cardImage2.jpg'; // Example image 2
import cardImage3 from './assets/cardImage3.jpg'; // Example image 3


const LandingPage = () => {
    // State for toggling FAQ answers
    const [faqOpen, setFaqOpen] = useState([false, false, false]);

    // Function to toggle specific FAQ
    const toggleFAQ = (index) => {
        const newFaqState = faqOpen.map((item, i) => (i === index ? !item : item));
        setFaqOpen(newFaqState);
    };

    useEffect(() => {
        document.title = "Campus Connect";
    }, []);

    return (
        <div className="landing-page">
            <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="EduVents Logo" />
      </div>
     <h1 class="ctz">Campus connect</h1>
    </nav>
            {/* Hero Section */}
            <div >
                <section className="hero-section">
                    <div className="hero-image">
                        <img src="https://images.unsplash.com/photo-1464047736614-af63643285bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Event Experience" />
                    </div>
                    <div className="hero-content">
                        <h1 className="white">Welcome to the Ultimate College Event Experience</h1>
                        <p>Unleash your creativity, connect with like-minded individuals, and make memories that will last a lifetime.</p>
                        <a className="none" href="/login"><button className="cta-button">Get Started</button></a>
                    </div>

                </section>
                    

            </div>
            <div className='bg'>
                <img src="" alt="" />
                <div className="about-us-container">
                    <h1 className="about-us-title">About Us</h1>
                    <p className="about-us-description">
                        Welcome to our College Event Management website! We are a dedicated team of students passionate about creating unforgettable experiences for our fellow classmates.
                        Our mission is to organize, promote, and execute events that foster community engagement, learning, and fun.
                        From academic conferences and workshops to social gatherings and cultural celebrations, we strive to make every event unique and enjoyable.
                        <br /><br />
                        Our team is composed of individuals with diverse skills and backgrounds, working collaboratively to ensure each event runs smoothly from start to finish.
                        We believe in the power of teamwork, creativity, and organization to bring our ideas to life and cater to the interests of our college community.
                        Thank you for being a part of our journey, and we look forward to seeing you at our next event!
                    </p>
                </div>
            </div>


            <div className="card-section">
            <h1 className="section-title"><b>Our Team,</b></h1>
            <div className="cards-container">
                {/* Card 1 */}
                <div className="card">
                    <img src={cardImage1} alt="Feature 1" className="card-image" />
                    <h2 className="card-title">Salvin K J</h2>
                    <p className="card-description">
                     Contributed creative ideas and designed visuals to enhance the overall   presen -tation of the project. 
                    </p>
                </div>

                {/* Card 2 */}
                <div className="card">
                    <img src={cardImage2} alt="Feature 2" className="card-image" />
                    <h2 className="card-title">Ananthakrishnan V
                    </h2>
                    <p className="card-description">
                    Guided the team with effective leadership, oversaw project progress, and ensured all objectives were met efficiently.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="card">
                    <img src={cardImage3} alt="Feature 3" className="card-image" />
                    <h2 className="card-title">Farhan K N</h2>
                    <p className="card-description">
                    Played a key role in organizing and structuring the event management project, ensuring effective collaboration among team members.
                    </p>
                </div>
            </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2>FAQ</h2>

                {/* FAQ Item 1 */}
                <div className="faq-item" onClick={() => toggleFAQ(0)}>
                    <div className="faq-question">
                        <h3>How do I register for the event?</h3>
                        <span>{faqOpen[0] ? '-' : '+'}</span>
                    </div>
                    {faqOpen[0] && (
                        <div className="faq-answer">
                            <p>
                                To register for the event, simply visit our website and click on the 'Register Now' button. Fill out the registration form with your personal details and select the events you wish to participate in.
                            </p>
                        </div>
                    )}
                </div>

                {/* FAQ Item 2 */}
                <div className="faq-item" onClick={() => toggleFAQ(1)}>
                    <div className="faq-question">
                        <h3>Can I transfer my registration to someone else?</h3>
                        <span>{faqOpen[1] ? '-' : '+'}</span>
                    </div>
                    {faqOpen[1] && (
                        <div className="faq-answer">
                            <p>
                                Yes, you can transfer your registration to someone else. Please contact our support team with the details of the person you wish to transfer your registration to.
                            </p>
                        </div>
                    )}
                </div>

                {/* FAQ Item 3 */}
                <div className="faq-item" onClick={() => toggleFAQ(2)}>
                    <div className="faq-question">
                        <h3>Will there be on-site registration?</h3>
                        <span>{faqOpen[2] ? '-' : '+'}</span>
                    </div>
                    {faqOpen[2] && (
                        <div className="faq-answer">
                            <p>
                                No, we do not offer on-site registration. All participants must register online before the event. This allows us to better manage the event logistics and ensure a smooth registration process for all attendees.
                            </p>
                        </div>
                    )}
                    
                </div>
            </div>


            <div class="foot">
            Copyright © 2024 Campus-Connect. All Rights Reserved
            </div>
        </div>
    );
};

export default LandingPage;