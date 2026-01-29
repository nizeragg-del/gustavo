
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/40 backdrop-blur-xl p-4 animate-fade-in">
            <div className="fixed inset-0 cursor-pointer" onClick={onClose}></div>
            <div className="relative bg-[#112218]/90 border border-[#326747] rounded-3xl p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black uppercase text-white tracking-tighter italic">
                            {isSignUp ? (step === 1 ? 'Criar Conta' : 'Seus Dados') : 'Área do Sócio'}
                        </h2>
                        <div className="h-1 w-12 bg-primary mt-1"></div>
                    </div>
                    <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <p className="text-[#92c9a8] mb-10 text-sm font-medium leading-relaxed">
                    {isSignUp
                        ? (step === 1 ? 'Junte-se à Arena Golaço. Comece com seu acesso.' : 'Complete seu perfil para agilizar suas compras.')
                        : 'Acesse sua conta para gerenciar seus pedidos.'}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* STEP 1: Email/Pass */}
                    {(!isSignUp || step === 1) && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">E-mail</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-5 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20" placeholder="ex: craque@gol.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">Senha</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-5 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20" placeholder="********" />
                            </div>
                        </>
                    )}

                    {/* STEP 2: Personal Info */}
                    {isSignUp && step === 2 && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">Nome Completo</label>
                                <input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-5 py-3 text-white focus:border-primary outline-none" placeholder="Seu Nome" />
                            </div>
                            <div className="flex gap-4">
                                <div className="space-y-2 w-1/2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">CPF</label>
                                    <input required value={cpf} onChange={e => setCpf(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-2 w-1/2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">Celular</label>
                                    <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="(11) 90000-0000" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="pt-4 border-t border-white/10">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-3 text-left">Endereço de Entrega</label>
                                <div className="flex gap-3 mb-3">
                                    <input value={zip} onChange={e => setZip(e.target.value)} onBlur={handleZipBlur} placeholder="CEP" className="w-1/3 bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    <input value={city} readOnly placeholder="Cidade" className="w-2/3 bg-[#234832]/20 border border-[#326747] rounded-xl px-4 py-3 text-white/50" />
                                </div>
                                <div className="flex gap-3 mb-3">
                                    <input value={street} onChange={e => setStreet(e.target.value)} placeholder="Rua / Avenida" className="w-2/3 bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    <input value={number} onChange={e => setNumber(e.target.value)} placeholder="Nº" className="w-1/3 bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                </div>
                                <div className="flex gap-3">
                                    <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Bairro" className="w-1/2 bg-[#234832]/30 border border-[#326747] rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    <input value={state} readOnly placeholder="UF" className="w-1/2 bg-[#234832]/20 border border-[#326747] rounded-xl px-4 py-3 text-white/50" />
                                </div>
                            </div>
                        </>
                    )}

                    {error && <div className="text-red-500 text-xs">{error}</div>}

                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-5 rounded-2xl transition-all uppercase tracking-tighter shadow-[0_10px_20px_-10px_rgba(43,238,121,0.5)] active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Carregando...' : (isSignUp ? (step === 1 ? 'AVANÇAR' : 'FINALIZAR CADASTRO') : 'ENTRAR NA CONTA')}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-[#326747]/50 text-center">
                    <button onClick={() => { setIsSignUp(!isSignUp); setStep(1); setError(null); }} className="text-white hover:text-primary transition-colors underline underline-offset-4 text-xs font-bold uppercase tracking-widest">
                        {isSignUp ? 'Já tem conta? FAÇA LOGIN' : 'Não tem conta? CADASTRE-SE'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;
