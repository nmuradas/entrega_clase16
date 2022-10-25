import knexLib from 'knex'
class ContenedorM {
  constructor(config) {
      this.knex = knexLib(config)
  }

  crearTabla(){
      return this.knex.schema.dropTableIfExists('mensajes')
      .finally(()=>{
          return this.knex.schema.createTable('mensajes', table=> { 
              table.string('email', 50).notNullable();
              table.string('message', 10).notNullable();
              table.date('date');
          })
      })
  }

  async save(mensajes) {
      const result = this.knex('mensajes').insert(mensajes)
      return await result
  }

  async getAll() {
      const result = this.knex('mensajes').select('*')
      return await result 
      
  }

}

  
  export default ContenedorM;