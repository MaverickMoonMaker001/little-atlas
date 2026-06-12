/*
 * 12 zodiac signs × 4 rotating weekly themes = 48 unique insight combinations.
 * Theme index is determined by: Math.floor((weekOfYear - 1) / 13) % 4
 * so each theme covers ~13 weeks (one quarter), cycling every year.
 */

export const ZODIAC_SIGNS = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius',  start: [1, 20],  end: [2, 18] },
  { sign: 'Pisces',    start: [2, 19],  end: [3, 20] },
  { sign: 'Aries',     start: [3, 21],  end: [4, 19] },
  { sign: 'Taurus',    start: [4, 20],  end: [5, 20] },
  { sign: 'Gemini',    start: [5, 21],  end: [6, 20] },
  { sign: 'Cancer',    start: [6, 21],  end: [7, 22] },
  { sign: 'Leo',       start: [7, 23],  end: [8, 22] },
  { sign: 'Virgo',     start: [8, 23],  end: [9, 22] },
  { sign: 'Libra',     start: [9, 23],  end: [10, 22] },
  { sign: 'Scorpio',   start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
]

export function getSunSign(birthdate) {
  if (!birthdate) return null
  const d = new Date(birthdate)
  const month = d.getMonth() + 1
  const day = d.getDate()

  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start
    const [em, ed] = z.end
    if (sm > em) {
      // Spans year boundary (Capricorn)
      if ((month === sm && day >= sd) || (month === em && day <= ed) ||
          (month > sm) || (month < em)) return z.sign
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) ||
          (month > sm && month < em)) return z.sign
    }
  }
  return 'Capricorn'
}

export function getWeekOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
}

export function getThemeIndex(date = new Date()) {
  return Math.floor((getWeekOfYear(date) - 1) / 13) % 4
}

// 12 signs × 4 themes
export const INSIGHT_THEMES = {
  Aries: [
    {
      theme: 'Courage and new starts',
      body: 'Your Aries child is feeling a surge of initiative. This is an excellent week to let them lead a small project or try something they have been nervous about. Direct praise for bravery — not just outcomes — will land especially well right now.',
      bestSupport: 'letting them choose what to try next',
      watchFor: 'frustration if things don\'t go their way immediately',
      tryThis: 'a friendly challenge or race with a sibling or friend',
    },
    {
      theme: 'Energy and movement',
      body: 'Physical energy is high. Channel it intentionally — outdoor time, sport, or a creative build project will help them stay regulated. If they seem restless or reactive, check how much free movement they\'ve had today.',
      bestSupport: 'active play before focused tasks',
      watchFor: 'agitation from too much sitting',
      tryThis: 'an obstacle course or backyard exploration',
    },
    {
      theme: 'Independence',
      body: 'Your child wants to do more on their own this week. Let them. Resist the urge to correct small mistakes and focus instead on affirming the effort. They are practicing self-trust.',
      bestSupport: 'stepping back and watching them figure it out',
      watchFor: 'taking on too much and getting overwhelmed',
      tryThis: 'giving them a task with real responsibility',
    },
    {
      theme: 'Reflection after action',
      body: 'A good week to slow down after recent busy stretches. Help your Aries child notice what they have accomplished. They rarely pause to appreciate their own effort — make space for that this week.',
      bestSupport: 'asking "what\'s one thing you\'re proud of this week?"',
      watchFor: 'boredom masking a need for rest',
      tryThis: 'a slow morning with no agenda',
    },
  ],

  Taurus: [
    {
      theme: 'Comfort and security',
      body: 'Your Taurus child is craving routine and familiar pleasures this week. Honor that. Unexpected changes to schedule may cause more friction than usual. Warmth, predictability, and sensory comfort are your best tools.',
      bestSupport: 'predictable meals and bedtime rituals',
      watchFor: 'stubbornness when plans change suddenly',
      tryThis: 'cooking or baking something together',
    },
    {
      theme: 'Patience and craft',
      body: 'Creative and hands-on work is especially rewarding right now. Your child may want to take their time with something and get it just right. Honor the pace rather than rushing to completion.',
      bestSupport: 'uninterrupted time for a project',
      watchFor: 'perfectionism stalling progress',
      tryThis: 'a craft project with no deadline',
    },
    {
      theme: 'Nature and the body',
      body: 'This Taurus child is at their best when connected to physical sensation and the natural world. Time outside, tactile play, and good food will regulate mood more effectively than words this week.',
      bestSupport: 'outdoor time and sensory-rich experiences',
      watchFor: 'low mood when cooped up indoors',
      tryThis: 'a walk, garden time, or barefoot grass time',
    },
    {
      theme: 'Loyalty and belonging',
      body: 'Connection with close friends or family feels especially important this week. Your Taurus child may need reassurance that they are truly seen and valued. Say it directly and specifically.',
      bestSupport: 'one-on-one quality time',
      watchFor: 'withdrawal if they feel overlooked',
      tryThis: 'a shared movie, game, or meal with their favorite person',
    },
  ],

  Gemini: [
    {
      theme: 'Curiosity and communication',
      body: 'Your Gemini child\'s mind is moving at full speed. They want to talk, ask questions, and explore ideas. Feed the curiosity with books, conversations, or new subjects. Avoid one-word answers — they need real dialogue.',
      bestSupport: 'genuine conversation and shared exploration',
      watchFor: 'scattered attention across too many interests at once',
      tryThis: 'a trip to the library or a documentary they can pick',
    },
    {
      theme: 'Variety and stimulation',
      body: 'Boredom is the enemy this week. Your Gemini child needs input — variety, novelty, and social interaction. A mix of activities, even small ones, will keep them regulated and happy.',
      bestSupport: 'keeping options open and flexible',
      watchFor: 'restlessness that can look like misbehavior',
      tryThis: 'a playdate or a new game with different rules',
    },
    {
      theme: 'Expression and creativity',
      body: 'Writing, storytelling, music, or any form of expressive play is especially energizing right now. Let your Gemini child show off what they know and what they imagine. Audience matters to them this week.',
      bestSupport: 'asking them to explain or teach something to you',
      watchFor: 'feeling unseen or talked over',
      tryThis: 'a creative writing prompt or storytelling game',
    },
    {
      theme: 'Focus and depth',
      body: 'Help your naturally wide-ranging Gemini go a little deeper this week. One subject, one project, one friendship — this is a good week to practice staying with something long enough to truly understand it.',
      bestSupport: 'gentle encouragement to finish before starting something new',
      watchFor: 'anxiety from too many open loops',
      tryThis: 'a puzzle or project that takes more than one sitting',
    },
  ],

  Cancer: [
    {
      theme: 'Emotional sensitivity',
      body: 'Your Cancer child\'s feelings are closer to the surface this week. Small things may land bigger than usual. Slow down, listen fully, and resist the urge to fix or minimize. Being heard is what they need most right now.',
      bestSupport: 'slow, unhurried presence',
      watchFor: 'mood swings that seem disproportionate to the cause',
      tryThis: 'a quiet check-in at bedtime about how they\'re really doing',
    },
    {
      theme: 'Home and belonging',
      body: 'Your child is drawing comfort from familiar spaces and people right now. This is not the week to push for big new experiences. Instead, build up the nest — cozy routines, family time, and the feeling of being truly home.',
      bestSupport: 'stability and warmth at home',
      watchFor: 'resistance to anything that feels unfamiliar',
      tryThis: 'a cozy family activity at home',
    },
    {
      theme: 'Nurturing others',
      body: 'Your Cancer child has a generous heart and this week it wants to give. They may want to take care of a pet, a younger sibling, or even a plant. Support that instinct — it\'s meaningful to them and builds emotional intelligence.',
      bestSupport: 'giving them something or someone to care for',
      watchFor: 'over-giving to the point of emotional depletion',
      tryThis: 'letting them plan a meal or surprise for someone they love',
    },
    {
      theme: 'Intuition and imagination',
      body: 'Creative and imaginative energy is strong. Your Cancer child may have vivid dreams, big feelings they can\'t name, or a strong pull toward art and storytelling. Give them space to process the inner world.',
      bestSupport: 'open-ended creative time without judgment',
      watchFor: 'confusion between fear and imagination',
      tryThis: 'drawing, journaling, or imaginative play with no goal',
    },
  ],

  Leo: [
    {
      theme: 'Recognition and pride',
      body: 'Your Leo child needs to feel seen this week — not just loved, but genuinely appreciated. Specific, direct acknowledgment of what they did well will mean more than general praise. Look for what they are working on and name it.',
      bestSupport: 'specific, sincere compliments',
      watchFor: 'acting out as a bid for attention',
      tryThis: 'telling them one thing you genuinely admire about them',
    },
    {
      theme: 'Creativity and performance',
      body: 'Leo energy is at its best when there\'s an audience. This is a wonderful week for performing, showing, or sharing something they\'ve made. Even a small stage — telling a story at dinner, showing off a drawing — fills their cup.',
      bestSupport: 'creating small moments to shine',
      watchFor: 'jealousy if a sibling gets more attention',
      tryThis: 'a talent show, performance, or "presentation" at home',
    },
    {
      theme: 'Leadership and generosity',
      body: 'Your Leo child has natural leadership instincts. This week, channel those instincts toward others — being a helper, organizing a game, or looking out for someone younger. Generous leadership is Leo at their best.',
      bestSupport: 'giving them a role with real responsibility',
      watchFor: 'bossiness when they want to lead but aren\'t given a way to',
      tryThis: 'letting them plan a family activity',
    },
    {
      theme: 'Rest and inner warmth',
      body: 'After weeks of high energy, your Leo child may need quieter time to recharge. That doesn\'t come naturally to them — they may resist it. But rest without an audience is good medicine this week.',
      bestSupport: 'unscheduled downtime without pressure to perform',
      watchFor: 'irritability as a sign of overstimulation',
      tryThis: 'a slow, screen-free evening with nothing to accomplish',
    },
  ],

  Virgo: [
    {
      theme: 'Order and learning',
      body: 'Your Virgo child thrives when things feel organized and purposeful right now. Give them clear tasks, explain the "why" behind things, and let them be the helper. They feel safe when they understand how the world works.',
      bestSupport: 'clear explanations and logical structure',
      watchFor: 'anxiety when things feel chaotic or unclear',
      tryThis: 'organizing something together — a shelf, a drawer, a routine',
    },
    {
      theme: 'Health and care',
      body: 'Body awareness is heightened this week. Your Virgo child may have complaints about physical feelings — real or worried. Take them seriously without amplifying. Good sleep, clean food, and gentle movement are their reset buttons.',
      bestSupport: 'steady rhythms around food and sleep',
      watchFor: 'health anxiety or somatic stress complaints',
      tryThis: 'a walk, stretching, or a calm, nourishing meal together',
    },
    {
      theme: 'Service and helpfulness',
      body: 'Your Virgo child wants to be useful. Let them. Give them a real job — not a pretend one — and thank them specifically for how it helped. They genuinely find meaning in contributing.',
      bestSupport: 'a real task that makes a real difference',
      watchFor: 'self-criticism when they make mistakes',
      tryThis: 'a household project they can manage start to finish',
    },
    {
      theme: 'Gentleness and self-compassion',
      body: 'Virgo children can be their own harshest critics. This week, help them soften. When they make a mistake, model what self-compassion sounds like. Remind them that being good at something always starts with not knowing how.',
      bestSupport: 'normalizing mistakes and modeling "good enough"',
      watchFor: 'shutting down after a single failure',
      tryThis: 'sharing a story about something you struggled to learn',
    },
  ],

  Libra: [
    {
      theme: 'Harmony and fairness',
      body: 'Your Libra child is especially attuned to the social atmosphere right now. Conflict in the home or friend group will affect them more than usual. Keeping things calm and fair — and naming it when you do — will help them feel secure.',
      bestSupport: 'peaceful, balanced interactions',
      watchFor: 'people-pleasing to avoid tension',
      tryThis: 'letting them help mediate or solve a small conflict',
    },
    {
      theme: 'Beauty and aesthetics',
      body: 'Libra children notice beauty and proportion in the world. This week they are especially drawn to art, design, and environments that feel pleasing. Support that sensibility rather than dismissing it.',
      bestSupport: 'a trip to a museum, art store, or beautiful outdoor space',
      watchFor: 'overwhelm in cluttered or chaotic environments',
      tryThis: 'creating something beautiful together — decorating, arranging, designing',
    },
    {
      theme: 'Relationships and connection',
      body: 'Social connection is deeply important this week. A good interaction with a close friend will uplift them for days. A social wound can linger. Check in about friendships and help them navigate with grace if anything feels off.',
      bestSupport: 'supporting good friendships and social confidence',
      watchFor: 'rumination over a social misstep',
      tryThis: 'arranging a special time with their closest friend',
    },
    {
      theme: 'Decisions and inner voice',
      body: 'Libra children can struggle with decisions — they see all sides. This week, gently help them practice trusting their own instincts. Ask what they think before you tell them what you think.',
      bestSupport: 'asking "what does your gut say?" and honoring the answer',
      watchFor: 'decision fatigue leading to withdrawal',
      tryThis: 'low-stakes choice practice: you pick dinner, you plan Saturday morning',
    },
  ],

  Scorpio: [
    {
      theme: 'Depth and intensity',
      body: 'Your Scorpio child is operating at full emotional depth right now. Feelings are strong and real. Don\'t rush them through emotional states — let the feelings move through at their own pace. Presence without commentary is your most powerful tool.',
      bestSupport: 'staying steady when their feelings feel big',
      watchFor: 'bottling up until it overflows',
      tryThis: 'a one-on-one check-in at a moment of calm',
    },
    {
      theme: 'Trust and privacy',
      body: 'Your Scorpio child is watching whether the world — and especially you — is trustworthy. Keep commitments. Be honest, even about hard things. They already know when something is being hidden and it worries them more than the truth would.',
      bestSupport: 'honesty and follow-through on what you say',
      watchFor: 'secrecy as a form of self-protection',
      tryThis: 'sharing something true and slightly vulnerable about your own day',
    },
    {
      theme: 'Power and transformation',
      body: 'Something is shifting internally for your Scorpio child. They may seem moody or withdrawn — this is often internal processing, not a problem to solve. Support the transformation by not forcing it to resolve too quickly.',
      bestSupport: 'giving them space to process without pressure',
      watchFor: 'interpreting their intensity as defiance',
      tryThis: 'a creative outlet that lets them express what can\'t be said in words',
    },
    {
      theme: 'Healing and release',
      body: 'A good week for clearing out old grievances. Your Scorpio child may benefit from a calm, honest conversation about something that\'s been lingering. Not to relitigate — to actually put it down and move forward.',
      bestSupport: 'opening a low-pressure space to revisit something unresolved',
      watchFor: 'holding grudges or replaying past hurts',
      tryThis: 'a "clean slate" ritual — write it down, then put it away',
    },
  ],

  Sagittarius: [
    {
      theme: 'Adventure and freedom',
      body: 'Your Sagittarius child needs room to roam this week — literally and figuratively. Tight constraints will create friction. Find the big picture for them: where are we going, what are we working toward, why does this matter?',
      bestSupport: 'explaining the larger meaning behind rules or tasks',
      watchFor: 'rebellion when they feel boxed in',
      tryThis: 'a day trip, hike, or genuinely new experience',
    },
    {
      theme: 'Philosophy and meaning',
      body: 'Big questions are on their mind. Why do we exist? What\'s fair? Why do people act the way they do? Don\'t deflect — engage. Your Sagittarius child feels most connected when taken seriously as a thinker.',
      bestSupport: 'taking their questions seriously and thinking out loud together',
      watchFor: 'cynicism or disillusionment if adults seem dismissive',
      tryThis: 'a documentary, biography, or story about someone who changed something',
    },
    {
      theme: 'Optimism and humor',
      body: 'Your Sagittarius child has a natural sense of humor and a contagious optimism. This week, let it run. Laughter, play, and lightness are legitimate forms of regulation for them. Don\'t over-sober the mood.',
      bestSupport: 'joining the fun without redirecting it',
      watchFor: 'using humor to deflect real feelings',
      tryThis: 'a silly game, joke exchange, or improv activity',
    },
    {
      theme: 'Commitment and follow-through',
      body: 'Sagittarius children are natural starters — finishing is harder. This is a good week to gently support completion. Help them close one open loop, and celebrate when they do. It builds the part of them that can be counted on.',
      bestSupport: 'being alongside them for the final stretch of something',
      watchFor: 'abandoning projects right before they\'re done',
      tryThis: 'picking one unfinished thing and doing it together',
    },
  ],

  Capricorn: [
    {
      theme: 'Responsibility and achievement',
      body: 'Your Capricorn child is motivated by accomplishment right now. Give them a real goal, not a busy task. They want to do something that actually matters — and they\'ll work harder than you expect.',
      bestSupport: 'clear goals with real stakes',
      watchFor: 'over-seriousness and forgetting to play',
      tryThis: 'a project with a visible finish line they can be proud of',
    },
    {
      theme: 'Structure and patience',
      body: 'Capricorn energy thrives with predictability. This week, stability in schedule and expectation helps them feel capable and grounded. Sudden changes may create more anxiety than usual.',
      bestSupport: 'maintaining routines and previewing what\'s coming',
      watchFor: 'rigidity when things don\'t go as planned',
      tryThis: 'building a shared schedule or list for the week',
    },
    {
      theme: 'Rest and play',
      body: 'Your Capricorn child may resist rest, thinking they should always be productive. This week, model the value of genuine downtime. They need permission — sometimes even instructions — to just play for the sake of it.',
      bestSupport: 'unstructured play with no productivity attached',
      watchFor: 'guilt when they aren\'t being "useful"',
      tryThis: 'a silly, purposeless activity — building something just to knock it down',
    },
    {
      theme: 'Warmth and affection',
      body: 'Capricorn children can seem self-sufficient, but their need for warmth runs deep. This week, reach toward them first. A hug, a specific compliment, a moment of real presence — they won\'t always ask for it.',
      bestSupport: 'initiating warmth without waiting to be asked',
      watchFor: 'interpreting independence as not needing closeness',
      tryThis: 'a slow, connected activity: reading together, a walk, just being nearby',
    },
  ],

  Aquarius: [
    {
      theme: 'Individuality and originality',
      body: 'Your Aquarius child wants to be recognized as uniquely themselves this week. Don\'t fit them into a box — celebrate what\'s unusual, unconventional, or surprising about them. That\'s where their confidence lives.',
      bestSupport: 'celebrating what makes them genuinely different',
      watchFor: 'rebellion when they feel pressured to conform',
      tryThis: 'letting them design something their own way without direction',
    },
    {
      theme: 'Ideas and the future',
      body: 'Aquarius minds love the new and the not-yet-invented. This week, engage their ideas about the future, about problems worth solving, about how things could be different. They will light up.',
      bestSupport: 'taking their ideas seriously and building on them',
      watchFor: 'feeling dismissed when adults aren\'t interested in their vision',
      tryThis: 'a conversation about something they think the world needs more of',
    },
    {
      theme: 'Friendship and community',
      body: 'Connection — especially with people who share their interests — is particularly nourishing this week. A meaningful conversation with a friend, or time in a group they care about, will lift their spirits more than time alone.',
      bestSupport: 'facilitating social time with their people',
      watchFor: 'feeling like an outsider, especially at school',
      tryThis: 'finding or creating a space where their interests are shared',
    },
    {
      theme: 'Emotion and the body',
      body: 'Aquarius children live in their heads. This week, help them land in their body and their heart. How are they physically feeling? What are they actually feeling emotionally, beneath the ideas? Gentle checking-in works best.',
      bestSupport: 'gentle emotional and physical grounding',
      watchFor: 'intellectualizing feelings rather than feeling them',
      tryThis: 'movement, breathwork, or a quiet check-in about the heart, not the head',
    },
  ],

  Pisces: [
    {
      theme: 'Imagination and dreams',
      body: 'Your Pisces child is in a richly imaginative phase. They may be more dreamy, creative, and inward than usual. Make space for art, fantasy play, or quiet reflection. Don\'t rush them back to the "real world."',
      bestSupport: 'unstructured time for imaginative play',
      watchFor: 'daydreaming as avoidance of something hard',
      tryThis: 'a creative project with full freedom and no endpoint',
    },
    {
      theme: 'Empathy and sensitivity',
      body: 'Pisces children absorb the emotional atmosphere around them. If the household has been stressed, they\'ve felt it. This week, lighten the air — kindness, laughter, and peace in the home will visibly regulate them.',
      bestSupport: 'a calm, peaceful home environment',
      watchFor: 'carrying emotions that aren\'t theirs',
      tryThis: 'asking "is this feeling yours, or did you pick it up from someone else?"',
    },
    {
      theme: 'Spirituality and meaning',
      body: 'Questions about meaning, the unseen world, and why things happen are alive in them right now. Engage those questions with openness rather than definitive answers. The inquiry itself is the nourishment.',
      bestSupport: 'curiosity and open-ended conversation',
      watchFor: 'existential anxiety disguised as nighttime worry',
      tryThis: 'a stargazing moment, a walk in nature, or a wonder-focused conversation',
    },
    {
      theme: 'Grounding and clarity',
      body: 'After a stretch of dreamy, feeling-heavy energy, your Pisces child benefits from gentle structure and clear anchors. Routine, simple tasks with visible results, and time in the physical world are balancing this week.',
      bestSupport: 'light, loving structure',
      watchFor: 'feeling overwhelmed or losing track of what\'s real',
      tryThis: 'a simple hands-on project: cooking, building, or tending something living',
    },
  ],
}

export function getInsightForChild(birthdate, date = new Date()) {
  const sign = getSunSign(birthdate)
  if (!sign) return null
  const themes = INSIGHT_THEMES[sign]
  if (!themes) return null
  const idx = getThemeIndex(date)
  return { sign, ...themes[idx] }
}
