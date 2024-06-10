import { findAllStates } from "../models/State.js"

export const getStates = async (req,res) => {
    try{
        const states = await findAllStates()
        res.status(200).json({ states })
    } catch (error){
        res
            .status(500)
            .json({ error: "Failed to get states", message: error.message})
    }
}

export const info = async(req,res) => {
    try {
        let token = req.body.token;
        const user = await findUserByTokenWithRelations(token);
        let adList = [] // add dados anuncio
        res.status(200).json ({
            name: user.name,
            email: user.email,
            state: user.state.name,
            ads: adList,
        })
    } catch (error) {
        res
 
        .status(500)
        .json({ error: "failed to get info", message: error.message });
    }
}