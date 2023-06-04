import '../App.css';
import React, { useState, useEffect } from 'react';
import Post from './Post'
function LeftContainer(e) {
	var heading = e.heading;
	heading = "Posts"
    return (
        <div id='leftContainer'>
            <h2 id = 'left-heading'>{heading}</h2>
			<Post/>
        </div>
    )
}

export default LeftContainer