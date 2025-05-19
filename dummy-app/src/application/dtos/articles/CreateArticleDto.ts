import { CreateArticleImageDto } from './CreateArticleImageDto';

export class CreateArticleDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    professionalId: number | null;
    author: string | null;
    published: string | null;
    images: CreateArticleImageDto[] | null;

    constructor(
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        professionalId: number | null,
        author: string | null,
        published: string | null,
        images: CreateArticleImageDto[] | null
    ) {
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
