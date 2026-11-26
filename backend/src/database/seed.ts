import { prisma } from './prisma'

// Lista de palavras com as categorias, com cada elemento tendo duas strings
const palavras: [string, string][] = [
  ['PROMISE', 'JavaScript'], ['CALLBACK', 'JavaScript'], ['CLOSURE', 'JavaScript'],
  ['ARRAY', 'JavaScript'], ['FUNCTION', 'JavaScript'], ['ASYNC', 'JavaScript'],
  ['OBJETO', 'JavaScript'],
  ['INTERFACE', 'TypeScript'], ['GENERICS', 'TypeScript'], ['ENUM', 'TypeScript'],
  ['TUPLA', 'TypeScript'], ['UNION', 'TypeScript'], ['NARROWING', 'TypeScript'],
  ['DECORATOR', 'TypeScript'],
  ['COMPONENTE', 'React'], ['ESTADO', 'React'], ['HOOK', 'React'],
  ['PROPS', 'React'], ['EFEITO', 'React'], ['CONTEXTO', 'React'],
  ['RENDERIZACAO', 'React']
]

// Percorre a lista e cadastra as palavras no banco, fazendo validções, se houve duplicatas ou não
async function main(){
    for (const [palavra, categoria] of palavras){
        await prisma.palavra.upsert({
            where: {palavra},
            update: {},
            create: {palavra, categoria}
        })
    }
    console.log('Seed realizado')
}

// cadastra, e ao finalazar encerra conexão ao DB
main().finally(()=> prisma.$disconnect())