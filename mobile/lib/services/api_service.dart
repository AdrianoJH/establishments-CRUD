// ignore_for_file: avoid_print, unnecessary_null_comparison

import 'package:http/http.dart' as http;
import 'package:mobile/models/message_model.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/establishment_model.dart';

class ApiService {
// Método estático para obter a lista de estabelecimentos do servidor
  static Future<List<EstablishmentModel>> fetchEstablishments(
      String token) async {
    // Enviando uma requisição GET para o endpoint de estabelecimentos, incluindo o token de autenticação nos cabeçalhos
    final response = await http.get(
      Uri.parse('http://localhost:3000/api/establishments'),
      headers: {'Authorization': 'Bearer $token'},
    );
    // Verificando se a resposta foi bem-sucedida (código de status 200)
    if (response.statusCode == 200) {
      // Decodificando os dados JSON da resposta e mapeando para uma lista de objetos
      List<dynamic> data = json.decode(response.body);
      List<EstablishmentModel> establishments =
          data.map((e) => EstablishmentModel.fromJson(e)).toList();

      return establishments; // Retornando a lista de estabelecimentos
    } else {
      // Lançando uma exceção em caso de falha na requisição
      throw Exception('Falha ao carregar os estabelecimentos');
    }
  }

// Método estático para realizar o login do usuário
  static Future<String> login(String email, String password) async {
    // Enviando uma requisição POST para o endpoint de login, incluindo as credenciais do usuário no corpo da requisição
    final response = await http.post(
      Uri.parse('http://localhost:3000/api/login'),
      body: jsonEncode({'email': email, 'password': password}),
      headers: {'Content-Type': 'application/json'},
    );
    // Verificando se o login foi bem-sucedido (código de status 200)
    if (response.statusCode == 200) {
      // Decodificando os dados JSON da resposta e obtendo o token de autenticação
      Map<String, dynamic> data = json.decode(response.body);
      String token = data['token'];

      // Verificando se o token não é nulo
      if (token != null) {
        // Obtendo uma instância de SharedPreferences para armazenar o token localmente
        SharedPreferences prefs = await SharedPreferences.getInstance();

        // Salvando o token no SharedPreferences
        await prefs.setString('token', token);

        return token; // Retornando o token de autenticação
      } else {
        // Lançando uma exceção se o token for nulo
        throw Exception('Token de autenticação nulo');
      }
    } else {
      // Lançando uma exceção em caso de falha no login
      throw Exception('Falha ao fazer login');
    }
  }

// Método estático para registrar um novo usuário
  static Future<String> register(String email, String password) async {
    try {
      // Envia uma requisição POST para o endpoint de registro
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/register'),
        body: jsonEncode({'email': email, 'password': password}),
        headers: {'Content-Type': 'application/json'},
      );

      // Verifica o código de status da resposta
      if (response.statusCode == 200) {
        // Retorna uma mensagem de sucesso se o registro for bem-sucedido
        return 'Usuário registrado com sucesso';
      } else {
        // Em caso de falha, decodifica a resposta e retorna a mensagem de erro
        final data = jsonDecode(response.body);
        return data['message'] ?? 'Falha ao registrar usuário';
      }
    } catch (e) {
      // Em caso de erro na requisição, imprime o erro e retorna uma mensagem genérica
      print('Erro ao registrar usuário na API: $e');
      return 'Falha ao conectar com o servidor';
    }
  }

// Método estático para enviar uma mensagem para o servidor
  static Future<MessageModel> sendMessage(String content) async {
    // Obtendo o token de autenticação do SharedPreferences
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    // Verificando se o token foi obtido com sucesso
    if (token != null) {
      // Enviando uma requisição POST para o endpoint de mensagens, incluindo o token de autenticação e o conteúdo da mensagem no corpo da requisição
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/messages'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'content': content}),
      );
      // Verificando se o envio da mensagem foi bem-sucedido (código de status 200)
      if (response.statusCode == 200) {
        // Decodificando os dados JSON da resposta e convertendo para um objeto MessageModel
        Map<String, dynamic> data = json.decode(response.body);
        return MessageModel.fromJson(data); // Retornando o objeto MessageModel
      } else {
        // Lançando uma exceção em caso de falha no envio da mensagem
        throw Exception('Falha ao enviar mensagem');
      }
    } else {
      // Lançando uma exceção se o usuário não estiver autenticado
      throw Exception('Usuário não autenticado');
    }
  }
}
