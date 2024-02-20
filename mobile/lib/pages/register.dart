// ignore_for_file: library_private_types_in_public_api, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:mobile/pages/login.dart';
import 'package:mobile/services/api_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  _RegisterPageState createState() =>
      _RegisterPageState(); // Criando o estado da página de registro
}

// Estado da página de registro
class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>(); // Chave global para o formulário
  late TextEditingController
      _emailController; // Controlador para o campo de email
  late TextEditingController
      _passwordController; // Controlador para o campo de senha
  late TextEditingController
      _confirmPasswordController; // Controlador para confirmar o campo de senha
  bool hidePassword = true; // Variável para controlar a visibilidade da senha

  @override
  void initState() {
    super.initState();
    _emailController =
        TextEditingController(); // Inicializando o controlador de email
    _passwordController =
        TextEditingController(); // Inicializando o controlador de senha
    _confirmPasswordController =
        TextEditingController(); // Inicializando o controlador de confirmar a senha
  }

  @override
  void dispose() {
    _emailController.dispose(); // Liberando recursos do controlador de email
    _passwordController.dispose(); // Liberando recursos do controlador de senha
    _confirmPasswordController
        .dispose(); // Liberando recursos do controlador de confirmar a senha
    super.dispose();
  }

  // Método para lidar com o registro do usuário
  void _register() async {
    // Verifica se o formulário é válido
    if (_formKey.currentState!.validate()) {
      // Obtém o email e senha dos campos de texto
      String email = _emailController.text.trim();
      String password = _passwordController.text.trim();
      try {
        // Chama o serviço de registro e aguarda a resposta
        final message = await ApiService.register(email, password);

        // Exibe uma mensagem de sucesso
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(message),
            backgroundColor: Colors.green, // Cor de fundo verde para sucesso
          ),
        );

        // Limpa os campos após o registro bem-sucedido
        _emailController.clear();
        _passwordController.clear();

        // Navega para a página de login após o registro
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      } catch (e) {
        // Em caso de erro, exibe uma mensagem de falha
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Falha ao registrar: $e'),
            backgroundColor: Colors.red, // Cor de fundo vermelha para falha
          ),
        );
      }
    }
  }

  // Método para navegar para a página de login
  void _goToLoginPage() {
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) =>
              const LoginPage()), // Navegando para a página de login
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: const Color(0xFF071329),
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey, // Associando a chave global ao formulário
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
                  'Cadastro',
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
                        controller:
                            _emailController, // Controlador para o campo de email
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
                            return 'Por favor, insira um email'; // Validando o campo de email
                          }
                          return null;
                        },
                        textAlignVertical: TextAlignVertical.center,
                      ),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 20.0),
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    height: 40.0,
                    decoration: BoxDecoration(
                      color: const Color(0xFF17233A),
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: TextFormField(
                      controller:
                          _passwordController, // Controlador para o campo de senha
                      obscureText: hidePassword, // Ocultando o texto da senha
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
                              hidePassword =
                                  !hidePassword; // Alternando a visibilidade da senha
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
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFDFE5EB),
                      ),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 20.0),
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    height: 40.0,
                    decoration: BoxDecoration(
                      color: const Color(0xFF17233A),
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: TextFormField(
                      controller: _confirmPasswordController,
                      obscureText: hidePassword, // Ocultando o texto da senha
                      decoration: InputDecoration(
                        hintText: 'Confirmar Senha',
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
                              hidePassword =
                                  !hidePassword; // Alternando a visibilidade da senha
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
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFDFE5EB),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, confirme sua senha';
                        } else if (value != _passwordController.text) {
                          return 'As senhas não coincidem';
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: _register, // Chama o método para registrar o usuário
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1A2B4A),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 15.5),
                ),
                child: const Text(
                  'Cadastrar', // Texto do botão de cadastro
                  style: TextStyle(fontSize: 18, color: Color(0xFFDFE5EB)),
                ),
              ),
              ElevatedButton(
                onPressed:
                    _goToLoginPage, // Chama o método para navegar para a página de login
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1A2B4A),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 15.5),
                ),
                child: const Text(
                  'Voltar',
                  style: TextStyle(fontSize: 18, color: Color(0xFFDFE5EB)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
