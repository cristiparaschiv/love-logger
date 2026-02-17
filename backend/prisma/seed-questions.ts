import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const freeTextQuestions = [
  "What made you smile today?",
  "What's one thing you appreciate about us?",
  "What's a small thing your partner did recently that meant a lot?",
  "What's something you're looking forward to this week?",
  "What's a memory of us that always makes you happy?",
  "If we had a free weekend with no plans, what would you want to do?",
  "What's something new you learned today?",
  "What's one thing you'd love us to try together?",
  "What song reminds you of us?",
  "What's the best meal we've ever shared?",
  "What's something you've been overthinking lately?",
  "If you could relive one day together, which would it be?",
  "What's a goal you'd like us to work on together?",
  "What made today hard? (or what made it easy?)",
  "What's something silly that only we would understand?",
  "What's the most thoughtful thing your partner has done for you?",
  "What's a place you'd love to visit together?",
  "What's your favorite lazy activity to do together?",
  "What's something about your partner that always impresses you?",
  "What would your perfect date night look like?",
  "What's something you want to learn together?",
  "What's one thing you'd change about your daily routine?",
  "What's the funniest thing that happened to us?",
  "What's a compliment you've been meaning to give your partner?",
  "What's your favorite inside joke?",
  "What's something your partner does that makes you feel safe?",
  "What's a dream you haven't shared yet?",
  "What's the best advice you've ever received about relationships?",
  "What's something about your partner that you find adorable?",
  "If we wrote a book about us, what would the title be?",
  "What's a tradition you'd like to start together?",
  "What's the most spontaneous thing we've done?",
  "What's one thing you want your partner to know right now?",
  "What's your favorite way to spend a rainy day together?",
  "What's something that made you proud of your partner recently?",
  "What's the most romantic thing someone has ever done for you?",
  "What's a skill your partner has that you admire?",
  "What does home feel like to you?",
  "What's something you're grateful for today?",
  "If you could give us one superpower as a couple, what would it be?",
  "What's the best surprise you've ever planned or received?",
  "What's your favorite photo of us and why?",
  "What's something you miss about the early days of our relationship?",
  "What's a challenge we've overcome together that made us stronger?",
  "What does your ideal morning together look like?",
  "What's the best gift you've ever received from your partner?",
  "What's something you want to do more of together?",
  "What's a quality of your partner that balances you out?",
  "What made you fall in love?",
  "What's the most important thing in a relationship to you?",
  "What's something your partner said that you'll never forget?",
  "What's a fear you'd like to overcome together?",
  "What's your favorite thing about coming home to your partner?",
  "What's one word that describes how you feel about us right now?",
  "What's the kindest thing a stranger has done for us?",
  "What's something about our relationship that makes you feel lucky?",
  "What's a habit of your partner that you've grown to love?",
  "What's the best trip we've ever taken?",
  "What's something new you noticed about your partner recently?",
  "What do you think we'll be doing in 10 years?",
];

const optionsQuestions: { text: string; options: string[] }[] = [
  { text: "How would you describe today in one word?", options: ["Adventure", "Routine", "Cozy", "Chaotic", "Productive", "Lazy"] },
  { text: "Pick a date night for this week", options: ["Cook together", "Movie night", "Go for a walk", "Try a new restaurant", "Stay in and talk", "Game night"] },
  { text: "What does your partner deserve today?", options: ["A hug", "A surprise", "A break", "A compliment", "A home-cooked meal", "All of the above"] },
  { text: "Our relationship superpower is", options: ["Making each other laugh", "Always being honest", "Great teamwork", "Comfortable silence", "Adventure spirit", "Forgiveness"] },
  { text: "Right now I could really use", options: ["Quality time", "Words of encouragement", "Physical affection", "Help with something", "Space to recharge", "A fun distraction"] },
  { text: "Pick a weekend trip vibe", options: ["Beach", "Mountains", "City", "Cabin", "Road trip", "Staycation"] },
  { text: "What I value most about us right now", options: ["Trust", "Fun", "Growth", "Support", "Intimacy", "Stability"] },
  { text: "If we were a movie genre", options: ["Romantic comedy", "Adventure", "Drama", "Documentary", "Sci-fi", "Indie"] },
  { text: "The thing I'm most proud of in our relationship", options: ["Communication", "How we handle conflict", "Our adventures", "Our daily routines", "How we support each other", "Our growth"] },
  { text: "Today I felt most loved when", options: ["Morning routine", "A message from you", "Something you did", "A shared moment", "Thinking about us", "Just being near you"] },
  { text: "My love language today was", options: ["Words of affirmation", "Quality time", "Physical touch", "Acts of service", "Gifts"] },
  { text: "If we could teleport somewhere right now", options: ["Paris", "Tokyo", "A tropical beach", "Our favorite restaurant", "Childhood home", "The moon"] },
  { text: "What would make tomorrow better?", options: ["More sleep", "More time together", "Less stress", "A treat", "An adventure", "Nothing, today was perfect"] },
  { text: "Our theme song today would be", options: ["Something upbeat", "A love ballad", "A chill track", "An epic anthem", "Something funny", "Silence (comfortable)"] },
  { text: "Best part of today was", options: ["Morning", "Afternoon", "Evening", "A specific moment", "All of it", "None (rough day)"] },
  { text: "I feel closest to you when", options: ["We're laughing", "We're talking", "We're quiet together", "We're on an adventure", "We're working on something", "We're being silly"] },
  { text: "Pick a couple activity for tonight", options: ["Watch something", "Cook together", "Go for a walk", "Play a game", "Just talk", "Early bedtime"] },
  { text: "If I could gift you a feeling", options: ["Peace", "Excitement", "Confidence", "Joy", "Comfort", "Pride"] },
  { text: "Rate our communication today", options: ["Amazing", "Good", "Average", "Could be better", "We need to talk", "What communication?"] },
  { text: "What I need most from this week", options: ["Rest", "Fun", "Accomplishment", "Connection", "Alone time", "Spontaneity"] },
  { text: "My energy level today", options: ["Fully charged", "Pretty good", "Half tank", "Running low", "Empty", "Chaotic energy"] },
  { text: "Our next adventure should be", options: ["Food related", "Nature", "Cultural", "Sporty", "Relaxation", "Surprise me"] },
  { text: "How I'd describe our week so far", options: ["Smooth sailing", "Rollercoaster", "Productive", "Lazy", "Stressful", "Mixed bag"] },
  { text: "If we had a couple's trophy, it'd be for", options: ["Best team", "Most laughs", "Most resilient", "Most adventurous", "Best food critics", "Most supportive"] },
  { text: "What I appreciate most today", options: ["Your patience", "Your humor", "Your presence", "Your effort", "Your love", "Everything"] },
  { text: "Pick a cozy activity", options: ["Blankets and movie", "Hot drinks", "Reading together", "Baking", "Cuddling", "Long conversation"] },
  { text: "The weather today matched my mood", options: ["Sunny", "Cloudy", "Stormy", "Breezy", "Snowy", "Tropical"] },
  { text: "I showed love today by", options: ["Words", "Actions", "Being present", "Listening", "Planning something", "Thinking of you"] },
  { text: "What surprised me today", options: ["Something good", "Something challenging", "My own reaction", "Nothing", "Your message", "How fast the day went"] },
  { text: "If today were a color", options: ["Bright yellow", "Calm blue", "Passionate red", "Cozy orange", "Fresh green", "Mellow purple"] },
  { text: "What I want to dream about tonight", options: ["Our next vacation", "A perfect day", "The future", "Something funny", "Nothing specific", "You"] },
  { text: "My comfort food today would be", options: ["Pizza", "Chocolate", "Soup", "Sushi", "Home cooking", "Ice cream"] },
  { text: "How present was I today?", options: ["Fully here", "Mostly here", "Distracted", "In my head", "Scattered", "Zen mode"] },
  { text: "The highlight reel of today includes", options: ["A laugh", "A good meal", "A productive moment", "Time with you", "A win", "A peaceful moment"] },
  { text: "If I wrote today in my diary", options: ["Short and sweet", "A whole chapter", "Just a smiley", "A rant", "A love letter", "Nothing to report"] },
  { text: "I handled stress today by", options: ["Talking it out", "Exercise", "Deep breaths", "Ignoring it", "Snacking", "Leaning on you"] },
  { text: "Our vibe today was", options: ["In sync", "Parallel play", "Playful", "Intense", "Chill", "Disconnected"] },
  { text: "Tomorrow I want to wake up feeling", options: ["Energized", "Peaceful", "Excited", "Rested", "Motivated", "Loved"] },
  { text: "Rate today's quality time", options: ["10/10", "Pretty good", "Average", "Not enough", "Zero", "We'll make up for it"] },
  { text: "If today had a soundtrack", options: ["Upbeat pop", "Slow jazz", "Classical", "Rock anthem", "Lo-fi beats", "Nature sounds"] },
];

async function main() {
  const existing = await prisma.dailyQuestion.count();
  if (existing > 0) {
    console.log(`Already ${existing} questions in database, skipping seed.`);
    return;
  }

  const allQuestions = [
    ...freeTextQuestions.map((text) => ({
      text,
      type: 'free_text' as const,
      options: null as string | null,
    })),
    ...optionsQuestions.map((q) => ({
      text: q.text,
      type: 'options' as const,
      options: JSON.stringify(q.options),
    })),
  ];

  await prisma.dailyQuestion.createMany({ data: allQuestions });
  console.log(`Seeded ${allQuestions.length} daily questions.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
