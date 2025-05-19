import { AboutImage } from './AboutImage';

export class About {
    constructor(
        public id: number | null,
        public bodyText: string,
        public secondText: string,
        public createdAt: Date,
        public images: AboutImage[] | null
    ) {}
}
