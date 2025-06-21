import { useState, useEffect } from "react";
import Edit from "../hoc/loc/Edit_button_dashboard";
import Save from "../hoc/loc/Save_button_dashboard";
import Back from "../hoc/loc/Back_button_dashboard";
import ChangePassword from "./user_dashboard/Change_password";
import axios from "axios";
import { PassThrough } from "stream";

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
  const [AuthUserId, setAuthUserId] = useState<string>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [toggleWindow, setToggleWindow] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState("");
  const [newUsernameValue, setNewUsernameValue] = useState("");
  const [selectValue, setSelectValue] = useState<SelectValue>({ value: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Not authenticated");
      }

      const storedData = localStorage.getItem('userData');
      if (!storedData) {
        throw new Error("No user data found in session storage.");
      }

      const parsedData = JSON.parse(storedData);

      setAuthUserId(parsedData.id);
      fetchAuthUser(parsedData.id);
      // if (AuthUserId) {
      //   fetchAuthUser(AuthUserId);
      // } else {
      //   console.log("No Id Found!");
      // }
      
      // setUserData(parsedData);
      // setNewEmailValue(parsedData.email);
      // setNewUsernameValue(parsedData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
    }; 
        loadUserData();
    }, []);


  const fetchAuthUser = (id: string) => {
    try {
      axios.get(`http://localhost/user/${id}`)
        .then(response => {
          const UserData = response.data;
          setUserData(UserData);
        })
    } catch (error) {
      console.error("Failed fetch Auth User", error);
    }
  }

  const ToggleWindowFunction = () => {
    setToggleWindow(!toggleWindow);
  };

  const ToggleEditEmailFunction = () => {
    setEditEmail(!editEmail);
  };

  const ToggleEditUsernameFunction = () => {
    setEditUsername(!editUsername);
  };

  const ToggleResetEditForm = () => {
    setEditEmail(false);
    setEditUsername(false);
  };

  const handleOptionChange = (newValue: SelectValue) => {
    setSelectValue(newValue);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !userData) return;

      const response = await fetch("http://localhost:3000/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmailValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      const updatedUser = { ...userData, email: newEmailValue };
      setUserData(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setEditEmail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email update failed");
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !userData) return;

      const response = await fetch("http://localhost:3000/update-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newUsernameValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update username");
      }

      const updatedUser = { ...userData, name: newUsernameValue };
      setUserData(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setEditUsername(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Username update failed");
    }
  };

  if (isLoading) {
    return <div className="user_info">Loading user data...</div>;
  }

  if (error) {
    return <div className="user_info">{error}</div>;
  }

  if (!userData) {
    return <div className="user_info">No user data available</div>;
  }

  const CheckStatus = () => {

    const storedData = localStorage.getItem('userData');
      if (!storedData) {
        throw new Error("No user data found in session storage.");
      }

    console.log(AuthUserId);
    console.log(userData);
    console.log(storedData);
  }

  return (
    <>
      <div className="user_info">
        <div className="game_title">Game Stats</div>
        <button style={{color: '#FFF'}} onClick={() => CheckStatus()}>Check Status</button>
        <div className="game_stats">
          <div className="title">Current Rating:</div>
          <div className="data">{userData.elo || "N/A"}</div>
          <div className="title">Total Wins:</div>
          <div className="data">{userData.wins || "N/A"}</div>
          <div className="title">Total Matches:</div>
          <div className="data">{userData.total_matches || "N/A"}</div>
        </div>

        <div className="user_title">User Settings</div>
        <div className="sub_title">Password and account details</div>

        {editEmail === false && editUsername === false && (
          <div className="grid">
            <div className="title">Username</div>
            <div className="data">{userData.name}</div>
            <Edit onClick={ToggleEditUsernameFunction} />
            <div className="title">Email</div>
            <div className="data">{userData.email}</div>
            <Edit onClick={ToggleEditEmailFunction} />
          </div>
        )}

        {editEmail && (
          <div className="grid">
            <div className="title">Username</div>
            <div className="data">{userData.name}</div>
            <Back onClick={ToggleResetEditForm} />
            <form className="grid-form" onSubmit={handleUpdateEmail}>
              <div className="title">Email</div>
              <input
                id="EmailData"
                type="email"
                className="data data-edit"
                value={newEmailValue}
                onChange={(e) => setNewEmailValue(e.target.value)}
                required
              />
              <Save className="action" />
            </form>
          </div>
        )}

        {editUsername && (
          <div className="grid">
            <form className="grid-form" onSubmit={handleUpdateUsername}>
              <div className="title">Username</div>
              <input
                type="text"
                className="data data-edit"
                value={newUsernameValue}
                onChange={(e) => setNewUsernameValue(e.target.value)}
                required
              />
              <Save className="action" />
            </form>
            <div className="title">Email</div>
            <div className="data">{userData.email}</div>
            <Back className="action" onClick={ToggleResetEditForm} />
          </div>
        )}

        <button onClick={ToggleWindowFunction} className="change_button">
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

      {toggleWindow && (
        <ChangePassword
          selectedValue={selectValue}
          onOptionChange={handleOptionChange}
          ToggleWindowFunction={ToggleWindowFunction}
        />
      )}
    </>
  );
};

export default UserInfo;
