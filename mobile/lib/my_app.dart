import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/pages/home.dart';
import 'package:mobile/pages/login.dart';
import 'package:mobile/pages/register.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Estabelecimentos CRUD',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF0095C1),
      ),
      home:
          const _AuthChecker(), // Define a tela inicial como _AuthChecker para verificar a autenticação do usuário
    );
  }
}

class _AuthChecker extends StatefulWidget {
  const _AuthChecker({Key? key}) : super(key: key);

  @override
  __AuthCheckerState createState() =>
      __AuthCheckerState(); // Cria o estado para _AuthChecker
}

class __AuthCheckerState extends State<_AuthChecker> {
  String? _initialRoute; // Definindo _initialRoute como String nullable

  @override
  void initState() {
    super.initState();
    _initialRoute = null; // Inicializando _initialRoute como null
    _checkAuth(); // Verifica a autenticação do usuário ao inicializar o estado
  }

  Future<void> _checkAuth() async {
    SharedPreferences prefs = await SharedPreferences
        .getInstance(); // Obtém a instância do SharedPreferences
    String? token = prefs.getString('token'); // Obtém o token salvo
    setState(() {
      _initialRoute = token != null && token.isNotEmpty
          ? '/home'
          : '/login'; // Define a rota inicial com base na presença e conteúdo do token
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_initialRoute == null) {
      // Verifica se a rota inicial está vazia (ainda não foi definida)
      return const Scaffold(
          body: Center(
              child:
                  CircularProgressIndicator())); // Exibe um indicador de progresso enquanto verifica a autenticação
    }
    return Navigator(
      // Retorna um Navigator para gerenciar as transições entre telas
      onGenerateRoute: (settings) {
        // Define a função para gerar rotas dinamicamente
        return MaterialPageRoute(
          settings: settings,
          builder: (context) {
            switch (settings.name) {
              case '/home': // Caso a rota seja '/home', retorna a HomePage
                return const HomePage();
              case '/login': // Caso a rota seja '/login', retorna a LoginPage
                return const LoginPage();
              case '/register': // Caso a rota seja '/register', retorna a RegisterPage
                return const RegisterPage();
              default: // Caso contrário, retorna a LoginPage como rota padrão
                return const LoginPage();
            }
          },
        );
      },
      initialRoute:
          _initialRoute, // Define a rota inicial com base no resultado da verificação de autenticação
    );
  }
}
