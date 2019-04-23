import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return(
        <div>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 45 }} style={{ height: 125, width: 125 }} >
                <div className="Tilt-inner pa3"><img style={{paddingTop:'5px'}} src={brain} alt=""/></div>
            </Tilt>
        </div>
    );
};

export default Logo;