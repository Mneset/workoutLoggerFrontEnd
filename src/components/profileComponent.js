import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.nickname} />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;