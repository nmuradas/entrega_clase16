import knexLib from 'knex'

class ContenedorP {
    constructor(config) {
        this.knex = knexLib(config)
    }

    crearTabla(){
        return this.knex.schema.dropTableIfExists('productos')
        .finally(()=>{
            return this.knex.schema.createTable('productos', table=> {
                table.increments('id').primary();
                table.string('title', 50).notNullable();
                table.string('thumbnail', 100).notNullable();
                table.float('price')
            })
        })
    }

    async save(productos) {
        const result =  this.knex('productos').insert(productos)
        return await result
    }

    async getAll() {
        const result = this.knex('productos').select('*')
        return await result
    }

}
    
    export default ContenedorP;