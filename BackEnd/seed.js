import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/ContentModel.js';
import Exercise from './models/ExerciseModel.js';
import MCQ from './models/MCQModel.js';
import Role from './models/RoleModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'mpdb';

const seedData = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log('Connected to MongoDB');

        // Clear existing data
        await MCQ.deleteMany({});
        await Content.deleteMany({});
        await Exercise.deleteMany({});
        console.log('Cleared existing data');

        // Seed roles (don't delete existing to preserve user references)
        const roles = ['user', 'admin'];
        for (const roleName of roles) {
            const existingRole = await Role.findOne({ name: roleName });
            if (!existingRole) {
                await Role.create({ name: roleName });
                console.log(`Created role: ${roleName}`);
            } else {
                console.log(`Role already exists: ${roleName}`);
            }
        }

        // Comprehensive exercises with multiple per age group, longer text, more MCQs
        const exercisesData = [
            // ============ AGE GROUP 6-8 (3 exercises) ============
            {
                name: 'My Pet Dog',
                description: 'A fun story about a pet dog for young readers',
                difficulty: { minAge: 6, maxAge: 8, level: 'Easy' },
                text: `I have a pet dog named Max. Max is a golden retriever with soft, fluffy fur. Every morning, Max wakes me up by licking my face. He loves to play fetch in the backyard. I throw the ball, and Max runs very fast to catch it. He always brings the ball back to me with his tail wagging happily.

Max also likes to go for walks in the park. He sniffs all the flowers and trees along the way. Sometimes he meets other dogs and they play together. Max is very friendly and never barks at strangers.

At night, Max sleeps in his cozy bed next to mine. He protects our house and makes me feel safe. I give Max food and water every day. I also brush his fur to keep it shiny and clean. Max is my best friend, and I love him very much.`,
                mcqs: [
                    { question: 'What type of dog is Max?', options: ['Bulldog', 'Golden retriever', 'Poodle', 'German shepherd'], correctAnswer: 'Golden retriever' },
                    { question: 'How does Max wake up his owner?', options: ['By barking', 'By licking his face', 'By jumping on the bed', 'By bringing a ball'], correctAnswer: 'By licking his face' },
                    { question: 'What game does Max love to play?', options: ['Hide and seek', 'Fetch', 'Tug of war', 'Chase'], correctAnswer: 'Fetch' },
                    { question: 'Where does Max like to go for walks?', options: ['The beach', 'The park', 'The mall', 'The forest'], correctAnswer: 'The park' },
                    { question: 'Where does Max sleep at night?', options: ['Outside', 'In a cozy bed', 'On the couch', 'In the kitchen'], correctAnswer: 'In a cozy bed' }
                ]
            },
            {
                name: 'The Magic Garden',
                description: 'A story about a special garden with colorful flowers',
                difficulty: { minAge: 6, maxAge: 8, level: 'Easy' },
                text: `Once upon a time, there was a magical garden behind a little cottage. In this garden, the flowers could talk and sing! Red roses sang sweet songs in the morning. Yellow sunflowers told funny jokes that made everyone laugh. Purple violets whispered secrets to the butterflies.

A little girl named Lily visited the garden every day. She watered the flowers and pulled out the weeds. The flowers loved Lily and always made her smile. One day, a big storm came and bent all the flowers. Lily was very sad.

But Lily did not give up. She carefully fixed each flower and gave them extra water. She put sticks next to them for support. After a few days, the flowers stood tall again. They sang a special thank you song just for Lily. From that day on, the garden grew even more beautiful than before.`,
                mcqs: [
                    { question: 'What made this garden magical?', options: ['It had gold', 'The flowers could talk and sing', 'It never rained', 'Animals could talk'], correctAnswer: 'The flowers could talk and sing' },
                    { question: 'What color were the roses?', options: ['Yellow', 'Purple', 'Red', 'White'], correctAnswer: 'Red' },
                    { question: 'What did the sunflowers do?', options: ['Sang songs', 'Told jokes', 'Whispered secrets', 'Danced'], correctAnswer: 'Told jokes' },
                    { question: 'What happened to the garden?', options: ['It caught fire', 'A storm bent the flowers', 'Animals ate it', 'It disappeared'], correctAnswer: 'A storm bent the flowers' },
                    { question: 'How did Lily help the flowers?', options: ['She sang to them', 'She fixed them with sticks and water', 'She built a roof', 'She moved them inside'], correctAnswer: 'She fixed them with sticks and water' }
                ]
            },
            {
                name: 'The Busy Bee',
                description: 'Learn about how bees help our world',
                difficulty: { minAge: 6, maxAge: 8, level: 'Easy' },
                text: `Buzz, buzz, buzz! That is the sound a bee makes when it flies. Bees are very small but very important insects. They live together in a home called a hive. Inside the hive, there are many bees working together like a big family.

The queen bee is the leader of the hive. Worker bees fly from flower to flower collecting nectar. Nectar is a sweet liquid inside flowers. Bees use nectar to make honey. Honey is yummy and good for us to eat!

When bees visit flowers, they also help the flowers grow. Yellow powder called pollen sticks to their fuzzy bodies. When they fly to the next flower, the pollen falls off. This helps new flowers and fruits grow. Without bees, we would not have many fruits and vegetables. So next time you see a bee, remember how helpful it is!`,
                mcqs: [
                    { question: 'What sound does a bee make?', options: ['Chirp', 'Buzz', 'Meow', 'Bark'], correctAnswer: 'Buzz' },
                    { question: 'What is a bee\'s home called?', options: ['Nest', 'Den', 'Hive', 'Burrow'], correctAnswer: 'Hive' },
                    { question: 'Who is the leader of the hive?', options: ['King bee', 'Queen bee', 'Worker bee', 'Baby bee'], correctAnswer: 'Queen bee' },
                    { question: 'What do bees collect from flowers?', options: ['Water', 'Leaves', 'Nectar', 'Seeds'], correctAnswer: 'Nectar' },
                    { question: 'What do bees make from nectar?', options: ['Milk', 'Honey', 'Juice', 'Jam'], correctAnswer: 'Honey' }
                ]
            },

            // ============ AGE GROUP 8-10 (3 exercises) ============
            {
                name: 'The Solar System Adventure',
                description: 'Explore the planets in our solar system',
                difficulty: { minAge: 8, maxAge: 10, level: 'Easy' },
                text: `Our solar system is like a giant neighborhood in space. At the center is the Sun, a huge ball of hot, glowing gas that gives us light and warmth. Eight planets orbit around the Sun, each one unique and amazing in its own way.

Mercury is the closest planet to the Sun and also the smallest. It has no air and gets extremely hot during the day. Venus is the second planet and is covered in thick clouds. It is the hottest planet because the clouds trap heat like a blanket.

Earth is our home, the third planet from the Sun. It is the only planet we know that has life. Earth has water, air, and the perfect temperature for plants, animals, and people to live. Mars is called the Red Planet because of its rusty red color. Scientists are studying Mars to see if humans could live there someday.

The outer planets are much bigger. Jupiter is the largest planet and has a famous Great Red Spot, which is actually a giant storm! Saturn is known for its beautiful rings made of ice and rock. Uranus and Neptune are the farthest planets and are very cold and blue.`,
                mcqs: [
                    { question: 'What is at the center of our solar system?', options: ['Earth', 'The Moon', 'The Sun', 'Jupiter'], correctAnswer: 'The Sun' },
                    { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], correctAnswer: 'Mercury' },
                    { question: 'Why is Venus the hottest planet?', options: ['It is closest to the Sun', 'Its clouds trap heat', 'It has volcanoes', 'It spins fast'], correctAnswer: 'Its clouds trap heat' },
                    { question: 'What is special about Earth?', options: ['It has rings', 'It is the largest', 'It has life', 'It is red'], correctAnswer: 'It has life' },
                    { question: 'Why is Mars called the Red Planet?', options: ['It is hot', 'It has red clouds', 'Its rusty red color', 'It has red water'], correctAnswer: 'Its rusty red color' },
                    { question: 'Which planet is the largest?', options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'], correctAnswer: 'Jupiter' }
                ]
            },
            {
                name: 'The Water Cycle Journey',
                description: 'Discover how water travels around our planet',
                difficulty: { minAge: 8, maxAge: 10, level: 'Easy' },
                text: `Have you ever wondered where rain comes from? The answer is the water cycle, nature's way of recycling water over and over again. This amazing process has been happening for millions of years and keeps our planet alive.

The water cycle begins with evaporation. When the Sun heats water in oceans, lakes, and rivers, the water turns into an invisible gas called water vapor. This vapor rises up into the sky. You cannot see it, but it is always happening, especially on warm, sunny days.

As the water vapor rises higher, the air gets colder. The vapor cools down and changes into tiny water droplets. This process is called condensation. These droplets join together to form clouds. The fluffy white clouds you see in the sky are actually made of billions of tiny water droplets!

When the clouds get heavy with too many water droplets, the water falls back to Earth. This is called precipitation. Precipitation can be rain, snow, sleet, or hail, depending on the temperature. The water then flows into rivers, lakes, and oceans, and the cycle starts all over again.`,
                mcqs: [
                    { question: 'What is the water cycle?', options: ['A type of bicycle', 'Nature\'s way of recycling water', 'A water sport', 'A washing machine setting'], correctAnswer: 'Nature\'s way of recycling water' },
                    { question: 'What starts the water cycle?', options: ['Rain', 'Evaporation', 'Snow', 'Wind'], correctAnswer: 'Evaporation' },
                    { question: 'What is water vapor?', options: ['Liquid water', 'Frozen water', 'Invisible gas', 'Dirty water'], correctAnswer: 'Invisible gas' },
                    { question: 'What is condensation?', options: ['Water heating up', 'Vapor cooling into droplets', 'Water flowing downhill', 'Clouds disappearing'], correctAnswer: 'Vapor cooling into droplets' },
                    { question: 'What are clouds made of?', options: ['Cotton', 'Smoke', 'Tiny water droplets', 'Dust'], correctAnswer: 'Tiny water droplets' },
                    { question: 'What is precipitation?', options: ['Water rising up', 'Water falling to Earth', 'Water evaporating', 'Water freezing'], correctAnswer: 'Water falling to Earth' }
                ]
            },
            {
                name: 'Ancient Egypt Mysteries',
                description: 'Travel back in time to ancient Egypt',
                difficulty: { minAge: 8, maxAge: 10, level: 'Medium' },
                text: `Thousands of years ago, one of the world's greatest civilizations flourished along the banks of the Nile River in Egypt. The ancient Egyptians built magnificent structures, created beautiful art, and developed one of the first writing systems in history.

The most famous structures from ancient Egypt are the pyramids. These massive stone buildings were built as tombs for the pharaohs, the kings of Egypt. The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World. It took thousands of workers many years to build, using blocks of stone that weighed several tons each.

The Egyptians believed in life after death. When a pharaoh died, the body was preserved through a process called mummification. The mummy was placed in the pyramid along with food, jewelry, and other items the pharaoh might need in the afterlife. The Egyptians believed these treasures would help the pharaoh in the next world.

Ancient Egyptians also created hieroglyphics, a writing system using pictures and symbols. Each symbol represented a sound or a word. For many years, no one could read hieroglyphics. Then, in 1799, a stone called the Rosetta Stone was discovered, which helped scientists finally decode this ancient language.`,
                mcqs: [
                    { question: 'Where did ancient Egyptian civilization develop?', options: ['Amazon River', 'Nile River', 'Mississippi River', 'Thames River'], correctAnswer: 'Nile River' },
                    { question: 'What were the pyramids built for?', options: ['Homes for people', 'Tombs for pharaohs', 'Schools', 'Markets'], correctAnswer: 'Tombs for pharaohs' },
                    { question: 'Who were the pharaohs?', options: ['Soldiers', 'Teachers', 'Kings of Egypt', 'Farmers'], correctAnswer: 'Kings of Egypt' },
                    { question: 'What is mummification?', options: ['A type of dance', 'Preserving dead bodies', 'Building pyramids', 'Writing hieroglyphics'], correctAnswer: 'Preserving dead bodies' },
                    { question: 'What are hieroglyphics?', options: ['Egyptian food', 'Ancient writing with pictures', 'Egyptian clothing', 'Pyramid decorations'], correctAnswer: 'Ancient writing with pictures' },
                    { question: 'What helped decode hieroglyphics?', options: ['A pyramid', 'The Rosetta Stone', 'A mummy', 'The Nile River'], correctAnswer: 'The Rosetta Stone' }
                ]
            },

            // ============ AGE GROUP 10-12 (3 exercises) ============
            {
                name: 'The Human Body Machine',
                description: 'Understand how your amazing body works',
                difficulty: { minAge: 10, maxAge: 12, level: 'Medium' },
                text: `Your body is the most sophisticated machine ever created, with trillions of cells working together in perfect harmony. Every second, millions of processes occur without you even thinking about them. Let's explore some of the incredible systems that keep you alive and healthy.

The circulatory system is like a transportation network. Your heart, a muscle about the size of your fist, pumps blood through thousands of miles of blood vessels. Blood carries oxygen from your lungs to every cell in your body and removes waste products like carbon dioxide. Your heart beats approximately 100,000 times per day, pumping about 2,000 gallons of blood!

The nervous system is your body's communication center. Your brain, containing about 86 billion neurons, controls everything you think, feel, and do. Electrical signals travel along nerves at speeds up to 250 miles per hour, allowing you to react quickly to your environment. The spinal cord acts as a highway connecting your brain to the rest of your body.

The digestive system breaks down food into nutrients your body can use. The journey begins in your mouth, where teeth crush food and saliva starts breaking it down. Food then travels through the esophagus to the stomach, where acids continue the breakdown process. The small intestine absorbs nutrients into the blood, while the large intestine removes water and waste. The entire digestive tract is about 30 feet long!

Your immune system is like an army defending against invaders. White blood cells patrol your body, looking for bacteria, viruses, and other harmful substances. When they detect a threat, they attack and destroy it. This is why you might get a fever when sick – it's your immune system fighting back.`,
                mcqs: [
                    { question: 'How many times does the heart beat per day approximately?', options: ['10,000', '50,000', '100,000', '500,000'], correctAnswer: '100,000' },
                    { question: 'What does blood carry from the lungs to cells?', options: ['Food', 'Water', 'Oxygen', 'Vitamins'], correctAnswer: 'Oxygen' },
                    { question: 'How many neurons are in the human brain?', options: ['86 million', '86 billion', '86 thousand', '86 trillion'], correctAnswer: '86 billion' },
                    { question: 'What is the role of the spinal cord?', options: ['Digest food', 'Connect brain to body', 'Filter blood', 'Store memories'], correctAnswer: 'Connect brain to body' },
                    { question: 'How long is the digestive tract?', options: ['10 feet', '20 feet', '30 feet', '50 feet'], correctAnswer: '30 feet' },
                    { question: 'What fights bacteria and viruses in your body?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Neurons'], correctAnswer: 'White blood cells' }
                ]
            },
            {
                name: 'Rainforest Ecosystems',
                description: 'Dive into the world\'s most diverse ecosystems',
                difficulty: { minAge: 10, maxAge: 12, level: 'Medium' },
                text: `Tropical rainforests are among the most important and biodiverse ecosystems on Earth. Covering only about 6% of the Earth's surface, they are home to more than half of all plant and animal species on the planet. These incredible forests receive between 80 and 400 inches of rain each year, creating ideal conditions for life to flourish.

Rainforests are organized into distinct layers, each with its own unique environment and inhabitants. The emergent layer consists of the tallest trees that poke above the main canopy, reaching heights of 200 feet or more. Eagles, butterflies, and bats live in this sunny layer. Below is the canopy layer, a dense ceiling of leaves that blocks most sunlight from reaching the forest floor. This layer is home to monkeys, sloths, toucans, and countless insects.

The understory layer receives only about 5% of the sunlight. Plants here have large leaves to capture whatever light filters through. Jaguars, leopards, and many snakes hunt in this dim environment. The forest floor is almost completely dark, receiving less than 2% of sunlight. Despite the darkness, it teems with life – decomposers like fungi and insects break down dead plants and animals, recycling nutrients back into the soil.

Rainforests play a crucial role in regulating Earth's climate. They absorb carbon dioxide and release oxygen, earning them the nickname "the lungs of the Earth." They also influence weather patterns and water cycles across the globe. Unfortunately, deforestation threatens these vital ecosystems. Every year, millions of acres of rainforest are destroyed for farming, logging, and development.`,
                mcqs: [
                    { question: 'What percentage of Earth\'s surface do rainforests cover?', options: ['About 2%', 'About 6%', 'About 15%', 'About 25%'], correctAnswer: 'About 6%' },
                    { question: 'How much of all species live in rainforests?', options: ['About 10%', 'About 25%', 'More than 50%', 'About 75%'], correctAnswer: 'More than 50%' },
                    { question: 'What is the highest layer of the rainforest called?', options: ['Canopy', 'Understory', 'Emergent', 'Forest floor'], correctAnswer: 'Emergent' },
                    { question: 'How much sunlight reaches the understory?', options: ['About 5%', 'About 25%', 'About 50%', 'About 75%'], correctAnswer: 'About 5%' },
                    { question: 'Why are rainforests called "the lungs of the Earth"?', options: ['They are shaped like lungs', 'They absorb CO2 and release oxygen', 'They are very large', 'They breathe'], correctAnswer: 'They absorb CO2 and release oxygen' },
                    { question: 'What threatens rainforests today?', options: ['Too much rain', 'Deforestation', 'Cold weather', 'Floods'], correctAnswer: 'Deforestation' }
                ]
            },
            {
                name: 'The Renaissance Revolution',
                description: 'Explore the age of artistic and scientific rebirth',
                difficulty: { minAge: 10, maxAge: 12, level: 'Medium' },
                text: `The Renaissance was a remarkable period of cultural, artistic, and intellectual transformation that began in Italy in the 14th century and spread throughout Europe over the next 300 years. The word "Renaissance" means "rebirth" in French, referring to the renewed interest in the art, literature, and ideas of ancient Greece and Rome.

During the Middle Ages, life centered around the Church, and most art depicted religious subjects. The Renaissance brought a shift toward humanism, a philosophy that emphasized the value and potential of human beings. Artists and thinkers began exploring the natural world, human emotions, and individual achievement. This new way of thinking laid the foundation for the modern era.

Some of history's greatest artists emerged during the Renaissance. Leonardo da Vinci was not only a masterful painter of works like the Mona Lisa and The Last Supper, but also an inventor, scientist, and engineer whose notebooks contained designs for flying machines, tanks, and anatomical studies centuries ahead of their time. Michelangelo sculpted the famous statue of David and painted the ceiling of the Sistine Chapel, a task that took him four years lying on his back.

The Renaissance also transformed science and knowledge. Nicolaus Copernicus proposed that the Earth revolved around the Sun, challenging the accepted belief that Earth was the center of the universe. Galileo Galilei improved the telescope and made observations that supported Copernicus's theory. Johannes Gutenberg invented the printing press around 1440, making books affordable and accessible, which accelerated the spread of knowledge throughout Europe.`,
                mcqs: [
                    { question: 'What does "Renaissance" mean?', options: ['Revolution', 'Rebirth', 'Religion', 'Royalty'], correctAnswer: 'Rebirth' },
                    { question: 'Where did the Renaissance begin?', options: ['France', 'England', 'Italy', 'Germany'], correctAnswer: 'Italy' },
                    { question: 'What philosophy became popular during the Renaissance?', options: ['Socialism', 'Humanism', 'Feudalism', 'Capitalism'], correctAnswer: 'Humanism' },
                    { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correctAnswer: 'Leonardo da Vinci' },
                    { question: 'What did Copernicus propose?', options: ['The Moon revolves around Mars', 'The Earth revolves around the Sun', 'The Sun revolves around Earth', 'Stars are very close'], correctAnswer: 'The Earth revolves around the Sun' },
                    { question: 'Who invented the printing press?', options: ['Leonardo da Vinci', 'Galileo Galilei', 'Johannes Gutenberg', 'Michelangelo'], correctAnswer: 'Johannes Gutenberg' }
                ]
            },

            // ============ AGE GROUP 12-14 (3 exercises) ============
            {
                name: 'The Science of Black Holes',
                description: 'Journey into the universe\'s most mysterious objects',
                difficulty: { minAge: 12, maxAge: 14, level: 'Medium' },
                text: `Black holes are among the most fascinating and mysterious objects in the universe. These cosmic phenomena possess gravitational forces so powerful that nothing – not even light itself – can escape once it crosses a boundary called the event horizon. Despite their name suggesting emptiness, black holes are actually incredibly dense concentrations of matter.

Black holes form when massive stars, at least 20 times larger than our Sun, reach the end of their lives. When such a star exhausts its nuclear fuel, it can no longer support itself against its own gravity. The core collapses catastrophically, creating a supernova explosion. If enough mass remains after the explosion, it continues collapsing until it forms a singularity – a point of infinite density where the laws of physics as we know them break down.

Scientists categorize black holes by size. Stellar black holes, formed from collapsed stars, are typically 5 to 50 times the mass of our Sun. Supermassive black holes, found at the centers of galaxies, can be millions or even billions of times the Sun's mass. The supermassive black hole at the center of our Milky Way galaxy, called Sagittarius A*, is approximately 4 million solar masses.

Although black holes cannot be directly observed since they emit no light, scientists detect them through their effects on nearby matter and light. When material falls toward a black hole, it forms a swirling disk called an accretion disk, which heats up and emits X-rays. Gravitational waves, ripples in spacetime predicted by Einstein's theory of relativity, have also been detected from colliding black holes. In 2019, the Event Horizon Telescope captured the first-ever image of a black hole's shadow, confirming decades of theoretical predictions.`,
                mcqs: [
                    { question: 'Why is nothing able to escape a black hole?', options: ['It\'s too cold', 'Gravitational force is too strong', 'It\'s too hot', 'There\'s no air'], correctAnswer: 'Gravitational force is too strong' },
                    { question: 'What is the boundary around a black hole called?', options: ['Accretion disk', 'Event horizon', 'Singularity', 'Corona'], correctAnswer: 'Event horizon' },
                    { question: 'How large must a star be to form a black hole?', options: ['5 times the Sun', 'At least 20 times the Sun', '100 times the Sun', 'Same as the Sun'], correctAnswer: 'At least 20 times the Sun' },
                    { question: 'What is a singularity?', options: ['A bright star', 'A point of infinite density', 'A type of galaxy', 'A planet'], correctAnswer: 'A point of infinite density' },
                    { question: 'What is the black hole at our galaxy\'s center called?', options: ['Alpha Centauri', 'Sagittarius A*', 'Andromeda', 'Orion'], correctAnswer: 'Sagittarius A*' },
                    { question: 'When was the first image of a black hole captured?', options: ['2010', '2015', '2019', '2022'], correctAnswer: '2019' }
                ]
            },
            {
                name: 'World War II: Global Conflict',
                description: 'Understanding the war that shaped the modern world',
                difficulty: { minAge: 12, maxAge: 14, level: 'Hard' },
                text: `World War II (1939-1945) was the deadliest and most widespread conflict in human history, involving more than 30 countries and resulting in an estimated 70-85 million deaths. This global war reshaped international relations, led to the creation of the United Nations, and established the United States and Soviet Union as the world's two superpowers.

The war in Europe began on September 1, 1939, when Nazi Germany, led by Adolf Hitler, invaded Poland. Britain and France declared war on Germany two days later. Hitler's aggressive expansionist policies, combined with his ideology of racial superiority, drove Germany to conquer much of Europe by 1941. The Holocaust, Nazi Germany's systematic murder of six million Jews and millions of others deemed "undesirable," remains one of history's greatest atrocities.

The conflict became truly global when Japan attacked the U.S. naval base at Pearl Harbor, Hawaii, on December 7, 1941, bringing the United States into the war. Meanwhile, Germany had invaded the Soviet Union in June 1941, opening the devastating Eastern Front. The war was fought on multiple continents, from the beaches of Normandy to the islands of the Pacific, from the deserts of North Africa to the cities of Asia.

The war ended in stages. Germany surrendered on May 8, 1945, following Allied invasions from both west and east and Hitler's suicide. Japan surrendered on August 15, 1945, after the United States dropped atomic bombs on Hiroshima and Nagasaki – the first and only use of nuclear weapons in warfare. The war's aftermath included the Nuremberg Trials, which established the principle that individuals can be held accountable for war crimes, and the formation of the United Nations to prevent future global conflicts.`,
                mcqs: [
                    { question: 'When did World War II begin in Europe?', options: ['1935', '1939', '1941', '1945'], correctAnswer: '1939' },
                    { question: 'What event started the war in Europe?', options: ['Attack on Pearl Harbor', 'Invasion of Poland', 'Invasion of France', 'Bombing of London'], correctAnswer: 'Invasion of Poland' },
                    { question: 'How many people died in World War II?', options: ['10-20 million', '30-40 million', '70-85 million', '100 million'], correctAnswer: '70-85 million' },
                    { question: 'What brought the United States into the war?', options: ['Invasion of Britain', 'Attack on Pearl Harbor', 'Invasion of Canada', 'Submarine warfare'], correctAnswer: 'Attack on Pearl Harbor' },
                    { question: 'When did Germany surrender?', options: ['May 8, 1944', 'May 8, 1945', 'August 15, 1945', 'December 7, 1941'], correctAnswer: 'May 8, 1945' },
                    { question: 'What was established after the war to prevent future conflicts?', options: ['NATO', 'European Union', 'United Nations', 'World Bank'], correctAnswer: 'United Nations' }
                ]
            },
            {
                name: 'Genetics and DNA',
                description: 'The molecular blueprint of life',
                difficulty: { minAge: 12, maxAge: 14, level: 'Hard' },
                text: `Deoxyribonucleic acid, or DNA, is the molecule that carries the genetic instructions for life. Found in nearly every cell of every living organism, DNA determines everything from the color of your eyes to your risk for certain diseases. Understanding DNA has revolutionized medicine, agriculture, and criminal justice.

DNA has a famous double helix structure, resembling a twisted ladder. The "rungs" of this ladder are made of pairs of chemical bases: adenine (A) always pairs with thymine (T), and guanine (G) always pairs with cytosine (C). A human cell contains about 3 billion of these base pairs, organized into 23 pairs of chromosomes. If you stretched out all the DNA from a single cell, it would be about 6 feet long!

Genes are specific sections of DNA that contain instructions for making proteins, the molecules that perform most functions in your body. Humans have approximately 20,000-25,000 genes, but these account for only about 2% of our total DNA. The function of much of the remaining DNA is still being studied, though some of it helps regulate when and how genes are expressed.

DNA replication is the process by which cells copy their DNA before dividing. This process is remarkably accurate, with only about one error per billion base pairs copied. However, when errors do occur, they can lead to mutations. Some mutations are harmful and can cause diseases like cancer; others are neutral or even beneficial, providing the genetic variation that drives evolution.

The Human Genome Project, completed in 2003, mapped the entire human genetic code. This achievement has opened new frontiers in personalized medicine, allowing doctors to tailor treatments based on a patient's genetic makeup.`,
                mcqs: [
                    { question: 'What does DNA stand for?', options: ['Deoxyribonucleic acid', 'Dinitrogen acid', 'Deoxynitrogen acid', 'Dynamic nucleic acid'], correctAnswer: 'Deoxyribonucleic acid' },
                    { question: 'What shape is DNA?', options: ['Single helix', 'Double helix', 'Triple helix', 'Straight line'], correctAnswer: 'Double helix' },
                    { question: 'Which base always pairs with adenine (A)?', options: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'], correctAnswer: 'Thymine' },
                    { question: 'How many base pairs are in human DNA?', options: ['3 million', '3 billion', '3 trillion', '300 million'], correctAnswer: '3 billion' },
                    { question: 'How many genes do humans have approximately?', options: ['2,000-5,000', '20,000-25,000', '200,000-250,000', '2 million'], correctAnswer: '20,000-25,000' },
                    { question: 'When was the Human Genome Project completed?', options: ['1990', '1997', '2003', '2010'], correctAnswer: '2003' }
                ]
            },

            // ============ AGE GROUP 14-16 (3 exercises) ============
            {
                name: 'Climate Change: Science and Solutions',
                description: 'Understanding and addressing the climate crisis',
                difficulty: { minAge: 14, maxAge: 16, level: 'Hard' },
                text: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The overwhelming scientific consensus, supported by data from thousands of studies, confirms that human activities are fundamentally altering Earth's climate systems. Understanding both the science and potential solutions is essential for addressing this global crisis.

The greenhouse effect is a natural process that makes Earth habitable. Gases in the atmosphere, including carbon dioxide, methane, and water vapor, trap some of the Sun's heat, maintaining temperatures suitable for life. However, since the Industrial Revolution, human activities have dramatically increased the concentration of these greenhouse gases. Carbon dioxide levels have risen from about 280 parts per million (ppm) in 1750 to over 420 ppm today – the highest level in at least 800,000 years.

The consequences of climate change are already visible. Global average temperatures have risen approximately 1.1°C since pre-industrial times. Ice sheets in Greenland and Antarctica are losing mass at accelerating rates, contributing to sea level rise. Ocean acidification, caused by CO2 absorption, threatens marine ecosystems. Extreme weather events, including hurricanes, droughts, and wildfires, are becoming more frequent and intense.

Addressing climate change requires both mitigation (reducing emissions) and adaptation (preparing for unavoidable changes). Transitioning to renewable energy sources like solar, wind, and hydroelectric power is crucial. Improving energy efficiency in buildings, transportation, and industry can significantly reduce emissions. Protecting and restoring forests helps absorb CO2 from the atmosphere. Some scientists also propose carbon capture technologies that could remove CO2 directly from the air.

International cooperation is essential. The Paris Agreement of 2015 united 196 nations in committing to limit global warming to 1.5-2°C above pre-industrial levels. Meeting these targets will require unprecedented collaboration between governments, businesses, and individuals worldwide.`,
                mcqs: [
                    { question: 'What is the current CO2 level in the atmosphere?', options: ['280 ppm', '350 ppm', 'Over 420 ppm', '800 ppm'], correctAnswer: 'Over 420 ppm' },
                    { question: 'How much have global temperatures risen since pre-industrial times?', options: ['About 0.5°C', 'About 1.1°C', 'About 2.0°C', 'About 3.0°C'], correctAnswer: 'About 1.1°C' },
                    { question: 'What causes ocean acidification?', options: ['Plastic pollution', 'CO2 absorption', 'Oil spills', 'Overfishing'], correctAnswer: 'CO2 absorption' },
                    { question: 'What is mitigation in the context of climate change?', options: ['Preparing for changes', 'Reducing emissions', 'Measuring temperatures', 'Cleaning oceans'], correctAnswer: 'Reducing emissions' },
                    { question: 'When was the Paris Agreement signed?', options: ['2005', '2010', '2015', '2020'], correctAnswer: '2015' },
                    { question: 'How many nations committed to the Paris Agreement?', options: ['50', '100', '150', '196'], correctAnswer: '196' }
                ]
            },
            {
                name: 'The Psychology of Decision Making',
                description: 'How the mind makes choices',
                difficulty: { minAge: 14, maxAge: 16, level: 'Hard' },
                text: `Every day, humans make thousands of decisions, from trivial choices like what to eat for breakfast to life-altering ones like choosing a career path. Understanding the psychology behind decision making reveals both the remarkable capabilities and surprising limitations of the human mind.

Psychologists distinguish between two systems of thinking. System 1 is fast, automatic, and intuitive – it allows you to catch a ball or recognize a friend's face without conscious effort. System 2 is slow, deliberate, and analytical – it engages when you solve a math problem or carefully weigh options. While System 2 feels like the driver of our decisions, research shows that System 1 often makes choices before we're even aware of them.

Cognitive biases are systematic errors in thinking that affect everyone's decisions. Confirmation bias leads us to seek information that supports our existing beliefs while ignoring contradictory evidence. The availability heuristic causes us to overestimate the likelihood of events we easily remember, like plane crashes, while underestimating more common risks. Anchoring occurs when we rely too heavily on the first piece of information we encounter, even if it's irrelevant.

Emotions play a larger role in decision making than most people realize. Research by neuroscientist Antonio Damasio showed that patients with damage to emotional centers of the brain struggle to make even simple decisions, suggesting that emotion is not the opposite of reason but essential to it. However, strong emotions can also lead to impulsive choices we later regret.

Understanding these psychological mechanisms has practical applications. Marketers use knowledge of biases to influence consumer behavior. Behavioral economists design "nudges" – subtle changes in how choices are presented – to encourage better decisions about health, savings, and the environment. And individuals can learn to recognize their own biases and create decision-making frameworks that lead to better outcomes.`,
                mcqs: [
                    { question: 'What characterizes System 1 thinking?', options: ['Slow and analytical', 'Fast and intuitive', 'Always conscious', 'Only for complex tasks'], correctAnswer: 'Fast and intuitive' },
                    { question: 'What is confirmation bias?', options: ['Confirming appointments', 'Seeking information that supports existing beliefs', 'Confirming facts are true', 'Making quick decisions'], correctAnswer: 'Seeking information that supports existing beliefs' },
                    { question: 'What does the availability heuristic cause us to do?', options: ['Remember everything equally', 'Overestimate easily remembered events', 'Forget important things', 'Make better decisions'], correctAnswer: 'Overestimate easily remembered events' },
                    { question: 'What did Damasio\'s research reveal about emotions?', options: ['Emotions prevent good decisions', 'Emotions are unnecessary for decisions', 'Emotions are essential for decision making', 'Emotions should be ignored'], correctAnswer: 'Emotions are essential for decision making' },
                    { question: 'What is anchoring?', options: ['Staying in one place', 'Relying too heavily on first information', 'Making careful decisions', 'Changing your mind frequently'], correctAnswer: 'Relying too heavily on first information' },
                    { question: 'What are "nudges" in behavioral economics?', options: ['Forceful rules', 'Subtle changes to encourage better decisions', 'Financial punishments', 'Marketing tricks'], correctAnswer: 'Subtle changes to encourage better decisions' }
                ]
            },
            {
                name: 'Quantum Mechanics: The Strange World',
                description: 'Exploring physics at the smallest scales',
                difficulty: { minAge: 14, maxAge: 16, level: 'Hard' },
                text: `Quantum mechanics is the branch of physics that describes the behavior of matter and energy at the smallest scales – atoms, electrons, and photons. At this level, the universe operates according to rules that seem counterintuitive, even bizarre, compared to our everyday experience. Yet quantum mechanics is one of the most successful and accurate scientific theories ever developed.

One of the strangest aspects of quantum mechanics is wave-particle duality. Light, and indeed all particles, can behave as both waves and particles depending on how they are observed. The famous double-slit experiment demonstrates this: when electrons are fired at a barrier with two slits, they create an interference pattern typical of waves. But if you observe which slit each electron passes through, the pattern disappears and they behave like particles.

The Heisenberg Uncertainty Principle states that you cannot simultaneously know both the exact position and exact momentum of a particle. This is not a limitation of measurement technology but a fundamental property of nature. The more precisely you measure one quantity, the less precisely you can know the other. This principle challenges our classical notion that particles have definite properties at all times.

Quantum superposition allows particles to exist in multiple states simultaneously until measured. Schrödinger's famous thought experiment illustrates this: a cat in a box could theoretically be both alive and dead until someone opens the box to look. While this seems absurd for cats, it accurately describes the behavior of electrons and photons.

Perhaps most mysterious is quantum entanglement, which Einstein called "spooky action at a distance." When two particles become entangled, measuring one instantly affects the other, regardless of the distance between them. This phenomenon has been experimentally verified and forms the basis for emerging technologies like quantum computing and quantum cryptography.`,
                mcqs: [
                    { question: 'What does quantum mechanics describe?', options: ['Large objects', 'Matter and energy at the smallest scales', 'Only light', 'Only electrons'], correctAnswer: 'Matter and energy at the smallest scales' },
                    { question: 'What does wave-particle duality mean?', options: ['Waves become particles', 'Particles become waves', 'Things can behave as both waves and particles', 'Nothing is real'], correctAnswer: 'Things can behave as both waves and particles' },
                    { question: 'What does the Heisenberg Uncertainty Principle state?', options: ['Nothing is certain', 'You cannot know position and momentum exactly simultaneously', 'All measurements are wrong', 'Physics is unpredictable'], correctAnswer: 'You cannot know position and momentum exactly simultaneously' },
                    { question: 'What is quantum superposition?', options: ['Particles being stacked', 'Particles existing in multiple states at once', 'Particles moving fast', 'Particles colliding'], correctAnswer: 'Particles existing in multiple states at once' },
                    { question: 'What did Einstein call quantum entanglement?', options: ['Amazing discovery', 'Spooky action at a distance', 'The greatest theory', 'Impossible phenomenon'], correctAnswer: 'Spooky action at a distance' },
                    { question: 'What technology uses quantum entanglement?', options: ['Television', 'Radio', 'Quantum computing', 'Solar panels'], correctAnswer: 'Quantum computing' }
                ]
            },

            // ============ AGE GROUP 16-18 (3 exercises) ============
            {
                name: 'Artificial Intelligence: Promise and Peril',
                description: 'Understanding AI\'s impact on society and future',
                difficulty: { minAge: 16, maxAge: 18, level: 'Hard' },
                text: `Artificial intelligence has evolved from a theoretical concept discussed in academic circles to a transformative technology embedded in virtually every aspect of contemporary life. From the algorithms that curate our social media feeds to the systems that enable autonomous vehicles, AI is reshaping how we work, communicate, and understand ourselves as a species.

The current AI revolution is primarily driven by machine learning, particularly deep learning using neural networks loosely inspired by the human brain. These systems learn from vast amounts of data, identifying patterns and making predictions. Language models like GPT can generate human-quality text, while computer vision systems can identify objects and faces with superhuman accuracy. The release of ChatGPT in 2022 brought these capabilities to mainstream attention, demonstrating AI's potential to augment or automate knowledge work.

The economic implications are profound. A 2023 study by Goldman Sachs estimated that generative AI could automate approximately 300 million jobs worldwide. While AI will create new jobs and industries, the transition may cause significant disruption. History suggests that technological revolutions ultimately increase prosperity, but the benefits are not automatically distributed equally. The question of how to manage this transition fairly is one of the most important policy challenges of our time.

Ethical concerns about AI are multifaceted. Algorithmic bias can perpetuate and amplify existing social inequalities when systems trained on biased data make decisions about hiring, lending, or criminal justice. The opacity of complex AI systems – sometimes called the "black box" problem – raises questions about accountability when AI makes errors. Privacy concerns intensify as AI enables unprecedented surveillance capabilities. And the concentration of AI development in a small number of large technology companies raises questions about power and democratic governance.

Perhaps most philosophically challenging are questions about artificial general intelligence (AGI) – hypothetical AI systems that match or exceed human cognitive abilities across all domains. While experts disagree about whether and when AGI might emerge, its potential development raises fundamental questions about consciousness, identity, and what it means to be human. Some researchers warn of existential risks; others see AGI as the key to solving humanity's greatest challenges.`,
                mcqs: [
                    { question: 'What primarily drives the current AI revolution?', options: ['Rule-based programming', 'Machine learning and deep learning', 'Simple algorithms', 'Human supervision'], correctAnswer: 'Machine learning and deep learning' },
                    { question: 'How many jobs could generative AI potentially automate according to Goldman Sachs?', options: ['50 million', '100 million', '300 million', '1 billion'], correctAnswer: '300 million' },
                    { question: 'What is the "black box" problem in AI?', options: ['AI stored in black boxes', 'Opacity of how complex AI makes decisions', 'AI that only works in the dark', 'Broken AI systems'], correctAnswer: 'Opacity of how complex AI makes decisions' },
                    { question: 'What is algorithmic bias?', options: ['AI preferring certain algorithms', 'Systems perpetuating social inequalities', 'Programmers being biased', 'AI being too slow'], correctAnswer: 'Systems perpetuating social inequalities' },
                    { question: 'What is AGI?', options: ['Advanced Gaming Interface', 'Artificial General Intelligence', 'Automated Government Intelligence', 'Advanced Graphical Interface'], correctAnswer: 'Artificial General Intelligence' },
                    { question: 'When was ChatGPT released to mainstream attention?', options: ['2018', '2020', '2022', '2024'], correctAnswer: '2022' }
                ]
            },
            {
                name: 'Philosophy of Ethics: Moral Frameworks',
                description: 'Exploring how we determine right from wrong',
                difficulty: { minAge: 16, maxAge: 18, level: 'Hard' },
                text: `Ethics, the systematic study of morality, has occupied philosophers for millennia. How do we determine what actions are right or wrong? What makes a person virtuous? These questions are not merely academic – they underlie debates about everything from criminal justice to healthcare policy to how we treat animals. Understanding the major ethical frameworks provides tools for navigating complex moral decisions.

Consequentialism holds that the morality of an action depends solely on its outcomes. The most influential consequentialist theory is utilitarianism, developed by Jeremy Bentham and John Stuart Mill in the 18th and 19th centuries. Utilitarianism proposes that we should maximize overall well-being or happiness. An action is right if it produces the greatest good for the greatest number. While intuitively appealing, consequentialism faces challenges: it might justify harming one person to benefit many, and calculating all consequences of an action is often impossible.

Deontological ethics, championed by Immanuel Kant, focuses on duties and rules rather than consequences. Kant's "categorical imperative" states that we should only act according to principles we could rationally will to become universal laws. For example, lying is wrong not because of its bad consequences but because we cannot consistently will a world where everyone lies – such a world would make communication meaningless. Deontological ethics provides strong protections for individual rights but can seem inflexible when rules conflict.

Virtue ethics, originated by Aristotle, emphasizes character rather than actions or rules. It asks not "What should I do?" but "What kind of person should I be?" Virtues like courage, honesty, and compassion are habits that lead to human flourishing (eudaimonia). Virtue ethics has experienced a revival in contemporary philosophy, partly because it addresses motivation and moral development in ways other theories neglect.

Modern ethical debates often involve these frameworks in tension. Consider the classic trolley problem: a runaway trolley will kill five people unless you divert it to a track where it will kill one. Consequentialists generally approve of diverting: five saved outweighs one lost. Deontologists may hesitate: actively causing someone's death violates their rights. Virtue ethicists might ask what a person of good character would do in that situation.`,
                mcqs: [
                    { question: 'What does consequentialism focus on?', options: ['Intentions', 'Character', 'Outcomes of actions', 'Divine commands'], correctAnswer: 'Outcomes of actions' },
                    { question: 'Who developed utilitarianism?', options: ['Aristotle', 'Kant', 'Bentham and Mill', 'Socrates'], correctAnswer: 'Bentham and Mill' },
                    { question: 'What is Kant\'s "categorical imperative"?', options: ['Do whatever makes you happy', 'Act only on principles you could will to be universal laws', 'Follow your emotions', 'Obey authority'], correctAnswer: 'Act only on principles you could will to be universal laws' },
                    { question: 'What does virtue ethics emphasize?', options: ['Rules', 'Consequences', 'Character and virtues', 'Pleasure'], correctAnswer: 'Character and virtues' },
                    { question: 'What is "eudaimonia"?', options: ['A Greek god', 'Human flourishing', 'A logical fallacy', 'An ethical rule'], correctAnswer: 'Human flourishing' },
                    { question: 'Who originated virtue ethics?', options: ['Kant', 'Mill', 'Aristotle', 'Bentham'], correctAnswer: 'Aristotle' }
                ]
            },
            {
                name: 'Global Economics: Interconnected Systems',
                description: 'How economies interact in a globalized world',
                difficulty: { minAge: 16, maxAge: 18, level: 'Hard' },
                text: `The global economy is an intricate web of interconnected systems, where events in one country can ripple across continents within hours. Understanding these connections – through trade, finance, monetary policy, and supply chains – is essential for navigating the modern world and making informed decisions as citizens and future professionals.

International trade has grown exponentially over the past century, driven by technological advances in transportation and communication, reduced tariffs, and agreements like the World Trade Organization. Countries specialize in producing goods where they have a comparative advantage – that is, where their opportunity cost is lowest relative to other goods. This specialization increases global efficiency but also creates dependencies. A semiconductor shortage in Taiwan, for example, can halt automobile production in Germany.

The global financial system facilitates the movement of capital across borders. Foreign direct investment occurs when companies establish operations in other countries. Portfolio investment involves buying stocks and bonds internationally. Currency markets, where over $6 trillion is traded daily, determine exchange rates that affect the prices of imports and exports. While financial globalization provides opportunities for investment and economic development, it can also transmit crises rapidly, as seen in the 2008 financial crisis.

Central banks play crucial roles in managing national economies through monetary policy. By adjusting interest rates and controlling money supply, they influence inflation, employment, and economic growth. The Federal Reserve in the United States, the European Central Bank, and the Bank of Japan are among the most influential. Their decisions can have global effects: when the Federal Reserve raises interest rates, capital tends to flow toward the U.S., strengthening the dollar and potentially destabilizing emerging market economies.

Economic inequality has become a defining issue of our era. While global poverty has declined dramatically – the proportion of people living in extreme poverty fell from 36% in 1990 to about 9% in 2019 – inequality within many countries has increased. The richest 1% of the global population owns approximately 45% of total wealth. Debates continue about how to balance economic growth with more equitable distribution, involving policies on taxation, education, social safety nets, and labor rights.`,
                mcqs: [
                    { question: 'What is comparative advantage?', options: ['Being better than competitors', 'Having lowest opportunity cost for a good', 'Having the most resources', 'Being the largest economy'], correctAnswer: 'Having lowest opportunity cost for a good' },
                    { question: 'How much is traded daily in currency markets?', options: ['$6 million', 'About $600 billion', 'Over $6 trillion', '$60 trillion'], correctAnswer: 'Over $6 trillion' },
                    { question: 'What is foreign direct investment?', options: ['Buying foreign stocks', 'Companies establishing operations in other countries', 'Government lending', 'Currency exchange'], correctAnswer: 'Companies establishing operations in other countries' },
                    { question: 'What tools do central banks use to manage economies?', options: ['Taxation', 'Interest rates and money supply', 'Tariffs', 'Trade agreements'], correctAnswer: 'Interest rates and money supply' },
                    { question: 'What happened to extreme poverty rates from 1990 to 2019?', options: ['Increased from 9% to 36%', 'Fell from 36% to about 9%', 'Stayed the same', 'Doubled'], correctAnswer: 'Fell from 36% to about 9%' },
                    { question: 'What percentage of global wealth does the richest 1% own?', options: ['About 10%', 'About 25%', 'About 45%', 'About 75%'], correctAnswer: 'About 45%' }
                ]
            }
        ];

        // Create exercises with content and MCQs
        for (const exerciseData of exercisesData) {
            // Create MCQs first
            const createdMCQs = await MCQ.insertMany(exerciseData.mcqs);
            const mcqIds = createdMCQs.map(mcq => mcq._id);

            // Create Content
            const content = await Content.create({
                contentType: 'text',
                text: exerciseData.text,
                description: exerciseData.description,
                mcqs: mcqIds
            });

            // Create Exercise
            await Exercise.create({
                name: exerciseData.name,
                description: exerciseData.description,
                difficulty: exerciseData.difficulty,
                content: content._id
            });

            console.log(`Created exercise: ${exerciseData.name}`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('Created 18 exercises (3 per age group): 8, 10, 12, 14, 16, 18');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
