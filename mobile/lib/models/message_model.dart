class MessageModel {
  final String id;
  final String content;
  final String createdAt;

  MessageModel({
    required this.id,
    required this.content,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'].toString(),
      content: json['content'],
      createdAt: json['createdAt'],
    );
  }
}
