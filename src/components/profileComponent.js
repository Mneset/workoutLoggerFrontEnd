import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [ userMetadata, setUserMetadata ] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.REACT_APP_ACCESS_DOMAIN;
  
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const responseData = await metadataResponse.json();
        console.log("API Response:", responseData);

        const { user_metadata } = responseData;
        setUserMetadata(user_metadata);
        console.log(user);
        
      } catch (e) {
        console.log(e.message);
      }
    };
  
    if (user?.sub) {
      getUserMetadata();
    }
  }, [getAccessTokenSilently, user?.sub]);

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.nickname} />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default Profile;