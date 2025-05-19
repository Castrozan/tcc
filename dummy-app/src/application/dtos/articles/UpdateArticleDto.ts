import { UpdateArticleImageDto } from './UpdateArticleImageDto';

export class UpdateArticleDto {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    professionalId: number | null;
    author: string | null;
    published: string | null;
    images: UpdateArticleImageDto[] | null;

    constructor(
        id: number,
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        professionalId: number | null,
        author: string | null,
        published: string | null,
        images: UpdateArticleImageDto[] | null
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.professionalId = professionalId;
        this.author = author;
        this.published = published;
        this.images = images;
    }
}
