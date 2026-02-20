import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/ContentModel.js';
import Exercise from './models/ExerciseModel.js';
import MCQ from './models/MCQModel.js';

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

        // Sample exercises for different age groups
        const exercisesData = [
            {
                name: 'Reading Practice - Easy',
                description: 'A simple reading exercise for beginners',
                difficulty: { minAge: 6, maxAge: 8, level: 'Easy' },
                text: 'The sun rises in the east. Birds sing in the morning. Children go to school. They learn new things every day. Reading is fun and helps us grow smarter.',
                mcqs: [
                    { question: 'Where does the sun rise?', options: ['North', 'East', 'West', 'South'], correctAnswer: 'East' },
                    { question: 'What do birds do in the morning?', options: ['Sleep', 'Sing', 'Fly away', 'Eat'], correctAnswer: 'Sing' }
                ]
            },
            {
                name: 'Reading Practice - Grade 2',
                description: 'Reading exercise for 8-10 year olds',
                difficulty: { minAge: 8, maxAge: 10, level: 'Easy' },
                text: 'The forest was quiet in the early morning. Sunlight filtered through the tall trees, creating patterns on the ground. A small rabbit hopped along the path, stopping now and then to nibble on fresh grass. Nearby, a stream flowed gently, its water sparkling in the light. This peaceful place was home to many animals who lived together in harmony.',
                mcqs: [
                    { question: 'What time of day was it in the forest?', options: ['Night', 'Afternoon', 'Early morning', 'Evening'], correctAnswer: 'Early morning' },
                    { question: 'What was the rabbit doing?', options: ['Sleeping', 'Hopping and nibbling grass', 'Swimming', 'Climbing trees'], correctAnswer: 'Hopping and nibbling grass' },
                    { question: 'What was sparkling in the light?', options: ['The trees', 'The rabbit', 'The stream water', 'The grass'], correctAnswer: 'The stream water' }
                ]
            },
            {
                name: 'Reading Practice - Grade 3',
                description: 'Reading exercise for 10-12 year olds',
                difficulty: { minAge: 10, maxAge: 12, level: 'Medium' },
                text: 'Scientists have discovered that dolphins are among the most intelligent animals on Earth. They communicate with each other using a series of clicks and whistles, and each dolphin has its own unique whistle that acts like a name. Dolphins live in groups called pods and work together to find food and protect each other from predators. They are also known for their playful behavior and have been observed surfing waves and playing with objects they find in the ocean.',
                mcqs: [
                    { question: 'How do dolphins communicate?', options: ['By singing', 'Using clicks and whistles', 'Through body language only', 'They cannot communicate'], correctAnswer: 'Using clicks and whistles' },
                    { question: 'What is a group of dolphins called?', options: ['A herd', 'A flock', 'A pod', 'A pack'], correctAnswer: 'A pod' },
                    { question: 'What unique feature does each dolphin have?', options: ['A unique color', 'A unique whistle like a name', 'A unique fin shape', 'A unique size'], correctAnswer: 'A unique whistle like a name' }
                ]
            },
            {
                name: 'Reading Practice - Grade 4',
                description: 'Reading exercise for 12-14 year olds',
                difficulty: { minAge: 12, maxAge: 14, level: 'Medium' },
                text: 'The Industrial Revolution, which began in Britain in the late 18th century, transformed the way people lived and worked. Before this period, most people lived in rural areas and made goods by hand. The invention of machines powered by steam engines changed everything. Factories were built in cities, and people moved from the countryside to work in them. While this brought economic growth and new opportunities, it also created challenges such as poor working conditions, pollution, and overcrowded cities. The effects of the Industrial Revolution can still be seen in our modern world today.',
                mcqs: [
                    { question: 'Where did the Industrial Revolution begin?', options: ['France', 'Germany', 'Britain', 'United States'], correctAnswer: 'Britain' },
                    { question: 'What powered the new machines?', options: ['Electricity', 'Steam engines', 'Wind power', 'Human labor'], correctAnswer: 'Steam engines' },
                    { question: 'What was a challenge created by the Industrial Revolution?', options: ['Too much food', 'Poor working conditions', 'Too few jobs', 'Clean air'], correctAnswer: 'Poor working conditions' }
                ]
            },
            {
                name: 'Reading Practice - Grade 5',
                description: 'Reading exercise for 14-16 year olds',
                difficulty: { minAge: 14, maxAge: 16, level: 'Hard' },
                text: 'Climate change represents one of the most significant challenges facing humanity in the 21st century. The burning of fossil fuels releases greenhouse gases into the atmosphere, trapping heat and causing global temperatures to rise. This phenomenon leads to melting ice caps, rising sea levels, and more frequent extreme weather events such as hurricanes, droughts, and floods. Scientists around the world are working to develop sustainable energy solutions, including solar, wind, and hydroelectric power. However, addressing climate change requires not only technological innovation but also changes in policy, industry practices, and individual behavior. The decisions we make today will determine the kind of planet future generations will inherit.',
                mcqs: [
                    { question: 'What causes greenhouse gases to be released?', options: ['Planting trees', 'Burning fossil fuels', 'Using solar power', 'Recycling'], correctAnswer: 'Burning fossil fuels' },
                    { question: 'What is NOT mentioned as a sustainable energy solution?', options: ['Solar power', 'Wind power', 'Nuclear power', 'Hydroelectric power'], correctAnswer: 'Nuclear power' },
                    { question: 'According to the text, what is needed to address climate change?', options: ['Only new technology', 'Only government policies', 'Technology, policy changes, and individual behavior', 'Nothing can be done'], correctAnswer: 'Technology, policy changes, and individual behavior' }
                ]
            },
            {
                name: 'Reading Practice - Grade 6',
                description: 'Reading exercise for 16-18 year olds',
                difficulty: { minAge: 16, maxAge: 18, level: 'Hard' },
                text: 'Artificial intelligence has rapidly evolved from a theoretical concept to a transformative technology that permeates nearly every aspect of modern life. Machine learning algorithms now power recommendation systems, autonomous vehicles, medical diagnostics, and countless other applications. While AI offers tremendous potential for solving complex problems and improving efficiency, it also raises profound ethical questions. Concerns about algorithmic bias, job displacement, privacy, and the concentration of power in technology companies have sparked intense debate among policymakers, ethicists, and the public. As AI systems become increasingly sophisticated, society must grapple with fundamental questions about the relationship between humans and machines, the nature of intelligence itself, and how to ensure that technological progress benefits all of humanity rather than exacerbating existing inequalities.',
                mcqs: [
                    { question: 'What powers recommendation systems according to the text?', options: ['Human experts', 'Machine learning algorithms', 'Simple databases', 'Random selection'], correctAnswer: 'Machine learning algorithms' },
                    { question: 'Which is NOT mentioned as a concern about AI?', options: ['Algorithmic bias', 'Job displacement', 'High electricity costs', 'Privacy concerns'], correctAnswer: 'High electricity costs' },
                    { question: 'What does the text suggest society must do regarding AI?', options: ['Stop all AI development', 'Ignore ethical concerns', 'Address fundamental questions about humans and machines', 'Let technology companies decide everything'], correctAnswer: 'Address fundamental questions about humans and machines' }
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
        console.log('Created 6 exercises for age groups: 8, 10, 12, 14, 16, 18');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
