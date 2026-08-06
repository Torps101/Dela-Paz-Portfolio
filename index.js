const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

const headerLogoConatiner = document.querySelector('.header__logo-container')

headerLogoConatiner.addEventListener('click', () => {
  location.href = 'index.html'
})

const themeToggles = document.querySelectorAll('.theme-toggle')
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  themeToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'))
  })
}

applyTheme(
  localStorage.getItem('theme') || (colorSchemeQuery.matches ? 'dark' : 'light')
)

themeToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const next =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
  })
})

colorSchemeQuery.addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light')
  }
})

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic (Kept from original setup) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        htmlElement.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        let currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });


    // --- Project Carousel Logic ---

    const projectContainer = document.querySelector('.projects__carousel');
    const projectGrid = document.querySelector('.projects__grid');
    const navArrows = document.querySelectorAll('.projects__nav-arrow');

    // Get all project cards
    const projects = Array.from(projectGrid.querySelectorAll('.projects__card'));
    
    // Configuration
    const visibleItems = 3;
    let currentIndex = 0;

    // Function to update the displayed projects
    function updateCarousel() {
        if (projects.length === 0) return;

        // Calculate the starting index for the current view
        const start = currentIndex;
        
        // Determine the end index, ensuring we don't go past the array length
        const end = Math.min(start + visibleItems, projects.length);

        // Slice the projects array to get only the items currently visible
        const visibleProjects = projects.slice(start, end);

        // Clear the grid and redraw the visible projects
        projectGrid.innerHTML = '';
        visibleProjects.forEach(project => {
            projectGrid.appendChild(project);
        });
    }

    // Event Listener for Left Arrow
    navArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            if (arrow.classList.contains('projects__nav-arrow--left')) {
                currentIndex--;
            } else if (arrow.classList.contains('projects__nav-arrow--right')) {
                currentIndex++;
            }
            updateCarousel();
        });
    });

    // Initialize the carousel on load
    updateCarousel();
});