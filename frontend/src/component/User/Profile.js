import React, { Fragment, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import MetaData from "../layout/Header/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link,useNavigate } from "react-router-dom";
import "./Profile.css";
import { loadUser } from "../../actions/userAction";
import store from "../../store";

const Profile = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // let user ={};
  // let user = {};
  const {user,loading, isAuthenticated } = useSelector((state) => state.user);
  // user = useSelector((state) => state.user.user);
  useEffect(() => {
    // store.dispatch(loadUser());

    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  // if(!user){
  //   return(<>
  //   </>);
  // }
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {isAuthenticated && <MetaData title={`${user.name}'s Profile`} />}
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              {isAuthenticated && <img src={user.avatar.url} alt={user.name} />}
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                {isAuthenticated && <p>{user.name}</p>}
              </div>
              <div>
                <h4>Email</h4>
                {isAuthenticated && <p>{user.email}</p>}
              </div>
              <div>
                <h4>Joined On</h4>
                {isAuthenticated && <p>{String(user.createdAt).substr(0, 10)}</p>}
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;