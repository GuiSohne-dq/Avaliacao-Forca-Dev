import { prisma } from './prisma'

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

main().finally(()=> prisma.$disconnect)