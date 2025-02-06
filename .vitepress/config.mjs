import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Pixelfed Glitch Docs",
  base: "/docs/",
  description: "The Pixelfed Glitch documentation",
  themeConfig: {
    logo: {
      light: '/logo-black.png',
      dark: '/logo-white.png'
    },

    siteTitle: 'Docs',

  
    // https://vitepress.dev/reference/frontmatter-config#outline
    outline: {
      level: [2, 3, 4, 5],
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Pixelfed Glitch', link: 'https://pixelfed-glitch.github.io/docs' },
      { text: 'Support', link: 'https://github.com/pixelfed-glitch/pixelfed/discussions' },
    ],

    search: {
      provider: 'local'
    },

    i18nRouting: false,

    sidebar: [
      {
        text: '',
        items: [
          { text: 'Introduction', link: '/project/introduction' },
          { text: 'Code of Conduct', link: '/CODE_OF_CONDUCT' },
          { text: 'Community', link: '/project/community' },
          { text: 'Documentation', link: '/project/documentation' },
        ]
      },
      {
        text: 'Running Pixelfed',
        link: '/running-pixelfed/index',
        items: [
          {
            text: "Docker",
            link: '/running-pixelfed/docker/prerequisites',
            items: [
              { text: "Prerequisites", link: "/running-pixelfed/docker/prerequisites" },
              { text: "Installation", link: "/running-pixelfed/docker/installation" },
              { text: "Build Settings", link: "/running-pixelfed/docker/build-settings" },
              { text: "FAQ", link: "/running-pixelfed/docker/faq" },
              { text: "Runtimes", link: "/running-pixelfed/docker/runtimes" }
                        ],
          },
          {
            text: "Native",
            link: '/running-pixelfed/native/prerequisites',
            items: [
              { text: 'Prerequisites', link: '/running-pixelfed/native/prerequisites' },
              { text: 'Installation', link: '/running-pixelfed/native/installation' },
              { text: 'Administration', link: '/running-pixelfed/native/administration' },
              { text: 'Push Notifications', link: '/running-pixelfed/native/push-notifications' },
              { text: 'CLI Cheatsheet', link: '/running-pixelfed/native/cli-cheatsheet' },
              { text: 'Troubleshooting', link: '/running-pixelfed/native/troubleshooting' }
        ],
      }
    ]
  },
  {
    text: "",
    items: [
      { text: 'Configuration', link: 'configuration/configuration' }
],
},
      {
        text: 'Spec Compliance',
        items: [
          { text: 'ActivityPub', link: '/spec/ActivityPub' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pixelfed-glitch/pixelfed' },
      { icon: 'discord', link: 'https://discord.gg/HuZc6jr25X' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
  },
  head: [
    ['link', { rel: "stylesheet", href: "/custom.css"}],
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/favicon.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicon.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicon.png"}],
    ['link', { rel: "shortcut icon", href: "/assets/favicon.png"}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
  ],
})
