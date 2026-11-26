// define a classe de erro, permitindo a associação
export class ErroApp extends Error {
    constructor(message: string, public readonly status: number){
        super(message)
    }
}