
import React, { useState } from 'react';

interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, pass: string) => Promise<void>;
    onSignUp: (data: any) => Promise<void>;
    error: string | null;
    setError: (err: string | null) => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ isOpen, onClose, onLogin, onSignUp, error, setError }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Profile
    const [fullName, setFullName] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2: Address
    const [zip, setZip] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                if (step === 1) {
                    // Validate Step 1
                    if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
                    setStep(2);
                    setLoading(false);
                    return;
                } else {
                    // Finalize SignUp
                    await onSignUp({
                        email, password,
                        full_name: fullName,
                        cpf, phone,
                        address: { zip, street, number, district, city, state }
                    });
                }
            } else {
                // Login
                await onLogin(email, password);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro na autenticação");
        } finally {
            if (!isSignUp || step === 2) setLoading(false);
        }
    };

    const handleZipBlur = async () => {
        if (zip.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setStreet(data.logradouro);
                    setDistrict(data.bairro);
                    setCity(data.localidade);
                    setState(data.uf);
                }
            } catch (e) { }
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <div className="fixed inset-0 cursor-pointer" onClick={onClose}></div>
            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl shadow-slate-900/20 animate-scale-in overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tighter italic leading-none">
                            {isSignUp ? (step === 1 ? 'Nova Conta' : 'Seus Dados') : 'Área do Sócio'}
                        </h2>
                        <div className="h-1.5 w-12 bg-primary mt-3 rounded-full"></div>
                    </div>
                    <button onClick={onClose} className="size-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

                <p className="text-slate-500 mb-10 text-xs font-bold leading-relaxed uppercase tracking-wide">
                    {isSignUp
                        ? (step === 1 ? 'Junte-se à Arena Golaço. Comece com seu acesso.' : 'Complete seu perfil para agilizar suas compras.')
                        : 'Acesse sua conta para gerenciar seus pedidos.'}
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* STEP 1: Email/Pass */}
                    {(!isSignUp || step === 1) && (
                        <>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail de Acesso</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none transition-all placeholder:text-slate-300 shadow-inner" placeholder="ex: craque@gol.com" />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha Secreta</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none transition-all placeholder:text-slate-300 shadow-inner" placeholder="********" />
                            </div>
                        </>
                    )}

                    {/* STEP 2: Personal Info */}
                    {isSignUp && step === 2 && (
                        <>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                                <input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="Seu Nome" />
                            </div>
                            <div className="flex gap-4">
                                <div className="space-y-3 flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CPF</label>
                                    <input required value={cpf} onChange={e => setCpf(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Celular</label>
                                    <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="(11) 90000-0000" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary font-black italic">Informações de Entrega</label>
                                <div className="flex gap-4">
                                    <input value={zip} onChange={e => setZip(e.target.value)} onBlur={handleZipBlur} placeholder="CEP" className="w-1/3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" />
                                    <input value={city} readOnly placeholder="Cidade" className="w-2/3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-4 text-slate-400 font-black italic cursor-not-allowed" />
                                </div>
                                <div className="flex gap-4">
                                    <input value={street} onChange={e => setStreet(e.target.value)} placeholder="Rua / Avenida" className="w-2/3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" />
                                    <input value={number} onChange={e => setNumber(e.target.value)} placeholder="Nº" className="w-1/3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" />
                                </div>
                                <div className="flex gap-4">
                                    <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Bairro" className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" />
                                    <input value={state} readOnly placeholder="UF" className="w-1/2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-4 text-slate-400 font-black italic cursor-not-allowed" />
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest italic">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Preparando...' : (isSignUp ? (step === 1 ? 'Avançar' : 'Finalizar Cadastro') : 'Entrar na Arena')}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <button onClick={() => { setIsSignUp(!isSignUp); setStep(1); setError(null); }} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] italic">
                        {isSignUp ? 'Já tem conta? Fazer Login' : 'Nova conta? Cadastre-se agora'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;
