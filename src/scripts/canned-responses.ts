export interface Participant {
  initials: string;
  name: string;
  detail: string;
  tags: string[];
  availability: string;
  availColor: 'green' | 'amber' | 'muted';
}

export function getParticipants(prompt: string): Participant[] {
  const p = prompt.toLowerCase();
  if (p.includes('founder') || p.includes('discovery') || p.includes('customer')) {
    return [
      { initials: 'TH', name: 'Tom H.', detail: 'Co-founder · Flowboard', tags: ['Pre-seed', 'PM tooling', 'B2B'], availability: 'This week', availColor: 'green' },
      { initials: 'AO', name: 'Aisha O.', detail: 'CEO · Draftly', tags: ['Seed', 'AI writing', 'SaaS'], availability: 'Next week', availColor: 'amber' },
      { initials: 'RS', name: 'Ravi S.', detail: 'CTO · Loopback', tags: ['Pre-seed', 'DevTools', 'B2B'], availability: 'Available', availColor: 'green' },
      { initials: 'CJ', name: 'Carmen J.', detail: 'Co-founder · Helio', tags: ['Seed', 'FinTech'], availability: 'This week', availColor: 'green' },
    ];
  } else if (p.includes('user') || p.includes('research') || p.includes('checkout')) {
    return [
      { initials: 'DM', name: 'Dana M.', detail: 'Frequent shopper · BNPL user', tags: ['iPhone', '4×/mo', 'Portland OR'], availability: 'Available', availColor: 'green' },
      { initials: 'RS', name: 'Ricardo S.', detail: 'Freelance designer', tags: ['Android', '7×/mo', 'Austin TX'], availability: 'Weekends', availColor: 'amber' },
      { initials: 'YN', name: 'Yuki N.', detail: 'Small biz owner · bulk orders', tags: ['Desktop', '8×/mo', 'Chicago IL'], availability: 'Mornings', availColor: 'amber' },
      { initials: 'JO', name: 'James O.', detail: 'Remote worker · multi-device', tags: ['Desktop+mobile', '5×/mo', 'Denver CO'], availability: 'Available', availColor: 'green' },
    ];
  } else if (p.includes('intake') || p.includes('legal') || p.includes('injury') || p.includes('client')) {
    return [
      { initials: 'MB', name: 'Dr. Marcus B.', detail: 'Orthopedic Surgery', tags: ['Board-certified', 'CA · NV · AZ', '120+ deps'], availability: '2 wk notice', availColor: 'amber' },
      { initials: 'LC', name: 'Linda C., MD', detail: 'Emergency Medicine', tags: ['ABEM', 'NY · NJ · CT', '85+ cases'], availability: '1 wk notice', availColor: 'green' },
      { initials: 'GT', name: 'Gregory T., PE', detail: 'Accident Reconstruction', tags: ['ACTAR', 'TX · OK · LA', '200+ cases'], availability: 'Available now', availColor: 'green' },
      { initials: 'PS', name: 'Priya S., MD', detail: 'Neurology · TBI/Spine', tags: ['Board-certified', 'FL · GA', '60+ cases'], availability: 'Limited', availColor: 'muted' },
    ];
  }
  return [
    { initials: 'PN', name: 'Priya N.', detail: 'Staff SWE · Stripe', tags: ['Go', 'Postgres', 'SF Bay Area'], availability: 'Passively open', availColor: 'amber' },
    { initials: 'MW', name: 'Marcus W.', detail: 'Principal Eng · Vercel', tags: ['TypeScript', 'Rust', 'Remote EU'], availability: 'Actively looking', availColor: 'green' },
    { initials: 'DA', name: 'Dayo A.', detail: 'Senior SWE · Cloudflare', tags: ['Rust', 'eBPF', 'Austin TX'], availability: 'Exploring', availColor: 'amber' },
    { initials: 'SR', name: 'Sofia R.', detail: 'Backend Lead · Plaid', tags: ['Python', 'Go', 'New York NY'], availability: 'Open to roles', availColor: 'green' },
  ];
}

export interface StudioSection {
  title: string;
  questions: string[];
}

export interface StudioTemplate {
  title: string;
  meta: { label: string; value: string }[];
  sections: StudioSection[];
}

export function getTemplate(prompt: string): StudioTemplate {
  const p = prompt.toLowerCase();

  if (p.includes('founder') || p.includes('discovery') || p.includes('customer')) {
    return {
      title: "Customer Discovery — SaaS Onboarding",
      meta: [
        { label: "Duration", value: "~30 min" },
        { label: "Modality", value: "Voice" },
        { label: "Voice tone", value: "Curious, unleading" },
        { label: "Sections", value: "3" },
      ],
      sections: [
        {
          title: "Current state",
          questions: [
            "Walk me through how onboarding works for a new customer at your company today.",
            "What's the first thing they do? What's the first thing you do?",
            "Where in that flow do you feel the most friction — yours or theirs?",
          ]
        },
        {
          title: "What's been tried",
          questions: [
            "What have you tried changing in the last six months?",
            "What worked? What didn't?",
            "Is there anything you wanted to try but couldn't?",
          ]
        },
        {
          title: "Unmet needs",
          questions: [
            "If you could wave a magic wand and change one thing, what would it be?",
            "What would have to be true for you to consider that a solved problem?",
            "Anything else I should have asked?",
          ]
        },
      ],
    };
  } else if (p.includes('user') || p.includes('research') || p.includes('checkout')) {
    return {
      title: "Usability Study — Checkout Flow",
      meta: [
        { label: "Duration", value: "~25 min" },
        { label: "Modality", value: "Voice + Screen" },
        { label: "Voice tone", value: "Neutral, patient" },
        { label: "Sections", value: "2" },
      ],
      sections: [
        {
          title: "Task arc",
          questions: [
            "Walk me through what you'd normally do to complete a purchase.",
            "What are you noticing on this screen?",
            "What were you expecting to happen there?",
            "Talk me through what you'd try next.",
          ]
        },
        {
          title: "Reflection",
          questions: [
            "Looking back, where did things feel hardest?",
            "Where did your confidence dip?",
            "What would you describe to a friend if you recommended this?",
            "Anything I didn't ask about that mattered to you?",
          ]
        },
      ],
    };
  } else if (p.includes('intake') || p.includes('legal') || p.includes('injury') || p.includes('client')) {
    return {
      title: "Legal Intake — Personal Injury",
      meta: [
        { label: "Duration", value: "~20 min" },
        { label: "Modality", value: "Voice" },
        { label: "Voice tone", value: "Calm, careful, privilege-aware" },
        { label: "Sections", value: "5" },
      ],
      sections: [
        {
          title: "Identification",
          questions: [
            "Confirm your full name and date of birth.",
            "What's the best phone number and email to reach you?",
          ]
        },
        {
          title: "Incident",
          questions: [
            "When and where did the incident occur?",
            "Walk me through what happened, in your own words.",
            "Were there any witnesses? Police on the scene?",
          ]
        },
        {
          title: "Injuries",
          questions: [
            "What injuries did you sustain?",
            "Did you lose consciousness, even briefly?",
            "When did symptoms first appear?",
          ]
        },
        {
          title: "Treatment",
          questions: [
            "Did you receive medical attention at the scene?",
            "What treatment have you received since?",
            "Are you currently in ongoing treatment?",
          ]
        },
        {
          title: "History & authorization",
          questions: [
            "Have you been involved in similar incidents before?",
            "Are you willing to authorize us to gather your medical records?",
          ]
        },
      ],
    };
  }

  return {
    title: "Senior Backend Engineer",
    meta: [
      { label: "Duration", value: "~45 min" },
      { label: "Modality", value: "Voice + Video" },
      { label: "Voice tone", value: "Conversational, technically precise" },
      { label: "Sections", value: "4" },
    ],
    sections: [
      {
        title: "Background & context",
        questions: [
          "Tell me about a system you've built or led that you're proud of — what made it work?",
          "What was the hardest tradeoff you had to make on that project?",
          "Walk me through a moment where the team disagreed and how it got resolved.",
        ]
      },
      {
        title: "Technical depth",
        questions: [
          "How would you approach designing a rate-limiting system for a high-traffic API?",
          "When do you reach for a queue versus a synchronous call? Why?",
          "Tell me about a time a system you owned failed — what did you learn?",
        ]
      },
      {
        title: "Judgment & tradeoffs",
        questions: [
          "When is it right to add a cache, and when is it the wrong instinct?",
          "How do you decide what's worth load testing versus shipping and watching?",
          "Tell me about a time you pushed back on a product decision.",
        ]
      },
      {
        title: "Collaboration & growth",
        questions: [
          "Describe a code review you gave that changed someone's mind.",
          "What's the kind of engineering work you most want more of?",
          "Anything I should have asked but didn't?",
        ]
      },
    ],
  };
}
