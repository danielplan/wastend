import User from '../models/user.model';

export async function registerUser(name: string, email: string, password: string) {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
}

export function loginUser(email: string, password: string) {
}
