//importar o mongoose
const mongoose = require('mongoose')
//scripts de conexão
const conn = async()=>{
    const atlas = await mongoose.connect('mongodb+srv://userRevisao:ld081205@cluster0.9add4.mongodb.net/revisao')
}

//exportar as infomações para acesso externo
module.exports = conn 