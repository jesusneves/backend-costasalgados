require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

async function enviarMensagem(numero, mensagem) {

  const telefone = numero
    .replace(/\D/g, "");

  return axios.post(
    `${process.env.EVOLUTION_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
    {
      number: `55${telefone}`,
      text: mensagem
    },
    {
      headers: {
        apikey: process.env.EVOLUTION_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
}

app.post("/api/pedido/producao", async (req,res)=>{

  try{

    const {
      nome,
      telefone,
      pedidoId
    } = req.body;

    await enviarMensagem(
      telefone,
      `🍔 Olá ${nome}!\n\nSeu pedido ${pedidoId} entrou em produção.`
    );

    res.json({
      success:true
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      success:false
    });

  }

});

app.post("/api/pedido/pronto", async (req,res)=>{

  try{

    const {
      nome,
      telefone,
      pedidoId
    } = req.body;

    await enviarMensagem(
      telefone,
      `✅ Olá ${nome}!\n\nSeu pedido ${pedidoId} está pronto para retirada.`
    );

    res.json({
      success:true
    });

  }catch(err){

    res.status(500).json({
      success:false
    });

  }

});

app.post("/api/pedido/em-rota", async (req,res)=>{

  try{

    const {
      nome,
      telefone,
      pedidoId,
      rastreioLink
    } = req.body;

    await enviarMensagem(
      telefone,
      `🚚 Olá ${nome}!\n\nSeu pedido está a caminho!\n\n${rastreioLink}`
    );

    res.json({
      success:true
    });

  }catch(err){

    res.status(500).json({
      success:false
    });

  }

});

app.get("/teste-whatsapp", async (req, res) => {

  try {

    const resultado = await enviarMensagem(
      "21993876478",
      "🚀 Teste Backend SalgadosCosta + Evolution"
    );

    res.json(resultado.data);

  } catch (erro) {

    console.error(
      erro.response?.data || erro.message
    );

    res.status(500).json(
      erro.response?.data || {
        erro: erro.message
      }
    );

  }

});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "Backend SalgadosCosta"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.listen(process.env.PORT, ()=>{

  console.log("Servidor iniciado");

});