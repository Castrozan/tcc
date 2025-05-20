export class UpdateProfessionalDto {
    id: number | null;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    hierarchy: number | null;

    constructor(
        id: number | null,
        name: string,
        role: string,
        bio: string | null,
        imageUrl: string | null,
        hierarchy: number | null
    ) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.hierarchy = hierarchy;
    }
}
