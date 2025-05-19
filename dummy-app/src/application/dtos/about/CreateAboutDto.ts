import { CreateAboutImageDto } from './CreateAboutImageDto';

export class CreateAboutDto {
    bodyText: string;
    secondText: string;
    createdAt: Date;
    images: CreateAboutImageDto[] | null;

    constructor(bodyText: string, secondText: string, images: CreateAboutImageDto[] | null) {
        this.createdAt = new Date();
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.images = images;
    }
}
