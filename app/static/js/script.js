document.addEventListener("DOMContentLoaded", () => {
    const skillsContainer = document.getElementById("skills-container");
    const searchBar = document.getElementById("search-bar");
    const filterDropdown = document.getElementById("filter-dropdown");
    const compareButton = document.getElementById("compare-button");
    const clearButton = document.getElementById("clear-button");
    const modal = document.getElementById("compare-modal");
    const modalClose = document.getElementById("modal-close");

    const bestSkill = document.getElementById("best-skill").querySelector("span");
    const secondBestSkill = document.getElementById("second-best-skill").querySelector("span");
    const leastOptimalSkill = document.getElementById("least-optimal-skill").querySelector("span");

    let allSkills = []; // Store all skills for rendering and filtering

    // Fetch skills from the API
    fetch("/api/skills")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch skills");
            }
            return response.json();
        })
        .then((skills) => {
            allSkills = skills; // Save skills for filtering
            console.log("Fetched skills:", allSkills);

            // Render all skills initially
            renderSkills(allSkills);
        })
        .catch((error) => {
            console.error("Error fetching skills:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Failed to load skills. Please try again later.";
            errorMessage.style.color = "red";
            skillsContainer.appendChild(errorMessage);
        });

    // Function to render skills in the container
    function renderSkills(skills) {
        skillsContainer.innerHTML = ""; // Clear previous content
        skills.forEach((skill) => {
            const skillBox = document.createElement("div");
            skillBox.classList.add("skill-box");
            skillBox.setAttribute("data-id", skill.id);
            skillBox.setAttribute("data-tier", skill.tier); // Add tier from API
            skillBox.setAttribute("data-priority", skill.priority); // Add priority from API

            // Add an image to the skill box
            const skillImage = document.createElement("img");
            skillImage.src = skill.image || "/static/images/skills/placeholder.png"; // Default image if none provided
            skillImage.alt = skill.name;
            skillImage.classList.add("skill-image");

            // Add the skill name below the image
            const skillName = document.createElement("p");
            skillName.textContent = skill.name;
            skillName.classList.add("skill-name");

            // Append image and name to the skill box
            skillBox.appendChild(skillImage);
            skillBox.appendChild(skillName);

            // Append the skill box to the container
            skillsContainer.appendChild(skillBox);

            // Add click event for selection
            skillBox.addEventListener("click", () => toggleSkillSelection(skillBox));
        });
    }

    // Function to toggle the selection state of a skill box
    function toggleSkillSelection(skillBox) {
        if (skillBox.classList.contains("selected")) {
            skillBox.classList.remove("selected"); // Deselect
        } else if (document.querySelectorAll(".skill-box.selected").length < 3) {
            skillBox.classList.add("selected"); // Select
        } else {
            alert("You can only select up to 3 skills!");
        }
    }

    // Function to sort and populate the modal
    compareButton.addEventListener("click", () => {
        const selectedSkills = Array.from(document.querySelectorAll(".skill-box.selected"));

        if (selectedSkills.length !== 3) {
            alert("Please select exactly 3 skills to compare.");
            return;
        }

        // Extract skill data (name, tier, and priority)
        const skillsData = selectedSkills.map((box) => {
            const name = box.querySelector(".skill-name").textContent;
            const tier = box.getAttribute("data-tier") || "E"; // Default to the lowest tier
            const priority = parseInt(box.getAttribute("data-priority"), 10); // Parse priority as a number
            return { name, tier, priority };
        });

        // Sort skills by tier first, then priority number
        const tierOrder = ["SS", "S", "A", "B", "C", "D", "E"];
        skillsData.sort((a, b) => {
            const tierDifference = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
            if (tierDifference !== 0) return tierDifference; // If tiers are different, sort by tier
            return a.priority - b.priority; // If tiers are the same, sort by priority number
        });

        // Populate the modal with sorted skills
        bestSkill.textContent = `${skillsData[0].name} (${skillsData[0].tier} Tier)`;
        secondBestSkill.textContent = `${skillsData[1].name} (${skillsData[1].tier} Tier)`;
        leastOptimalSkill.textContent = `${skillsData[2].name} (${skillsData[2].tier} Tier)`;

        // Show the modal
        modal.style.display = "block";
    });

    // Handle modal close
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Apply search and filter logic
    function applyFilters() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedType = filterDropdown.value;

        let filteredSkills = allSkills;

        // Filter by type
        if (selectedType !== "All") {
            filteredSkills = filteredSkills.filter((skill) => skill.type === selectedType);
        }

        // Filter by search term
        if (searchTerm) {
            filteredSkills = filteredSkills.filter((skill) =>
                skill.name.toLowerCase().includes(searchTerm)
            );
        }

        renderSkills(filteredSkills); // Re-render the filtered skills
    }

    // Event listener for the dropdown filter
    filterDropdown.addEventListener("change", applyFilters);

    // Event listener for the search bar
    searchBar.addEventListener("input", applyFilters);

    // Clear button functionality
    clearButton.addEventListener("click", () => {
        const selectedBoxes = document.querySelectorAll(".skill-box.selected");
        selectedBoxes.forEach((box) => box.classList.remove("selected"));
    });
});
