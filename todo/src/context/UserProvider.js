/* eslint-disable no-unused-vars */
import { useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";

const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function UserProvider({ children }) {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : {email: '', password: ''});

    const signUp = async () => {
        const json = JSON.stringify(user);
        const headers = {headers: {'Content-Type': 'application/json'}}
        try{
            const response = await axios.post(url + '/user/signup', json, headers);
            setUser(response.data);
            sessionStorage.setItem('user', JSON.stringify(response.data));
        } catch(error) {
            throw error;
        }
    }

    const signIn = async () => {
        const json = JSON.stringify(user);
        const headers = {headers: {'Content-Type': 'application/json'}}
        try{
            const response = await axios.post(url + '/user/signin', json,headers);
            const token = response.data.token;
            setUser(response.data);
            sessionStorage.setItem('user', JSON.stringify(response.data));
        } catch(error) {
            throw error;
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
            {children}
        </UserContext.Provider>
    )
}