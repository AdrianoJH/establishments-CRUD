class EstablishmentModel {
  final String name;
  final String image;
  final String phone;

  EstablishmentModel(
      {required this.name, required this.image, required this.phone});

  factory EstablishmentModel.fromJson(Map<String, dynamic> json) {
    return EstablishmentModel(
      name: json['name'],
      image: json['image'],
      phone: json['phone'],
    );
  }
}
