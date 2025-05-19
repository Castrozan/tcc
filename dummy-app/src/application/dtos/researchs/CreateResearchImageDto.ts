export class CreateResearchImageDto {
    url: string | null;
    title: string | null;
    description: string | null;

    constructor(url: string | null, title: string | null, description: string | null) {
        this.url = url;
        this.title = title;
        this.description = description;
    }
}
