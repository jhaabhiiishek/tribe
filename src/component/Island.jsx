import React, { useRef,useEffect,useState } from 'react';
function Island() {
    // selection = 1 for personal
    // selection = 2 for Tribe
    const [selection, setSelect]= useState(0);

    const setSelectvariable = (event)=>{
        console.log("here")
        
        if(selection!==event.target.getAttribute("value")){
            setSelect(event.target.getAttribute("value"))
        }else{
            setSelect(0)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(!(event.target.classList.contains('choice-divs')||event.target.classList.contains('choice-divs-image')||event.target.classList.contains('secondary-island'))){
                setSelect(0)
            }
        };

        window.addEventListener('click', handleClickOutside);
    }, [selection]);
    return(
    <div>
        < div id = 'island'>
            <div className='choice-divs'>
                <img className='choice-divs-image' value={1} onClick={setSelectvariable} src={process.env.PUBLIC_URL+"/profile.png"}></img>
            </div>
            <div className='choice-divs'>
                <img className='choice-divs-image'  value={2} onClick={setSelectvariable}src={process.env.PUBLIC_URL+"/tribe.png"}></img>
            </div>
        </div>
        {
            (selection>0)&&(
                (selection===1)?(
                < div className = 'secondary-island'>
                    {/* The content here depends on the choice made in main-island */}
                    <div>
                        {/* Profiling and related */}
                    </div>
                </div>):(
                    < div className = 'secondary-island'>
                    {/* The content here depends on the choice made in main-island */}
                    <div>
                        {/* Tribe related */}
                    </div>
                </div>
                )
            )
        }
        
    </div>
    );
}
export default Island;