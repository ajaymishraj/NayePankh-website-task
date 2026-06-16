// ========================================
// AI Volunteer Role Finder Quiz — Groq API
// ========================================

// Uses the same API key from chat.js (defined there)
// Make sure chat.js is loaded before this file

const quizQuestions = [
  {
    question: "What excites you the most?",
    options: [
      { text: "🎨 Creating beautiful designs and visuals", tags: ["design", "creative"] },
      { text: "💻 Building things with code and technology", tags: ["tech", "development"] },
      { text: "📢 Connecting with people and spreading awareness", tags: ["outreach", "social"] },
      { text: "📝 Writing content and telling stories", tags: ["content", "writing"] },
      { text: "📊 Analyzing data and finding patterns", tags: ["data", "analytics"] }
    ]
  },
  {
    question: "How many hours per week can you volunteer?",
    options: [
      { text: "⏰ 2-5 hours (I'm quite busy)", tags: ["parttime"] },
      { text: "⏰ 5-10 hours (Moderate availability)", tags: ["moderate"] },
      { text: "⏰ 10-20 hours (Very committed!)", tags: ["fulltime"] },
      { text: "⏰ 20+ hours (All in!)", tags: ["dedicated"] }
    ]
  },
  {
    question: "Which social cause resonates with you most?",
    options: [
      { text: "📚 Education for underprivileged children", tags: ["education"] },
      { text: "🏥 Healthcare and wellness access", tags: ["health"] },
      { text: "👩 Women empowerment and safety", tags: ["women"] },
      { text: "🌱 Environmental conservation", tags: ["environment"] },
      { text: "🤝 Overall community development", tags: ["community"] }
    ]
  },
  {
    question: "What's your superpower?",
    options: [
      { text: "🗣️ Communication — I can convince anyone!", tags: ["outreach", "social"] },
      { text: "🧩 Problem-solving — I love fixing things", tags: ["tech", "analytics"] },
      { text: "🎭 Creativity — I think outside the box", tags: ["design", "creative", "content"] },
      { text: "📋 Organization — I keep everything on track", tags: ["management", "data"] },
      { text: "❤️ Empathy — I understand people deeply", tags: ["outreach", "community"] }
    ]
  },
  {
    question: "Which tool would you most enjoy using?",
    options: [
      { text: "🖌️ Canva / Figma / Photoshop", tags: ["design"] },
      { text: "💻 VS Code / Python / JavaScript", tags: ["tech", "development"] },
      { text: "📱 Instagram / Twitter / Social Media", tags: ["social", "outreach"] },
      { text: "📄 Google Docs / Notion / WordPress", tags: ["content", "writing"] },
      { text: "📈 Excel / Google Sheets / Tableau", tags: ["data", "analytics"] }
    ]
  }
];

// Role definitions based on tag combinations
const roles = [
  {
    title: "🎨 Creative Design Volunteer",
    match: ["design", "creative"],
    description: "You'd be perfect for creating posters, social media graphics, and campaign visuals. Your creative eye would help NayePankh's message reach more people!",
    tasks: ["Design campaign posters", "Create social media graphics", "Design certificates and reports"]
  },
  {
    title: "💻 Tech & Development Volunteer",
    match: ["tech", "development"],
    description: "Your coding skills can build real solutions! From automating processes to building web tools, you'd directly impact how NayePankh operates.",
    tasks: ["Build internal tools and dashboards", "Automate certificate generation", "Maintain and improve website"]
  },
  {
    title: "📢 Outreach & Campaign Volunteer",
    match: ["outreach", "social"],
    description: "You're a natural connector! You'd thrive in organizing awareness campaigns, managing social media, and growing NayePankh's community reach.",
    tasks: ["Organize awareness drives", "Manage social media accounts", "Coordinate with local communities"]
  },
  {
    title: "📝 Content & Storytelling Volunteer",
    match: ["content", "writing"],
    description: "Your words can inspire! You'd be amazing at writing impact stories, blog posts, and campaign content that moves people to action.",
    tasks: ["Write impact stories and blogs", "Create campaign narratives", "Draft newsletters and reports"]
  },
  {
    title: "📊 Data & Analytics Volunteer",
    match: ["data", "analytics"],
    description: "Your analytical mindset would help NayePankh track impact, optimize campaigns, and make data-driven decisions for maximum social good.",
    tasks: ["Track campaign impact metrics", "Analyze volunteer data", "Create dashboards and reports"]
  },
  {
    title: "🤝 Community Management Volunteer",
    match: ["community", "management"],
    description: "Your organizational skills and empathy make you ideal for managing volunteer teams, coordinating events, and building lasting community relationships.",
    tasks: ["Manage volunteer teams", "Coordinate events and drives", "Handle intern onboarding"]
  }
];

let currentQuestion = 0;
let answers = [];

// ---------- Quiz Initialization ----------
function initQuiz() {
  const quizContainer = document.getElementById('quizContainer');
  if (!quizContainer) return;

  renderQuestion();
}

function renderQuestion() {
  const quizContainer = document.getElementById('quizContainer');
  if (!quizContainer) return;

  const q = quizQuestions[currentQuestion];

  quizContainer.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">
        ${quizQuestions.map((_, i) => `
          <div class="progress-step ${i < currentQuestion ? 'done' : ''} ${i === currentQuestion ? 'active' : ''}"></div>
        `).join('')}
      </div>
      
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
        Question ${currentQuestion + 1} of ${quizQuestions.length}
      </p>
      
      <h3 class="quiz-question">${q.question}</h3>
      
      <div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `
          <div class="quiz-option" data-index="${i}" onclick="selectOption(${i})">
            <div class="option-radio"></div>
            <span>${opt.text}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-top: 28px;">
        <button class="btn btn-secondary btn-sm" onclick="prevQuestion()" 
                ${currentQuestion === 0 ? 'style="visibility:hidden"' : ''}>
          ← Back
        </button>
        <button class="btn btn-primary btn-sm" id="nextBtn" onclick="nextQuestion()" disabled>
          ${currentQuestion === quizQuestions.length - 1 ? 'Get My Role ✨' : 'Next →'}
        </button>
      </div>
    </div>
  `;
}

function selectOption(index) {
  // Update UI
  document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector(`.quiz-option[data-index="${index}"]`).classList.add('selected');
  
  // Store answer
  answers[currentQuestion] = quizQuestions[currentQuestion].options[index].tags;
  
  // Enable next button
  document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
  if (!answers[currentQuestion]) return;

  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

// ---------- Calculate & Show Result ----------
async function showResult() {
  const quizContainer = document.getElementById('quizContainer');
  
  // Calculate tag frequencies
  const tagCounts = {};
  answers.flat().forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  // Find best matching role
  let bestRole = roles[0];
  let bestScore = 0;

  roles.forEach(role => {
    const score = role.match.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  });

  // Show loading state
  quizContainer.innerHTML = `
    <div class="quiz-card" style="text-align: center; padding: 60px 48px;">
      <div style="font-size: 3rem; margin-bottom: 16px;">🔮</div>
      <h3>Analyzing your responses...</h3>
      <p style="color: var(--text-secondary);">Our AI is finding the perfect role for you</p>
      <div class="chat-typing" style="justify-content: center; margin-top: 20px;">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  // Try to get AI-personalized result
  let aiInsight = '';
  
  if (typeof GROQ_API_KEY !== 'undefined' && GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE') {
    try {
      const prompt = `Based on these quiz answers about a volunteer's preferences:
      - Interests: ${JSON.stringify(tagCounts)}
      - Best matching role: ${bestRole.title}
      
      Write a short, enthusiastic 2-sentence personalized message explaining why this role is perfect for them. Be specific and motivating. Don't repeat the role name.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: 'You are a career advisor for an NGO. Be warm, encouraging, and concise.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      if (response.ok) {
        const data = await response.json();
        aiInsight = data.choices[0]?.message?.content || '';
      }
    } catch (e) {
      console.log('AI insight unavailable, using default');
    }
  }

  // Delay for effect
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Show result
  quizContainer.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-result">
        <div style="font-size: 4rem; margin-bottom: 8px;">🎉</div>
        <p style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px;">Your perfect role is</p>
        <h2 class="result-role">${bestRole.title}</h2>
        <p class="result-description">${bestRole.description}</p>
        
        ${aiInsight ? `
          <div style="background: rgba(232,98,44,0.06); border: 1px solid rgba(232,98,44,0.15); border-radius: var(--radius-md); padding: 16px 20px; margin: 20px 0; text-align: left;">
            <p style="font-size: 0.82rem; font-weight: 600; color: var(--primary); margin-bottom: 6px;">🤖 AI Personalized Insight</p>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">${aiInsight}</p>
          </div>
        ` : ''}
        
        <div style="text-align: left; margin: 24px 0;">
          <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 12px;">What you'd be doing:</p>
          ${bestRole.tasks.map(task => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 0.88rem; color: var(--text-secondary);">
              <span style="color: var(--accent);">✓</span> ${task}
            </div>
          `).join('')}
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="https://nayepankh.com" target="_blank" class="btn btn-primary">
            Apply Now at NayePankh →
          </a>
          <button class="btn btn-secondary" onclick="resetQuiz()">
            Retake Quiz 🔄
          </button>
        </div>
      </div>
    </div>
  `;
}

function resetQuiz() {
  currentQuestion = 0;
  answers = [];
  renderQuestion();
}

// ---------- Initialize on DOM Ready ----------
document.addEventListener('DOMContentLoaded', initQuiz);
