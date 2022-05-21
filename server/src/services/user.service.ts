import User from '../models/user.model';
import { comparePasswords, createSession, encryptPassword, Tokens } from './auth.service';

export async function registerUser(name: string, email: string, password: string): Promise<Tokens> {
    const passwordHash = await encryptPassword(password);
    const user = new User({name, email, password, password_hash: passwordHash});
    await user.save();
    return await createSession(user);
}

export async function loginUser(email: string, password: string) {
    const user = await User.getByEmail(email);
    if(!user) throw new Error('label.login_failed');
    const checkPassword = await comparePasswords(password, user.passwordHash);
    if(!checkPassword) throw new Error('label.login_failed');
    return await createSession(user);
}

