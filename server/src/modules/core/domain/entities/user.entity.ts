export interface UserProps {
  email: string;
  password: string;
  name: string;
  role: 'VET' | 'MANAGER' | 'OPERATOR';
  organizationId: string;
}

export class User {
  constructor(
    public readonly props: UserProps,
    public readonly id?: string,
  ) {}

  public static create(props: UserProps, id?: string): User {
    if (!props.email.includes('@')) throw new Error('Invalid email format');
    return new User(props, id);
  }
}
