# Problèmes

- ## Les propriétés de la table issue des rélations plusieurs à plusieurs sur prisma

J'arrive pas à gerer les propriétés (`quantity` et `date`) de la table `book` issue des tables `User` et `Car`.

# A faire

## A faire dans le sheduler(cron job)

- (chaque 30 minutes) Supprimer tous les voitures dont le stock est terminé(Comme alternative à cette méthode, je peux utiliser le patron `Observer` pour observer à chaque fois qu'on reserve une voiture puis je supprime cette voiture une fois que son stock est à 0).
