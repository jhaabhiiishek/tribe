import '../App.css';
import React, { useState, useEffect } from 'react';
import Profile from './Profile';
function RightContainer(e) {
	var heading = e.heading;
	heading = 'Profile';
    return (
        <div id='rightContainer'>
            <h2 id = 'right-heading'>{heading}</h2>
			<Profile/>
        </div>
    )
}

export default RightContainer