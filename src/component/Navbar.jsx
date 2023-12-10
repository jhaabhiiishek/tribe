import '../App.css';
function Navbar() {
    return (
        <div id='nav'>
            <div id='nav-group'>
                <h1 id='branding'>Tribe.in</h1>
                <h1 className='subgroup-heading'> friends </h1>
                <div className='vals-container'>
                    <div className='vals'>abhiiishek</div>
                    <div className='vals'>viran</div>
                    <div className='vals'>adnan</div>
                </div>
                <a className='view-all' href="#">view all</a>
                <h1 className='subgroup-heading'> tribes</h1>
                <div className='vals-container'>
                    <div className='vals'>Chandigarh University</div>
                    <div className='vals'>Best one Yet</div>
                    <div className='vals'>Amazing Guys</div>
                </div>
                <a className='view-all' href="#">view all</a>
            </div>
            <div id='compose'>Create</div>
        </div>
    )
}

export default Navbar