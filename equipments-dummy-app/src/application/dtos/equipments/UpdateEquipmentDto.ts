export class UpdateEquipmentDto {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    type: string | null;

    constructor(id: number, name: string, description: string, imageUrl?: string, type?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.type = type;
    }
}
