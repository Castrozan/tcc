export class CreateEquipmentDto {
    name: string;
    description: string | null;
    imageUrl: string | null;
    type: string | null;

    constructor(name: string, description: string, imageUrl?: string, type?: string) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.type = type;
    }
}
