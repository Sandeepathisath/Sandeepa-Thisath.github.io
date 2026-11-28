import type { Project } from '../types/portfolio'
import { assetPath } from './assets'

export const projects: Project[] = [
  // ==========================================
  // PROJECT 1 — ALGORITHM VISUALIZER STUDIO
  // ==========================================
  {
    id: 'algorithm-visualizer-studio',
    title: 'Algorithm Visualizer Studio',
    tagline: 'C# Windows Forms Sorting & BFS Pathfinding Desktop App',
    shortDescription:
      'A 2nd-year C# desktop app that visualizes Insertion Sort, Merge Sort, and BFS grid pathfinding step by step.',
    role: 'Desktop Appplication Development',
    year: '2026',
    status: 'featured',
    tech: ['C#', '.NET Framework 4.7.2', 'Windows Forms', 'GDI+ Graphics', 'Visual Studio'],
    accentColor: '#38bdf8',
    coverImage: assetPath('images/projects/algorithm-visualizer/cover.png'),
    githubUrl: 'https://github.com/Sandeepathisath/AlgorithmVisualizer',
    liveUrl: '',
    details: {
      overview:
        'Algorithm Visualizer Studio is a desktop app I built during my 2nd year studying C# to see how classic algorithms work step by step. Building on my own C# knowledge with AI assistance along the way, I later worked with Gemini 4 Hydrogen to redesign the layout and turn an early prototype into a clean desktop application.',
      problem:
        'Reading sorting or pathfinding algorithms only from static code makes it harder to see how values swap, how Merge Sort uses a temporary buffer, or how Breadth-First Search spreads around walls on a grid.',
      solution:
        'I built the app using C#, .NET Framework 4.7.2, Windows Forms, and custom GDI+ (System.Drawing) graphics in Visual Studio with no external UI libraries. It animates each step alongside live counters, matching code line highlights, Dark and Light themes (shown in the screenshots below), keyboard shortcuts, pop-out windows, and saved settings.',
      highlights: [
        {
          label: 'Project Type',
          value: '2nd-Year C# Learning Project',
        },
        {
          label: 'How It Was Built',
          value:
            'Built using my own C# knowledge with AI assistance along the way, then redesigned and expanded with Gemini 4 Hydrogen.',
        },
        {
          label: 'Themes & Modes',
          value:
            'Includes Dark Mode and Light Mode (examples shown below), keyboard shortcuts, pop-out windows, and saved settings.',
        },
        {
          label: 'Built With',
          value:
            'C#, .NET Framework 4.7.2, Windows Forms, and custom GDI+ graphics in Visual Studio (no external UI libraries).',
        },
      ],
      videoUrl: 'https://drive.google.com/file/d/15eKL-q89sxrHDXLs7SzUUyPWhOXzwAVb/view?usp=sharing',
      videoTitle: 'Walkthrough Demo: Sorting Lab & Pathfinding Studio',
      videoPoster: assetPath('images/projects/algorithm-visualizer/sorting-dark.png'),
      features: [
        'Sorting Lab: Watch Insertion Sort and Merge Sort organize bars step by step with random, nearly sorted, reversed, or few-unique data, live size and speed sliders, pause/step controls, and exact-array replay.',
        'Buffer & Code Trace: Highlights which bars are being compared or swapped, displays Merge Sort’s temporary buffer at the bottom, counts comparisons and steps, and highlights the active line of code as it runs.',
        'Pathfinding Lab: Draw walls directly on the grid with your mouse, drag the Start and Target points anywhere, generate random walls or solvable mazes in one click, and watch BFS expand wave by wave until showing the shortest path.',
        'Dark & Light Modes: Switch easily between Dark Mode and Light Mode (examples shown in Screenshots), use keyboard shortcuts, open pop-out windows, and keep your last settings automatically.',
      ],
      gallery: [
        {
          src: assetPath('images/projects/algorithm-visualizer/sorting-dark.png'),
          badge: 'Dark Mode',
          caption: 'Sorting Lab (Dark Mode): Insertion Sort bars, live counters, and code trace',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/pathfinding-dark.png'),
          badge: 'Dark Mode',
          caption: 'Pathfinding Lab (Dark Mode): BFS wave expansion and show shortest path',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/sorting-light.png'),
          badge: 'Light Mode',
          caption: 'Sorting Lab (Light Mode): Completed bar sorting run with final summary stats',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/pathfinding-light.png'),
          badge: 'Light Mode',
          caption: 'Pathfinding Lab (Light Mode): Custom maze walls and active BFS wave',
        },
      ],
    },
  },

  // ==========================================
  // PROJECT SLOT 2 — PASTE YOUR NEXT PROJECT HERE
  // ==========================================
  {
    id: 'project-2',
    title: 'Featured Project 02',
    tagline: 'Replace with your second project subtitle',
    shortDescription:
      'Another ready-to-edit slot for your next project. You can duplicate or remove slots anytime.',
    role: 'Backend & Systems Developer',
    year: '2026',
    status: 'featured',
    tech: ['Spring Boot', 'Java', 'MySQL', 'Docker'],
    accentColor: '#818cf8',
    coverImage: undefined,
    githubUrl: '',
    liveUrl: '',
    details: {
      overview:
        'Paste a detailed description of your second project here. This content only appears when a visitor clicks the card.',
      problem: 'Explain the workflow bottleneck or requirement you tackled.',
      solution:
        'Walk through how you structured the database, backend logic, and frontend experience.',
      features: [
        'Core feature 1 — update when ready',
        'Core feature 2 — update when ready',
        'Core feature 3 — update when ready',
      ],
      gallery: [],
    },
  },

  // ==========================================
  // SLOT 3 — CURRENTLY BUILDING / NEXT BUILD
  // ==========================================
  {
    id: 'currently-building',
    title: 'In Progress / Next Build',
    tagline: 'Currently Building',
    shortDescription:
      'A dedicated slot showing what you are actively learning and building right now—keeps your portfolio feeling active.',
    role: 'Active Experiment',
    year: '2026',
    status: 'building',
    tech: ['Three.js', 'React Three Fiber', 'TypeScript', 'Linux'],
    accentColor: '#34d399',
    coverImage: undefined,
    details: {
      overview:
        'Use this slot to share a work-in-progress idea, university research project, or new technology you are exploring.',
      problem:
        'What skill or technical goal are you pushing yourself to master with this build?',
      solution: 'Share your current roadmap and what milestones are coming next.',
      features: [
        'Milestone 1: Core prototype in progress',
        'Milestone 2: Architecture & performance tuning',
      ],
      gallery: [],
    },
  },
]

void assetPath
