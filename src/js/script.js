//Declarações dos Elementos usando DOM(DOcument objetc Model)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado =  document.getElementById("saida");
const canvas = document.getElementById("canvas");



//Função para habilitar a câmera

async function configurarCamera(){
    try{
        //chama a api do navegador para solicitar acesso
        const midia= await navigator.mediaDevices.getUserMedia({
            //habilit a câmera traseira
            video:{facingMode:"environment"},
            audio:false
        });
        //recebe a função para midia para ser executada
        videoElemento.srcObject=midia;
        //força a reprodução do video
        videoElemento.onplay();

    }catch(erro){
        resultado.innerText="Erro ao acessar a Câmera",erro;

    }
}
//executando a função
configurarCamera();
//função para capturar o texto da câmera
botaoScanear.onclick =async ()=>{
    botaoScanear.disable=true; //habilitando a camera
    resultado.innerText="Fazendo a leitura do texto ... aguarde";

    //Define o canvas para inicar a leitura
    const contexto = canvas.getContext("2d");

    //ajusta o tamanho do canvas para o tamanho real do video 
    canvas.width =videoElemento.videoWidth;
    canvas.height =videoElemento.videoHeight;

    //aplica o filtron para melhorar o OCR
    contexto.filter='conrast(1.2) grayscale(1)';

    //desenha o video no canvas
    contexto.drawImage(videoElemento,0,0,canvas.width,canvas.height);
    try{
        const {data:{ text }}= await Tesseract.recognize(
            canvas,
            'por'//define o idioma
        );
        //remove os espaços em brancos 
        const textoFinal = text.trim();
        //estrutura condicional  ternaria ?=if : =else    
        resultado.innerText=textoFinal.length > 0? textoFinal:"Não foi possivel identificar o texto "


    }catch(erro){
        resultado.innerText="Erro no processamento",erro

    }
    finally{
        //desabilita o botão para fazer nova captura
        botaoScanear.disabled=false;

    }
}