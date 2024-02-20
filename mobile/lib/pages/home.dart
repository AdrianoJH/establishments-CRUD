// ignore_for_file: use_build_context_synchronously, avoid_print, library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:mobile/pages/messages.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/establishment_model.dart';
import '../services/api_service.dart';
import 'login.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<EstablishmentModel>> _establishments = Future.value([]);
  int _currentIndex = 0; // Índice da página atual
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _loadEstablishments(); // Carrega os estabelecimentos ao iniciar a página
    _pageController = PageController(
        initialPage:
            _currentIndex); // Controlador da página inicializado com o índice atual
  }

  @override
  void dispose() {
    _pageController
        .dispose(); // Libera o controlador de página quando o widget é destruído
    super.dispose();
  }

  Future<void> _loadEstablishments() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String token = prefs.getString('token') ??
        ''; // Obtém o token do usuário salvo no SharedPreferences

    try {
      List<EstablishmentModel> establishments =
          await ApiService.fetchEstablishments(
              token); // Busca os estabelecimentos na API usando o token
      setState(() {
        _establishments = Future.value(
            establishments); // Atualiza o estado dos estabelecimentos com os dados obtidos
      });
    } catch (e) {
      print(
          'Erro ao buscar estabelecimentos: $e'); // Trata e exibe erros ao buscar os estabelecimentos
    }
  }

  Future<void> _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token'); // Remove o token do usuário ao fazer logout
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
          builder: (context) =>
              const LoginPage()), // Redireciona para a página de login após o logout
    );
  }

  Widget _buildEstablishmentsList(List<EstablishmentModel> establishments) {
    // Constrói a lista de estabelecimentos exibida na tela
    return ListView.builder(
      itemCount: establishments.length,
      itemBuilder: (context, index) {
        final establishment = establishments[index];
        return Card(
          // Cria um card para cada estabelecimento
          elevation: 20,
          margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(0),
          ),
          color: const Color(0xFF030F1E),
          child: Padding(
            padding: const EdgeInsets.only(left: 8),
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Container(
                width: 70,
                height: 70,
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: const Color(0xFF17233A),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF000001).withOpacity(0.5),
                      spreadRadius: 1,
                      blurRadius: 3,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: establishment.image.endsWith('.svg')
                    ? SvgPicture.network(
                        establishment.image,
                        width: 40,
                        height: 40,
                      )
                    : CachedNetworkImage(
                        imageUrl: establishment.image,
                        width: 40,
                        height: 40,
                        placeholder: (context, url) =>
                            const CircularProgressIndicator(),
                        errorWidget: (context, url, error) =>
                            const Icon(Icons.error),
                      ),
              ),
              title: SizedBox(
                width: 50,
                child: Text(
                  establishment.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFDFE5EB),
                  ),
                ),
              ),
              subtitle: SizedBox(
                width: 50,
                child: Text(
                  establishment.phone,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFDFE5EB),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF071329),
        title: Row(
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Image.asset(
                "images/logo.png",
                fit: BoxFit.contain,
                width: 25,
                height: 25,
              ),
            ),
            const Text(
              'Estabelecimentos CRUD',
              style: TextStyle(
                fontSize: 18,
                color: Color(0xFFDFE5EB),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            color: const Color(0xFFDFE5EB),
            icon: const Icon(Icons.logout),
            onPressed: _logout, // Ação de logout ao clicar no ícone de logout
          ),
        ],
      ),
      body: Container(
        // Corpo da página
        padding: const EdgeInsets.only(top: 10),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF3b414d), // Cor #3b414d
              Color(0xFF595f70), // Cor #595f70
            ],
          ),
        ),
        child: PageView(
          controller: _pageController,
          onPageChanged: (index) {
            setState(() {
              _currentIndex =
                  index; // Atualiza o índice da página atual ao mudar de página
            });
          },
          children: [
            FutureBuilder(
              // Exibe os estabelecimentos carregados no futuro
              future: _establishments,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  // Se estiver carregando, exibe um indicador de progresso
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  // Se ocorrer um erro, exibe uma mensagem de erro
                  return Center(child: Text('Erro: ${snapshot.error}'));
                } else {
                  // Se estiver tudo bem, exibe a lista de estabelecimentos
                  List<EstablishmentModel> establishments =
                      snapshot.data as List<EstablishmentModel>;
                  return _buildEstablishmentsList(establishments);
                }
              },
            ),
            const MessagePage(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        // Barra de navegação inferior
        backgroundColor: const Color(0xFF071329),
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFF009CF4),
        unselectedItemColor: const Color(0xFFDFE5EB),
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() {
            _currentIndex =
                index; // Atualiza o índice da página atual ao tocar em um item da barra de navegação
          });
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 400),
            curve: Curves.ease,
          );
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(
              Icons.home,
            ),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.message,
            ),
            label: 'Enviar Mensagem',
          ),
        ],
      ),
    );
  }
}
