export const seeUsers = (req,res) => res.render("seeUsers");
export const seeUser = (req,res) => res.render("seeUser", {userId: req.param.id })