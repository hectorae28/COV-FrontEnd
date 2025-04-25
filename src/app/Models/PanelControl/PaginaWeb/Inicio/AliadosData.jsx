export const initialAliados = [
    { id: 1, logo: '/assets/sponsor/dacosi.png', name: 'Dacosi' },
    { id: 2, logo: '/assets/sponsor/dacomed.png', name: 'Dacomed' },
    { id: 3, logo: '/assets/sponsor/1.png', name: 'Sponsor 1' },
    { id: 4, logo: '/assets/sponsor/2.png', name: 'Sponsor 2' },
    { id: 5, logo: '/assets/sponsor/3.png', name: 'Sponsor 3' },
    { id: 6, logo: '/assets/sponsor/4.png', name: 'Sponsor 4' },
    { id: 7, logo: '/assets/sponsor/5.png', name: 'Sponsor 5' },
    { id: 8, logo: '/assets/sponsor/6.png', name: 'Sponsor 6' },
    { id: 9, logo: '/assets/sponsor/7.png', name: 'Sponsor 7' },
    { id: 10, logo: '/assets/sponsor/8.png', name: 'Sponsor 8' },
];

// You could also export other data or helper functions related to aliados here
export const generateMockImagePath = () => {
    return `/assets/sponsor/${Math.floor(Math.random() * 13) + 1}.png`;
};