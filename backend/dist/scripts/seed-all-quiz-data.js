"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const difficultyMap = {
    facile: client_1.Difficulty.FACILE,
    moyen: client_1.Difficulty.MOYEN,
    difficile: client_1.Difficulty.DIFFICILE,
};
const PLAY_QUIZZES_DATA = [
    {
        id: 1,
        title: 'Histoire de France - Révolution',
        description: 'Testez vos connaissances sur la Révolution française',
        categories: ['Histoire'],
        difficulty: 'moyen',
    },
    {
        id: 2,
        title: 'Antiquité Égyptienne',
        description: 'Pharaons, pyramides et hiéroglyphes',
        categories: ['Histoire'],
        difficulty: 'facile',
    },
    {
        id: 3,
        title: 'Seconde Guerre Mondiale',
        description: 'Les événements marquants de 1939-1945',
        categories: ['Histoire'],
        difficulty: 'difficile',
    },
    {
        id: 4,
        title: 'Moyen Âge',
        description: 'Châteaux, chevaliers et rois',
        categories: ['Histoire'],
        difficulty: 'moyen',
    },
    {
        id: 5,
        title: 'Renaissance Italienne',
        description: 'Art, science et découvertes',
        categories: ['Histoire'],
        difficulty: 'difficile',
    },
    {
        id: 6,
        title: "Histoire de l'Art",
        description: 'Les plus grands artistes et leurs œuvres',
        categories: ['Histoire', 'Culture Générale'],
        difficulty: 'moyen',
    },
    {
        id: 7,
        title: 'Empire Romain',
        description: 'César, gladiateurs et conquêtes',
        categories: ['Histoire'],
        difficulty: 'facile',
    },
    {
        id: 8,
        title: 'Révolution Industrielle',
        description: 'Machines, usines et progrès',
        categories: ['Histoire', 'Sciences'],
        difficulty: 'moyen',
    },
    {
        id: 9,
        title: 'Capitales du Monde',
        description: 'Connaissez-vous toutes les capitales ?',
        categories: ['Géographie'],
        difficulty: 'facile',
    },
    {
        id: 10,
        title: 'Montagnes du Monde',
        description: 'Les plus hauts sommets et chaînes',
        categories: ['Géographie'],
        difficulty: 'moyen',
    },
];
const QUIZ_QUESTIONS = {
    1: [
        {
            id: 1,
            question: 'En quelle année a eu lieu la prise de la Bastille ?',
            options: ['1789', '1790', '1788', '1791'],
            correctAnswer: 0,
            explanation: 'La prise de la Bastille a eu lieu le 14 juillet 1789, marquant le début de la Révolution française.'
        },
        {
            id: 2,
            question: 'Quel roi régnait en France au début de la Révolution ?',
            options: ['Louis XIV', 'Louis XV', 'Louis XVI', 'Louis XVII'],
            correctAnswer: 2,
            explanation: 'Louis XVI régnait en France au début de la Révolution française.'
        },
        {
            id: 3,
            question: 'Quel était le nom de l\'épouse de Louis XVI ?',
            options: ['Marie-Thérèse', 'Marie-Antoinette', 'Marie-Louise', 'Marie-Christine'],
            correctAnswer: 1,
            explanation: 'Marie-Antoinette était l\'épouse de Louis XVI.'
        },
        {
            id: 4,
            question: 'Quel document a été adopté le 26 août 1789 ?',
            options: ['La Constitution', 'La Déclaration des Droits de l\'Homme', 'Le Code Civil', 'Le Concordat'],
            correctAnswer: 1,
            explanation: 'La Déclaration des Droits de l\'Homme et du Citoyen a été adoptée le 26 août 1789.'
        },
        {
            id: 5,
            question: 'Quel était le nom du club politique de Robespierre ?',
            options: ['Les Girondins', 'Les Jacobins', 'Les Montagnards', 'Les Feuillants'],
            correctAnswer: 1,
            explanation: 'Robespierre était membre du club des Jacobins.'
        },
        {
            id: 6,
            question: 'En quelle année Louis XVI a-t-il été guillotiné ?',
            options: ['1792', '1793', '1794', '1795'],
            correctAnswer: 1,
            explanation: 'Louis XVI a été guillotiné le 21 janvier 1793.'
        },
        {
            id: 7,
            question: 'Quel était le nom de la période de terreur révolutionnaire ?',
            options: ['La Terreur', 'Le Régime de la Peur', 'La Grande Peur', 'La Terreur Blanche'],
            correctAnswer: 0,
            explanation: 'La période de terreur révolutionnaire était appelée "La Terreur".'
        },
        {
            id: 8,
            question: 'Quel général a pris le pouvoir en 1799 ?',
            options: ['Napoléon Bonaparte', 'Lazare Carnot', 'Jean-Baptiste Jourdan', 'André Masséna'],
            correctAnswer: 0,
            explanation: 'Napoléon Bonaparte a pris le pouvoir lors du coup d\'État du 18 Brumaire en 1799.'
        },
        {
            id: 9,
            question: 'Quel était le nom de l\'assemblée qui a remplacé les États généraux ?',
            options: ['L\'Assemblée Nationale', 'La Convention', 'Le Directoire', 'Le Consulat'],
            correctAnswer: 0,
            explanation: 'L\'Assemblée Nationale a remplacé les États généraux.'
        },
        {
            id: 10,
            question: 'Quel était le nom du calendrier révolutionnaire ?',
            options: ['Le calendrier républicain', 'Le calendrier révolutionnaire', 'Le calendrier français', 'Le calendrier national'],
            correctAnswer: 0,
            explanation: 'Le calendrier révolutionnaire était appelé le calendrier républicain.'
        }
    ],
    2: [
        {
            id: 1,
            question: 'Quel était le dieu du soleil dans l\'Égypte antique ?',
            options: ['Osiris', 'Rê', 'Horus', 'Anubis'],
            correctAnswer: 1,
            explanation: 'Rê était le dieu du soleil dans l\'Égypte antique.'
        },
        {
            id: 2,
            question: 'Quel pharaon a fait construire la plus grande pyramide ?',
            options: ['Khéops', 'Khéphren', 'Mykérinos', 'Ramsès II'],
            correctAnswer: 0,
            explanation: 'Khéops a fait construire la plus grande pyramide de Gizeh.'
        },
        {
            id: 3,
            question: 'Quel était le nom de l\'écriture égyptienne ?',
            options: ['Les hiéroglyphes', 'Le cunéiforme', 'L\'alphabet', 'Les runes'],
            correctAnswer: 0,
            explanation: 'L\'écriture égyptienne s\'appelait les hiéroglyphes.'
        },
        {
            id: 4,
            question: 'Quel était le dieu des morts ?',
            options: ['Rê', 'Horus', 'Osiris', 'Thot'],
            correctAnswer: 2,
            explanation: 'Osiris était le dieu des morts dans l\'Égypte antique.'
        },
        {
            id: 5,
            question: 'Quel était le nom de la reine qui a régné seule ?',
            options: ['Néfertiti', 'Cléopâtre', 'Hatchepsout', 'Nefertari'],
            correctAnswer: 2,
            explanation: 'Hatchepsout a été la seule femme pharaon à régner seule.'
        },
        {
            id: 6,
            question: 'Quel animal était sacré pour les Égyptiens ?',
            options: ['Le chat', 'Le chien', 'Le lion', 'L\'aigle'],
            correctAnswer: 0,
            explanation: 'Le chat était un animal sacré pour les Égyptiens.'
        },
        {
            id: 7,
            question: 'Quel était le nom du fleuve sacré ?',
            options: ['Le Tigre', 'L\'Euphrate', 'Le Nil', 'Le Jourdain'],
            correctAnswer: 2,
            explanation: 'Le Nil était le fleuve sacré de l\'Égypte antique.'
        },
        {
            id: 8,
            question: 'Quel était le nom de la capitale de l\'Égypte antique ?',
            options: ['Thèbes', 'Memphis', 'Alexandrie', 'Louxor'],
            correctAnswer: 1,
            explanation: 'Memphis était la capitale de l\'Ancien Empire égyptien.'
        },
        {
            id: 9,
            question: 'Quel était le dieu de la sagesse ?',
            options: ['Thot', 'Horus', 'Anubis', 'Seth'],
            correctAnswer: 0,
            explanation: 'Thot était le dieu de la sagesse et de l\'écriture.'
        },
        {
            id: 10,
            question: 'Quel était le nom du scarabée sacré ?',
            options: ['Khepri', 'Bastet', 'Sekhmet', 'Taweret'],
            correctAnswer: 0,
            explanation: 'Khepri était le nom du scarabée sacré, symbole de renaissance.'
        }
    ],
    3: [
        {
            id: 1,
            question: 'En quelle année la Seconde Guerre mondiale a-t-elle commencé ?',
            options: ['1938', '1939', '1940', '1941'],
            correctAnswer: 1,
            explanation: 'La Seconde Guerre mondiale a commencé le 1er septembre 1939 avec l\'invasion de la Pologne.'
        },
        {
            id: 2,
            question: 'Quel était le nom du leader nazi allemand ?',
            options: ['Mussolini', 'Hitler', 'Franco', 'Staline'],
            correctAnswer: 1,
            explanation: 'Adolf Hitler était le leader nazi allemand.'
        },
        {
            id: 3,
            question: 'Quel événement a marqué l\'entrée des États-Unis dans la guerre ?',
            options: ['Le débarquement de Normandie', 'L\'attaque de Pearl Harbor', 'La bataille de Stalingrad', 'La bataille d\'Angleterre'],
            correctAnswer: 1,
            explanation: 'L\'attaque de Pearl Harbor le 7 décembre 1941 a fait entrer les États-Unis dans la guerre.'
        },
        {
            id: 4,
            question: 'Quel était le nom du débarquement en Normandie ?',
            options: ['Opération Overlord', 'Opération Barbarossa', 'Opération Market Garden', 'Opération Torch'],
            correctAnswer: 0,
            explanation: 'Le débarquement en Normandie était l\'Opération Overlord.'
        },
        {
            id: 5,
            question: 'En quelle année la guerre s\'est-elle terminée en Europe ?',
            options: ['1944', '1945', '1946', '1947'],
            correctAnswer: 1,
            explanation: 'La guerre s\'est terminée en Europe le 8 mai 1945.'
        },
        {
            id: 6,
            question: 'Quel était le nom du projet américain de bombe atomique ?',
            options: ['Projet Manhattan', 'Projet Trinity', 'Projet Los Alamos', 'Projet Oak Ridge'],
            correctAnswer: 0,
            explanation: 'Le projet américain de bombe atomique était le Projet Manhattan.'
        },
        {
            id: 7,
            question: 'Quel était le nom du leader soviétique pendant la guerre ?',
            options: ['Lénine', 'Staline', 'Trotski', 'Khrouchtchev'],
            correctAnswer: 1,
            explanation: 'Joseph Staline était le leader soviétique pendant la guerre.'
        },
        {
            id: 8,
            question: 'Quel était le nom de la conférence qui a divisé l\'Allemagne ?',
            options: ['Conférence de Yalta', 'Conférence de Potsdam', 'Conférence de Téhéran', 'Conférence de Casablanca'],
            correctAnswer: 1,
            explanation: 'La conférence de Potsdam a décidé de la division de l\'Allemagne.'
        },
        {
            id: 9,
            question: 'Quel était le nom du leader britannique pendant la guerre ?',
            options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'],
            correctAnswer: 1,
            explanation: 'Winston Churchill était le leader britannique pendant la guerre.'
        },
        {
            id: 10,
            question: 'Quel était le nom du camp de concentration le plus connu ?',
            options: ['Auschwitz', 'Dachau', 'Buchenwald', 'Treblinka'],
            correctAnswer: 0,
            explanation: 'Auschwitz était le camp de concentration le plus connu et le plus meurtrier.'
        }
    ],
    4: [
        {
            id: 1,
            question: 'Quel était le nom du roi des Francs qui s\'est fait baptiser en 496 ?',
            options: ['Clovis', 'Charlemagne', 'Pépin le Bref', 'Charles Martel'],
            correctAnswer: 0,
            explanation: 'Clovis, roi des Francs, s\'est fait baptiser en 496.'
        },
        {
            id: 2,
            question: 'Quel était le nom de l\'empereur qui a créé l\'Empire carolingien ?',
            options: ['Clovis', 'Charlemagne', 'Pépin le Bref', 'Louis le Pieux'],
            correctAnswer: 1,
            explanation: 'Charlemagne a créé l\'Empire carolingien.'
        },
        {
            id: 3,
            question: 'En quelle année a eu lieu la bataille de Poitiers ?',
            options: ['732', '733', '734', '735'],
            correctAnswer: 0,
            explanation: 'La bataille de Poitiers a eu lieu en 732.'
        },
        {
            id: 4,
            question: 'Quel était le nom du système social du Moyen Âge ?',
            options: ['La féodalité', 'Le servage', 'La chevalerie', 'La noblesse'],
            correctAnswer: 0,
            explanation: 'La féodalité était le système social du Moyen Âge.'
        },
        {
            id: 5,
            question: 'Quel était le nom des guerres entre chrétiens et musulmans ?',
            options: ['Les croisades', 'Les guerres saintes', 'Les guerres de religion', 'Les guerres médiévales'],
            correctAnswer: 0,
            explanation: 'Les croisades étaient les guerres entre chrétiens et musulmans.'
        },
        {
            id: 6,
            question: 'Quel était le nom de la peste qui a ravagé l\'Europe au XIVe siècle ?',
            options: ['La peste noire', 'La peste bubonique', 'La peste pneumonique', 'La grande peste'],
            correctAnswer: 0,
            explanation: 'La peste noire a ravagé l\'Europe au XIVe siècle.'
        },
        {
            id: 7,
            question: 'Quel était le nom de la guerre entre la France et l\'Angleterre ?',
            options: ['La guerre de Cent Ans', 'La guerre des Roses', 'La guerre de Succession', 'La guerre médiévale'],
            correctAnswer: 0,
            explanation: 'La guerre de Cent Ans a opposé la France et l\'Angleterre.'
        },
        {
            id: 8,
            question: 'Quel était le nom de Jeanne d\'Arc ?',
            options: ['La Pucelle d\'Orléans', 'La Vierge de France', 'La Sainte de France', 'La Guerrière de France'],
            correctAnswer: 0,
            explanation: 'Jeanne d\'Arc était surnommée la Pucelle d\'Orléans.'
        },
        {
            id: 9,
            question: 'Quel était le nom de l\'ordre religieux militaire ?',
            options: ['Les Templiers', 'Les Hospitaliers', 'Les Teutoniques', 'Tous les précédents'],
            correctAnswer: 3,
            explanation: 'Les Templiers, Hospitaliers et Teutoniques étaient des ordres religieux militaires.'
        },
        {
            id: 10,
            question: 'Quel était le nom du style architectural du Moyen Âge ?',
            options: ['Le roman', 'Le gothique', 'Le médiéval', 'Le classique'],
            correctAnswer: 1,
            explanation: 'Le gothique était le style architectural principal du Moyen Âge.'
        }
    ],
    5: [
        {
            id: 1,
            question: 'Quel était le nom de la famille qui a régné sur Florence ?',
            options: ['Les Médicis', 'Les Borgia', 'Les Sforza', 'Les Visconti'],
            correctAnswer: 0,
            explanation: 'Les Médicis ont régné sur Florence pendant la Renaissance.'
        },
        {
            id: 2,
            question: 'Quel artiste a peint la Joconde ?',
            options: ['Michel-Ange', 'Raphaël', 'Léonard de Vinci', 'Botticelli'],
            correctAnswer: 2,
            explanation: 'Léonard de Vinci a peint la Joconde.'
        },
        {
            id: 3,
            question: 'Quel artiste a sculpté le David ?',
            options: ['Léonard de Vinci', 'Michel-Ange', 'Donatello', 'Bernini'],
            correctAnswer: 1,
            explanation: 'Michel-Ange a sculpté le David.'
        },
        {
            id: 4,
            question: 'Quel était le nom de la technique de peinture à l\'huile ?',
            options: ['La fresque', 'La tempera', 'L\'huile sur toile', 'La peinture à l\'œuf'],
            correctAnswer: 2,
            explanation: 'La peinture à l\'huile sur toile était la technique principale de la Renaissance.'
        },
        {
            id: 5,
            question: 'Quel était le nom du mouvement culturel de la Renaissance ?',
            options: ['L\'humanisme', 'Le classicisme', 'Le naturalisme', 'Le réalisme'],
            correctAnswer: 0,
            explanation: 'L\'humanisme était le mouvement culturel de la Renaissance.'
        },
        {
            id: 6,
            question: 'Quel était le nom de l\'inventeur de l\'imprimerie ?',
            options: ['Gutenberg', 'Galilée', 'Copernic', 'Vesalius'],
            correctAnswer: 0,
            explanation: 'Gutenberg a inventé l\'imprimerie à caractères mobiles.'
        },
        {
            id: 7,
            question: 'Quel était le nom de l\'astronome qui a découvert l\'héliocentrisme ?',
            options: ['Galilée', 'Copernic', 'Kepler', 'Brahe'],
            correctAnswer: 1,
            explanation: 'Copernic a découvert l\'héliocentrisme.'
        },
        {
            id: 8,
            question: 'Quel était le nom de l\'architecte du dôme de Florence ?',
            options: ['Brunelleschi', 'Alberti', 'Palladio', 'Michel-Ange'],
            correctAnswer: 0,
            explanation: 'Brunelleschi a conçu le dôme de la cathédrale de Florence.'
        },
        {
            id: 9,
            question: 'Quel était le nom de la technique de perspective ?',
            options: ['La perspective linéaire', 'La perspective atmosphérique', 'La perspective géométrique', 'La perspective Renaissance'],
            correctAnswer: 0,
            explanation: 'La perspective linéaire était la technique de perspective de la Renaissance.'
        },
        {
            id: 10,
            question: 'Quel était le nom du peintre de la Naissance de Vénus ?',
            options: ['Botticelli', 'Raphaël', 'Titien', 'Giorgione'],
            correctAnswer: 0,
            explanation: 'Botticelli a peint la Naissance de Vénus.'
        }
    ],
    6: [
        {
            id: 1,
            question: 'Quel artiste a peint Les Nymphéas ?',
            options: ['Claude Monet', 'Vincent van Gogh', 'Pablo Picasso', 'Salvador Dalí'],
            correctAnswer: 0,
            explanation: 'Claude Monet a peint la série des Nymphéas.'
        },
        {
            id: 2,
            question: 'Quel mouvement artistique a été créé par Picasso et Braque ?',
            options: ['Le cubisme', 'Le surréalisme', 'L\'impressionnisme', 'L\'expressionnisme'],
            correctAnswer: 0,
            explanation: 'Le cubisme a été créé par Picasso et Braque.'
        },
        {
            id: 3,
            question: 'Quel artiste a peint La Nuit étoilée ?',
            options: ['Monet', 'Van Gogh', 'Gauguin', 'Cézanne'],
            correctAnswer: 1,
            explanation: 'Vincent van Gogh a peint La Nuit étoilée.'
        },
        {
            id: 4,
            question: 'Quel était le nom du mouvement artistique de Dali ?',
            options: ['Le surréalisme', 'Le dadaïsme', 'Le futurisme', 'Le constructivisme'],
            correctAnswer: 0,
            explanation: 'Salvador Dalí était un peintre surréaliste.'
        },
        {
            id: 5,
            question: 'Quel artiste a sculpté Le Penseur ?',
            options: ['Rodin', 'Brancusi', 'Giacometti', 'Moore'],
            correctAnswer: 0,
            explanation: 'Auguste Rodin a sculpté Le Penseur.'
        },
        {
            id: 6,
            question: 'Quel était le nom du mouvement artistique de Monet ?',
            options: ['L\'impressionnisme', 'Le post-impressionnisme', 'Le réalisme', 'Le naturalisme'],
            correctAnswer: 0,
            explanation: 'Monet était un peintre impressionniste.'
        },
        {
            id: 7,
            question: 'Quel artiste a peint Guernica ?',
            options: ['Picasso', 'Dalí', 'Miró', 'Gris'],
            correctAnswer: 0,
            explanation: 'Pablo Picasso a peint Guernica.'
        },
        {
            id: 8,
            question: 'Quel était le nom du mouvement artistique de Warhol ?',
            options: ['Le pop art', 'L\'art minimal', 'L\'art conceptuel', 'L\'art contemporain'],
            correctAnswer: 0,
            explanation: 'Andy Warhol était un artiste du pop art.'
        },
        {
            id: 9,
            question: 'Quel artiste a peint Les Demoiselles d\'Avignon ?',
            options: ['Picasso', 'Matisse', 'Braque', 'Derain'],
            correctAnswer: 0,
            explanation: 'Picasso a peint Les Demoiselles d\'Avignon.'
        },
        {
            id: 10,
            question: 'Quel était le nom du mouvement artistique de Kandinsky ?',
            options: ['L\'abstraction', 'L\'expressionnisme', 'Le constructivisme', 'Le suprématisme'],
            correctAnswer: 0,
            explanation: 'Kandinsky était un peintre de l\'art abstrait.'
        }
    ],
    7: [
        {
            id: 1,
            question: 'Quel était le nom du premier empereur romain ?',
            options: ['Jules César', 'Auguste', 'Tibère', 'Caligula'],
            correctAnswer: 1,
            explanation: 'Auguste fut le premier empereur romain.'
        },
        {
            id: 2,
            question: 'Quel était le nom de la capitale de l\'Empire romain ?',
            options: ['Rome', 'Constantinople', 'Alexandrie', 'Carthage'],
            correctAnswer: 0,
            explanation: 'Rome était la capitale de l\'Empire romain.'
        },
        {
            id: 3,
            question: 'Quel était le nom des combattants dans l\'arène ?',
            options: ['Les légionnaires', 'Les gladiateurs', 'Les centurions', 'Les prétoriens'],
            correctAnswer: 1,
            explanation: 'Les gladiateurs étaient les combattants dans l\'arène.'
        },
        {
            id: 4,
            question: 'Quel était le nom de la route qui menait à Rome ?',
            options: ['La Via Appia', 'La Via Flaminia', 'La Via Aurelia', 'La Via Salaria'],
            correctAnswer: 0,
            explanation: 'La Via Appia était la route principale qui menait à Rome.'
        },
        {
            id: 5,
            question: 'Quel était le nom du temple principal de Rome ?',
            options: ['Le Panthéon', 'Le Capitole', 'Le Forum', 'Le Colisée'],
            correctAnswer: 0,
            explanation: 'Le Panthéon était le temple principal de Rome.'
        },
        {
            id: 6,
            question: 'Quel était le nom de l\'armée romaine ?',
            options: ['Les légions', 'Les cohortes', 'Les manipules', 'Les centuries'],
            correctAnswer: 0,
            explanation: 'L\'armée romaine était organisée en légions.'
        },
        {
            id: 7,
            question: 'Quel était le nom de l\'empereur qui a construit le Colisée ?',
            options: ['Néron', 'Vespasien', 'Titus', 'Domitien'],
            correctAnswer: 1,
            explanation: 'Vespasien a fait construire le Colisée.'
        },
        {
            id: 8,
            question: 'Quel était le nom de la langue officielle de Rome ?',
            options: ['Le latin', 'Le grec', 'L\'étrusque', 'L\'osque'],
            correctAnswer: 0,
            explanation: 'Le latin était la langue officielle de Rome.'
        },
        {
            id: 9,
            question: 'Quel était le nom de l\'empereur qui a persécuté les chrétiens ?',
            options: ['Néron', 'Dioclétien', 'Trajan', 'Hadrien'],
            correctAnswer: 0,
            explanation: 'Néron a persécuté les chrétiens.'
        },
        {
            id: 10,
            question: 'Quel était le nom de l\'empereur qui a divisé l\'empire ?',
            options: ['Dioclétien', 'Constantin', 'Théodose', 'Valentinien'],
            correctAnswer: 0,
            explanation: 'Dioclétien a divisé l\'empire en deux parties.'
        }
    ],
    8: [
        {
            id: 1,
            question: 'En quel pays la Révolution industrielle a-t-elle commencé ?',
            options: ['La France', 'L\'Allemagne', 'L\'Angleterre', 'Les États-Unis'],
            correctAnswer: 2,
            explanation: 'La Révolution industrielle a commencé en Angleterre.'
        },
        {
            id: 2,
            question: 'Quel était le nom de l\'inventeur de la machine à vapeur ?',
            options: ['James Watt', 'Thomas Newcomen', 'Richard Trevithick', 'George Stephenson'],
            correctAnswer: 0,
            explanation: 'James Watt a perfectionné la machine à vapeur.'
        },
        {
            id: 3,
            question: 'Quel était le nom du premier chemin de fer public ?',
            options: ['Le Liverpool-Manchester', 'Le Stockton-Darlington', 'Le London-Birmingham', 'Le Paris-Lyon'],
            correctAnswer: 1,
            explanation: 'Le Stockton-Darlington fut le premier chemin de fer public.'
        },
        {
            id: 4,
            question: 'Quel était le nom de l\'inventeur du métier à tisser mécanique ?',
            options: ['Edmund Cartwright', 'Richard Arkwright', 'Samuel Crompton', 'James Hargreaves'],
            correctAnswer: 0,
            explanation: 'Edmund Cartwright a inventé le métier à tisser mécanique.'
        },
        {
            id: 5,
            question: 'Quel était le nom du combustible principal de la Révolution industrielle ?',
            options: ['Le charbon', 'Le pétrole', 'Le gaz', 'Le bois'],
            correctAnswer: 0,
            explanation: 'Le charbon était le combustible principal de la Révolution industrielle.'
        },
        {
            id: 6,
            question: 'Quel était le nom de l\'inventeur du téléphone ?',
            options: ['Thomas Edison', 'Alexander Graham Bell', 'Guglielmo Marconi', 'Nikola Tesla'],
            correctAnswer: 1,
            explanation: 'Alexander Graham Bell a inventé le téléphone.'
        },
        {
            id: 7,
            question: 'Quel était le nom de l\'inventeur de l\'ampoule électrique ?',
            options: ['Thomas Edison', 'Nikola Tesla', 'Joseph Swan', 'Humphry Davy'],
            correctAnswer: 0,
            explanation: 'Thomas Edison a inventé l\'ampoule électrique.'
        },
        {
            id: 8,
            question: 'Quel était le nom du premier avion à voler ?',
            options: ['Le Flyer', 'Le Blériot XI', 'Le Spirit of St. Louis', 'Le Wright Flyer'],
            correctAnswer: 3,
            explanation: 'Le Wright Flyer fut le premier avion à voler.'
        },
        {
            id: 9,
            question: 'Quel était le nom de l\'inventeur de la radio ?',
            options: ['Guglielmo Marconi', 'Nikola Tesla', 'Heinrich Hertz', 'James Clerk Maxwell'],
            correctAnswer: 0,
            explanation: 'Guglielmo Marconi a inventé la radio.'
        },
        {
            id: 10,
            question: 'Quel était le nom de l\'inventeur de l\'automobile ?',
            options: ['Karl Benz', 'Henry Ford', 'Gottlieb Daimler', 'Nicolas-Joseph Cugnot'],
            correctAnswer: 0,
            explanation: 'Karl Benz a inventé la première automobile.'
        }
    ],
    9: [
        {
            id: 1,
            question: 'Quelle est la capitale de l\'Australie ?',
            options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
            correctAnswer: 2,
            explanation: 'Canberra est la capitale de l\'Australie.'
        },
        {
            id: 2,
            question: 'Quelle est la capitale du Brésil ?',
            options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
            correctAnswer: 2,
            explanation: 'Brasília est la capitale du Brésil.'
        },
        {
            id: 3,
            question: 'Quelle est la capitale de l\'Afrique du Sud ?',
            options: ['Johannesburg', 'Le Cap', 'Pretoria', 'Bloemfontein'],
            correctAnswer: 2,
            explanation: 'Pretoria est la capitale administrative de l\'Afrique du Sud.'
        },
        {
            id: 4,
            question: 'Quelle est la capitale de la Turquie ?',
            options: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'],
            correctAnswer: 1,
            explanation: 'Ankara est la capitale de la Turquie.'
        },
        {
            id: 5,
            question: 'Quelle est la capitale de la Nouvelle-Zélande ?',
            options: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'],
            correctAnswer: 1,
            explanation: 'Wellington est la capitale de la Nouvelle-Zélande.'
        },
        {
            id: 6,
            question: 'Quelle est la capitale du Canada ?',
            options: ['Toronto', 'Montréal', 'Ottawa', 'Vancouver'],
            correctAnswer: 2,
            explanation: 'Ottawa est la capitale du Canada.'
        },
        {
            id: 7,
            question: 'Quelle est la capitale de l\'Argentine ?',
            options: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
            correctAnswer: 0,
            explanation: 'Buenos Aires est la capitale de l\'Argentine.'
        },
        {
            id: 8,
            question: 'Quelle est la capitale de l\'Inde ?',
            options: ['Mumbai', 'Delhi', 'Calcutta', 'Chennai'],
            correctAnswer: 1,
            explanation: 'New Delhi est la capitale de l\'Inde.'
        },
        {
            id: 9,
            question: 'Quelle est la capitale de l\'Égypte ?',
            options: ['Alexandrie', 'Le Caire', 'Gizeh', 'Louxor'],
            correctAnswer: 1,
            explanation: 'Le Caire est la capitale de l\'Égypte.'
        },
        {
            id: 10,
            question: 'Quelle est la capitale du Japon ?',
            options: ['Osaka', 'Tokyo', 'Kyoto', 'Yokohama'],
            correctAnswer: 1,
            explanation: 'Tokyo est la capitale du Japon.'
        }
    ],
    10: [
        {
            id: 1,
            question: 'Quelle est la plus haute montagne du monde ?',
            options: ['Le K2', 'L\'Everest', 'Le Kangchenjunga', 'Le Lhotse'],
            correctAnswer: 1,
            explanation: 'L\'Everest est la plus haute montagne du monde avec 8 848 mètres.'
        },
        {
            id: 2,
            question: 'Dans quel pays se trouve l\'Everest ?',
            options: ['Le Népal', 'Le Tibet', 'L\'Inde', 'Le Bhoutan'],
            correctAnswer: 0,
            explanation: 'L\'Everest se trouve à la frontière entre le Népal et le Tibet.'
        },
        {
            id: 3,
            question: 'Quelle est la plus haute montagne d\'Europe ?',
            options: ['Le Mont Blanc', 'Le Mont Elbrouz', 'La Jungfrau', 'Le Cervin'],
            correctAnswer: 1,
            explanation: 'Le Mont Elbrouz est la plus haute montagne d\'Europe.'
        },
        {
            id: 4,
            question: 'Quelle chaîne de montagnes traverse l\'Amérique du Sud ?',
            options: ['Les Andes', 'Les Rocheuses', 'Les Alpes', 'L\'Himalaya'],
            correctAnswer: 0,
            explanation: 'Les Andes traversent l\'Amérique du Sud.'
        },
        {
            id: 5,
            question: 'Quelle est la plus haute montagne d\'Afrique ?',
            options: ['Le Kilimandjaro', 'Le Mont Kenya', 'Le Ras Dashan', 'Le Toubkal'],
            correctAnswer: 0,
            explanation: 'Le Kilimandjaro est la plus haute montagne d\'Afrique.'
        },
        {
            id: 6,
            question: 'Quelle chaîne de montagnes traverse l\'Amérique du Nord ?',
            options: ['Les Rocheuses', 'Les Appalaches', 'Les Cascades', 'Les Sierra Nevada'],
            correctAnswer: 0,
            explanation: 'Les Rocheuses traversent l\'Amérique du Nord.'
        },
        {
            id: 7,
            question: 'Quelle est la plus haute montagne d\'Australie ?',
            options: ['Le Mont Kosciuszko', 'Le Mont Townsend', 'Le Mont Bogong', 'Le Mont Feathertop'],
            correctAnswer: 0,
            explanation: 'Le Mont Kosciuszko est la plus haute montagne d\'Australie.'
        },
        {
            id: 8,
            question: 'Quelle chaîne de montagnes traverse l\'Europe ?',
            options: ['Les Alpes', 'Les Pyrénées', 'Les Carpates', 'Les Balkans'],
            correctAnswer: 0,
            explanation: 'Les Alpes traversent l\'Europe.'
        },
        {
            id: 9,
            question: 'Quelle est la plus haute montagne d\'Amérique du Nord ?',
            options: ['Le Mont McKinley', 'Le Mont Logan', 'Le Mont Saint Elias', 'Le Mont Foraker'],
            correctAnswer: 0,
            explanation: 'Le Mont McKinley (Denali) est la plus haute montagne d\'Amérique du Nord.'
        },
        {
            id: 10,
            question: 'Quelle chaîne de montagnes traverse l\'Asie ?',
            options: ['L\'Himalaya', 'Les Tian Shan', 'Les Oural', 'Les Altaï'],
            correctAnswer: 0,
            explanation: 'L\'Himalaya traverse l\'Asie.'
        }
    ]
};
async function seedAll() {
    console.log('Seeding quizzes + questions...');
    const categories = await prisma.category.findMany();
    const nameToCategoryId = new Map();
    for (const c of categories) {
        nameToCategoryId.set(c.name, c.id);
    }
    const anyUser = await prisma.user.findFirst();
    if (!anyUser) {
        throw new Error('Aucun utilisateur trouvé. Lancez d\'abord seed-users.ts');
    }
    let createdQuizCount = 0;
    for (const q of PLAY_QUIZZES_DATA) {
        const primaryCategoryName = q.categories[0];
        const categoryId = nameToCategoryId.get(primaryCategoryName);
        if (!categoryId) {
            console.log(`Catégorie introuvable pour "${q.title}": ${primaryCategoryName}. Quiz ignoré.`);
            continue;
        }
        const difficulty = difficultyMap[q.difficulty] ?? client_1.Difficulty.MOYEN;
        const existing = await prisma.quiz.findFirst({
            where: {
                title: q.title,
                authorId: anyUser.id,
                categoryId,
            },
        });
        let quizId;
        if (!existing) {
            const created = await prisma.quiz.create({
                data: {
                    title: q.title,
                    description: q.description,
                    difficulty,
                    authorId: anyUser.id,
                    categoryId,
                },
            });
            quizId = created.id;
            createdQuizCount += 1;
            console.log(`Quiz créé: ${q.title}`);
        }
        else {
            const updated = await prisma.quiz.update({
                where: { id: existing.id },
                data: {
                    description: q.description,
                    difficulty,
                },
            });
            quizId = updated.id;
            console.log(`Quiz mis à jour: ${q.title}`);
            await prisma.answer.deleteMany({ where: { question: { quizId } } });
            await prisma.question.deleteMany({ where: { quizId } });
        }
        const frontQuestions = QUIZ_QUESTIONS[q.id] || [];
        for (const fq of frontQuestions) {
            const question = await prisma.question.create({
                data: {
                    text: fq.question,
                    type: client_1.QuestionType.SIMPLE,
                    quizId,
                },
            });
            await prisma.answer.createMany({
                data: fq.options.map((opt, idx) => ({
                    text: opt,
                    isCorrect: idx === fq.correctAnswer,
                    questionId: question.id,
                })),
            });
        }
    }
    console.log(`Terminé. Quizzes créés/mis à jour: ${createdQuizCount}/${PLAY_QUIZZES_DATA.length}`);
}
seedAll()
    .catch((e) => {
    console.error('Erreur lors du seed complet:', e);
    process.exit(1);
})
    .finally(() => {
    void prisma.$disconnect();
});
//# sourceMappingURL=seed-all-quiz-data.js.map