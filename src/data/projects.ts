import type { Project } from '../types/portfolio'
import { assetPath } from './assets'

export const projects: Project[] = [
    // ==========================================
    // PROJECT SLOT 1 — PASTE YOUR PROJECT HERE
    // ==========================================
    {
        id: 'project-1',
        title: 'Featured Project 01',
        tagline: 'Replace with a crisp one-line subtitle',
        shortDescription:
            'Short 2-line preview shown on the main portfolio card. Click this card to open the full project breakdown modal.',
        role: 'Full-Stack Developer',
        year: '2026',
        status: 'featured',
        tech: ['React', 'TypeScript', 'Node.js', 'MySQL'],
        accentColor: '#38bdf8',
        coverImage: undefined, // Later: assetPath('images/projects/project1-cover.png')
        githubUrl: '',
        liveUrl: '',
        details: {
            overview:
                'Paste a longer summary of what this project does, who it is built for, and the overall system design.',
            problem:
                'Describe the main challenge or real-world problem this project was created to solve.',
            solution:
                'Explain your technical approach, key architecture choices, and how the final app solves the problem.',
            features: [
                'Key feature 1 — replace with what you built',
                'Key feature 2 — replace with an interesting technical highlight',
                'Key feature 3 — replace with another core capability',
            ],
            gallery: [
                // Later add extra modal screenshots like:
                // assetPath('images/projects/project1-screen1.png'),
            ],
        },
    },

    // ==========================================
    // PROJECT SLOT 2 — PASTE YOUR PROJECT HERE
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