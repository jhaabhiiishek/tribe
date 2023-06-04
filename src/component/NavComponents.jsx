import '../App.css';

import React, { useState, useEffect } from 'react';
function Navbar() {
    return (
        <div id='navComponents'>
                <a  href='/profiles'>
                    <img className = 'navimages'  src={process.env.PUBLIC_URL+"/profiles.png"}>
					</img>
                </a>
                <a  href='/search'>
					<img className = 'navimages' src={process.env.PUBLIC_URL+"/search.png"}>
					</img>
				</a>
                <a  href='/notifications'>
					<img className = 'navimages' src={process.env.PUBLIC_URL+"/notifications.png"}>
					</img>
				</a>
        </div>
    )
}

export default Navbar