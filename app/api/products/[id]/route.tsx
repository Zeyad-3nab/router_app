import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";
import schema from "../Schema";
import { error } from "console";


interface Props{
    params:{id:string}
}



export async function GET(request:NextRequest , {params}:Props )
{
    const product = await prisma.product.findUnique({
        where:{id:parseInt(params.id)}
    })

    if(!product)
        return NextResponse.json({error:"Product with this Id is not found"},{status:404})

    return NextResponse.json(product);
}

export async function PUT(request:NextRequest , {params}:Props){

    const body = await request.json();
const validation = schema.safeParse(body);

if(!validation.success)
    return NextResponse.json(validation.error.issues,{status:400});


   const product = await prisma.product.findUnique({
        where:{id:parseInt(params.id)}
    })

if(!product)
    return NextResponse.json({error:"product with this id is not found"},{status:404});

const NewProduct =  await prisma.product.update({
    where:{id:parseInt(params.id)},
    data:{
        name:body.name,
        price:body.price
    }
})
return NextResponse.json({NewProduct})
}


export function DELETE(request:NextRequest , {params}:Props){

    const product = prisma.product.findUnique({
        where:{id:parseInt(params.id)}
    })


    if(!product)
        return NextResponse.json({error:"Product with this Id is not  found"},{status:404});

    prisma.product.delete({
        where:{id:parseInt(params.id)}
    })

    return NextResponse.json("product is deleted successfully");
}