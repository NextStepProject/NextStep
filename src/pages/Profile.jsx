import Header from "../components/Header";
import "./profile.css";

const Profile = () => {
    return (
        <div>
            <Header />
            <div className="floating-profile-container">
                <div class="prfile-image-container">
                    <img
                        src="public/assets/images/profile/default_user.png"
                        alt="default profile picture"
                        className="profile-picture"
                    >
                    </img>
                </div>
                <div className="short-user-infos">
                    {/* TEMPORÄRER Inhalt */}
                    <p>Username : Demo User</p>
                    <p>Birthday : 23.11.1998</p>

                </div>
            </div>
            <div className="detailed-user-infos">
                <p>beipsiel informationen</p>
                {/* TEMPORÄRER Inhalt */}
                <p>Username : Demo User</p>
                <p>Birthday : 23.11.1998</p>
            </div>
            <div className="detailed-user-infos">
                <div className="button-container">
                    <button className="btn login-btn">
                        <a href="/logout">Logout</a>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile; 