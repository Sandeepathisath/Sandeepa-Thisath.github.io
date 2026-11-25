import type { Profile } from '../types/portfolio'
import { assetPath } from './assets'

export const profile: Profile = {
    name: 'Sandeepa Thisath',
    role: 'Computer Science Undergraduate & Full-Stack Developer',
    headline: 'Building clean web applications and learning through hands-on projects.',
    subheadline: 'I am a Computer Science undergraduate interested in web development, backend systems, and creating simple, reliable software.',
    bio: 'I am a Computer Science undergraduate at the University of Kelaniya who enjoys building practical web and desktop applications. Through my coursework and personal projects, I work with tools like React, TypeScript, Java, and SQL to turn ideas into working software. I am always eager to learn new technologies, improve my coding skills, and gain real-world experience.',
    location: 'Sri Lanka',
    availability: 'Open to internships & collaborations',
    email: 'thisathsandeepa30@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/sandeepa-thisath-257333387',
    avatar: assetPath('images/profile.jpg.jpeg'),
    avatarIsTransparent: false,
    cvUrl: assetPath('cv/Sandeepa-Thisath-CV.pdf.pdf'),
    cvFileName: 'Sandeepa-Thisath-CV.pdf',
    socials: [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/sandeepa-thisath-257333387',
            handle: 'in/sandeepa-thisath',
            icon: 'linkedin',
        },
        {
            name: 'GitHub',
            url: 'https://github.com/Sandeepathisath',
            handle: '@Sandeepathisath',
            icon: 'github',
        },
        {
            name: 'Gmail',
            url: 'thisathsandeepa30@gmail.com',
            handle: 'thisathsandeepa30@gmail.com',
            icon: 'mail',
        },
    ],
    focusPillars: [
        {
            tag: 'Frontend',
            title: 'Web Interfaces',
            description:
                'Building clean, responsive user interfaces with React, TypeScript, and modern CSS.',
        },
        {
            tag: 'Backend',
            title: 'APIs & Databases',
            description:
                'Learning to connect web apps with server-side logic, REST APIs, and relational databases.',
        },
        {
            tag: 'Everyday Tools',
            title: 'Linux & Dev Workflows',
            description:
                'Practicing version control with Git, working in Linux environments, and writing organized code.',
        },
    ],
}