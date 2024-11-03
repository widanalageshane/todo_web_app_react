import { pool } from "../helper/db.js";
import { Router } from "express";
import { hash,compare } from "bcrypt";
import jwt from "jsonwebtoken";

const { sign } = jwt;

const userRouter = Router();

userRouter.post('/register', async (req,res,next) => {
    hash(req.body.password,10,(error,hashedPassword) => {
        if (error) return next(error) // Hash error.
        try {
            pool.query('insert into account (email,password) values ($1,$2) returning *',
            [req.body.email,hashedPassword],
            (error,result) => {
                if (error) return next(error) // Database error.
                return res.status(201).json({id: result.rows[0].id,email: result.rows[0].email})
              }
            )
        } catch (error) {
            return next(error) // Catch all error.
        } 
    })
})

userRouter.post('/login',(req,res,next) => {
    const invalid_message = 'Invalid credentials';
    try {
        pool.query('select * from account where email=$1',
            [req.body.email],
            (error,result) => {
                if (error) return next(error)
                if (result.rowCount === 0) return next(new Error(invalid_message))
                    compare(req.body.password,result.rows[0].password,(error,match) => {
                if (error) next(error)
                if (!match) return next(new Error(invalid_message))
                const token = sign({user: req.body.email},process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
                const user = result.rows[0]
                return res.status(200).json({
                    'id': user.id,
                    'email': user.email,
                    'token': token
                })})
            }
        )
    } catch (error) {
        return next(error)
    }
})

export default userRouter;