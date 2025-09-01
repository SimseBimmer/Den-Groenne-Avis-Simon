import React from 'react';
import './FooterComponent.scss';

const FooterComponent = () => {
    return (
        <footer className="footerContainer">
            <div id='footerContentContainer'>
                {/* left side */}
                <div id='leftContainer'>
                    <h3 id='goofyText'>Bagtanker</h3>
                    <ul>
                        <div id='adress'>
                            <li>Øster Uttrupvej 1</li>
                            <li>9000 Aalborg</li>
                        </div>
                        <li>Tlf: 12345678</li>
                        <li>Email: info@bagtanker.dk</li>
                    </ul>
                </div>
                <div id='rightContainer'>
                    <h3>Tilmeld dig Bagtankers nyhedsbrev</h3>
                    <p>Få vores nyheder direkte i din indbakke</p>
                    <input type="email" placeholder='Indtast din email' />
                    <button>Tilmeld</button>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
