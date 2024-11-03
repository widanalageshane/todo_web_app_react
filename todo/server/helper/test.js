import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const __dirname = import.meta.dirname;

dotenv.config();

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../db.sql'), 'utf-8');
    pool.query(sql)
}

const insertTestUser = (email,password) => {
    hash(password,10,(error,hashedPassword) => {
        pool.query('insert into account (email,password) values ($1,$2) returning *',
        [email,hashedPassword],
        )
    })
}

const getToken = async(email) => {
    return jwt.sign({user: email}, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken };