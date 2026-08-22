import {api} from "../../lib/axios"

//  return res.status(200).json({
//             message: "Signin successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
export const signInApi = async (data) => {
    const res = await api.post("/auth/signin",data);
    return res.data;
}

// return res.status(201).json({message:"SIgn up successfully, wait for admin verification."});
export const signUpApi = async (data) => {
    const res = await api.post("/auth/signup",data);
    return res.data;
}

export const logOutApi = async () => {
    const res = await api.post("/auth/signout");
    return res.data;
}