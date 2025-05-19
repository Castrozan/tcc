export class UpdateArticleImageDto {
    id: number | null;
    url: string | null;
    title: string | null;
    description: string | null;

    constructor(
        id: number | null,
        url: string | null,
        title: string | null,
        description: string | null
    ) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.description = description;
    }
}
