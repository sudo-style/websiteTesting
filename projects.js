async function loadProjects() {
    const container = document.getElementById("projects-container");

    try {
        const response = await fetch("./projects.json");

        if (!response.ok) {
            throw new Error("Could not load projects.json");
        }

        const projects = await response.json();

        container.innerHTML = "";

        for (const project of projects) {
            let markdownContent = "";

            // Load README
            try {
                const mdResponse = await fetch(project.readme);

                if (!mdResponse.ok) {
                    throw new Error("README not found");
                }

                markdownContent = await mdResponse.text();
            } catch (err) {
                markdownContent =
                    "# README Missing\n\nNo documentation is available for this project.";
            }

            // Build media section
            let mediaSection = "";

            // YouTube Embed
            if (project.youtube) {
                mediaSection += `
                    <a href="https://youtu.be/${project.youtube}" target="_blank">
                        <img src="https://img.youtube.com/vi/${project.youtube}/hqdefault.jpg">
                    </a>
                `;
            }

            // GitHub link
            if (project.github) {
                mediaSection += `
                    <p class="project-link">
                        <a
                            href="${project.github}"
                            target="_blank"
                            rel="noopener noreferrer">
                            View Source on GitHub
                        </a>
                    </p>
                `;
            }

            // Create project card
            const card = document.createElement("section");
            card.className = "project-card";

            card.innerHTML = `
                <div class="project-header">
                    <h2 class="project-title">${project.title}</h2>

                    ${
                        project.description
                            ? `<p class="project-description">${project.description}</p>`
                            : ""
                    }
                </div>

                ${mediaSection}

                <div class="readme">
                    ${marked.parse(markdownContent)}
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <div class="error">
                <h2>Error Loading Projects</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Start loading projects when page loads
document.addEventListener("DOMContentLoaded", loadProjects);
