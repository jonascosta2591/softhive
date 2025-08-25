import { Grid, Button, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import axios from 'axios'

import { DashboardContent } from "src/layouts/dashboard"

type TypeMeusDados = {
    email: string;
    userlevel: number;
    nomeCompleto: string;
    cpf: string;
}

export function MinhaConta(){
    // const [meusDados, setMeusDados] = useState<TypeMeusDados[]>([])
    const [email, setEmail] = useState<string>('Carregando email...')
    const [senhaAtual, setSenhaAtual] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [ConfirmSenha, setConfirmSenha] = useState<string>('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(!token){
        window.location.href = "./sign-in"
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get(`${import.meta.env.VITE_API_URL}/meus-dados/meus-dados`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((response: any) => {
            setEmail(response.data[0].email)
        }).catch(() => alert('Ocorreu um erro ao carregar os seus dados, por favor atualize a página'))
    }, [])

    async function handleSaveData() {
        try{
            const token = localStorage.getItem('token')
            if(senha !== ConfirmSenha) return alert('A confirmação de senha não é igual a senha!')
            if(senha.length < 7) return alert('Sua senha precisa ter mais que 8 caracteres')

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/meus-dados/meus-dados`, {email, senha, senhaAtual}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                
            })
            if(response.data.msg) {
                alert(response.data.msg)
                return window.location.reload()
            }
            if(response.data.error) return alert(response.data.error)
            
        }catch(err: any){
            console.log(err)
        }
    }

    return (
        <DashboardContent>
            
            <Grid sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                alignItems: 'flex-start' 
            }}>
                <Typography variant="h4">Meus dados</Typography>
                <TextField
                    label="Email"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    value={email}
                    disabled
                />
                <TextField
                    label="Senha atual"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                    onChange={(ev) => setSenhaAtual(ev.target.value)}
                />
                <TextField
                    label="Nova senha (deixe em branco para não alterar)"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                    onChange={(ev) => setSenha(ev.target.value)}
                />
                <TextField
                    label="Confirmar nova senha"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                    onChange={(ev) => setConfirmSenha(ev.target.value)}
                />
                <Button sx={{
                    backgroundColor: '#141556',
                    color: '#fff',
                    width: 200,
                    "&:hover": {
                        backgroundColor: '#00A9C4'
                    }
                }}
                onClick={handleSaveData}
                >Salvar</Button>
            </Grid>
        </DashboardContent>
    )
}