import { prisma } from "../database/prisma"

// sorteia e devolve uma palavra que está no banco de dados
export async function sortearPalavra(){
    const total = await prisma.palavra.count()
    if(total === 0) return null

    return prisma.palavra.findFirst({
        orderBy: {id: 'asc'},
        skip: Math.floor(Math.random() * total)
    })
}


