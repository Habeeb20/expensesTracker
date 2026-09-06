import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';

export default function Register() {
    const { theme, isDark } = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // TODO: call register({ name, email, password }) from src/api/auth.js
            // router.replace('/(tabs)') on success
        } catch (e) {
            setError('Something went wrong. Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-6 pt-16 pb-10">
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center mb-8"
                        style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                    >
                        <ArrowLeft size={18} color={theme.textPrimary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={{ color: theme.textPrimary }} className="text-[30px] font-bold mb-2">
                        Create account
                    </Text>
                    <Text style={{ color: theme.textSecondary }} className="text-base mb-10">
                        Start building better money habits today.
                    </Text>

                    {/* Error banner */}
                    {error ? (
                        <View
                            className="rounded-xl px-4 py-3 mb-5"
                            style={{ backgroundColor: isDark ? 'rgba(255,107,107,0.12)' : 'rgba(220,38,38,0.08)' }}
                        >
                            <Text style={{ color: theme.expense }} className="text-sm font-medium">
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    {/* Name field */}
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
                        Full name
                    </Text>
                    <View
                        className="flex-row items-center rounded-2xl px-4 mb-5 border"
                        style={{ backgroundColor: theme.surface, borderColor: theme.border, height: 56 }}
                    >
                        <User size={18} color={theme.textMuted} />
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Habeeb Waliyu"
                            placeholderTextColor={theme.textMuted}
                            className="flex-1 ml-3 text-[15px]"
                            style={{ color: theme.textPrimary }}
                        />
                    </View>

                    {/* Email field */}
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
                        Email address
                    </Text>
                    <View
                        className="flex-row items-center rounded-2xl px-4 mb-5 border"
                        style={{ backgroundColor: theme.surface, borderColor: theme.border, height: 56 }}
                    >
                        <Mail size={18} color={theme.textMuted} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="flex-1 ml-3 text-[15px]"
                            style={{ color: theme.textPrimary }}
                        />
                    </View>

                    {/* Password field */}
                    <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
                        Password
                    </Text>
                    <View
                        className="flex-row items-center rounded-2xl px-4 mb-2 border"
                        style={{ backgroundColor: theme.surface, borderColor: theme.border, height: 56 }}
                    >
                        <Lock size={18} color={theme.textMuted} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="At least 6 characters"
                            placeholderTextColor={theme.textMuted}
                            secureTextEntry={!showPassword}
                            className="flex-1 ml-3 text-[15px]"
                            style={{ color: theme.textPrimary }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                            {showPassword ? (
                                <EyeOff size={18} color={theme.textMuted} />
                            ) : (
                                <Eye size={18} color={theme.textMuted} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={{ color: theme.textMuted }} className="text-xs mb-8">
                        By signing up, you agree to our Terms and Privacy Policy.
                    </Text>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className="rounded-2xl py-4 items-center mb-6"
                        style={{ backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }}
                    >
                        <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
                            {loading ? 'Creating account...' : 'Create account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Switch to login */}
                    <View className="flex-row justify-center items-center gap-1.5 mt-auto">
                        <Text style={{ color: theme.textSecondary }} className="text-sm">
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={{ color: theme.primary }} className="text-sm font-bold">
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}