import type { NextAuthOptions  } from "next-auth";

import AzureADProvider from "next-auth/providers/azure-ad";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from 'next-auth/providers/google'
//import CredentialsProvider from 'next-auth/providers/credentials'
import { TwitterLegacy } from 'next-auth/providers/twitter'

export const authOptions:NextAuthOptions ={
    providers:[
        TwitterLegacy({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!
          }),
           GoogleProvider({
            clientId: '891083635477-u0nkh6j24spc26n97tk8gserpl2ov7fe.apps.googleusercontent.com',
            clientSecret: 'whnEe-y62bAROzg3qvskuuBH',
          }),
          /*
          CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              // Add logic to verify credentials here
              if (!credentials) return null
              const { email, password } = credentials
              // Fetch user and password hash from your database
              // Example: const user = await getUserByEmail(email)
              if (user && bcrypt.compareSync(password, user.passwordHash)) {
                return { id: user.id, name: user.name, email: user.email }
              } else {
                throw new Error('Invalid credentials')
              }
            },
          }),*/
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID!,
          }),
          FacebookProvider({
      clientId: "3509858812639739",//process.env.FACEBOOK_APP_ID as string,
      clientSecret: "8d43459a0624bb9f66b28803097193ab"//process.env.FACEBOOK_APP_SECRET as string,
    }),
    ]
};