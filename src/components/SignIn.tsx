import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Timer } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../lib/supabase';

interface SignInProps {
    onAuthenticate: (isAdmin: boolean) => void;
}

const INVESTOR_CODE = 'INV2024ABC'; // Hardcoded for now
const ADMIN_CODE = 'ADM2024XYZ'; // Admin access code
const COOLDOWN_TIME = 30000; // 30 seconds in milliseconds

export const SignIn: React.FC<SignInProps> = ({ onAuthenticate }) => {
    const [code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Check for code in URL params on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCode = urlParams.get('code');
        if (urlCode) {
            setCode(urlCode);
            // Auto-authenticate if valid code in URL
            handleCodeAuthentication(urlCode);
        }
    }, []);

    // Cooldown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (cooldownEnd) {
            interval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, cooldownEnd - now);
                setTimeLeft(Math.ceil(remaining / 1000));

                if (remaining <= 0) {
                    setCooldownEnd(null);
                    setTimeLeft(0);
                    setAttempts(0);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldownEnd]);

    const handleCodeAuthentication = async (authCode: string) => {
        setIsLoading(true);
        setError('');

        try {
            let email: string;
            let isAdmin = false;

            if (authCode === INVESTOR_CODE) {
                email = 'investor@dataroom.app';
                isAdmin = false;
            } else if (authCode === ADMIN_CODE) {
                email = 'admin@dataroom.app';
                isAdmin = true;
            } else {
                throw new Error('Invalid access code');
            }

            // Try to sign in first
            let result = await signInWithEmail(email, 'dataroom123');

            // If sign in fails, create the user account
            if (!result.success) {
                const signUpResult = await signUpWithEmail(email, 'dataroom123', {
                    role: isAdmin ? 'admin' : 'user',
                    access_code: authCode
                });

                if (signUpResult.success) {
                    // Now sign in with the newly created account
                    result = await signInWithEmail(email, 'dataroom123');
                }
            }

            if (result.success) {
                setError('');
                onAuthenticate(isAdmin);
            } else {
                throw new Error(result.error?.message || 'Authentication failed');
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setError('Invalid access code');

            if (newAttempts >= 3) {
                setCooldownEnd(Date.now() + COOLDOWN_TIME);
                setError('Too many failed attempts. Please wait 30 seconds.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cooldownEnd && Date.now() < cooldownEnd) {
            return;
        }

        if (code.length !== 10) {
            setError('Code must be exactly 10 characters');
            return;
        }

        handleCodeAuthentication(code);
    };

    const isInCooldown = cooldownEnd && Date.now() < cooldownEnd;

    return (
        <div className="bg-[#FAB049] min-h-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDYwIDAgTCAwIDYwIE0gMzAgMCBMIDAgMzAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjA1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPC9zdmc+')] bg-repeat flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#FFF1D6] rounded-full border-4 border-black flex items-center justify-center mx-auto mb-4 transform -rotate-12">
                        <Lock size={32} className="text-[#B74B28]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#B74B28] mb-2 transform rotate-1">
                        DataVault
                    </h1>
                    <p className="text-lg text-[#B74B28] font-medium">
                        Secure Access Required
                    </p>
                </div>

                {/* Sign In Form */}
                <div className="bg-[#FFF1D6] p-8 rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] transform -rotate-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-lg font-bold text-[#B74B28] mb-3">
                                Enter Access Code
                            </label>
                            <div className="relative">
                                <input
                                    type={showCode ? 'text' : 'password'}
                                    id="code"
                                    value={code}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                        if (value.length <= 10) {
                                            setCode(value);
                                            setError('');
                                        }
                                    }}
                                    placeholder="10-digit code"
                                    className="w-full px-4 py-3 text-lg font-mono border-3 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] bg-white text-[#B74B28] placeholder-gray-400"
                                    disabled={isInCooldown || isLoading}
                                    maxLength={10}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCode(!showCode)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[#B74B28] hover:text-[#fab049]"
                                    disabled={isInCooldown || isLoading}
                                >
                                    {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="mt-2 text-sm text-[#B74B28]">
                                {code.length}/10 characters
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-100 border-2 border-red-500 rounded-[10px]">
                                <AlertCircle size={20} className="text-red-600" />
                                <span className="text-red-600 font-medium">{error}</span>
                            </div>
                        )}

                        {isInCooldown && (
                            <div className="flex items-center gap-2 p-3 bg-yellow-100 border-2 border-yellow-500 rounded-[10px]">
                                <Timer size={20} className="text-yellow-600" />
                                <span className="text-yellow-600 font-medium">
                                    Cooldown active: {timeLeft}s remaining
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={code.length !== 10 || isInCooldown || isLoading}
                            className="w-full bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black shadow-[5px_6px_0px_#000000] hover:shadow-[2px_3px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 py-3 px-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[5px_6px_0px_#000000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#B74B28] border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </div>
                            ) : isInCooldown ? (
                                `Wait ${timeLeft}s`
                            ) : (
                                'Access Data Room'
                            )}
                        </button>
                    </form>

                    {/* Attempt Counter */}
                    {attempts > 0 && !isInCooldown && (
                        <div className="mt-4 text-center">
                            <span className="text-sm text-[#B74B28]">
                                Attempts: {attempts}/3
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="mt-6 text-center">
                    <div className="bg-[#7583FA] p-4 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] transform rotate-1">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle size={20} className="text-white" />
                            <span className="text-white font-bold">Secure Access</span>
                        </div>
                        <p className="text-white text-sm">
                            Your access code provides secure entry to confidential startup information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
