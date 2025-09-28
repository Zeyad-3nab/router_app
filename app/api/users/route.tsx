import { NextRequest, NextResponse } from "next/server";
import schema from './Schema';
import { prisma } from "@/prisma/client";
import { email } from "zod";


export async function GET(request:NextRequest){

    //fetch data from db

    // prisma.user.findMany({email:'Zeyadenab220@gmail.com'});
        const users = await prisma.user.findMany();
    return NextResponse.json(users)
}



export async function POST(request:NextRequest){
    const body=await request.json();

    const validation =  schema.safeParse(body);

    if(!validation.success)
        return NextResponse.json(validation.error.issues,{status:400})
    
    const user = await prisma.user.findUnique({
        where:{email: body.email}
    })


    if(user)
          return NextResponse.json({error:'User with this email is already exists'},{status:400})


    const NewUser =  await prisma.user.create({
        data:{
            name:body.name,
            email:body.email
        }   
    });


    return NextResponse.json(NewUser);
}