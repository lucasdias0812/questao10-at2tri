const atividades = require('../models/atividades')
const usuarios = require('../models/usuarios')

module.exports = (app) => {
    app.get('/atividades', async (req, res) => {
        //capturar o id da barra de endereço
        var id = req.query.id
        //buscar o nome na collection usuarios
        var user = await usuarios.findOne({ _id: id })
        //buscar todas as atividades desse usuário
        var abertas = await atividades.find({ usuario: id, status: 0 }).sort({ data: 1 })
        //buscar todas as atividades desse usuário
        var entregues = await atividades.find({ usuario: id, status: 1 }).sort({ data: 1 })
        //buscar todas as atividades desse usuário
        var excluidas = await atividades.find({ usuario: id, status: 2 }).sort({ data: 1 })
        //console.log(buscar)
        //res.render('atividades.ejs',{nome:user.nome,id:user._id,dados:abertas,dadosx:excluidas,dadose:entregues})
        //res.render('accordion.ejs',{nome:user.nome,id:user._id,dados:abertas,dadosx:excluidas,dadose:entregues})
        res.render('atividades.ejs', { nome: user.nome, id: user._id, dados: abertas, dadosx: excluidas, dadose: entregues })

    })
    app.post('/atividades', async (req, res) => {
        //recuperando as informações digitadas
        var dados = req.body
        //console.log(dados)
        //conectar com o database
        const conexao = require('../config/database')()
        //model atividades
        const atividades = require('../models/atividades')
        //salvar as informações do formulário no database
        var salvar = await new atividades({
            data: dados.data,
            instrucoes: dados.orientacao,
            usuario: dados.id
        }).save()
        res.redirect('/atividades?id=' + dados.id)
    })

    app.get("/excluir", async (req, res) => {
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        var excluir = await atividades.findOneAndRemove({ _id: id })
        //redirecionar para a rota atividades
        res.redirect('/atividades?id=' + excluir.usuario)
    })

    app.get("/consumido", async (req, res) => {
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        var consumido = await atividades.findOneAndUpdate(
            { _id: id },
            { status: 2 }
        )
        //redirecionar para a rota atividades
        res.redirect('/atividades?id=' + consumido.usuario)
    })

    app.get("/vencido", async (req, res) => {
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        var vencido = await atividades.findOneAndUpdate(
            { _id: id },
            { status: 1 }
        )
        //redirecionar para a rota atividades
        res.redirect('/atividades?id=' + vencido.usuario)
    })

    app.get("/desfazer", async (req, res) => {
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        var desfazer = await atividades.findOneAndUpdate(
            { _id: id },
            { status: 0 }
        )
        //redirecionar para a rota atividades
        res.redirect('/atividades?id=' + desfazer.usuario)
    })

    //criar a rota para renderizar a view alterar
    app.get('/alterar', async (req, res) => {
        //capturar o id(atividade) da barra de endereço
        var id = req.query.id
        //buscar a atividade que será alterada
        var alterar = await atividades.findOne({ _id: id })
        //buscar o nome na collection usuarios
        var user = await usuarios.findOne({ _id: alterar.usuario })
        //abrir a view alterar
        res.render('alterar.ejs', { nome: user.nome, id: user._id, dados: alterar })
    })

    //rota para gravar as alterações na atividade
    app.post('/alterar', async (req, res) => {
        var id_a = req.query.id
        //quais são as informações digitadas?
        var infos = req.body
        console.log(infos)
        //gravar as alterações na collection atividades
        var gravar = await atividades.findOneAndUpdate(
            { id: infos.id_a }, 
            { data: infos.data,
              instrucoes: infos.orientacao 
            }
        )
        res.redirect('/atividades?id='+infos.id)
    })
}