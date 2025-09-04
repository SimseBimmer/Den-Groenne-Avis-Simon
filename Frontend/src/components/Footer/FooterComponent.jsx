import React from 'react';
import './FooterComponent.scss';

const FooterComponent = () => {
    return (
        <footer id="footerContainer">
            <div id="footerGrid">
                <div id="footerNewsletter">
                    <h3>Nyhedsbrev</h3>
                    <p>Vil du være med på den grønne front? Tilmeld dig vores nyhedsbrev og få de seneste klima opdateringer direkte i din indbakke.</p>
                    <form id="newsletterForm" onSubmit={e => e.preventDefault()}>
                        <input type="email" id="newsletterInput" placeholder="Din email" />
                        <button id="newsletterBtn" type="submit">Tilmeld</button>
                    </form>
                </div>
                <div id="footerContact">
                    <h3>Kontakt</h3>
                    <p>Rødvinge 32<br />2210 Vintreby Øster<br />+45 88229422<br />dga@dga-fv.dk</p>
                </div>
                <div id="footerUN">
                    <h3>FN's Verdensmål</h3>
                    <p>
                        Vi støtter på organisatorisk plan op om FN's verdensmål og har derfor besluttet at en del af overskuddet går direkte til verdensmål nr. 13: Klimahandling.
                    </p>
                    <a id="footerUNLink" href="#" target="_blank" rel="noopener noreferrer">
                        Læs mere om verdensmålene her
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
