import { prisma } from "../database/prisma"

export async function sortearPalavra(){
    const total = await prisma.palavra.count()
    if(total === 0) return null

    return prisma.palavra.findFirst({
        orderBy: {id: 'asc'},
        skip: Math.floor(Math.random() * total)
    })
}


