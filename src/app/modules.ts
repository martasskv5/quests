export interface Quest {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    xp: number;
};

export interface Player {
    id: number;
    username: string;
    level: number;
    clan?: Clan;
    profilePictureUrl?: string;
    questsList: Quest[];
};

export interface Clan {
    name: string;
    description: string;
    capacity: number;
    profilePictureUrl?: string;
    players?: Player[];
}