import {describe, it, expect} from 'vitest'
import {gerarMascara, calcularPontos, aplicarPalpite } from '../src/game/regras'
import type { PartidaJogo } from '../src/types'

//partida inicial para teste
const base: PartidaJogo = {
    palavra: 'PROMISE',
    letrasTentadas: [],
    erros: 0,
    status: 'em_andamento',
    pontos: 0
}

describe('regras do jogo', ()=>{
    it('gerarMascara mostra só as letras já tentadas', ()=>{
        expect(gerarMascara('PROMISE', ['P', 'E'])).toBe('P_____E')
    })

    it('calcularPontos segue a RN06(4 vidas em PROMISE = 75', () =>{
        expect(calcularPontos('PROMISE', 4)).toBe(75)
    })

    it('Letra errada aumenta os erros em 1 (RN01)', ()=>{
        const nova = aplicarPalpite(base, 'Z')
        expect(nova.erros).toBe(1)
        expect(nova.letrasTentadas).toEqual(['Z'])
    })

    it('Letra certa não consome vida', ()=>{
        const nova = aplicarPalpite(base, 'P')
        expect(nova.erros).toBe(0)
        expect(nova.status).toBe('em_andamento')
    })

    it('Letra repetida lança erro 409 (RN03)', ()=>{
        const partida = {...base, letrasTentadas: ['P']}
        expect(()=> aplicarPalpite(partida, 'P')).toThrow('Letra já utilizada')
    })

    it('Partida encerrada não aceita palpites(RN04', ()=>{
        const partida: PartidaJogo = {...base, status: 'derrota'}
        expect(()=> aplicarPalpite(partida, 'P')).toThrow('Partida encerrada')
    })

    it('Aceitar a última letra dá vitoria e pontos (RN05 e RN06', ()=>{
        const partida = {...base, letrasTentadas: ['P', 'R', 'O', 'M', 'I', 'S']}
        const nova = aplicarPalpite(partida, 'E')
        expect(nova.status).toBe('vitoria')
        expect(nova.pontos).toBe(95)
    })

    it('6 erros seguidos dão derrota com 0 pontos (RN05)', ()=>{
        const erradas = ['Z', 'X', 'W', 'Q', 'K', 'J']
        const final = erradas.reduce((p, l) => aplicarPalpite(p, l), base)
        expect(final.erros).toBe(6)
        expect(final.status).toBe('derrota')
        expect(final.pontos).toBe(0)
    })
})



