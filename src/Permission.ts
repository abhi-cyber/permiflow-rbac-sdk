export class Permission {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly resource?: string,
    public readonly description?: string,
    public readonly deny?: boolean
  ) {}
}
