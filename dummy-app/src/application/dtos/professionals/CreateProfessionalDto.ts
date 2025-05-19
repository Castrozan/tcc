export class CreateProfessionalDto {
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    hierarchy: number | null;

    constructor(
        name: string,
        role: string,
        bio: string | null,
        imageUrl: string | null,
        hierarchy: number | null
    ) {
        this.name = name;
        this.role = role;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.hierarchy = hierarchy;
    }
}
