import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Input } from './Input';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                if (!username.trim()) {
                    throw new Error('Введите имя пользователя');
                }
                await signUp(email, password, username);
            }
            onClose();
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md"
                >
                    <GlassCard className="relative p-8" animate={false}>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-200/50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                            {isLogin ? 'Вход' : 'Регистрация'}
                        </h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-100/80 border border-red-300 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <Input
                                    value={username}
                                    onChange={setUsername}
                                    placeholder="Имя пользователя"
                                    required
                                    disabled={loading}
                                />
                            )}

                            <Input
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="Email"
                                required
                                disabled={loading}
                            />

                            <Input
                                type="password"
                                value={password}
                                onChange={setPassword}
                                placeholder="Пароль"
                                required
                                disabled={loading}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                            </Button>
                        </form>

                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">или</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <Button
                            onClick={handleGoogleSignIn}
                            variant="secondary"
                            className="w-full flex items-center justify-center space-x-2"
                            disabled={loading}
                        >
                            <span className="text-xl">🔐</span>
                            <span>Войти через Google</span>
                        </Button>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="text-sm text-blue-600 hover:underline"
                                disabled={loading}
                            >
                                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
