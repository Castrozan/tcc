export class ResearchImage {
    constructor(
        public id: number | null,
        public researchId: number | null,
        public url: string | null,
        public title: string | null,
        public description: string | null
    ) {}
}
