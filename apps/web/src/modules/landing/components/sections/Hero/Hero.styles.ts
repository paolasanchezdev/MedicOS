/* ==========================================================================
   Hero.styles.ts - Corrección Espaciado Móvil & Navbars (Versión 100% Responsiva)
   ========================================================================== */

export const HeroStyles = {
  section: `
    relative
    isolate
    overflow-hidden
    w-full
    min-h-fit
    lg:min-h-screen
    bg-medicos-canvas
    flex
    flex-col
    justify-between
  `,

  // Subimos el padding superior a pt-32 / pt-36 para dar aire debajo de la Navbar flotante
  container: `
    relative
    z-20
    mx-auto
    w-full
    max-w-7xl
    px-4
    sm:px-6
    lg:px-8
    pt-32
    sm:pt-36
    lg:pt-40
    pb-12
    lg:pb-24
  `,

  content: `
    grid
    w-full
    grid-cols-1
    items-center
    gap-8
    lg:gap-16
    lg:grid-cols-12
  `,

  left: `
    relative
    z-10
    flex
    flex-col
    items-start
    text-left
    lg:col-span-6
    xl:col-span-5
  `,

  badgeWrapper: `
    mb-4
    sm:mb-6
    inline-flex
  `,

  title: `
    text-3xl
    sm:text-4xl
    lg:text-5xl
    xl:text-6xl
    font-extrabold
    tracking-tight
    leading-[1.12]
    sm:leading-[1.08]
    text-medicos-dark-blue
  `,

  titleAccent: `
    bg-gradient-to-r
    from-medicos-teal
    to-medicos-cyan
    bg-clip-text
    text-transparent
  `,

  description: `
    mt-4
    sm:mt-6
    max-w-xl
    text-sm
    sm:text-base
    lg:text-lg
    leading-relaxed
    text-medicos-muted
    font-normal
  `,

  buttons: `
    mt-6
    sm:mt-8
    flex
    flex-col
    sm:flex-row
    items-stretch
    sm:items-center
    gap-3
    sm:gap-4
    w-full
    sm:w-auto
  `,

  metrics: `
    mt-8
    sm:mt-12
    pt-6
    sm:pt-8
    border-t
    border-medicos-soft-border/60
    grid
    grid-cols-3
    gap-2
    sm:gap-6
    w-full
  `,

  metricItem: `
    flex
    flex-col
  `,

  metricValue: `
    text-lg
    sm:text-2xl
    lg:text-3xl
    font-bold
    tracking-tight
    text-medicos-dark-blue
  `,

  metricLabel: `
    mt-1
    text-[10px]
    sm:text-xs
    lg:text-sm
    font-medium
    text-medicos-muted
  `,

  right: `
    relative
    z-10
    w-full
    flex
    items-center
    justify-center
    lg:col-span-6
    xl:col-span-7
    mt-6
    lg:mt-0
  `,

  dashboardWrapper: `
    relative
    w-full
    max-w-[680px]
    xl:max-w-[740px]
  `,

  primaryButton: `
    inline-flex
    h-12
    sm:h-14
    w-full
    sm:w-auto
    items-center
    justify-center
    rounded-2xl
    bg-medicos-teal
    px-6
    text-sm
    sm:text-base
    font-semibold
    text-white
    shadow-lg
    shadow-medicos-teal/20
    transition-all
    duration-300
    hover:bg-medicos-teal/90
    hover:-translate-y-0.5
    active:translate-y-0
    cursor-pointer
  `,

  secondaryButton: `
    inline-flex
    h-12
    sm:h-14
    w-full
    sm:w-auto
    items-center
    justify-center
    rounded-2xl
    border
    border-medicos-soft-border
    bg-white/70
    backdrop-blur-xl
    px-6
    text-sm
    sm:text-base
    font-semibold
    text-medicos-dark-blue
    shadow-xs
    transition-all
    duration-300
    hover:bg-white
    hover:border-medicos-teal/40
    hover:-translate-y-0.5
    active:translate-y-0
    cursor-pointer
  `,

  glass: `
    rounded-2xl
    sm:rounded-3xl
    border
    border-medicos-soft-border/80
    bg-white/80
    backdrop-blur-2xl
    shadow-xl
    shadow-medicos-teal/5
  `,

  glassStrong: `
    rounded-2xl
    sm:rounded-[32px]
    border
    border-medicos-soft-border
    bg-white/90
    backdrop-blur-3xl
    shadow-2xl
    shadow-medicos-teal/10
  `,

  widgetGlass: `
    rounded-xl
    sm:rounded-2xl
    border
    border-medicos-soft-border
    bg-white/85
    backdrop-blur-xl
    shadow-lg
    shadow-medicos-teal/5
  `,

  floatingWidget: `
    absolute
    z-30
    select-none
    pointer-events-auto
    transition-transform
    duration-700
    ease-out
  `,

  widgetTitle: `
    text-[11px]
    sm:text-sm
    font-bold
    text-medicos-dark-blue
  `,

  widgetSubtitle: `
    text-[9px]
    sm:text-[11px]
    font-medium
    text-medicos-muted
  `,

  dashboard: `
    relative
    w-full
    overflow-hidden
    rounded-2xl
    sm:rounded-3xl
    border
    border-medicos-soft-border
    bg-white/85
    backdrop-blur-2xl
    shadow-2xl
    shadow-medicos-teal/10
  `,

  // Añadimos overflow-x-auto o flex-wrap al header del dashboard
  dashboardHeader: `
    flex
    flex-wrap
    sm:flex-nowrap
    items-center
    justify-between
    gap-2
    border-b
    border-medicos-soft-border/80
    bg-medicos-canvas/50
    px-3
    sm:px-6
    py-3
    sm:py-4
    overflow-x-auto
  `,

  dashboardBody: `
    p-3
    xs:p-4
    sm:p-8
  `,

  carousel: `
    relative
    w-full
    overflow-hidden
  `,

  carouselIndicators: `
    mt-4
    sm:mt-6
    flex
    items-center
    justify-center
    gap-2
  `,

  indicator: `
    h-1.5
    w-1.5
    sm:h-2
    sm:w-2
    rounded-full
    bg-medicos-soft-border
    transition-all
    duration-300
    cursor-pointer
  `,

  indicatorActive: `
    w-5
    sm:w-6
    bg-medicos-teal
  `,

  background: `
    absolute
    inset-0
    -z-10
    overflow-hidden
    pointer-events-none
    select-none
  `,

  bioCore: `
    absolute
    right-[5%]
    top-1/2
    -translate-y-1/2
    z-10
    opacity-30
    pointer-events-none
  `,
} as const;

export type HeroStylesType = typeof HeroStyles;