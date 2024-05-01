  /* ----------------
   * Les évenements du script
   * ---------------- */
  
 
document.addEventListener('DOMContentLoaded', function () {
  // Fonction pour afficher les services sous la catégorie sélectionnée
  function services(category, buttonClicked) {
      // Sélectionner tous les éléments de service pour les cacher
      var allServices = document.querySelectorAll('.select-item-box');
      allServices.forEach(function (service) {
          service.style.display = 'none';
      });

      // Afficher seulement les services de la catégorie choisie
      var servicesToShow = document.querySelectorAll('.select-item.from-category-' + category);

      // Trouver le conteneur parent de la catégorie sélectionnée
      var categoryContainer = buttonClicked.closest('.select-item');
      servicesToShow.forEach(function (service) {
          // Insérer chaque service juste après le conteneur de la catégorie sélectionnée
          categoryContainer.parentNode.insertBefore(service, categoryContainer.nextSibling);
          service.style.display = 'block';
      });
  }

  // Ajouter un écouteur d'événement pour chaque bouton "Sélectionner"
  var selectButtons = document.querySelectorAll('.select-category button');
  selectButtons.forEach(function (button, index) {
      button.addEventListener('click', function () {
          services(index, button); // Passer l'index comme identifiant de catégorie
      });
  });
});

