import prisma from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { signInSchema } from "@repo/common/zodSchema";
import GoogleProvider from "next-auth/providers/google";
interface User {
    id: string;
    email: string;
    name: string;
    mobile_no:string;
}
export const NEXT_AUTH={
    providers:[
        CredentialsProvider({
            name:"credentails",
            credentials:{
                email:{
                    label: "Email",
                    type: "email",
                    placeholder: "name@gmail.com",
                },
                password:{
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
            },
            async authorize(credentials:any) {
                try {
                    if(!credentials){
                        return null;
                    }
                    const parsedSignIn = signInSchema.safeParse(credentials);
                    if (!parsedSignIn.success) {
                        console.error("Invalid credentials:", parsedSignIn.error);
                        return null; // Return null for validation errors
                    }
                    const user= await prisma.user.findUnique({
                        where:{
                            email:parsedSignIn.data.email,
                        }
                    });
                    if(!user){
                        return null;
                    }
                    const match= await bcrypt.compare(parsedSignIn.data.email,user.password)

                    return {
                        id: String(user.id), // Convert id to string
                        email: user.email,
                        name: user.name,
                        mobile_no:user.number
                    } as User;
                } catch (e:any) {
                    return null;
                } 
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }: any) {
            if (
              account &&
              user &&
              (account.provider === "google")
            ) {
              try {
                    const { email, name } = user;
        
                    const existUser = await prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    });
                    if (!existUser) {
                        const salt = await bcrypt.genSalt(10);
                        // Ensure process.env.SECRET_USER_PASS is defined and not undefined or null
                        if (!process.env.SECRET_USER_PASS) {
                            throw new Error(
                            "SECRET_USER_PASS is not defined in the environment variables",
                            );
                        }
                        const hashPassword = await bcrypt.hash(
                            process.env.SECRET_USER_PASS,
                            salt,
                        );
                        const newUser = await prisma.user.create({
                            data: {
                                name: name,
                                email: email,
                                password: hashPassword,
                                verified:true
                            },
                        });
                        const userBalance=await prisma.balance.create({
                           data:{
                                userId:newUser.id,
                                amount:0,
                                locked:0,
                            }
                        })
                        user.id = newUser.id.toString();
                        return true;
                    }
                    user.id = existUser.id.toString();
                    return true;
                }catch (e: any) {
                    console.log("Internal Server error");
                    return false;
                }
            }
            return true;
        },
        async redirect({
            url,
            baseUrl,
        }: {
            url: string;
            baseUrl: string;
        }): Promise<string> {
            // Redirect to dashboard after sign-in
            if (url.startsWith(baseUrl)) {
              return `${baseUrl}/dashboard`;
            } else if (url.startsWith("/")) {
              return `${baseUrl}/dashboard`;
            }
            return baseUrl;
        },
        async jwt({ token, user, account }: any) {
        if (
            account &&
            user &&
            (account.provider === "google")
        ) {
            const { email, name } = user;
            //console.log("user3"+JSON.stringify(user, null, 2));
            try {
                token.userId = user.id;
                return token;
            } catch (e: any) {
                console.log("Internal Server error");
                console.log(e);
                return null;
            }
        } else {
            token.userId = token.sub;
            return token;
        }
        },
        session: ({ session, token, user }: any) => {
            if (session && session.user) {
                session.user.id = token.userId;
            }
            return session;
        },
    },
}