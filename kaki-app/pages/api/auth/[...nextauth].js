import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt"

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import { signOut } from "next-auth/react";

const refreshToken = async function (refreshToken) {
    console.log("Refreshing token");
    console.log(refreshToken);
    try {
        const response = await axios.post(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "api/auth/token/refresh/",
            {
                refresh: refreshToken,
            },
        );
        console.log(response.data);
        const { access, refresh, access_token_expiration } = response.data;
        return [ access, refresh, access_token_expiration ];
    } catch {
        return [null, null];
    }
};


const isJwtExpired = (token) => {
    // offset by 60 seconds, so we will check if the token is "almost expired".
    const currentTime = Math.round(Date.now() / 1000 + 60);
    const decoded = jwt.decode(token);

    console.log(`Current time + 60 seconds: ${new Date(currentTime * 1000)}`);
    console.log(`Token lifetime: ${new Date(decoded["exp"] * 1000)}`);

    if (decoded["exp"]) {
      const adjustedExpiry = decoded["exp"];

      if (adjustedExpiry < currentTime) {
        console.log("Token expired");
        return true;
      }

      console.log("Token has not expired yet");
      return false;
    }

    console.log('Token["exp"] does not exist');
    return true;
};

const USER_QUERY = gql`query UserByIdentifier($identifier: String!) {
    userByIdentifier(identifier: $username) {
        user {
            username
        }
    }
}`

export const authOptions = {  // Configure one or more authentication providers
   
    providers: [
        CredentialsProvider ({
            name: "Credentials",
            credentials: {
              email: { label: "Username", type: "username", placeholder: "cool name" },
              password: { label: "Password", type: "password", placeholder: "cool password"}
            },

            async authorize(credentials, req) {

              console.log(credentials);

              try {
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "api/auth/login/", 
                    {
                        username: credentials.username,
                        password: credentials.password,
                    }
                );

                response.data.user.name = response.data.user.username;
                return(response.data);

              } catch(error) {
                console.log(error.request.data);
                console.log(error.response.data);
                return null;
              }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    secret: process.env.SESSION_SECRET,

    session: {
      strategy: "jwt",
      maxAge: 36 * 60 * 60, // 36 hours
    },

    jwt: {
      secret: process.env.JWT_SECRET,
    },

    pages: {
        error: '/login'
    },
    // debug: process.env.NODE_ENV === "development",

    callbacks: {

        async jwt( { token, user, account, profile, isNewUser } ) {

            // user just signed in
            if (user) {
                console.log("Setting up JWT!");
                console.log(user);

                if(account.provider === "credentials") {
                    const { access_token, refresh_token } = user;
                    token = {
                        ...token,
                        access_token: access_token,
                        refresh_token: refresh_token
                    }
                    token.user = user.user;
                    return token;
                }

                if (account.provider === "google") {
                    
                    //console.log("Handling google");
                    //console.log(token);
                    //console.log(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "api/google/"); 

                    // extract these two tokens
                    const { access_token, id_token } = account;

                    // make a POST request to the DRF backend
                    try {
                        const response = await axios.post(
                            "http://127.0.0.1:8000/api/google/", 
                            {
                                access_token: access_token, // note the differences in key and value variable names
                                id_token: id_token,
                            }
                        );

                        // extract tokens from the returned data
                        const { refresh_token } = response.data;
                        const access_token_returned = response.data.access_token;
                        // reform the `token` object
                        token = {
                        ...token,
                        access_token: access_token_returned,
                        refresh_token: refresh_token,
                    };

                    token.user = user;
                    return token;

                } catch (error) {
                    //console.log(error);
                    return null;
                }
            }
        }

        // user was signed in previously, we want to check if the token needs refreshing
        if (isJwtExpired(token.access_token)) {
                const [
                    newAccessToken,
                    newRefreshToken,
                ] = await refreshToken(token.refresh_token);

                if (newAccessToken && newRefreshToken) {
                    token = {
                        ...token,
                        access_token: newAccessToken,
                        refresh_token: newRefreshToken,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60),
                    };

                    return token;
                }
                console.log("Token is expired.")

                // Unable to refresh token from DRF backend; invalidate it
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                };
            }
            // Token is valid
            return token;
        },

        async session({ session, user, token } ) {
            session.user = token.user;
            session.error = token.error;
            session.access_token = token.access_token;
            console.log(session);
            if(user) {
                session.user = user;
            }
            return session;
        },
    }
}

export default (req, res) => NextAuth(req, res, authOptions);