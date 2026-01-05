import Icons from "../components/Icons";

const Home = () => {

    return (
        <div className="main-content">
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="portrait-box">
                            <img src="assets/img/avatar.png" alt="Saitama" className="portrait floating" />
                            {/* <div className="portrait-glow"></div> */}
                            <Icons />
                        </div>
                    </div>
                </div>
            </section>
        </div>  
    );
}

export default Home;