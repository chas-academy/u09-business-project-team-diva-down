import { useState, useEffect } from "react";
import Edit from "../hoc/loc/Edit_button_dashboard";
import Save from "../hoc/loc/Save_button_dashboard";
import Back from "../hoc/loc/Back_button_dashboard";
import ChangePassword from "./user_dashboard/Change_password";
import axios from "axios";

interface SelectValue {
  value: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  eloScore?: number;
  wins?: number;
  total_matches?: number;
}

const UserInfo = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [AuthUserData, setAuthUserData] = useState<UserData>();
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [newEmailValue, setNewEmailValue] = useState(userData.email);
  const [newUsernameValue, setNewUsernameValue] = useState(userData.name);
  const [editUsername, setEditUsername] = useState<boolean>(false); 
  const [ChangePasswordWindow, setChangePasswordWindow] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const fetchUserData = () => {
     axios.get(`http://localhost:3000/user/${userData.id}`)
      .then(response => {
        const UserData = response.data;
        setAuthUserData(UserData);

        const updatedUserData = { ...userData, name: newUsernameValue };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      })
  }

  const SaveChangesToUsername = (e: React.FormEvent) => {
    e.preventDefault();

    axios({
      method: 'put',
      url: `http://localhost:3000/user/${userData.id}`,
      data: {
        name: newUsernameValue
      }
    }).then(response => {
      const UserData = response.data;
      setAuthUserData(UserData);
      setEditUsername(false);
    });
  }

  const SaveChangesToEmail = (e: React.FormEvent) => {
    e.preventDefault();

    axios({
      method: 'put',
      url: `http://localhost:3000/user/${userData.id}`,
      data: {
        email: newEmailValue
      }
    }).then(response => {
      const UserData = response.data;
      setAuthUserData(UserData);
      setEditEmail(false);
    });
  }

  const SaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (password != confirmPassword) {
      return;
    }

    axios({
      method: 'put',
      url: `http://localhost:3000/${userData.id}`,
      data: {
        password: password
      }
    }).then(response => {
      if (response.status) {
        console.log("password has been changed");
      } else {
        console.error("Failed to update the password!");
        setChangePasswordWindow(false);
      }
    }
    )
  }

  useEffect(() => {
    if (userData) {
      fetchUserData();
    }
  }, [userDataString]);


  const CheckSatus = () => {
    console.log(AuthUserData);
    console.log(AuthUserData?.eloScore);
  }

  const toggleEditUsername = () => {
    setEditUsername(!editUsername);
    setEditEmail(false);
  }

  const toggleEditEmail = () => {
    setEditEmail(!editEmail);
    setEditUsername(false);
  }

  const CancelEditing = () => {
    setEditUsername(false);
    setEditEmail(false);
  }

  const toggleChangePassword = () => {
    setChangePasswordWindow(!ChangePasswordWindow);
  }

  return (
    <>
      <div className="user_info">
        <button style={{color: '#FFF'}} onClick={() => CheckSatus()}>Check Status</button>
        <div className="game_title">Game Stats</div>
        <div className="game_stats">
          <div className="title">Current Rating:</div>
          <div className="data">{AuthUserData?.eloScore ?? 'N/A'}</div>
          <div className="title">Total Wins:</div>
          <div className="data">{AuthUserData?.wins ?? 'N/A'}</div>
          <div className="title">Total Matches:</div>
          <div className="data">{AuthUserData?.total_matches ?? 'N/A'}</div>
        </div>

        <div className="user_title">User Settings</div>
        <div className="sub_title">Password and account details</div>

        {editEmail === false && editUsername === false && (
          <div className="grid">
            <div className="title">Username</div>
            <div className="data">{AuthUserData?.name}</div>
            <Edit onClick={() => toggleEditUsername()}/>
            <div className="title">Email</div>
            <div className="data">{AuthUserData?.email}</div>
            <Edit onClick={() => toggleEditEmail()}/>
          </div>
        )}

        {editEmail && (
          <div className="grid">
            <div className="title">Username</div>
            <div className="data"></div>
            <Back onClick={() => CancelEditing()}/>
            <form className="grid-form" onSubmit={SaveChangesToEmail}>
              <div className="title">Email</div>
              <input
                id="EmailData"
                type="email"
                className="data data-edit"
                value={newEmailValue}
                onChange={(e) => setNewEmailValue(e.target.value)}
                required
              />
              <Save className="action" type="submit"/>
            </form>
          </div>
        )}

        {editUsername && (
          <div className="grid">
            <form className="grid-form" onSubmit={SaveChangesToUsername}>
              <div className="title">Username</div>
              <input
                type="text"
                className="data data-edit"
                value={newUsernameValue}
                onChange={(e) => setNewUsernameValue(e.target.value)}
                required
              />
              <Save className="action" type="submit"/>
            </form>
            <div className="title">Email</div>
            <div className="data"></div>
            <Back className="action"  onClick={() => CancelEditing()}/>
          </div>
        )}

        <button className="change_button" onClick={() => toggleChangePassword()}>
          Change Password
        </button>

        <div className="account_title">Account Removal</div>
        <div className="account_sub_title">
          If you delete your account, it can't be recovered
        </div>
        <div className="button_container">
          <button className="delete">Delete Account</button>
        </div>
      </div>

      {ChangePasswordWindow && (
          <div className="password-background">
              <div className="change-password-container">
                <form onSubmit={SaveNewPassword}>
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>Confirm New Password</label>
                  <input 
                    type="confirmpassword" 
                    name="password" 
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="action_container">
                    <button className="save" type="submit">Save</button>
                    <button className="cancel" onClick={toggleChangePassword}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
          </div>
      )}
    </>
  );
};

export default UserInfo;
