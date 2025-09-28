// import { NextRequest, NextResponse } from "next/server";
// import schema from '../Schema';
// import { prisma } from "@/prisma/client";

// interface Props{
//     params:{id:string}
// }


// export async function GET(request:NextRequest , {params}:Props){

//     //get data from db
//     // if not found return 404
//     //else return data
// const user =await prisma.user.findUnique({
//     where:{id:parseInt(params.id)}
// })

//     if(!user)
//         return NextResponse.json({error:'user not found'},{status:404})

//      return NextResponse.json(user);
// }


// export async function PUT(request:NextRequest , {params}:Props){
    
//     const body = await request.json();
//     const validation =  schema.safeParse(body);
//     if(!validation.success)
//         return NextResponse.json(validation.error.issues,{status:400});


//     const user = await prisma.user.findUnique({
//         where:{id:parseInt(params.id)}
//     });

//     if(!user)
//         return NextResponse.json({error:"User with this Id is not found"} , {status:404});


//     const updatedUser =  await prisma.user.update({
//         where:{id: user.id}, 
        
//         data:{
//             name:body.name,
//             email:body.email
//         }
//     })

//     return NextResponse.json(updatedUser);
// }


// export async function DELETE(request:NextRequest , {params}:Props){


//     const user = await prisma.user.findUnique({
//         where:{id:parseInt(params.id)}
//     })
//     if(!user)
//         return NextResponse.json({error:'user with this Id is not found'},{status:404})


//     await prisma.user.delete({
//         where:{id:user.id}
//     });

//     return NextResponse.json({message:'user deleted'});

// }