async function fetchRunnerData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/WALERIAMF/olimpiadas/main/JSON_Corredor.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar os dados do corredor:', error);
    }
}

async function fetchCircuitData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/WALERIAMF/olimpiadas/main/JSON_Circuito.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar os dados do circuito:', error);
    }
}

async function displayRunnerData() {
    const runnerData = await fetchRunnerData();
    if (runnerData) {
        document.getElementById("runnerName").innerText = `${runnerData.nome} vai levar a tocha pela França hoje`;
        document.getElementById("runnerDescription").innerText = runnerData.descrição;
        document.getElementById("runButton").innerText = `Onde ${runnerData.nome.split(" ")[0]} vai correr hoje?`;
    }
}

displayRunnerData();


async function changeCities() {
    const circuitData = await fetchCircuitData();

    if (!circuitData || !Array.isArray(circuitData)) {
        console.error('Dados do circuito inválidos');
        return;
    }

    const availableCities = circuitData.filter(city => city && city.fator_desidratação !== null);

    if (!availableCities.some(city => city.cidade === 'Paris')) {
        availableCities.push({ cidade: 'Paris' });
    }

    const randomCityData = availableCities[Math.floor(Math.random() * availableCities.length)];

    const randomCity = randomCityData.cidade;

    document.body.style.backgroundImage = `url('${citiesBackground[randomCity]}')`;

    const firstName = document.getElementById("runnerName").innerText.split(" ")[0];

    if (randomCity === "Paris") {
        document.getElementById("torchGif").src = "https://media.tenor.com/9Vsj61rqfw4AAAAj/olympics-olympic.gif";
        document.getElementById("runnerName").style.display = "none";
        document.getElementById("runnerDescription").style.display = "none";
        document.getElementById("runButton").style.display = "none";
        document.getElementById("parisMessage").style.display = "block";
        document.getElementById("refreshButton").style.display = "block"; // Mostrar o botão de recarregar
        document.getElementById("parisMessage").innerHTML = `<b>${firstName}</b> está em <b>${randomCity}</b> e acendeu a tocha sem suar e sem correr`;


    } else {
        document.getElementById("torchGif").src = "https://media1.tenor.com/m/Zp3d4TlEWP4AAAAC/dodgeball-academia-dodgeball.gif";
        document.getElementById("runnerName").style.display = "none"; // Oculta o nome completo do corredor
        document.getElementById("runnerDescription").style.display = "block";
        document.getElementById("runButton").style.display = "block";
        document.getElementById("parisMessage").style.display = "none";

        // Exibir a mensagem do local atual
        const garrafasNecessarias = await calculateWaterConsumption(randomCityData); // Passa os dados do circuito como argumento
        if (!isNaN(garrafasNecessarias)) { // Verificar se o cálculo não é um NaN
            document.getElementById("runnerDescription").innerHTML = `<b>${firstName}</b> está correndo em <b>${randomCity}</b>,<br> percorrendo <b>${randomCityData.distancia_para_prox} km</b> e consumindo <b>${garrafasNecessarias}</b> garrafas de água, <br> durante o percurso com <b>${randomCityData.fator_desidratação}</b> fator de desidratação`;

        } else {
            console.error('Erro ao calcular o número de garrafas necessárias.');
            document.getElementById("runnerDescription").innerText = `${firstName} está correndo em ${randomCity}. Não foi possível calcular o número de garrafas necessárias.`;
        }
    }
}

async function calculateWaterConsumption(circuitData) {
    if (!circuitData) {
        console.error('Dados do circuito inválidos');
        return NaN;
    }

    // Obter dados do corredor
    const runnerData = await fetchRunnerData();

    // Verificar unidade de medida da velocidade do corredor
    let velocidade;
    if (runnerData.velocidade_media.unidade_de_medida === "km/h") {
        velocidade = runnerData.velocidade_media.velocidade;
    } else {
        // Converter velocidade de m/s para km/h
        velocidade = runnerData.velocidade_media.velocidade * 3.6;
    }

    // Calcular o tempo de corrida em horas
    const tempoCorridaHoras = circuitData.distancia_para_prox / velocidade;

    // Calcular o consumo de água baseado nas condições do percurso
    let consumoAgua = tempoCorridaHoras * 1.1; // Trecho moderado

    if (circuitData.fator_desidratação === "Alto") {
        consumoAgua *= 1.2; // Trecho de alta temperatura
    } else if (circuitData.fator_desidratação === "Baixo") {
        consumoAgua *= 0.8; // Trecho de temperatura confortável
    }

    // Calcular o número de garrafas de água necessárias
    const garrafasNecessarias = Math.ceil(consumoAgua / 0.8); // Cada garrafa contém 0.8 litros

    return garrafasNecessarias;
}


const citiesBackground = {
    "Paris": "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_lg_2x/f_auto/primary/vc4ucoz6rs96naqnk3jb",
    "Marseille": "https://th.bing.com/th/id/R.3cd9b06bdb58204cd745763f6783ca37?rik=kaMCGp%2fyBZ2Lig&riu=http%3a%2f%2fwww.telegraph.co.uk%2fcontent%2fdam%2fTravel%2fDestinations%2fEurope%2fFrance%2fMarseille%2fmarseille-attractions-cathedraldelamajor-xlarge.jpg&ehk=nCfUbU962VlVvmlwrdkDw8kuDu0f%2b5xpnn3H6ZLiDyA%3d&risl=&pid=ImgRaw&r=0",
    "Montpellier": "https://www.alibabuy.com/photos/library/1500/11144.jpg",
    "Pau":"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/07/72/62/photo2jpg.jpg?w=1200&h=-1&s=1",
    "Bordeaux":"https://blog.radissonblu.com/wp-content/uploads/2018/06/Bordeaux-cover.jpg",
    "Châteauroux":"https://www.chateauroux-tourisme.com/app/uploads/iris-images/5213/bsp-8193-1920x1080-c.webp",
    "Brest":"https://mediaim.expedia.com/destination/1/8d9a6882b31ec345332696164aa5d8c3.jpg",
    "Valence":"https://www.deepheartoffrance.com/wp-content/uploads/2022/05/VALENCE-028-scaled.jpg",
    "Chamonix":"https://static.seetheworld.com/image_uploader/photos/98/original/chamonix-mont-blanc-chamonix-centre.jpg",
    "Strasbourg":"https://about-france.com/cities/citypix/strasbourg-2.jpg",
    "Saint-Quentin":"https://upload.wikimedia.org/wikipedia/commons/7/78/St_quentin_hotel_de_ville.JPG",




};

function refreshPage() {
    window.location.reload();
}