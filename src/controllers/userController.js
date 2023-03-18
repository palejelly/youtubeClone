import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const seeUsers = (req,res) => res.render("seeUsers");
export const seeUser = (req,res) => res.render("seeUser", {userId: req.param.id })

export const getJoin = (req, res) => res.render("join",{pageTitle:"join"});
export const postJoin = async (req,res) => {
    const {name,username, email, password,password2, location} = req.body;
    if(password!==password2){
        return res.status(400).render("join",{
            errorMessage:"passsword confirmation does not match.",
        })
    }
    
    const exists = await User.exists({$or:[{username:username}, {email:email}] });
    if(exists){
        return res.status(400).render("join",{errorMessage: "this username/email is already taken"});
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join",{
            errorMessage: error._message
        });
    }
}

export const getLogin = (req,res) => res.render("login");
export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username:username, socialOnly:false});
    if(!user){
        return res.status(400).render("login",{errorMessage:"username doesn't exist"});
    }
    const pwMatch = await bcrypt.compare(password, user.password);

    if(!pwMatch){
        return res.status(400).render("login",{errorMessage:"wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    
    return res.redirect("/");
};

export const getEditUser = (req,res) => res.render("edit-profile");

export const startGithubLogin = (req,res) =>{
    const baseUrl = 'https://github.com/login/oauth/authorize';

    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl)
}

export const postEdit = async (req,res)=> {
    const {
        session:{
            user: {_id}
        },
        body: { name},
        file,
    } = req;
    // console.log(file);

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl:file ? file.path : null,
        }
    )
    return res.redirect("/users/edit");
};

export const finishGithubLogin = async (req,res) =>{
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = "https://github.com/login/oauth/access_token";
    const finalUrl= `${baseUrl}?${params}`;
    const tokenRequest = await
        (await fetch(finalUrl,{
            method:"POST",
            headers:{
                Accept: "application/json",
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`,{
            headers:{
                Authorization: `Bearer ${access_token}`,
            },
        })
        ).json();

        const emailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers:{
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            email => email.primary === true && email.verified ===true
        );
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({email:emailObj.email});
        if(!user){
            const user = await User.create({
                name: userData.name,
                username:userData.login,
                email: emailObj.email,
                password:"",
                location:userData.location,
                socialOnly:true,
                avatarUrl: userData.avatar_url,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
        
    }
    else{
        res.redirect("/login");
    }
}


export const logout = (req,res) =>{
    req.session.destroy();
    return res.redirect("/");
}