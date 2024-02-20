// ignore_for_file: use_build_context_synchronously, library_private_types_in_public_api

import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MessagePage extends StatefulWidget {
  const MessagePage({Key? key}) : super(key: key);

  @override
  _MessagePageState createState() => _MessagePageState();
}

class _MessagePageState extends State<MessagePage> {
  final TextEditingController _messageController =
      TextEditingController(); // Controlador para capturar o texto digitado pelo usuário

  void _sendMessage(BuildContext context, String message) async {
    // Função para enviar a mensagem ao serviço
    try {
      await ApiService.sendMessage(
          message); // Chamando o método do serviço para enviar a mensagem
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        // Exibindo um snack bar indicando que a mensagem foi enviada com sucesso
        content: Text('Mensagem enviada com sucesso'),
        backgroundColor: Colors.green,
      ));
      _messageController
          .clear(); // Limpando o campo de texto após o envio da mensagem
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        // Exibindo um snack bar em caso de erro ao enviar a mensagem
        content: Text('Erro ao enviar mensagem: $e'),
        backgroundColor: Colors.red,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF3b414d),
              Color(0xFF595f70),
            ],
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Enviar Mensagens',
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
                color: Color(0xFFDFE5EB),
              ),
              textAlign: TextAlign.center,
            ),
            Container(
              margin: const EdgeInsets.only(top: 20.0),
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              height: 150,
              decoration: BoxDecoration(
                color: const Color(0xFF17233A),
                borderRadius: BorderRadius.circular(10),
              ),
              child: TextFormField(
                controller: _messageController,
                decoration: const InputDecoration(
                  hintText: 'Mensagem',
                  hintStyle: TextStyle(color: Color(0xFF6B6B6B)),
                  border: InputBorder.none,
                ),
                style: const TextStyle(
                  color: Color(0xFFDFE5EB),
                ),
                maxLines: 10,
                validator: (value) {
                  // Validador para garantir que a mensagem não esteja vazia
                  if (value == null || value.isEmpty) {
                    return 'Por favor, insira uma mensagem';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 50),
            ElevatedButton(
              onPressed: () {
                String message = _messageController.text
                    .trim(); // Capturando a mensagem do campo de texto
                _sendMessage(context,
                    message); // Chamando a função para enviar a mensagem
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A2B4A),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                padding: const EdgeInsets.symmetric(vertical: 15.5),
              ),
              child: const Text(
                'Enviar',
                style: TextStyle(fontSize: 18, color: Color(0xFFDFE5EB)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
