import type { Member } from "./Member";

export interface Project {
    id: string
    name: string
}

export interface ProjectDetail extends Project {
    slug?: string;
    owner?: { id?: string; email?: string };
    ownerEmail?: string;
    timezone?: string;
    createdAt?: string;
    members?: Member[];
}