import { useEffect, useState } from 'react';
import '../App.css';
import getCookie from './getCookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
});

function OtherSelections() {

    
    return (
        <div id='othersDiv'>
            
		</div>
    )
}

export default OtherSelections