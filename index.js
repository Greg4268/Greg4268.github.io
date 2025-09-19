function init() {
  getData();
}

let cardData;
const favoriteProjects = [
  "hid-arduino-file-offload-to-server",
  "humidity-monitor-arduino-wifi",
  "network-scanner-to-hilbert-curve",
  "packet-sniffer-python",
  "WiFi_Heatmap",
  "tree",
];

const excluded_projects = [
  "emotion-reader-js",
  "calorie-calculator-js",
  "minecraft-bot-js",
  "leetcode",
  "emotion-reader-model-js"
]

async function getData() {
  const url = `https://api.github.com/users/Greg4268/repos`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    cardData = await response.json();
    console.log("Public Repositories:", cardData);

    loadProjects();
  } catch (error) {
    console.error("Fetch error:", error);
    // Fallback to manual projects if API fails
    loadFallbackProjects();
  }
}

function loadProjects() {
  const container = document.querySelector("#projects .row");

  if (!cardData || cardData.length === 0) {
    console.log("No repository data available");
    return;
  }

  const filteredRepos = cardData.filter(
    (repo) =>
      !repo.fork && // Exclude forked repositories
      repo.description && // Only include repos with descriptions
      repo.name !== "Greg4268" && // Exclude profile repository
      !excluded_projects.includes(repo.name)
  );

  // Sort so favorites come first
  filteredRepos.sort((a, b) => {
    const aFav = favoriteProjects.includes(a.name) ? 1 : 0;
    const bFav = favoriteProjects.includes(b.name) ? 1 : 0;
    return bFav - aFav;
  });

  filteredRepos.forEach((repo) => {
    // Create the card HTML
    const cardHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card shadow project-card">
                    <div class="card-body">
                        <h3 class="card-title h4">
                            ${repo.name}
                            ${
                              favoriteProjects.includes(repo.name)
                                ? '<span title="Favorite Project" style="font-size:1.2em;">💫</span>'
                                : ""
                            }
                        </h3>
                        <div class="mb-3">
                            ${generateTechBadges(repo)}
                        </div>
                        <p class="card-text">${
                          repo.description || "No description available"
                        }</p>
                    </div>
                    <div class="card-footer bg-white border-top-0">
                        <a href="${
                          repo.html_url
                        }" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fab fa-github me-1"></i> View Code
                        </a>
                        ${
                          repo.homepage
                            ? `<a href="${repo.homepage}" target="_blank" class="btn btn-sm btn-outline-primary ms-2">
                            <i class="fas fa-external-link-alt me-1"></i> Live Demo
                        </a>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;

    // Append the card to the container
    container.appendChild(tempDiv.firstElementChild);
  });
}

function generateTechBadges(repo) {
  // Map common repository names/topics to tech stacks
  const techMapping = {
    "hid-arduino-file-offload-to-server": ["PowerShell", "Flask", "Arduino", "Python", "C++"],
    "humidity-monitor-arduino-wifi": ["Flask", "Arduino", "Python", "C++"],
    "network-scanner-to-hilbert-curve": ["Python", "Netifaces", "NumPy", "Subprocess"],
    AdoptAPet: ["C#", "JavaScript", "SQL", "HTML/CSS"],
    "packet-sniffer-python": ["Python", "Scapy", "PySide6"],
    "blinds-controller-arduino": ["C++", "Arduino", "3D Printing"],
    "rfid-arduino-auth": ["C++", "Arduino"],
    WiFi_Heatmap: ["Python", "NumPy", "Seaborn"],
    leetcode: ["Data Structures & Algorithms"],
    tree: ["Python", "Script"],
    rm_cache: ["Python", "Script"],
    "git-auto": ["Shell", "Script"],
    "realtime-chatapp": ["WebSocket", "Python", "Flask"]
  };

  // Get tech stack for this repository
  let techStack = techMapping[repo.name] || [];

  // If no predefined tech stack, try to infer from language
  if (techStack.length === 0 && repo.language) {
    techStack = [repo.language];
  }

  // Add topics if available (GitHub topics can indicate technologies used)
  if (repo.topics && repo.topics.length > 0) {
    techStack = [
      ...techStack,
      ...repo.topics.map(
        (topic) => topic.charAt(0).toUpperCase() + topic.slice(1)
      ),
    ];
  }

  // Remove duplicates
  techStack = [...new Set(techStack)];

  // Generate badges HTML
  return techStack
    .map((tech) => `<span class="tech-badge">${tech}</span>`)
    .join(" ");
}

function loadFallbackProjects() {
  // This function can load your manually defined projects if the API fails
  console.log("Loading fallback projects (manual projects already in HTML)");
  // Your existing manual projects in the HTML will remain visible
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});
