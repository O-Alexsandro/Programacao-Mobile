import React, { useState } from 'react';
import { 
    Text, 
    TextInput, 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Button } from "@/component/button/button"; // Mantendo seu botão
import { themes } from "@/global/themes"; // Mantendo seu tema
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Ícones padrão do Expo

export default function Login() {
    // Estados para armazenar os dados dos inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estados de Erro
    const [errorUser, setErrorUser] = useState<string | null>(null);
    const [errorPass, setErrorPass] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState(''); // Para msg "Username ou senha inválidos"

async function handleLogin() {
        // 1. Limpa erros anteriores para começar validação do zero
        setErrorUser(null);
        setErrorPass(null);
        setGeneralError('');

        let crash = false; // Variável de controle

        // 2. Verifica se está vazio (Bloqueio 1)
        if (!username.trim()) {
            setErrorUser('Campo obrigatório');
            crash = true;
        }
        if (!password.trim()) {
            setErrorPass('Campo obrigatório');
            crash = true;
        }

        // Se algum campo estiver vazio, PARE AQUI.
        if (crash) return;

        // 3. Inicia verificação de credenciais
        setLoading(true);
        
        // Simulando tempo de processamento
        setTimeout(async () => {
            
            // --- AQUI ESTÁ A TRAVA DE SEGURANÇA ---
            // Só entra se for user: admin e senha: 123
            if (username === 'admin' && password === '123') {
                try {
                    await AsyncStorage.setItem('@user_token', 'token123456');
                    setLoading(false);
                    
                    // SUCESSO: Navega para a próxima tela
                    router.replace('/tela-inicio/inicio'); 
                } catch (e) {
                    setLoading(false);
                }
            } else {
                // FRACASSO: Senha ou usuário errados
                setLoading(false);
                setGeneralError('Username ou senha inválidos');
                
                // Aciona as bordas vermelhas
                setErrorUser('invalid'); 
                setErrorPass('invalid');
                
                // OBS: Note que aqui NÃO tem router.replace, 
                // então ele continua na mesma tela.
            }
        }, 1000);
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Text style={styles.title}>Bem-vindo de volta!</Text> 
            <Text style={styles.textInfo}>Insira seus dados para entrar na sua conta.</Text>

            <View style={styles.containerForm}>
                
                {/* Mensagem Geral de Erro (Imagem 3) */}
                {generalError ? <Text style={styles.generalErrorText}>{generalError}</Text> : null}

                {/* INPUT USERNAME */}
                <Text style={styles.titleForm}>Username</Text>
                <TextInput 
                    style={[
                        styles.inputText, 
                        (errorUser || generalError) && styles.inputError // Aplica borda vermelha se tiver erro
                    ]}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                {/* Mensagem de "Campo obrigatório" */}
                {errorUser === 'Campo obrigatório' && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>Campo obrigatório</Text>
                    </View>
                )}

                {/* INPUT SENHA */}
                <Text style={styles.titleForm}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={[
                            styles.inputText, 
                            { flex: 1, marginBottom: 0 }, // Ajuste para caber no container
                            (errorPass || generalError) && styles.inputError
                        ]}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword} // Esconde/Mostra senha
                    />
                    
                    {/* Ícone do Olhinho */}
                    <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons 
                            name={showPassword ? "eye-off" : "eye"} 
                            size={20} 
                            color={themes.colors.gray || '#999'} 
                        />
                    </TouchableOpacity>
                </View>
                
                {/* Mensagem de "Campo obrigatório" da Senha */}
                {errorPass === 'Campo obrigatório' && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>Campo obrigatório</Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    {loading ? (
                        <ActivityIndicator size="small" color={themes.colors.primary} />
                    ) : (
                        <Button title="Entrar" onPress={handleLogin}/>
                    )}
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',    
        padding: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    textInfo:{
        fontSize: 16,
        fontWeight: 'regular', // 'regular' as vezes dá warning no Android, prefira '400' ou 'normal'
        color: '#FFFFFF',
        marginBottom: 20
    },
    containerForm:{
        width: '100%',
        // Removi height fixo para se adaptar ao conteúdo
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themes.colors.gray || '#E0E0E0',
        backgroundColor: '#FFFFFF', // themes.colors.white
        marginTop: 10,
        padding: 20,
        paddingBottom: 30
    },
    titleForm: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333'
    },
    inputText: {
        width: '100%',
        height: 50, // Altura fixa fica melhor visualmente
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themes.colors.gray || '#E0E0E0',
        paddingHorizontal: 10,
        marginBottom: 5, // Reduzi o margin bottom padrão pois agora temos a msg de erro
    },
    // Estilo novo para borda vermelha
    inputError: {
        borderColor: '#FF3B30',
        borderWidth: 1.5
    },
    // Texto de erro geral (topo do form)
    generalErrorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '600'
    },
    // Container para texto de erro específico + icone
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 2
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginLeft: 4
    },
    // Ajustes para o input de senha com ícone
    passwordContainer: {
        width: '100%',
        height: 50,
        marginBottom: 5,
        position: 'relative', // Para posicionar o ícone
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    buttonContainer: {
        marginTop: 15
    }
})