export class ColorDefinition {
    public r: number;
    public g: number;
    public b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

export abstract class ColorDefinitions {
    static BLACK = new ColorDefinition(0, 0, 0);
    static WHITE = new ColorDefinition(1, 1, 1);
    static RED = new ColorDefinition(1, 0, 0);
    static GREEN = new ColorDefinition(0, 1, 0);
    static BLUE = new ColorDefinition(0, 0, 1);
    static CYAN = new ColorDefinition(0, 1, 1);
    static MAGENTA = new ColorDefinition(1, 0, 1);
    static YELLOW = new ColorDefinition(1, 1, 0);
    static GRAY = new ColorDefinition(0.5, 0.5, 0.5);
}