const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const authConfig = require("../../config/auth");
const mailer = require('../../modules/mailer');

const User = require("../models/user");
const {cry} = require("yarn/lib/cli");

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/register", async (req, res) => {
    const {email} = req.body;

    try {
        if (await User.findOne({email}))
            return res.status(400).send({error: "User already exists"});

        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({
            user,
            token: generateToken({id: user.id}),
        });
    } catch (err) {
        return res.status(400).send({error: err});
    }
});

router.post("/authenticate", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if (!user) {
        return res.status(401).send({error: "Invalid email or password"});
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({error: "Invalid email or password"});
    }

    user.password = undefined;

    res.send({
        user,
        token: generateToken({id: user.id}),
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send({error: "Invalid email or password"});
        }

        const token = crypto.randomBytes(20).toString('HEX');
        const tokenExpires = new Date();
        tokenExpires.setHours(tokenExpires.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: tokenExpires,
            }
        })

        mailer.sendMail({
            subject: 'Redefina sua senha',
            to: email,
            from: 'tiago.goes@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            console.log(err)
            if(err){

                return res.status(400).send({error: 'Cannot send forgot password email'})
            }
            res.send()
        })

    }catch (e){
        console.log(e)
        res.status(400).send({error: 'error on forgot password, try again'})
    }


});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try{
        const user = await User.findOne({email}).select("+passwordResetToken passwordResetExpires");

        if(!user){
            return res.status(400).send({error: 'User not found'})
        }

        if(token !== user.passwordResetToken){
            return res.status(400).send({error: 'Token invalid'})
        }

        const now = new Date()
        if(now > user.passwordResetExpires){
            return res.status(400).send({error: 'Token expired'})
        }

        user.password = password
        await user.save()
        res.send()

    }catch (e){
        return res.status(400).send({error: 'Cannot reset password, try again'})
    }
})

module.exports = (app) => app.use("/auth", router);
