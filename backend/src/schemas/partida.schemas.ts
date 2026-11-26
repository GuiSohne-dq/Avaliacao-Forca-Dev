import {z} from 'zod'

// defini e valida a criação de uma partida, com o nome do jogador possuindo min de 3 letras e max de 20
export const novaPartidaSchema = z.object({
    jogador: z.string().trim().min(3).max(20)
})

//defini e valida o palpite, aceitando letras de A a Z e convertendo para maisuculas
export const palpiteSchema = z.object({
    letra: z
        .string()
        .regex(/^[a-zA-Z]$/, 'Envie uma única palavra de A a Z')
        .transform((l) => l.toUpperCase())
})

//defini e valida o id, garantindo que seja convertido para numero, sendo que seja inteiro e positivo
export const idSchema = z.object({
    id: z.coerce.number().int().positive()
})


