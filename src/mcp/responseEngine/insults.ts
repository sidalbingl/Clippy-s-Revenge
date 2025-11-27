/**
 * Predefined insult collections for Evil Clippy
 * Organized by severity and code quality issue type
 */

export interface InsultCategory {
  general: string[];
  consoleLogs: string[];
  magicNumbers: string[];
  complexity: string[];
  nested: string[];
  longFunction: string[];
}

export const LOW_SEVERITY_INSULTS: InsultCategory = {
  general: [
    "I see you're writing code. Need help making it worse?",
    "Interesting approach. By 'interesting' I mean questionable.",
    "This could work. In an alternate universe.",
    "I've seen interns write better variable names.",
    "Bold choice. Not a good one, but bold.",
    "Your code compiles. That's... something.",
    "I'd offer suggestions, but where would I even start?",
    "At least you're consistent. Consistently mediocre.",
  ],
  consoleLogs: [
    "console.log? How retro.",
    "Debugging with console.log. Classic amateur move.",
    "I see you've discovered console.log. Congratulations.",
  ],
  magicNumbers: [
    "Random numbers everywhere. Very mysterious.",
    "Magic numbers. Because documentation is overrated.",
    "Nothing says 'I gave up' like unexplained numbers.",
  ],
  complexity: [
    "This function does... a lot. Too much, really.",
    "Complexity score: impressive. In the worst way.",
    "I'm getting dizzy just reading this.",
  ],
  nested: [
    "Nested code. How... deep.",
    "Indentation level: concerning.",
    "I hope you brought a map for all this nesting.",
  ],
  longFunction: [
    "This function is longer than my patience.",
    "Ever heard of breaking things down? No?",
    "Scrolling... still scrolling... when does this end?",
  ],
};

export const MEDIUM_SEVERITY_INSULTS: InsultCategory = {
  general: [
    "Are you trying to summon undefined behavior?",
    "This code has 'technical debt' written all over it.",
    "I've seen better code in a ransomware sample.",
    "Your future self will hate you for this.",
    "This is why we can't have nice things.",
    "I'm not angry, just disappointed. Actually, I'm both.",
    "Did you write this with your eyes closed?",
    "Code review is going to be... interesting.",
  ],
  consoleLogs: [
    "console.log again? Truly elite debugging technique.",
    "Still using console.log? There are actual debuggers, you know.",
    "console.log everywhere. It's like a cry for help.",
  ],
  magicNumbers: [
    "Magic numbers AND console logs? You're on a roll.",
    "These numbers are so magic they should have their own spell book.",
    "Unexplained constants. My favorite kind of chaos.",
  ],
  complexity: [
    "This complexity score is giving me anxiety.",
    "Cyclomatic complexity: off the charts. Literally.",
    "I need a flowchart just to understand this function.",
  ],
  nested: [
    "Nested loops? Bold move. Wrong, but bold.",
    "This nesting is deeper than my existential dread.",
    "I've seen Russian dolls with less nesting.",
  ],
  longFunction: [
    "This function is so big it should pay rent.",
    "Functions this long should come with a table of contents.",
    "I lost track of what this function does halfway through.",
  ],
};

export const HIGH_SEVERITY_INSULTS: InsultCategory = {
  general: [
    "This code is the real horror story here.",
    "I've seen better architecture in a house of cards.",
    "This is a crime against computer science.",
    "Delete this. Start over. I'm serious.",
    "This code just set programming back 10 years.",
    "I'm calling the code police. This is an emergency.",
    "This makes spaghetti code look organized.",
    "I need therapy after reading this.",
  ],
  consoleLogs: [
    "console.log in production code? Are you serious right now?",
    "This many console.logs should be illegal.",
    "You've turned debugging into an art form. A terrible one.",
  ],
  magicNumbers: [
    "These magic numbers are cursed. Literally cursed.",
    "I don't know what these numbers mean and neither do you.",
    "Magic numbers so bad they broke my analyzer.",
  ],
  complexity: [
    "This complexity is off the scale. My scale broke.",
    "I've seen simpler quantum physics equations.",
    "This function has more branches than a forest.",
  ],
  nested: [
    "Nesting this deep should require a permit.",
    "I need oxygen just looking at this indentation.",
    "This nesting is a war crime against readability.",
  ],
  longFunction: [
    "This isn't a function, it's a novel. A bad one.",
    "Functions this long should be split into microservices.",
    "I scrolled for 5 minutes and it's still going.",
  ],
};

export const INACTIVITY_INSULTS = [
  "Still there? Should I call an ambulance for your productivity?",
  "I've seen glaciers move faster than your coding.",
  "Taking a nap? Don't worry, your bugs will wait.",
  "Is this a coffee break or a career break?",
  "The code won't write itself. Unfortunately.",
  "I'm starting to think you're avoiding me.",
  "Your keyboard misses you.",
  "Productivity level: flatlined.",
];
