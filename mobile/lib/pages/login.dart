// ignore_for_file: library_private_types_in_public_api, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:mobile/pages/register.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/pages/home.dart';
import 'package:mobile/services/api_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() =>
      _LoginPageState(); // Criação do estado associado à página de login
}

class _LoginPageState extends State<LoginPage> {
  final _formKey =
      GlobalKey<FormState>(); // Chave global para o formulário de validação
  final TextEditingController _emailController =
      TextEditingController(); // Controlador para o campo de email
  final TextEditingController _passwordController =
      TextEditingController(); // Controlador para o campo de senha
  bool hidePassword = true; // Variável para controlar a visibilidade da senha

  // Método para lidar com o processo de login
  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      // Validando o formulário
      String email =
          _emailController.text.trim(); // Obtendo o email do campo de texto
      String password =
          _passwordController.text.trim(); // Obtendo a senha do campo de texto
      try {
        String token = await ApiService.login(email,
            password); // Tentando realizar o login através do serviço de API
        SharedPreferences prefs = await SharedPreferences
            .getInstance(); // Obtendo as preferências compartilhadas
        await prefs.setString('token',
            token); // Salvando o token de autenticação nas preferências compartilhadas
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) =>
                  const HomePage()), // Navegando para a página inicial após o login bem-sucedido
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          // Exibindo mensagem de erro em caso de falha no login
          content: Text('Falha ao fazer login: $e'),
          backgroundColor: Colors.red,
        ));
      }
    }
  }

  // Método para navegar para a página de registro
  void _goToRegisterPage() {
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) =>
              const RegisterPage()), // Navegando para a página de registro
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: const Color(0xFF071329),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey, // Usando a chave global para o formulário
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Align(
                  alignment: Alignment.center,
                  child: Image.asset(
                    "images/logo.png",
                    fit: BoxFit.contain,
                    width: 330,
                    height: 108,
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(bottom: 20.0),
                  child: const Text(
                    'Login',
                    style: TextStyle(
                      color: Color(0xFFDFE5EB),
                      fontSize: 24.0,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      height: 40.0,
                      decoration: BoxDecoration(
                        color: const Color(0xFF17233A),
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: Container(
                        alignment: Alignment.center,
                        height: 40,
                        padding: const EdgeInsets.only(bottom: 2, top: 5),
                        child: TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            hintText: 'E-mail',
                            hintStyle: TextStyle(color: Color(0xFF6B6B6B)),
                            border: InputBorder.none,
                            prefixIcon: Icon(Icons.email,
                                color: Color(0xFFDFE5EB), size: 18),
                            prefixIconConstraints: BoxConstraints(minWidth: 30),
                          ),
                          style: const TextStyle(color: Color(0xFFDFE5EB)),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, insira um email';
                            }
                            return null;
                          },
                          textAlignVertical: TextAlignVertical.center,
                        ),
                      ),
                    ),
                    // Campo de senha
                    Container(
                      margin: const EdgeInsets.only(top: 20.0),
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      height: 40.0,
                      decoration: BoxDecoration(
                        color: const Color(0xFF17233A),
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: TextFormField(
                        controller: _passwordController,
                        obscureText: hidePassword,
                        decoration: InputDecoration(
                          hintText: 'Senha',
                          hintStyle: const TextStyle(color: Color(0xFF6B6B6B)),
                          border: InputBorder.none,
                          prefixIcon: const Icon(
                            Icons.lock,
                            color: Color(0xFFDFE5EB),
                            size: 18,
                          ),
                          prefixIconConstraints:
                              const BoxConstraints(minWidth: 30),
                          suffixIcon: IconButton(
                            onPressed: () {
                              setState(() {
                                hidePassword = !hidePassword;
                              });
                            },
                            color: const Color(0xFFDFE5EB),
                            icon: Icon(hidePassword
                                ? Icons.visibility
                                : Icons.visibility_off),
                          ),
                          contentPadding:
                              const EdgeInsets.symmetric(vertical: 8.0),
                        ),
                        style: const TextStyle(color: Color(0xFFDFE5EB)),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Por favor, insira uma senha';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                // Botão de login
                ElevatedButton(
                  onPressed: _login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 26, 43, 74),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 15.5),
                  ),
                  child: const Text(
                    'Entrar',
                    style: TextStyle(fontSize: 18, color: Color(0xFFDFE5EB)),
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Ainda não possui conta?',
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFFDFE5EB),
                      ),
                    ),
                    TextButton(
                      onPressed: _goToRegisterPage,
                      child: const Text(
                        'Cadastre-se',
                        style: TextStyle(
                          fontSize: 14,
                          color: Color(0xFFDFE5EB),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
