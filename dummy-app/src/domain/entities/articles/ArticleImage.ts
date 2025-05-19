export class ArticleImage {
    constructor(
        public id: number | null,
        public articleId: number | null,
        public url: string | null,
        public title: string | null,
        public description: string | null
    ) {}
}
