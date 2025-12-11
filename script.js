// --- PRELOADER LOGIC ---
window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    
    // Wait for 2.5 seconds (to match the CSS animation) then fade out
    setTimeout(function() {
        preloader.classList.add("fade-out");
        
        // Optional: Re-enable scrolling if you disabled it
        document.body.style.overflow = "auto"; 
    }, 2500); 
});

// Add this to the very top of script.js
document.body.style.overflow = "auto";

// --- 1. See More Projects Logic ---
function seeMore() {
    // Finds all projects with the class 'hidden'
    const hiddenProjects = document.querySelectorAll('.work.hidden');
    
    // Reveals them
    hiddenProjects.forEach(project => {
        project.classList.remove('hidden');
    });

    // Hides the button after clicking
    const btn = document.getElementById('seeMoreBtn');
    if(btn) {
        btn.style.display = 'none';
    }
}

// --- 2. Mobile Menu Logic ---
function openmenu() {
    const sidemenu = document.querySelector(".nav-links");
    if (sidemenu) {
        sidemenu.style.right = "0";
        // Ensure close icon is visible
        const closeIcon = document.querySelector(".nav-links .fa-times");
        if(closeIcon) closeIcon.style.display = "block";
    }
}

function closemenu() {
    const sidemenu = document.querySelector(".nav-links");
    if (sidemenu) sidemenu.style.right = "-250px";
}

// --- 3. Tab Switching Logic (About Section) ---
function opentab(tabname) {
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");

    for (let tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (let tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// --- 4. Modal Logic (Works for Services AND Projects) ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Stop background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Resume background scrolling
    }
}

// Close modal if user clicks outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// --- 5. Initialization (Smooth Scroll & Animations) ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Smooth Scroll Link Handler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Prevent errors if link is empty or just "#"
            if (targetId === "#" || targetId === "") return;
            
            // Check if it's a modal link (starts with javascript) - Ignore it here
            if (this.getAttribute('href').includes("javascript")) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                closemenu(); // Close mobile menu if open
            }
        });
    });

    // Fade-in Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Elements to animate
    const hiddenElements = document.querySelectorAll('.service-card, .work, .about-col-1, .about-col-2, .contact-left, .contact-right');
    hiddenElements.forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Add this to the bottom of script.js

window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const heroSection = document.querySelector('.hero');
    const heroPersonImg = document.getElementById('heroPersonImg');
    
    // Only run if the elements exist and we are still viewing the hero section
    if (heroSection && heroPersonImg && scrollPosition < heroSection.offsetHeight) {
        
        // Calculate the movement (0.4 controls the speed)
        // Higher number = faster movement
        const translateValue = scrollPosition * 0.4; 
        
        // Apply the movement using a CSS variable
        heroPersonImg.style.setProperty('--scroll-y', `${translateValue}px`);
    }
});

// --- Dark/Light Mode Toggle ---
const themeIcon = document.getElementById("theme-icon");

themeIcon.onclick = function() {
    document.body.classList.toggle("light-theme");
    
    if(document.body.classList.contains("light-theme")){
        themeIcon.classList.remove("fa-moon"); // Remove Moon
        themeIcon.classList.add("fa-sun");     // Add Sun
    } else {
        themeIcon.classList.remove("fa-sun");  // Remove Sun
        themeIcon.classList.add("fa-moon");    // Add Moon
    }
}

// --- SCROLL REVEAL ANIMATION ---
const observerOptions = {
    root: null, // Use the viewport as the root
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Slightly offset the trigger point
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // If the element is visible
        if (entry.isIntersecting) {
            // Add the visible class
            entry.target.classList.add('show-scroll');
            // Stop observing it once it's animated (optional, saves resources)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Find all elements with the 'hidden-scroll' class and start observing them
const hiddenElements = document.querySelectorAll('.hidden-scroll');
hiddenElements.forEach(el => observer.observe(el)); 

// --- Contact Form Handling ---
const scriptURL = 'https://formspree.io/f/xovgnnky'; // Make sure this code is correct
const form = document.getElementById('contactForm'); // Selects the form by ID
const msg = document.getElementById("msg");

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault(); // 1. Stops the page from refreshing/redirecting
        
        // Change button text to show it's working
        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        fetch(scriptURL, { 
            method: 'POST', 
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                // SUCCESS
                msg.innerHTML = "Message sent successfully!";
                msg.style.color = "#61b752"; // Green
                form.reset(); // Clear the form
            } else {
                // SERVER ERROR
                msg.innerHTML = "Error sending message.";
                msg.style.color = "red";
            }
        })
        .catch(error => {
            // INTERNET ERROR
            msg.innerHTML = "Error! Check internet connection.";
            msg.style.color = "red";
            console.error('Error!', error.message);
        })
        .finally(() => {
            // Reset button text
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(function(){
                msg.innerHTML = "";
            }, 5000);
        });
    });
}

// --- NUMBER COUNTING ANIMATION ---
const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target'); // Get the target number (e.g., 50)
                const duration = 2000; // Animation duration in ms (2 seconds)
                const increment = target / (duration / 16); // Calculate increment per frame (60fps)
                
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCounter();
            });
            
            // Stop observing once animation starts so it doesn't reset
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // Trigger when 50% of the section is visible

// Start observing the stats section
const statsSection = document.querySelector('.stats-section');
if(statsSection) {
    statsObserver.observe(statsSection);
}

// --- AI CHATBOT LOGIC ---
const chatBtn = document.getElementById("chat-toggle-btn");
const chatBox = document.getElementById("chat-box");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// Toggle Chat
chatBtn.addEventListener("click", () => chatBox.classList.toggle("hidden"));
closeChat.addEventListener("click", () => chatBox.classList.add("hidden"));

// Send Message
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Add User Message
    addMessage(text, "user-message");
    userInput.value = "";

    // 2. Simulate Bot Typing Delay
    setTimeout(() => {
        const botReply = getBotReply(text.toLowerCase());
        addMessage(botReply, "bot-message");
    }, 600);
}

function addMessage(text, className) {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = text; // Allow HTML for links
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

// --- "AI" LOGIC (Simple Rules) ---
function getBotReply(input) {
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
        return "Hello! I am Mayantha's Portfolio Bot. How can I help you today?";
    } 
    else if (input.includes("skill") || input.includes("stack") || input.includes("coding")) {
        return "Mayantha is proficient in <b>Java, Python, C++</b>, and Web technologies like <b>React and HTML/CSS</b>. Check the 'Skills' section for more!";
    } 
    else if (input.includes("project") || input.includes("work")) {
        return "You can explore projects like the <b>Network Sim</b> and <b>IoT Weather Station</b> in the 'My Work' section.";
    } 
    else if (input.includes("contact") || input.includes("email") || input.includes("phone")) {
        return "You can email Mayantha at <b>mayanthachanuka55@gmail.com</b> or use the contact form below.";
    } 
    else if (input.includes("download") || input.includes("cv") || input.includes("resume")) {
        return "You can download the CV by clicking the 'Download CV' button in the Contact section.";
    } 
    else {
        return "I'm not sure about that. Try asking about <b>skills</b>, <b>projects</b>, or <b>contact</b> info.";
    }
}

// --- Handle Chat Suggestions ---
function askBot(question) {
    // 1. Display the user's click as a message
    addMessage(question, "user-message");

    // 2. Simulate a small delay for the bot to "think"
    setTimeout(() => {
        const botReply = getBotReply(question.toLowerCase());
        addMessage(botReply, "bot-message");
    }, 600);
}

// --- TYPING ANIMATION ---
const typingTextSpan = document.querySelector(".typing-text");
const roles = ["Computer Engineer", "Web Developer", "UI/UX Designer", "IoT Enthusiast"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingTextSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at the end of the word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing the next word
    }

    setTimeout(type, typeSpeed);
}

// Start the animation
document.addEventListener("DOMContentLoaded", () => {
    if (typingTextSpan) {
        setTimeout(type, 1000); // Initial delay before starting
    }
});