// ========================================
// NayePankh AI Chat Widget — Groq API
// ========================================

// ⚠️ STEP FOR USER: Paste your Groq API key below
// Get your FREE key at: https://console.groq.com/keys
const GROQ_API_KEY = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// NayePankh system prompt — gives the AI full context
const SYSTEM_PROMPT = `You are "NayeBot", the friendly AI assistant for NayePankh Foundation — a government-registered social welfare NGO in India.

Key Facts about NayePankh Foundation:
- Founded during COVID-19 pandemic (2020) to help underprivileged communities
- Government registered NGO (NITI Aayog, 12A, 80G certified)
- 30,000+ interns trained through their internship programs
- Reached 2,00,000+ people through awareness campaigns
- Focus areas: Education, Health, Women Empowerment, Environmental Conservation
- Website: nayepankh.com
- Offers free internship programs for students in tech, design, content, and more
- Runs campaigns like plantation drives, blood donation, menstrual hygiene awareness
- Accepts donations for various social causes
- Has been featured in multiple newspapers and media

Your personality:
- Warm, helpful, and enthusiastic about social impact
- Use emojis occasionally (but not excessively)
- Keep answers concise (2-4 sentences usually)
- If asked something you don't know, say so honestly
- Guide people towards volunteering, donating, or learning more about NayePankh
- You can answer questions about the foundation, its programs, how to volunteer, donate, etc.`;

// Chat history for memory (keeps last 10 messages for context)
let chatHistory = [
  { role: 'system', content: SYSTEM_PROMPT }
];

// ---------- Chat Widget Initialization ----------
function initChat() {
  const toggle = document.getElementById('chatToggle');
  const window_ = document.getElementById('chatWindow');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  if (!toggle || !window_) return;

  // Toggle chat window
  toggle.addEventListener('click', () => {
    window_.classList.toggle('open');
    if (window_.classList.contains('open')) {
      // Remove notification badge
      const badge = toggle.querySelector('.badge');
      if (badge) badge.style.display = 'none';
      input?.focus();
    }
  });

  // Send message on button click
  sendBtn?.addEventListener('click', () => sendMessage());

  // Send message on Enter key
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Add welcome message
  addBotMessage("Hello! 👋 I'm NayeBot, the AI assistant for NayePankh Foundation. I can help you learn about our programs, volunteering opportunities, donations, and more. How can I help you today?");
}

// ---------- Send Message ----------
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input?.value.trim();
  if (!text) return;

  // Add user message to UI
  addUserMessage(text);
  input.value = '';

  // Add to history
  chatHistory.push({ role: 'user', content: text });

  // Keep history manageable (system + last 10 exchanges)
  if (chatHistory.length > 21) {
    chatHistory = [chatHistory[0], ...chatHistory.slice(-20)];
  }

  // Show typing indicator
  showTyping();

  try {
    if (GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
      // Fallback responses when no API key is set
      hideTyping();
      const fallback = getFallbackResponse(text);
      addBotMessage(fallback);
      chatHistory.push({ role: 'assistant', content: fallback });
      return;
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again!";

    hideTyping();
    addBotMessage(reply);
    chatHistory.push({ role: 'assistant', content: reply });

  } catch (error) {
    console.error('Chat error:', error);
    hideTyping();
    addBotMessage("Oops! I'm having trouble connecting right now. Please check your API key or try again later. 🙏");
  }
}

// ---------- Fallback Responses (when no API key) ----------
function getFallbackResponse(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! Welcome to NayePankh Foundation! 🙏 How can I help you today? You can ask about our programs, volunteering, donations, or internships!";
  }
  if (lower.includes('intern') || lower.includes('internship')) {
    return "NayePankh offers free internship programs in Tech, Design, Content Writing, Marketing, and more! We've trained 30,000+ interns so far. Visit our Volunteer page to find the perfect role for you! 🎓";
  }
  if (lower.includes('donat') || lower.includes('money') || lower.includes('contribute')) {
    return "Your donations make a real difference! ₹100 can provide 5 meals, ₹500 can support a family for a week. Visit our Donate page to see how your contribution helps! 💝";
  }
  if (lower.includes('volunteer') || lower.includes('join') || lower.includes('help')) {
    return "We'd love to have you! Take our AI Volunteer Role Finder quiz on the Volunteer page to find the perfect role matching your skills and interests. We have roles in education, tech, outreach, and more! 🤝";
  }
  if (lower.includes('about') || lower.includes('what') || lower.includes('nayepankh')) {
    return "NayePankh Foundation is a government-registered NGO founded during COVID-19. We focus on Education, Health, Women Empowerment, and Environmental Conservation. We've reached 2 lakh+ people! 🌟";
  }
  if (lower.includes('contact') || lower.includes('reach') || lower.includes('email')) {
    return "You can reach us through our website nayepankh.com or follow us on social media. We're always happy to connect! 📧";
  }
  
  return "That's a great question! For the most accurate answer, I recommend connecting your Groq API key (it's free!) so I can use AI to give you detailed responses. Meanwhile, feel free to explore our website! 🌟";
}

// ---------- UI Helper Functions ----------
function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-bubble">${escapeHtml(text)}</div>
  `;
  container.appendChild(msg);
  scrollToBottom();
}

function addBotMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-message bot';
  msg.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-bubble">${escapeHtml(text)}</div>
  `;
  container.appendChild(msg);
  scrollToBottom();
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'chatTyping';
  typing.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typing);
  scrollToBottom();
}

function hideTyping() {
  const typing = document.getElementById('chatTyping');
  if (typing) typing.remove();
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Initialize on DOM Ready ----------
document.addEventListener('DOMContentLoaded', initChat);
