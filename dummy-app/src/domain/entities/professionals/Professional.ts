export class Professional {
    constructor(
        public id: number | null,
        public name: string,
        public role: string,
        public bio: string | null,
        public imageUrl: string | null,
        public createdAt: Date,
        public hierarchy: number
    ) {}
}
