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

const projectsCarousel = document.querySelector('.projects__carousel')

const projectsTrack = projectsCarousel?.querySelector('.projects__track')

if (projectsTrack && projectsTrack.querySelector('.projects__card')) {
  const track = projectsTrack
  const cards = Array.from(track.querySelectorAll('.projects__card'))
  const prevBtn = projectsCarousel.querySelector('.projects__nav-arrow--left')
  const nextBtn = projectsCarousel.querySelector('.projects__nav-arrow--right')
  const dotsCont = projectsCarousel.querySelector('.projects__dots')

  // distance from one card to the next, gap included
  const getStep = () =>
    cards.length > 1
      ? cards[1].offsetLeft - cards[0].offsetLeft
      : cards[0].offsetWidth

  // how many cards fit on screen at once — one page's worth
  const getPerView = () => {
    const step = getStep()
    return step ? Math.max(1, Math.round(track.clientWidth / step)) : 1
  }

  const getPageCount = () => Math.ceil(cards.length / getPerView())

  const getPage = () => {
    const step = getStep()
    if (!step) return 0

    const lastPage = getPageCount() - 1
    // the final page is short-scrolled when cards don't divide evenly,
    // so treat "scrolled to the end" as being on it
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
      return lastPage
    }
    return Math.min(Math.round(track.scrollLeft / step / getPerView()), lastPage)
  }

  // wraps around: past the last page lands on the first, and vice versa
  const goToPage = (page) => {
    const pages = getPageCount()
    const target = ((page % pages) + pages) % pages
    track.scrollTo({
      left: target * getPerView() * getStep(),
      behavior: 'smooth',
    })
  }

  const buildDots = () => {
    const count = getPageCount()
    if (dotsCont.children.length === count) return

    dotsCont.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.className = 'projects__dot'
      dot.setAttribute('aria-label', `Go to project page ${i + 1}`)
      dot.addEventListener('click', () => goToPage(i))
      dotsCont.appendChild(dot)
    }
  }

  const syncControls = () => {
    const page = getPage()

    Array.from(dotsCont.children).forEach((dot, i) => {
      const active = i === page
      dot.classList.toggle('projects__dot--active', active)
      dot.setAttribute('aria-current', String(active))
    })
  }

  prevBtn.addEventListener('click', () => goToPage(getPage() - 1))
  nextBtn.addEventListener('click', () => goToPage(getPage() + 1))

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToPage(getPage() + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPage(getPage() - 1)
    }
  })

  let scrollTick = false
  track.addEventListener('scroll', () => {
    if (scrollTick) return
    scrollTick = true
    window.requestAnimationFrame(() => {
      syncControls()
      scrollTick = false
    })
  })

  const refresh = () => {
    buildDots()
    syncControls()
  }

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(refresh, 150)
  })

  refresh()
}
