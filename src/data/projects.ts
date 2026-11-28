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
      'An interactive 2nd-year C# Windows Forms desktop app visualizing Insertion Sort, Merge Sort with live temp buffers, and BFS maze pathfinding with step-by-step code tracing.',
    role: 'Desktop App Developer',
    year: '2026',
    status: 'featured',
    tech: ['C#', '.NET Framework 4.7.2', 'Windows Forms', 'GDI+ Graphics', 'Visual Studio'],
    accentColor: '#38bdf8',
    coverImage: assetPath('images/projects/algorithm-visualizer/cover.png'),
    githubUrl: 'https://github.com/Sandeepathisath/AlgorithmVisualizer',
    liveUrl: '',
    details: {
      overview:
        'Algorithm Visualizer Studio is a desktop application I created during my 2nd year studying C# to better understand and visualize how classic algorithms work step by step. Building on my own programming knowledge with AI assistance along the way—and later partnering with Gemini 4 Hydrogen to redesign the interface and expand the user experience—I took the project from a basic algorithm prototype into a modern, interactive desktop studio.',
      problem:
        'Studying classic sorting and graph-traversal algorithms from static code alone makes it harder to trace array swaps, see how recursive Merge Sort uses temporary buffer memory, or watch Breadth-First Search explore cells around obstacles.',
      solution:
        'Engineered directly with C#, .NET Framework 4.7.2, Windows Forms, and custom GDI+ (System.Drawing) graphics with zero external UI libraries—delivering responsive custom rendering, live step-by-step code line highlighting, Dark and Light themes (examples shown in Screenshots below), keyboard shortcuts, pop-out windows, and persistent user preferences.',
      highlights: [
        {
          label: 'Project Type',
          value: '2nd-Year C# Learning Project',
        },
        {
          label: 'How It Was Built',
          value:
            'Designed and directed using my C# knowledge alongside AI assistance, with full UI/UX modernization and feature expansion co-developed using Gemini 4 Hydrogen',
        },
        {
          label: 'Themes & Modes',
          value:
            'Supports both Dark Mode and Light Mode (examples shown in the gallery below), plus pop-out windows and saved settings',
        },
        {
          label: 'Built With',
          value:
            'C#, .NET Framework 4.7.2, Windows Forms, and custom GDI+ (System.Drawing) graphics crafted in Visual Studio with no external UI libraries',
        },
      ],
      videoUrl: 'https://drive.google.com/file/d/15eKL-q89sxrHDXLs7SzUUyPWhOXzwAVb/view?usp=sharing',
      videoTitle: 'Walkthrough Demo — Sorting Lab & Pathfinding Studio',
      videoPoster: assetPath('images/projects/algorithm-visualizer/sorting-dark.png'),
      features: [
        'Sorting Lab (Insertion Sort & Merge Sort): Switch data patterns (random, nearly sorted, reversed, few unique values), adjust array size and animation speed live, pause or step one move at a time, and replay the exact same array to compare algorithms.',
        'Merge Sort Live Buffer & Code Trace: Highlights active bar comparisons and swaps, renders Merge Sort’s temporary buffer along the bottom, tracks live comparison/step counters, and highlights the matching line of code as it executes.',
        'Pathfinding Lab (Breadth-First Search): Draw walls directly on the grid with your mouse, drag Start and Target points anywhere, generate random obstacles or solvable mazes in one click, and watch BFS expand wave by wave until animating the shortest path.',
        'Dark & Light Themes + Desktop Polish: Switch cleanly between Dark Mode and Light Mode (examples shown below), use keyboard shortcuts, open pop-out studio views, and automatically retain your last settings.',
      ],
      gallery: [
        {
          src: assetPath('images/projects/algorithm-visualizer/sorting-dark.png'),
          badge: 'Dark Mode',
          caption: 'Sorting Lab (Dark Mode) — Insertion Sort bars, live metrics & execution code trace',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/pathfinding-dark.png'),
          badge: 'Dark Mode',
          caption: 'Pathfinding Lab (Dark Mode) — BFS wavefront & 34-hop shortest path trace',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/sorting-light.png'),
          badge: 'Light Mode',
          caption: 'Sorting Lab (Light Mode) — Completed 52-bar sort & summary metrics',
        },
        {
          src: assetPath('images/projects/algorithm-visualizer/pathfinding-light.png'),
          badge: 'Light Mode',
          caption: 'Pathfinding Lab (Light Mode) — Maze walls & expanding BFS frontier wave',
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
