/**
 * Every word in the gift lives here. Edit freely.
 * (The six-tap bunny sequence is deliberately a fixed, ordered array.)
 */
export const content = {
  welcome: {
    heading: 'Oh, look who survived another day.',
    sub: "Heard today was being a little bitch to you. Unfortunately, I can't personally fight your school, so I made you this instead.",
    button: 'I require emotional compensation →',
    bunnyHint: 'say hi',
  },

  bunny: {
    title: 'Meet Sir Fluffington III',
    subtitle: 'Certified emotional support creature. Unlicensed therapist. Professional cutie.',
    hint: 'Go on. Give him a little pat.',
    /** Taps 1–6, in this exact order. Tap 6 is the special one. */
    taps: [
      'Oh? Affection?',
      'Again? Needy.',
      'Fine. Unlimited hugs.',
      "I'm telling everyone you're soft.",
      "Okay, but seriously. You're doing great.",
      "Hey, one more thing. I know you've been feeling a little upset about your hair lately, but I genuinely think it's beautiful. Yes, even when you don't. And no, you're not allowed to argue with a bunny. 🩷",
    ],
    /** Taps 7+, picked at random. */
    extraTaps: [
      'Your school and I have unresolved beef.',
      "You're pretty adorable for someone this annoying.",
      'Would recommend you. 11/10 human.',
      "You're doing better than you think, silly.",
      "I have tiny paws, but I'm trying my best.",
      'Official diagnosis: You need snacks and a hug.',
      'Being this cute should be illegal, actually.',
    ],
    counter: (n: number) => `Pats received: ${n} ♡`,
    next: "Okay, what's next? 💌",
    secretTapsNeeded: 6,
  },

  letter: {
    heading: 'Something I wanted you to know.',
    subtitle: 'Warning: Contains an embarrassing amount of sincerity.',
    openHint: 'tap the envelope',
    paragraphs: [
      'Hey, you.',
      "I know today wasn't particularly kind to you, and I really wish I could've been there to make it a little better.",
      "I know I can't fix every bad day you have, and I'm not going to pretend that a silly little thing I made can magically make everything okay.",
      'But I hope it makes you smile, even if it\'s just for a second.',
      'You deserve a lot more good days than bad ones, you know?',
      "And for what it's worth, I'm really glad I have you in my life. Even if you're an absolute menace sometimes.",
      "Now stop being so cute and emotional. It's embarrassing.",
      '❤️',
    ],
    next: 'Okay, enough feelings. Moving on →',
  },

  serotonin: {
    heading: 'Emergency Serotonin Dispenser',
    subtitle: 'For when life is being unnecessarily rude.',
    button: 'Give me serotonin ✨',
    counter: (n: number) => `Emergency smiles delivered: ${n}`,
    next: 'One last little thing →',
    messages: [
      "You're cute. Unfortunately.",
      'Your school has officially been added to my list of enemies.',
      'Congratulations! You\'ve received one (1) virtual forehead kiss.',
      'Your existence has been rated 11/10 by the International Committee of Me.',
      'Breaking news: Local girl deserves to be wrapped in a blanket and given snacks.',
      'No thoughts. Just you being a very precious little idiot.',
      "You're somebody's favourite notification. Probably.",
      "Today's forecast: 100% chance of you being adorable.",
      "Here's a tiny hug because I can't teleport. 🫂",
      'Please accept this extremely official certificate of being precious.',
      "You're allowed to have bad days, you know. They don't make you any less wonderful.",
      'Your serotonin delivery has arrived. Unfortunately, shipping hugs internationally is complicated.',
    ],
    /** Rare, intentionally silly machine malfunctions. */
    malfunctions: [
      'ERROR: Too much cute detected. Dispensing hearts until further notice.',
      'The machine has malfunctioned out of pure affection. Please enjoy this unscheduled shower of hearts.',
      'Oops. The machine got emotional. It will be fine. Probably.',
    ],
  },

  crochet: {
    heading: 'I made you something.',
    subtitle: "Well, technically, you're going to help me finish it.",
    subtitleDone: 'And you finished it. Look at that.',
    tap: 'Tap to add a stitch ♡',
    progress: (done: number, total: number) => `${done} of ${total} stitches`,
    final: "Until I can give you a proper hug, this one's going to have to do.",
    ps: "P.S. You don't have to thank me for this, silly. I wanted to.",
    note: "And if today still sucks, that's okay too. You don't have to feel better just because I made you something. I'm still here.",
    hugButton: 'One more hug? 🥺',
    hugMessage: 'Consider yourself aggressively hugged.',
  },

  secretStars: {
    welcome: "You're someone's favourite person, you know.",
    letter: 'Psst. Still here. Still thinking you are great.',
    serotonin: 'Yes, you. I definitely mean you.',
    crochet: 'Tiny secret: I smiled the whole time I made this.',
  },

  sceneNames: ['The welcome', 'Sir Fluffington III', 'A little letter', 'Serotonin dispenser', 'The crochet heart'],
} as const
