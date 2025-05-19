import { Professional } from '../professionals/Professional';
import { ResearchImage } from './ResearchImage';

export class Research {
    constructor(
        public id: number | null,
        public title: string,
        public description: string,
        public bodyText: string,
        public secondText: string,
        public createdAt: Date,
        public updatedAt: Date,
        public professionalId: number | null,
        public image: ResearchImage[] | null,
        public professional: Professional | null
    ) {}
}
