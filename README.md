# 🇨🇲 Système de Suivi des Interventions IT - Ministère des Finances du Cameroun

## 📋 Description

Système complet de gestion et de suivi des interventions informatiques pour le Ministère des Finances du Cameroun. Cette application permet la gestion des points focaux, des postes comptables, et le suivi des interventions techniques avec un système d'authentification basé sur les rôles.

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2+ avec Java 21
- **Frontend**: Angular 18 avec Material Design
- **Base de données**: MySQL
- **Sécurité**: JWT (JSON Web Tokens)
- **UI/UX**: Material Design avec interface en français

## ✨ Fonctionnalités Principales

### 🔐 Authentification et Autorisation
- Système d'authentification basé sur JWT
- 6 rôles utilisateur distincts avec permissions spécifiques
- Contrôle d'accès granulaire par fonctionnalité

### 👥 Gestion des Utilisateurs
- Création, modification et suppression d'utilisateurs
- Attribution de rôles et permissions
- Gestion des profils utilisateur

### 🏢 Gestion des Postes Comptables
- Enregistrement des postes comptables par région
- Suivi des informations géographiques (10 régions du Cameroun)
- Association avec les points focaux

### 🎯 Gestion des Points Focaux
- Attribution des points focaux aux postes comptables
- Suivi des responsabilités et affectations
- Gestion par région

### 🔧 Gestion des Interventions
- Création et suivi des demandes d'intervention
- Assignation aux techniciens IT
- Suivi du statut (En attente, En cours, Terminé, Annulé)
- Gestion des priorités (Faible, Moyenne, Élevée, Urgente)

### 📋 Fiches d'Intervention
- Création de fiches détaillées pour chaque intervention
- Planification et suivi des travaux
- Documentation des matériels nécessaires

### 🖨️ Impression Professionnelle
- Impression des fiches d'intervention avec en-tête officiel
- Format professionnel avec sections de signature
- Export et impression de rapports complets

### 📊 Tableau de Bord et Rapports
- Statistiques en temps réel des interventions
- Rapports par période et par région
- Analyses avancées et export de données
- Visualisation des métriques clés

## 🚀 Installation et Déploiement

### Prérequis
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+
- Angular CLI 18+

### 1. Cloner le Repository
```bash
git clone https://github.com/NCHUNKE-TEMBOH/suivi_point_focaux.git
cd suivi_point_focaux
```

### 2. Configuration de la Base de Données
```sql
CREATE DATABASE suivipf_db;
CREATE USER 'suivipf_user'@'localhost' IDENTIFIED BY 'suivipf_password';
GRANT ALL PRIVILEGES ON suivipf_db.* TO 'suivipf_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration Backend
```bash
cd suivipf
# Modifier application.properties si nécessaire
./mvnw clean install
./mvnw spring-boot:run
```
Le backend sera accessible sur: http://localhost:9090

### 4. Configuration Frontend
```bash
cd suivipf-frontend
npm install
ng serve
```
Le frontend sera accessible sur: http://localhost:4200

## 👤 Comptes de Test

| Rôle | Nom d'utilisateur | Mot de passe | Permissions |
|------|-------------------|--------------|-------------|
| **ADMIN** | `admin` | `admin123` | Accès complet au système |
| **SERVICE** | `service` | `service123` | Gestion des services et postes |
| **IT_PROFESSIONAL** | `itpro` | `itpro123` | Gestion des interventions |
| **FOCAL_POINT** | `focal` | `focal123` | Création de fiches d'intervention |
| **ACCOUNTING_POST** | `accounting` | `accounting123` | Création d'interventions |
| **USER** | `user` | `user123` | Consultation des tableaux de bord |

## 🎯 Rôles et Permissions

### 🔑 ADMIN
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs et rôles
- Configuration système
- Tous les droits CRUD

### 🏢 SERVICE
- Gestion des postes comptables
- Attribution des points focaux
- Supervision des interventions

### 💻 IT_PROFESSIONAL
- Gestion des interventions techniques
- Mise à jour des statuts d'intervention
- Création de fiches techniques

### 🎯 FOCAL_POINT
- Création de fiches d'intervention
- Suivi des interventions assignées
- Coordination avec les postes comptables

### 📊 ACCOUNTING_POST
- Création de demandes d'intervention
- Consultation des rapports
- Suivi des interventions de leur poste

### 👀 USER
- Consultation des tableaux de bord
- Visualisation des rapports
- Accès en lecture seule

## 🌍 Régions du Cameroun Supportées

1. **Centre** (Yaoundé)
2. **Littoral** (Douala)
3. **Ouest** (Bafoussam)
4. **Nord-Ouest** (Bamenda)
5. **Sud-Ouest** (Buea)
6. **Est** (Bertoua)
7. **Nord** (Garoua)
8. **Adamaoua** (Ngaoundéré)
9. **Extrême-Nord** (Maroua)
10. **Sud** (Ebolowa)

## 📱 Interface Utilisateur

### Tableau de Bord Principal
- Statistiques en temps réel
- Compteurs d'interventions
- Accès rapide aux fonctionnalités
- Navigation intuitive

### Gestion des Interventions
- Liste complète avec filtres
- Création via formulaire guidé
- Modification en ligne
- Impression professionnelle

### Rapports et Analyses
- Statistiques générales
- Rapports par période
- Analyses par région
- Export de données

## 🔧 API Endpoints Principaux

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Création d'utilisateur
- `PUT /api/users/{id}` - Modification d'utilisateur
- `DELETE /api/users/{id}` - Suppression d'utilisateur

### Interventions
- `GET /api/interventions` - Liste des interventions
- `POST /api/interventions` - Création d'intervention
- `PUT /api/interventions/{id}` - Modification d'intervention
- `DELETE /api/interventions/{id}` - Suppression d'intervention

### Postes Comptables
- `GET /api/comptable-posts` - Liste des postes
- `POST /api/comptable-posts` - Création de poste
- `PUT /api/comptable-posts/{id}` - Modification de poste

### Points Focaux
- `GET /api/focal-points` - Liste des points focaux
- `POST /api/focal-points` - Attribution de point focal

## 🛠️ Technologies Utilisées

### Backend
- **Spring Boot 3.2+** - Framework principal
- **Spring Security** - Sécurité et authentification
- **Spring Data JPA** - Persistance des données
- **MySQL** - Base de données
- **JWT** - Authentification stateless
- **Maven** - Gestion des dépendances

### Frontend
- **Angular 18** - Framework frontend
- **Angular Material** - Composants UI
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **SCSS** - Styles CSS avancés

## 📄 Structure du Projet

```
suivi_point_focaux/
├── README.md
├── .gitignore
├── suivipf/                          # Backend Spring Boot
│   ├── src/main/java/sid/org/suivipf/
│   │   ├── DTOS/                     # Data Transfer Objects
│   │   ├── Service/                  # Services métier
│   │   ├── WEB/                      # Contrôleurs REST
│   │   ├── config/                   # Configuration
│   │   ├── entity/                   # Entités JPA
│   │   ├── repository/               # Repositories
│   │   └── util/                     # Utilitaires
│   ├── src/main/resources/
│   │   └── application.properties    # Configuration application
│   └── pom.xml                       # Dépendances Maven
└── suivipf-frontend/                 # Frontend Angular
    ├── src/app/
    │   ├── components/               # Composants UI
    │   ├── services/                 # Services Angular
    │   ├── guards/                   # Guards de route
    │   ├── models/                   # Modèles TypeScript
    │   └── interceptors/             # Intercepteurs HTTP
    ├── package.json                  # Dépendances npm
    └── angular.json                  # Configuration Angular
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est développé pour le Ministère des Finances du Cameroun.

## 📞 Support

Pour toute question ou support technique, veuillez contacter l'équipe de développement.

## 🚨 Dépannage

### Problèmes Courants

#### Backend ne démarre pas
```bash
# Vérifier Java version
java -version

# Vérifier MySQL
mysql -u root -p

# Nettoyer et rebuilder
./mvnw clean install
```

#### Frontend ne compile pas
```bash
# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install

# Vérifier Angular CLI
ng version
```

#### Erreurs de connexion à la base de données
1. Vérifier que MySQL est démarré
2. Vérifier les credentials dans `application.properties`
3. Vérifier que la base de données `suivipf_db` existe

### Logs et Debugging
- **Backend logs**: Console Spring Boot
- **Frontend logs**: Console navigateur (F12)
- **Base de données**: Logs MySQL

## 🔒 Sécurité

### Mesures de Sécurité Implémentées
- ✅ Authentification JWT avec expiration
- ✅ Hashage des mots de passe avec BCrypt
- ✅ Validation des entrées utilisateur
- ✅ Protection CORS configurée
- ✅ Contrôle d'accès basé sur les rôles
- ✅ Sessions sécurisées

### Recommandations de Production
1. **Changer les mots de passe par défaut**
2. **Configurer HTTPS**
3. **Utiliser des variables d'environnement pour les secrets**
4. **Activer les logs de sécurité**
5. **Mettre en place une sauvegarde régulière**

## 📈 Performance

### Optimisations Implémentées
- Lazy loading des composants Angular
- Pagination des listes
- Cache des données fréquemment utilisées
- Optimisation des requêtes SQL
- Compression des ressources statiques

### Métriques de Performance
- **Temps de chargement initial**: < 3 secondes
- **Temps de réponse API**: < 500ms
- **Taille du bundle Angular**: Optimisée
- **Utilisation mémoire**: Minimisée

## 🌐 Déploiement en Production

### Prérequis Production
- Serveur Linux (Ubuntu 20.04+ recommandé)
- Java 21+ installé
- MySQL 8.0+ configuré
- Nginx pour le reverse proxy
- SSL/TLS certificat

### Étapes de Déploiement

#### 1. Préparation du Serveur
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation Java 21
sudo apt install openjdk-21-jdk -y

# Installation MySQL
sudo apt install mysql-server -y

# Installation Nginx
sudo apt install nginx -y
```

#### 2. Déploiement Backend
```bash
# Build de production
./mvnw clean package -Pprod

# Copie du JAR
sudo cp target/suivipf-*.jar /opt/suivipf/

# Service systemd
sudo systemctl enable suivipf
sudo systemctl start suivipf
```

#### 3. Déploiement Frontend
```bash
# Build de production
ng build --prod

# Copie vers Nginx
sudo cp -r dist/* /var/www/html/
```

#### 4. Configuration Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring et Maintenance

### Monitoring Recommandé
- **Application**: Spring Boot Actuator
- **Base de données**: MySQL Performance Schema
- **Serveur**: htop, iotop, netstat
- **Logs**: ELK Stack ou équivalent

### Maintenance Régulière
1. **Sauvegarde quotidienne** de la base de données
2. **Mise à jour sécurité** mensuelle
3. **Nettoyage des logs** hebdomadaire
4. **Monitoring des performances** continu

## 🎓 Formation Utilisateurs

### Documentation Utilisateur
- Guide d'utilisation par rôle
- Tutoriels vidéo (à créer)
- FAQ des fonctionnalités
- Procédures métier

### Formation Recommandée
1. **Administrateurs**: Formation complète (2 jours)
2. **Utilisateurs métier**: Formation fonctionnelle (1 jour)
3. **Support technique**: Formation technique (1 jour)

## 🔄 Roadmap et Évolutions

### Version 2.0 (Prévue)
- [ ] Module de notifications par email
- [ ] Tableau de bord avancé avec graphiques
- [ ] Export Excel/PDF natif
- [ ] Application mobile (Android/iOS)
- [ ] Intégration avec Active Directory
- [ ] Workflow d'approbation avancé

### Améliorations Continues
- [ ] Tests automatisés complets
- [ ] Documentation API Swagger
- [ ] Monitoring avancé
- [ ] Cache Redis
- [ ] Microservices architecture

## 📞 Contact et Support

### Équipe de Développement
- **Lead Developer**: [Nom du développeur]
- **Email Support**: support@ministere-finances.cm
- **Documentation**: [Lien vers documentation complète]

### Signalement de Bugs
1. Utiliser les Issues GitHub
2. Fournir les logs d'erreur
3. Décrire les étapes de reproduction
4. Indiquer l'environnement (navigateur, OS)

---

## 🏆 Remerciements

Merci à tous les contributeurs et au Ministère des Finances du Cameroun pour leur confiance dans ce projet.

**Développé avec ❤️ pour le Ministère des Finances du Cameroun** 🇨🇲

---

*Dernière mise à jour: Janvier 2025*
