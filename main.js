// Função para codificar duas strings em base-64
function encrypt(alpha, betha) {
// Concatena as strings 'alpha' e 'betha' e retorna a versão codificada em base-64
    return btoa(alpha + betha);
}

// Estrutura de Dados dos Produtos
// Array contendo dados dos produtos do restaurante
const products = [
    {
        // Identificador único do produto
        id: "insalata-caprese",
        // Nome do produto
        name: "Insalata Caprese",
        // Preço do produto
        price: 9.99,
        // Caminho para a imagem do produto
        image: "assets/images/dish/1.png",
        // Quantidade de calorias do produto
        calories: 300,
        // Tipo do produto (Vegetariano/Não Veg)
        type: "Vegetariano",
        // Tamanho da porção servida
        servingSize: 1
    },
    // Mais produtos seguem no array com estrutura semelhante...
    {
        id: "spaghetti-carbonara",
        name: "Spaghetti Carbonara",
        price: 12.99,
        image: "assets/images/dish/2.png",
        calories: 500,
        type: "Não Veg",
        servingSize: 1
    },
    {
        id: "scaloppine-milanese",
        name: "Scaloppine alla Milanese",
        price: 15.99,
        image: "assets/images/dish/3.png",
        calories: 450,
        type: "Não Veg",
        servingSize: 1
    },
    {
        id: "risotto-funghi",
        name: "Risotto ai Funghi",
        price: 13.50,
        image: "assets/images/dish/4.png",
        calories: 350,
        type: "Vegetariano",
        servingSize: 1
    },
    {
        id: "branzino-grigliato",
        name: "Branzino Grigliato",
        price: 18.99,
        image: "assets/images/dish/5.png",
        calories: 300,
        type: "Não Veg",
        servingSize: 1
    },
    {
        id: "tiramisu",
        name: "Tiramisù",
        price: 89.99,
        image: "assets/images/dish/6.png",
        calories: 420,
        type: "Vegetarsiano",
        servingSize: "1-2"
    }
];

// Classe para gerenciar a conexão com o banco de dados local
class DatabaseConnection {
    // Construtor da classe
    constructor() {
        // Carrega a lista de usuários do localStorage ou inicializa um array vazio
        this.users = JSON.parse(localStorage.getItem('users')) || []
        this.orders = JSON.parse(localStorage.getItem('orders')) || []
        this.cart = JSON.parse(localStorage.getItem('cart')) || []
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null
    }

    // Método para adicionar um novo usuário
    addUser(email, password, name) {
        // Adiciona um novo usuário ao array 'users' com e-mail, senha criptografada e nome
        this.users.push({
            email: email,
            password: encrypt(email, password),// Usa a função 'encrypt' para criptografar a senha
            name: name,
        })
        // Atualiza a lista de usuários no localStorage
        localStorage.setItem('users', JSON.stringify(this.users))
    }

// Método para adicionar um novo pedido
    addOrder(total, address, paymentMethod) {
        // Adiciona um novo pedido ao array 'orders'
        this.orders.push({
            userEmail: this.currentUser.email,    // E-mail do usuário 
            cart: this.cart,                      // Itens no carrinho
            total: total,                        // Total do pedido
            address: address,                    // Endereço para entrega
            paymentMethod: paymentMethod,       // Método de pagamento
        })
    // Atualiza a lista de pedidos no localStorage
        localStorage.setItem('orders', JSON.stringify(this.orders))
    }

// Método para adicionar um item ao carrinho
    addCartItem(productId, quantity, price, image) {
        var existing = false;// Flag para verificar se o item já existe no carrinho
        // Percorre os itens do carrinho
        this.cart.forEach(item => {
            // Se o item já existe, aumenta a quantidade
            if (item.id === productId) {
                existing = true;
                item.quantity += quantity;
                return;
            }
        });
            // Se o item não existir, adiciona um novo item ao carrinho
        if(!existing) {
            this.cart.push({
                id: productId,
                quantity: quantity, 
                price: price,
                image: image
            });
        }
        // Atualiza o carrinho no localStorage      
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
// Método para remover todos os itens do carrinho
    removeCart() {
        this.cart = [];
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
// Método para definir o usuário atual
    setCurrentUser(email, validUntil) {
        // Define o usuário atual com e-mail e tempo de validade
        this.currentUser = {
            email: email,
            validUntil: validUntil
        }
// Atualiza o usuário atual no localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
// Método para remover o usuário atual
    removeCurrentUser() {
        this.currentUser = null
    // Remove o usuário atual do localStorage
        localStorage.removeItem('currentUser')
    }
// Método para obter informações do usuário atual
    findUser(email) {
            // Retorna informações do usuário atual, se ele existir
        return this.users.find(user => user.email === email)
    }

    currentUserInfo() {
        return this.findUser(this.currentUser?.email)
    }
// Método para obter pedidos de um usuário específico
    userOrders(email) {
        return this.orders.filter(order => order.userEmail === email)
    }
}

const databaseConnection = new DatabaseConnection();

// Aguarda o documento estar pronto para executar o código
$(document).ready(function ($) {
    "use strict";// Modo estrito para evitar erros comuns e práticas inseguras

// Configuração do Swiper para a seção de reserva de mesas
    var book_table = new Swiper(".book-table-img-slider", {
        slidesPerView: 1,                                       // Mostra um slide por vez
        spaceBetween: 20,                                       // Espaço entre slides
        loop: true,                                             // Habilita loop contínuo dos slides
        autoplay: {
            delay: 3000,                                        // Tempo de espera antes da mudança automática
            disableOnInteraction: false,                        // Continua o autoplay após interação do usuário
        },
        speed: 2000,                                            // Velocidade da transição entre slides
        effect: "coverflow",                                    // Efeito visual para a transição entre slides
        coverflowEffect: {
            rotate: 3,
            stretch: 2,
            depth: 100,
            modifier: 5,
            slideShadows: false,
        },
        loopAdditionSlides: true,                               // Adiciona slides adicionais ao loop
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",                           
            clickable: true,                                    // Configura a paginação
        },
    });

    // Configuração do Swiper para a seção da equipe
    var team_slider = new Swiper(".team-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    // Adiciona um evento de clique aos elementos com a classe 'filters'
    jQuery(".filters").on("click", function () {
        // Remove a classe 'bydefault_show' do elemento com o id 'menu-dish'
        jQuery("#menu-dish").removeClass("bydefault_show");
    });
    // Função para inicializar a filtragem dos itens do menu
    $(function () {
        var filterList = {
            // Inicializa a biblioteca mixItUp no elemento '#menu-dish'
            init: function () {
                $("#menu-dish").mixItUp({
                    selectors: {
                        target: ".dish-box-wp",// Define os alvos da filtragem
                        filter: ".filter",// Define o seletor do filtro
                    },
                    animation: {
                        effects: "fade",// Define o efeito de animação
                        easing: "ease-in-out",// Define o tipo de easing da animação
                    },
                    load: {
                        filter: ".all, .breakfast, .lunch, .dinner",// Filtra os itens iniciais
                    },
                });
            },
        };
        filterList.init();// Chama o método de inicialização
    });

    // Adiciona um evento de clique ao botão do menu (hamburger)
    jQuery(".menu-toggle").click(function () {
        // Alterna a classe 'toggled' na navegação principal
        jQuery(".main-navigation").toggleClass("toggled");
    });

    // Alterna a classe 'toggled' na navegação principal
    jQuery(".header-menu ul li a").click(function () {
    // Remove a classe 'toggled' da navegação principal
    jQuery(".main-navigation").removeClass("toggled");
    });

    // Registra o plugin ScrollTrigger no GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Seleciona o elemento do cabeçalho
    var elementFirst = document.querySelector('.site-header');
    // Cria um gatilho de rolagem (scroll trigger) com GSAP
    ScrollTrigger.create({
        trigger: "body",// Define o gatilho da animação
        start: "30px top",// Define o ponto de início da animação
        end: "bottom bottom",// Define o ponto final da animação
    // Funções a serem executadas quando o gatilho é ativado e desativado
        onEnter: () => myFunction(),
        onLeaveBack: () => myFunction(),
    });
    // Função para alternar a classe do cabeçalho
    function myFunction() {
        elementFirst.classList.toggle('sticky_head');
    }
    // Seleciona a cena para efeito de paralaxe
    var scene = $(".js-parallax-scene").get(0);
    // Inicializa a instância de paralaxe
    var parallaxInstance = new Parallax(scene);


});

// Espera pelo evento de carregamento da janela para executar o código
jQuery(window).on('load', function () {
    // Remove a classe 'body-fixed' do elemento 'body'
    $('body').removeClass('body-fixed');

    // Ativando a animação da barra de filtro
    // Seleciona todos os elementos com a classe 'filter'    let targets = document.querySelectorAll(".filter");
    let activeTab = 0;                          // Índice da aba ativa
    let old = 0;                                // Índice da aba anterior
    let dur = 0.4;                              // Duração da animação
    let animation;                              // Variável para armazenar a animação

    // Adiciona evento e índice a cada elemento 'filter'
    for (let i = 0; i < targets.length; i++) {
        targets[i].index = i;
        targets[i].addEventListener("click", moveBar);
    }

    // Define a posição inicial da barra 'filter-active'
    gsap.set(".filter-active", {
        x: targets[0].offsetLeft,
        width: targets[0].offsetWidth
    });
    // Função para mover a barra de filtro
    function moveBar() {
        // Verifica se a aba clicada é diferente da aba ativa
        if (this.index != activeTab) {
            // Se uma animação estiver ativa, força seu término
            if (animation && animation.isActive()) {
                animation.progress(1);
            }
            // Cria uma nova linha do tempo para a animação
            animation = gsap.timeline({
                defaults: {
                    duration: 0.4
                }
            });
            // Atualiza os índices da aba ativa e anterior
            old = activeTab;
            activeTab = this.index;
            animation.to(".filter-active", {
                x: targets[activeTab].offsetLeft,
                width: targets[activeTab].offsetWidth
            });
            // Muda a cor da aba anterior e da aba ativ
            animation.to(targets[old], {
                color: "#0d0d25",
                ease: "none"
            }, 0);
            animation.to(targets[activeTab], {
                color: "#fff",
                ease: "none"
            }, 0);

        }

    }
});

// Adiciona um evento de clique ao elemento com a classe 'header-cart'
document.querySelector('.header-cart').addEventListener('click', function() {
    // Cria um novo modal do Bootstrap para o elemento com ID 'cartModal
    var cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

// Função para adicionar ao carrinho
function addToCart(productId, productPrice, productImage) {
    databaseConnection.addCartItem(productId, 1, productPrice, productImage);
    updateCartUI();
}

// Seleciona todos os botões com a classe 'dish-add-btn' e adiciona um evento de clique
document.querySelectorAll('.dish-add-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Obtém os dados do produto a partir dos atributos do botão
        var productId = this.getAttribute('data-id');
        var productPrice = parseFloat(this.getAttribute('data-price').replace(",", "."));
        console.log(productPrice);
        console.log(productPrice);
        var productImage = this.getAttribute('data-image');
        addToCart(productId, productPrice, productImage);
    });
});

// Função para atualizar a quantidade de um item no carrinho
function updateItemQuantity(productId, newQuantity) {
    // Encontra o item no carrinho pelo ID
    var item = databaseConnection.cart.find(item => item.id === productId);
    // Se o item existe e a nova quantidade é maior que zero, atualiza a quantidade
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
    // Se a nova quantidade é zero ou menor, remove o item do carrinho
    } else if (item && newQuantity <= 0) {
        removeFromCart(productId);
    }
    updateCartUI();
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
    var index = databaseConnection.cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        databaseConnection.cart.splice(index, 1);
    }
    updateCartUI();
}

// Calcula o total usando reduce para somar o preço de cada item multiplicado pela sua quantidade
function calculateCartTotal() {
    var total = databaseConnection.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return total.toFixed(2);
}

// Função para renderizar os itens do carrinho no modal
function renderCartItems(selector = '#cartModal .modal-body') {
    // Seleciona o contêiner onde os itens do carrinho serão renderizados
    var cartItemsContainer = document.querySelector(selector);
    // Limpa o contêiner para garantir que está vazio antes de adicionar novos itens
    cartItemsContainer.innerHTML = '';

     // Itera sobre cada item no carrinho
    databaseConnection.cart.forEach(item => {
        // Cria um novo elemento para representar o item do carrinho
        var itemElement = document.createElement('div');
        itemElement.className = 'cart-item'; // Define a classe para estilização
        // Define o HTML interno do item, incluindo a imagem, nome e preço do produto
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.id}" style="width: 50px; height: 50px;">
            <p>${item.id} - R$ ${item.price}</p>
            <span>Quantidade: ${item.quantity}</span>
        `;

        // Cria um botão para diminuir a quantidade do item
        var decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.className = 'quantity-btn decrease';
        // Adiciona um evento de clique que diminui a quantidade do item
        decreaseButton.addEventListener('click', function() {
            updateItemQuantity(item.id, item.quantity - 1);
        });
        itemElement.appendChild(decreaseButton);// Adiciona o botão ao item

        // Cria um botão para aumentar a quantidade do item
        var increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.className = 'quantity-btn increase';
        // Adiciona um evento de clique que aumenta a quantidade do item
        increaseButton.addEventListener('click', function() {
            updateItemQuantity(item.id, item.quantity + 1);
        });
        itemElement.appendChild(increaseButton);// Adiciona o botão ao item

        // Cria um botão para remover o item do carrinho
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-btn'
        // Adiciona um evento de clique que remove o item do carrinho;
        removeButton.addEventListener('click', function() {
            removeFromCart(item.id);
        });
        itemElement.appendChild(removeButton);// Adiciona o botão ao item
        // Adiciona o elemento do item ao contêiner do carrinho
        cartItemsContainer.appendChild(itemElement);
    });
    // Cria um elemento para mostrar o total do carrinho
    var totalElement = document.createElement('div');
    totalElement.className = 'total';// Define a classe para estilização
     // Define o conteúdo de texto do elemento total com o valor calculado do carrinho
    totalElement.textContent = `Total: R$ ${calculateCartTotal()}`;
      // Adiciona o elemento total ao contêiner do carrinho
    cartItemsContainer.appendChild(totalElement);
}

// Função para atualizar a interface do usuário do carrinho
function updateCartUI() {
    // Calcula o total de itens no carrinho
    var totalItems = databaseConnection.cart.reduce((total, item) => total + item.quantity, 0);
     // Atualiza o texto do elemento com a classe 'cart-number' para mostrar o total de itens
    document.querySelector('.cart-number').textContent = totalItems;
    // Chama a função renderCartItems para atualizar os itens visualizados no carrinho
    renderCartItems();

    // Obtém o botão de checkout pelo ID
    var checkoutButton = document.getElementById('checkoutButton');
    // Desabilita o botão de checkout se o carrinho estiver vazio
    checkoutButton.disabled = databaseConnection.cart.length === 0;
}

// Adiciona um evento de clique ao botão de checkout
document.getElementById('checkoutButton').addEventListener('click', function() {
    // Verifica se o carrinho está vazio
    if (databaseConnection.cart.length === 0) {
        alert('Seu carrinho está vazio!');// Exibe um alerta se o carrinho estiver vazio
    } else {
        checkLogin('checkout.html');// Chama a função checkLogin se houver itens no carrinho
    }
});

// Função para cadastrar um novo usuário
function register() {
    // Obtém os valores dos campos do formulário
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var name = document.getElementById('name').value;

     // Verifica se as senhas conferem
    if (password !== confirmPassword) {
        alert('As senhas não conferem!');// Exibe um alerta se as senhas não forem iguais
        return;
    }

    // Procura um usuário existente com o mesmo e-mail
    databaseUser = databaseConnection.findUser(email);
    if (databaseUser) {
        alert('Já existe um usuário cadastrado com esse e-mail!');// Alerta se o usuário já existir
        return;
    }

    // Define o usuário atual e adiciona um novo usuário ao banco de dados
    databaseConnection.setCurrentUser(email, new Date().getTime() + 3000000);
    databaseConnection.addUser(email, password, name);

    alert('Usuário cadastrado com sucesso!');// Alerta de sucesso na criação do usuário
    window.location.href = 'index.html';// Redireciona para a página inicial
}

// Função para fazer login
function login() {
    // Obtém os valores dos campos de e-mail e senha do formulário de login
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    // Procura um usuário com o e-mail fornecido no banco de dados
    var user = databaseConnection.findUser(email);

    // Verifica se o usuário existe
    if (!user) {
        alert('Usuário ou senha incorretos!');// Exibe um alerta se o usuário não for encontrado
        return;
    }

    // Verifica se a senha fornecida, após ser criptografada, corresponde à senha armazenad
    var validPassword = password && encrypt(email, password) === user.password;

    // Se o usuário existir e a senha for válida
    if (user && validPassword) {
        // Define o usuário atual com um tempo de validade para a sessão
        databaseConnection.setCurrentUser(email, new Date().getTime() + 3000000);
        // Redireciona para a página inicial após o login bem-sucedido
        window.location.href = 'index.html';
    } else {
        alert('Usuário ou senha incorretos!');// Exibe um alerta se a senha for incorreta
    }
}

// Função para verificar se o usuário está logado
function checkLogin(goToPage = "user.html") {
    // Obtém o usuário atual
    var currentUser = databaseConnection.currentUser;
    // Se não houver um usuário logado, redireciona para a página de login ou registro
    if (!currentUser) {
        window.location.href = 'login_or_register.html';
        return;
    }
    // Verifica se a sessão do usuário ainda é válida
    var validUntil = currentUser.validUntil;
    // Se a sessão expirou, remove o usuário atual e redireciona para a página de login
    if (validUntil < new Date().getTime()) {
        databaseConnection.removeCurrentUser();

        alert('Sessão expirada! Faça login novamente.');
        window.location.href = 'login_or_register.html';
        return;
    }
    // Se o usuário estiver logado e a sessão for válida, redireciona para a página especificada
    window.location.href = goToPage;
}

// Função para fazer logout
function logout() {
    // Remove o usuário atual e limpa o carrinho
    databaseConnection.removeCurrentUser();
    databaseConnection.removeCart();
     // Redireciona para a página inicial após o logout
    window.location.href = 'index.html';
}

 // Redireciona para a página inicial após o logout
function makeOrder() {
    // Calcula o total do carrinho
    var total = calculateCartTotal();
    // Obtém o endereço e o método de pagamento dos campos de entrada
    var address = document.getElementById('address').value;
    var payment = document.getElementById('payment').value;

    // Verifica se o endereço foi fornecido
    if(!address) {
        alert('Informe o endereço de entrega!');
        return;
    }
    // Verifica se um método de pagamento válido foi selecionado
    if(payment === 'INVALID') {
        alert('Selecione um método de pagamento válido!');
        return;
    }
    // Adiciona o pedido ao banco de dados e limpa o carrinho
    databaseConnection.addOrder(total, address, payment);
    databaseConnection.removeCart();
    // Mostra um alerta de sucesso e redireciona para a página do usuário
    alert('Pedido realizado com sucesso!');
    window.location.href = 'user.html';
}

// Função para carregar informações do usuário
function loadUserInfo() {
    // Obtém informações do usuário atual
    var currentUser = databaseConnection.currentUserInfo();
    // Atualiza o conteúdo do nome e e-mail do usuário na página
    document.getElementById('name').textContent = currentUser.name;
    document.getElementById('email').textContent = currentUser.email;
    
    // Obtém os pedidos feitos pelo usuário
    var orders = databaseConnection.userOrders(currentUser.email);

    // Seleciona o contêiner onde os pedidos serão exibidos
    var ordersContainer = document.querySelector('#orders');

    // Itera sobre cada pedido e exibe na página
    orders.forEach(item => {
        cartItems = item.cart.map(cartItem => {
            return `- ${cartItem.id} - ${cartItem.quantity}x`;// Formata os itens do carrinho
        }).join('<br>');
        // Cria um novo elemento de tabela para cada pedido
        var itemElement = document.createElement('tr');
        itemElement.innerHTML = `
            <td style="text-align: left !important">${cartItems}</td>
            <td>${item.address}</td>
            <td>${item.paymentMethod}</td>
            <td>R\$ ${item.total}</td>
        `;
        // Adiciona o elemento de pedido ao contêiner
        ordersContainer.appendChild(itemElement);
    });
}

function loadCheckoutInfo() {
    // Obtém informações do usuário atual
    var currentUser = databaseConnection.currentUserInfo();
    // Se não houver um usuário logado, redireciona para a página de login ou registro
    if(!currentUser) {
        window.location.href = 'login_or_register.html';
        return;
    }
    
    // Obtém o carrinho do usuário
    var cart = databaseConnection.cart;
    // Se o carrinho estiver vazio, redireciona para a página inicial
    if(cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    // Seleciona o contêiner onde os itens do carrinho serão exibidos no checkout
    var cartItemsContainer = document.querySelector("#cart");
    cartItemsContainer.innerHTML = '';// Limpa o contêiner

    // Itera sobre cada item no carrinho
    databaseConnection.cart.forEach(item => {
        // Cria um novo elemento para representar o item do carrinho
        var itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        // Define o HTML interno do item, incluindo imagem, nome e preço
        itemElement.innerHTML = `
        <li class="list-group-item d-flex justify-content-between lh-sm align-middle">
            <img src="${item.image}" alt="${item.id}" style="width: 50px; height: 50px; margin: 16px">
            <span style="margin-top: 32px; font-weight: bold">${item.id}</span>
            <span style="margin-top: 32px">Quantidade: ${item.quantity}</span>
            <span style="margin-top: 32px; margin-right: 16px;">Preço: ${item.price}</span>

        </li>
        `;
        // Adiciona o elemento do item ao contêiner do carrinho
        cartItemsContainer.appendChild(itemElement);
    });
    // Atualiza o texto do elemento com o total do carrinho
    document.getElementById('total').textContent = `R$ ${calculateCartTotal()}`;
}
// Atualiza a interface do usuário do carrinho ao carregar a página
updateCartUI()
